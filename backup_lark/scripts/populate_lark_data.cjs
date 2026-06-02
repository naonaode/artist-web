/**
 * populate_lark_data.cjs
 * 为「大美汉字 · 制作中心」多维表格录入初始数据
 */

const https = require('https');

const CONFIG = {
  // 全能助手 (App C) 兼顾 Bitable 与 Wiki
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
  BASE_TOKEN: 'Uz92bWpRUaXEV6ssgvtcDIudnqV',
};

const TABLES = {
  T03: 'tbl9W6gXtFm8RP0f', // 汉字选题库
  T04: 'tbluPy8SM1itFt8c', // Prompt 模板库
};

const CHARACTERS = [
  { '汉字': '牛', '拼音': 'niú', '字义分类': '动物', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '马', '拼音': 'mǎ', '字义分类': '动物', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '羊', '拼音': 'yáng', '字义分类': '动物', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '水', '拼音': 'shuǐ', '字义分类': '自然', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '火', '拼音': 'huǒ', '字义分类': '自然', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '山', '拼音': 'shān', '字义分类': '自然', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '木', '拼音': 'mù', '字义分类': '植物', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '日', '拼音': 'rì', '字义分类': '自然', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '月', '拼音': 'yuè', '字义分类': '自然', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
  { '汉字': '人', '拼音': 'rén', '字义分类': '人体', '难度等级': '★简单', '选题状态': '待排期', '优先级': 5 },
];

const PROMPTS = [
  {
    '模板名称': '脚本生成_标准版_v1',
    '适用场景': '脚本生成',
    'Prompt正文': '你是一位资深的汉字文化推广人，请根据提供的汉字，从字源（甲骨文/金文）、演变过程、核心内涵、现代应用四个维度，创作一段适合短视频传播的脚本。风格要求：专业而不失趣味，能够唤起观众对汉字美学的共鸣。',
    '版本号': 'v1',
    '状态': '当前使用',
  },
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

async function batchCreateRecords(token, tableId, records) {
  const res = await request('POST', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}/tables/${tableId}/records/batch_create`, {
    records: records.map(r => ({ fields: r })),
  }, token);
  if (res.code !== 0) {
    console.error(`  ❌ 批量添加记录失败: ${res.msg}`);
    return null;
  }
  return res.data;
}

async function main() {
  const token = await getToken();
  console.log('✅ 获取 Token 成功');

  console.log('\n正在向表 03 (汉字选题库) 录入 10 个初始汉字...');
  const res03 = await batchCreateRecords(token, TABLES.T03, CHARACTERS);
  if (res03) console.log(`  ✅ 录入成功，共 ${res03.records.length} 条记录`);

  console.log('\n正在向表 04 (Prompt 模板库) 录入初始模板...');
  const res04 = await batchCreateRecords(token, TABLES.T04, PROMPTS);
  if (res04) console.log(`  ✅ 录入成功，共 ${res04.records.length} 条记录`);

  console.log('\n数据初始化任务结束。');
}

main().catch(console.error);
