/**
 * list_wiki_nodes.cjs
 * 测试 App C 是否可以访问给定的 Space ID 并列出根节点
 */

const https = require('https');

const CONFIG = {
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
  SPACE_ID: '7624435373854231520',
};

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request({ hostname: 'open.feishu.cn', path, method, headers }, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error('JSON parse failed: ' + raw));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // Step 1: 获取 tenant_access_token
  const authRes = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: CONFIG.APP_ID,
    app_secret: CONFIG.APP_SECRET,
  });
  const token = authRes.tenant_access_token;
  if (!token) {
    console.error('❌ Token 获取失败:', JSON.stringify(authRes));
    return;
  }
  console.log('✅ App C Token 获取成功');

  // Step 2: 获取空间信息
  console.log(`\n正在获取空间 [${CONFIG.SPACE_ID}] 的基本信息...`);
  const spaceInfo = await request('GET', `/open-apis/wiki/v2/spaces/${CONFIG.SPACE_ID}`, null, token);
  if (spaceInfo.code !== 0) {
    console.error('❌ 获取空间信息失败:', spaceInfo.msg);
    return;
  }
  console.log('✅ 空间信息:', spaceInfo.data.space.name);

  // Step 3: 列出根节点
  console.log('\n正在尝试列出根节点...');
  const nodesRes = await request('GET', `/open-apis/wiki/v2/spaces/${CONFIG.SPACE_ID}/nodes`, null, token);
  if (nodesRes.code !== 0) {
    console.error('❌ 列出节点失败:', nodesRes.msg);
    return;
  }
  const nodes = nodesRes.data.items || [];
  console.log(`✅ 成功获取 ${nodes.length} 个根节点:`);
  nodes.forEach(n => console.log(`  - [${n.title}] Token: ${n.node_token}`));
}

main().catch(console.error);
