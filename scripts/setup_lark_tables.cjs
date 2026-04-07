/**
 * setup_lark_tables.js
 * 「大美汉字 · 制作中心」飞书多维表格 — 一键配置脚本
 *
 * 运行方式: node scripts/setup_lark_tables.js
 * 无需安装任何依赖（使用 Node.js 内置 https 模块）
 */

const https = require('https');

// ================================================================
// 配置区 (不要修改此区域以外的内容)
// ================================================================
const CONFIG = {
  // 全能助手 (App C) - 统一负责 Bitable 和 Wiki
  APP_ID: 'cli_a945e0e568a45ccd',
  APP_SECRET: 'UBuRzQAuT33WA6jScQq00f76tQg4P6Pv',
  // 多维表格 Base Token
  BASE_TOKEN: 'Uz92bWpRUaXEV6ssgvtcDIudnqV',
  // Table 01 已知 ID（已存在，只补字段）
  TABLE_01_ID: 'tbl9hEoALnbzRImA',
};

// ================================================================
// 字段定义
// ================================================================

const TABLE_01_FIELDS = [
  { field_name: '集数编号', type: 1 },
  { field_name: '目标汉字', type: 1 },
  {
    field_name: '制作状态', type: 3,
    property: { options: [
      { name: '待启动', color: 0 }, { name: '脚本中', color: 1 },
      { name: '待审核', color: 2 }, { name: '制作中', color: 3 },
      { name: '待发布', color: 4 }, { name: '已发布', color: 5 },
      { name: '已暂停', color: 6 },
    ]},
  },
  { field_name: '脚本负责人', type: 11 },
  { field_name: '制作负责人', type: 11 },
  { field_name: '脚本截止日', type: 5 },
  { field_name: '发布日期', type: 5 },
  { field_name: '脚本文件链接', type: 15 },
  { field_name: '视频文件链接', type: 15 },
  { field_name: '审核意见', type: 1 },
  {
    field_name: '发布平台', type: 4,
    property: { options: [
      { name: 'B站', color: 0 }, { name: '抖音', color: 1 },
      { name: '视频号', color: 2 }, { name: 'YouTube', color: 3 },
    ]},
  },
];

const TABLES_TO_CREATE = [
  {
    name: '02-每日任务分配表',
    fields: [
      { field_name: '任务名称', type: 1 },
      { field_name: '负责人', type: 11 },
      { field_name: '任务日期', type: 5 },
      {
        field_name: '任务类型', type: 3,
        property: { options: [
          { name: '脚本生成', color: 0 }, { name: '内容校对', color: 1 },
          { name: '字形素材', color: 2 }, { name: '配音制作', color: 3 },
          { name: '视频合成', color: 4 }, { name: '发布运营', color: 5 },
        ]},
      },
      {
        field_name: '完成状态', type: 3,
        property: { options: [
          { name: '待开始', color: 0 }, { name: '进行中', color: 1 },
          { name: '已完成', color: 2 }, { name: '有问题', color: 3 },
        ]},
      },
      { field_name: '预计用时(分钟)', type: 2 },
      { field_name: '备注/卡点', type: 1 },
    ],
  },
  {
    name: '03-汉字选题库',
    fields: [
      { field_name: '汉字', type: 1 },
      { field_name: '拼音', type: 1 },
      {
        field_name: '字义分类', type: 3,
        property: { options: [
          { name: '动物', color: 0 }, { name: '植物', color: 1 },
          { name: '自然', color: 2 }, { name: '人体', color: 3 },
          { name: '动作', color: 4 }, { name: '数字', color: 5 },
          { name: '其他', color: 6 },
        ]},
      },
      {
        field_name: '难度等级', type: 3,
        property: { options: [
          { name: '★简单', color: 0 },
          { name: '★★中等', color: 1 },
          { name: '★★★较难', color: 2 },
        ]},
      },
      {
        field_name: '选题状态', type: 3,
        property: { options: [
          { name: '待排期', color: 0 }, { name: '已排期', color: 1 },
          { name: '制作中', color: 2 }, { name: '已完成', color: 3 },
        ]},
      },
      { field_name: '计划周次', type: 1 },
      { field_name: '关联字族', type: 1 },
      { field_name: '字源亮点', type: 1 },
      // 评分字段: type=2 是数字，Lark 的评分通过 property.rating 指定
      { field_name: '优先级', type: 2, property: { formatter: '0', rating: { symbol: 'star' } } },
    ],
  },
  {
    name: '04-Prompt模板库',
    fields: [
      { field_name: '模板名称', type: 1 },
      {
        field_name: '适用场景', type: 3,
        property: { options: [
          { name: '脚本生成', color: 0 }, { name: '例词扩展', color: 1 },
          { name: '字源查询', color: 2 }, { name: '旁白优化', color: 3 },
          { name: '例句生成', color: 4 },
        ]},
      },
      { field_name: 'Prompt正文', type: 1 },
      { field_name: '版本号', type: 1 },
      {
        field_name: '状态', type: 3,
        property: { options: [
          { name: '当前使用', color: 0 },
          { name: '测试中', color: 1 },
          { name: '已废弃', color: 2 },
        ]},
      },
      { field_name: '使用说明', type: 1 },
      { field_name: '维护人', type: 11 },
    ],
  },
];

