/**
 * list_my_spaces.cjs
 * 列出 App C 有权访问的所有知识空间
 */

const https = require('https');

const CONFIG = {
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
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
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const authRes = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: CONFIG.APP_ID,
    app_secret: CONFIG.APP_SECRET,
  });
  const token = authRes.tenant_access_token;
  if (!token) return console.error('❌ Token 获取失败');

  console.log('\n正在尝试获取所有可访问的知识空间...');
  const spacesRes = await request('GET', '/open-apis/wiki/v2/spaces', null, token);
  if (spacesRes.code !== 0) {
    console.error('❌ 列出空间失败:', spacesRes.msg);
    return;
  }
  const spaces = spacesRes.data.items || [];
  console.log(`✅ 成功获取 ${spaces.length} 个知识空间:`);
  spaces.forEach(s => console.log(`  - [${s.name}] Space ID: ${s.space_id}`));
}

main().catch(console.error);
