# 飞书项目管理系统搭建进度存档 (更新: 2026-04-03 15:48)

## 1. 认证信息 (Authentication)

| 应用角色 | App ID | App Secret | 职责 |
| :--- | :--- | :--- | :--- |
| **应用 A (Bitable)** | `cli_a947722ff9f8dbc9` | `sNvJNVdRqK9auE6sjJTXpfcYQYmHShvN` | ✅ 多维表格数据读写 |
| **应用 B (Legacy Wiki)** | `cli_a9477a65f2f8dbd3` | `8pBkwcmkcKM40XTtXAKyhdloH2k5dyaR` | 「大话汉字知识库」负责人（旧，暂不涉及） |
| **应用 C (New Wiki)** | `cli_a945e0e568a45ccd` | `UBuRzQAuT33WA6jScQq00f76tQg4P6Pv` | 「大美汉字·制作中心」知识库负责人 |

## 2. 基础架构 (Infrastructure)

### 多维表格 Base
- **Base Token**: `Uz92bWpRUaXEV6ssgvtcDIudnqV`

| 表格名称 | 表格 ID | 字段数 | 状态 |
| :--- | :--- | :--- | :--- |
| 01-视频制作进度表 | `tbl9hEoALnbzRImA` | 12 (含默认) | ✅ 完成 |
| 02-每日任务分配表 | `tblartEP5OMC50i3` | 8 (含默认) | ✅ 完成 |
| 03-汉字选题库 | `tbl9W6gXtFm8RP0f` | 10 (含默认) | ✅ 完成 |
| 04-Prompt 模板库 | `tbluPy8SM1itFt8c` | 8 (含默认) | ✅ 完成 |

### 视图 (Views)
| 表格 | 视图名称 | 视图类型 | View ID |
| :--- | :--- | :--- | :--- |
| 01-视频制作进度表 | 制作状态看板 | kanban | `vew9WIUNHz` |
| 02-每日任务分配表 | 按人员分组 | grid | `veww45xcLx` |
| 03-汉字选题库 | 按字义分类分组 | grid | `vewrDRJ8DR` |

### 知识库 Wiki
- **知识库 URL**: `https://ecnk3m58ly0g.feishu.cn/wiki/LoWVwTA3Wi0otykiClecf8OgnJs`
- **节点 Token**: `LoWVwTA3Wi0otykiClecf8OgnJs`
- **Space ID**: ❌ **待获取**（当前受权限阻塞）

## 3. 当前进度 (Status)

- [x] **架构设计**: 4 张表的完整 Schema 已在 `lark_project_system_design.md` 存档
- [x] **应用配置**: 三应用分工已厘清
- [x] **字段创建**: 4 张表所有业务字段已批量创建 ✅
- [x] **视图配置**: 已创建看板视图与分组视图 ✅
- [x] **初始数据录入**: 10 个汉字 + 1 个 Prompt 模板已录入 ✅
- [/] **知识库对接**: **卡住，权限问题待解决**

## 4. ⭐ 下次继续的任务（给接手的 AI 看）

### 当前障碍：App C 无法访问知识库

**问题原因**：App C (`cli_a945e0e568a45ccd`) 缺少 `wiki:wiki` 权限，且未被加入知识库空间。

**用户需完成两步操作（需手动在飞书控制台操作）**：

#### 第一步：重新发布 App C（使权限生效）
1. 打开 https://open.feishu.cn/app/cli_a945e0e568a45ccd
2. 左侧点「**权限管理**」→ 确认 `wiki:wiki` 已申请
3. 左侧点「**版本管理与发布**」→「**创建版本**」→ 提交发布
4. 等待自动审核通过

#### 第二步：将 App C 加入知识库空间成员
1. 打开知识库 `https://ecnk3m58ly0g.feishu.cn/wiki/LoWVwTA3Wi0otykiClecf8OgnJs`
2. 进入「空间设置」→「成员管理」
3. 搜索并添加「**大美汉字·制作中心**」（App C 的名字）为管理员

### 用户完成上面两步后，AI 运行以下脚本：

```powershell
cd f:\wmware\artist-web
node scripts/get_wiki_space_id.cjs
```

脚本会自动找出 Space ID（格式类似 `spc_xxxxxxxxx`），然后继续编写初始化知识库目录的脚本。

### 知识库目录结构规划（待初始化）
```
大美汉字·制作中心
├── 📁 制作规范
│   ├── 脚本写作规范
│   └── 视频制作标准
├── 📁 每周制作计划
├── 📁 汉字研究资料
└── 📁 Prompt 模板文档
```

## 5. 关键文件路径

| 文件 | 说明 |
| :--- | :--- |
| `f:\wmware\artist-web\scripts\setup_lark_tables.cjs` | 多维表格字段创建脚本（已执行完毕） |
| `f:\wmware\artist-web\scripts\setup_lark_views.cjs` | 视图创建脚本（已执行完毕） |
| `f:\wmware\artist-web\scripts\populate_lark_data.cjs` | 初始数据录入脚本（已执行完毕） |
| `f:\wmware\artist-web\scripts\get_wiki_space_id.cjs` | ⭐ **下次先运行这个** — 获取知识库 Space ID |
| `f:\wmware\artist-web\lark_project_system_design.md` | 完整 Schema 设计文档 |
