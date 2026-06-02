/**
 * get_wiki_space_id.cjs
 * 通过 wiki 页面 token 反查 Space ID
 * 使用 App C 凭证（负责知识库）
 */

const https = require('https');

const CONFIG = {
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
  // 从 URL 提取的节点 token
  NODE_TOKEN: 'LoWVwTA3Wi0otykiClecf8OgnJs',
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
  // Step 1: 获取 tenant_access_token
  const authRes = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: CONFIG.APP_ID,
    app_secret: CONFIG.APP_SECRET,
  });
  if (!authRes.tenant_access_token) {
    console.error('❌ 获取 Token 失败:', JSON.stringify(authRes));
    return;
  }
  const token = authRes.tenant_access_token;
  console.log('✅ App C Token 获取成功');

  // Step 2: 列出应用有权访问的所有知识空间
  console.log('\n正在列出知识空间...');
  const spacesRes = await request('GET', '/open-apis/wiki/v2/spaces', null, token);
  if (spacesRes.code !== 0) {
    console.error('❌ 列出空间失败 (code:', spacesRes.code, '):', spacesRes.msg);
    console.log('提示: 可能是 App C 还未被添加为知识空间成员，请前往飞书将 App C 添加为空间管理员。');
  } else {
    const spaces = spacesRes.data?.items || [];
    console.log(`\n共找到 ${spaces.length} 个知识空间:`);
    spaces.forEach(s => {
      console.log(`  📚 [${s.name}] Space ID: ${s.space_id} | 类型: ${s.space_type}`);
    });
  }

  // Step 3: 通过节点 token 查询空间信息
  console.log(`\n正在通过节点 token [${CONFIG.NODE_TOKEN}] 反查空间...`);
  const nodeRes = await request(
    'GET',
    `/open-apis/wiki/v2/spaces/get_node?token=${CONFIG.NODE_TOKEN}&obj_type=wiki`,
    null,
    token
  );
  if (nodeRes.code !== 0) {
    console.error('❌ 查询节点失败 (code:', nodeRes.code, '):', nodeRes.msg);
    console.log('提示: 需要将 App C 添加为该知识空间的成员才能访问。');
  } else {
    const node = nodeRes.data?.node;
    console.log('\n✅ 节点信息:');
    console.log('  Space ID:', node?.space_id);
    console.log('  Node Token:', node?.node_token);
    console.log('  标题:', node?.title);
    console.log('  类型:', node?.obj_type);
  }
}

main().catch(console.error);
