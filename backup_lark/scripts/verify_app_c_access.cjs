/**
 * verify_app_c_access.cjs
 * 验证 App C 是否已获得 Bitable 和 Wiki 的双重权限
 */

const https = require('https');

const CONFIG = {
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
  BASE_TOKEN: 'Uz92bWpRUaXEV6ssgvtcDIudnqV',
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
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // Step 0: 获取 tenant_access_token
  const authRes = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: CONFIG.APP_ID,
    app_secret: CONFIG.APP_SECRET,
  });
  const token = authRes.tenant_access_token;
  if (!token) return console.error('❌ App C Token 获取失败');
  console.log('✅ App C Token 获取成功\n');

  // Step 1: 验证 Bitable
  process.stdout.write('正在验证 Bitable 权限... ');
  const bitableRes = await request('GET', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}`, null, token);
  if (bitableRes.code === 0) {
    console.log(`✅ 成功 [${bitableRes.data.app.name}]`);
  } else {
    console.log(`❌ 失败: ${bitableRes.msg}`);
  }

  // Step 2: 验证 Wiki
  process.stdout.write('正在验证 Wiki 权限... ');
  const wikiRes = await request('GET', `/open-apis/wiki/v2/spaces/${CONFIG.SPACE_ID}`, null, token);
  if (wikiRes.code === 0) {
    console.log(`✅ 成功 [${wikiRes.data.space.name}]`);
  } else {
    console.log(`❌ 失败: ${wikiRes.msg}`);
  }
}

main().catch(console.error);
