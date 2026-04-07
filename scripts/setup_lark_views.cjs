/**
 * setup_lark_views.cjs
 * 为「大美汉字 · 制作中心」配置看板和分组视图
 */

const https = require('https');

const CONFIG = {
  // 全能助手 (App C) 兼顾 Bitable 与 Wiki
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
  BASE_TOKEN: 'Uz92bWpRUaXEV6ssgvtcDIudnqV',
};

const TABLES = {
  T01: 'tbl9hEoALnbzRImA', // 视频制作进度表
  T02: 'tblartEP5OMC50i3', // 每日任务分配表
  T03: 'tbl9W6gXtFm8RP0f', // 汉字选题库
};

const VIEWS_TO_CREATE = [
  { tableId: TABLES.T01, name: '制作状态看板', type: 'kanban' },
  { tableId: TABLES.T02, name: '按人员分组', type: 'grid' },
  { tableId: TABLES.T03, name: '按字义分类分组', type: 'grid' },
];

async function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);

    const options = {
      hostname: 'open.feishu.cn',
      path,
      method,
      headers,
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getToken() {
  const res = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: CONFIG.APP_ID,
    app_secret: CONFIG.APP_SECRET,
  });
  return res.tenant_access_token;
}

async function createView(token, tableId, name, type) {
  const res = await request('POST', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}/tables/${tableId}/views`, {
    view_name: name,
    view_type: type,
  }, token);
  if (res.code !== 0) {
    console.error(`  ❌ 创建视图 [${name}] 失败: ${res.msg}`);
    return null;
  }
  return res.data.view;
}

async function main() {
  const token = await getToken();
  console.log('✅ 获取 Token 成功');

  for (const v of VIEWS_TO_CREATE) {
    console.log(`\n正在为表 ${v.tableId} 创建视图 [${v.name}] (${v.type})...`);
    const view = await createView(token, v.tableId, v.name, v.type);
    if (view) {
      console.log(`  ✅ 视图创建成功: ${view.view_id}`);
    }
  }
  console.log('\n视图配置任务结束。');
}

main().catch(console.error);