// ================================================================
// HTTP 工具函数
// ================================================================

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
    };
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

// 延迟函数（避免触发 API 频率限制）
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ================================================================
// API 封装
// ================================================================

async function getToken() {
  const res = await request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: CONFIG.APP_ID,
    app_secret: CONFIG.APP_SECRET,
  });
  if (!res.tenant_access_token) {
    throw new Error('获取 Token 失败: ' + JSON.stringify(res));
  }
  return res.tenant_access_token;
}

async function listTables(token) {
  const res = await request('GET', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}/tables`, null, token);
  if (res.code !== 0) throw new Error('列出表格失败: ' + JSON.stringify(res));
  return res.data.items || [];
}

async function createTable(token, name) {
  const res = await request('POST', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}/tables`, {
    table: { name },
  }, token);
  if (res.code !== 0) throw new Error(`创建表格 [${name}] 失败: ` + JSON.stringify(res));
  return res.data.table_id;
}

async function listFields(token, tableId) {
  const res = await request('GET', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}/tables/${tableId}/fields`, null, token);
  if (res.code !== 0) throw new Error('列出字段失败: ' + JSON.stringify(res));
  return res.data.items || [];
}

async function createField(token, tableId, fieldDef) {
  const res = await request('POST', `/open-apis/bitable/v1/apps/${CONFIG.BASE_TOKEN}/tables/${tableId}/fields`, fieldDef, token);
  if (res.code !== 0) {
    throw new Error(`创建字段 [${fieldDef.field_name}] 失败: ` + JSON.stringify(res));
  }
  return res.data.field;
}

// ================================================================
// 主逻辑
// ================================================================

async function addFieldsToTable(token, tableId, tableName, fields) {
  console.log(`\n  📋 获取 [${tableName}] 现有字段...`);
  const existing = await listFields(token, tableId);
  const existingNames = new Set(existing.map((f) => f.field_name));
  console.log(`     现有字段: ${[...existingNames].join(', ') || '(空)'}`);

  let created = 0, skipped = 0;
  for (const field of fields) {
    if (existingNames.has(field.field_name)) {
      console.log(`  ⏭️  跳过 (已存在): ${field.field_name}`);
      skipped++;
      continue;
    }
    try {
      await createField(token, tableId, field);
      console.log(`  ✅ 创建成功: ${field.field_name}`);
      created++;
      await sleep(300); // 避免频率限制
    } catch (e) {
      console.error(`  ❌ 创建失败: ${field.field_name} — ${e.message}`);
    }
  }
  console.log(`  📊 [${tableName}] 完成: 新建 ${created} 个，跳过 ${skipped} 个`);
  return { created, skipped };
}

async function main() {
  console.log('='.repeat(60));
  console.log('  大美汉字 · 制作中心 — 飞书多维表格配置脚本');
  console.log('='.repeat(60));

  // Step 1: 认证
  console.log('\n[Step 1] 获取 tenant_access_token...');
  const token = await getToken();
  console.log('  ✅ 认证成功');

  // Step 2: 获取现有表格列表
  console.log('\n[Step 2] 读取 Base 中现有表格...');
  const existingTables = await listTables(token);
  const tableMap = {};
  existingTables.forEach((t) => {
    tableMap[t.name] = t.table_id;
    console.log(`  📦 已存在: [${t.name}] ID: ${t.table_id}`);
  });

  // Step 3: 处理 Table 01（已知存在，直接补字段）
  console.log('\n[Step 3] 处理 01-视频制作进度表（补全字段）...');
  const report = { '01-视频制作进度表': null };
  report['01-视频制作进度表'] = await addFieldsToTable(
    token, CONFIG.TABLE_01_ID, '01-视频制作进度表', TABLE_01_FIELDS
  );

  // Step 4: 处理 Table 02/03/04
  console.log('\n[Step 4] 处理 02/03/04 表...');
  for (const tableDef of TABLES_TO_CREATE) {
    let tableId = tableMap[tableDef.name];

    if (!tableId) {
      console.log(`\n  🆕 表格不存在，正在创建: [${tableDef.name}]...`);
      tableId = await createTable(token, tableDef.name);
      console.log(`  ✅ 表格创建成功，ID: ${tableId}`);
      await sleep(500);
    } else {
      console.log(`\n  ♻️  表格已存在: [${tableDef.name}] ID: ${tableId}`);
    }

    report[tableDef.name] = await addFieldsToTable(token, tableId, tableDef.name, tableDef.fields);
  }

  // Step 5: 最终报告
  console.log('\n' + '='.repeat(60));
  console.log('  ✅ 全部完成！配置汇总：');
  console.log('='.repeat(60));
  for (const [name, r] of Object.entries(report)) {
    if (r) console.log(`  ${name}: 新建 ${r.created} 字段，跳过 ${r.skipped} 字段`);
  }
  console.log('\n  请前往飞书 Base 验证表格结构是否正确。');
}

main().catch((err) => {
  console.error('\n❌ 脚本出错:', err.message);
  process.exit(1);
});
