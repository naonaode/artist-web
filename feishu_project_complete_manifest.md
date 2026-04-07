# 「大美汉字 · 制作中心」飞书项目管理系统 - 完整项目手册

> **最后更新**: 2026-04-03 17:41
> **架构变更**: 已简化为单一 App（App C）架构，App A 和 App B 可弃用。

---

## 1. 认证信息（已简化）

> ⚠️ **现在只需要记住一个 App（App C）！**

| 字段 | 值 |
| :--- | :--- |
| **App ID** | `cli_a945e0e568a45ccd` |
| **App Secret** | `UBuRzQAuT33WA6jScQq00f76tQg4P6Pv` |
| **职责** | 多维表格（Bitable）+ 知识库（Wiki）全部统一由此 App 负责 |

**旧 App（可弃用）**：
- App A: `cli_a947722ff9f8dbc9` — Bitable 专用（已迁移至 App C）
- App B: `cli_a9477a65f2f8dbd3` — 旧知识库（无需关注）

---

## 2. 多维表格架构（✅ 全部完成）

**Base Token**: `Uz92bWpRUaXEV6ssgvtcDIudnqV`

| 表格名称 | 表格 ID | 字段数 | 状态 |
| :--- | :--- | :--- | :--- |
| **01-视频制作进度表** | `tbl9hEoALnbzRImA` | 12 (含默认) | ✅ 完成 |
| **02-每日任务分配表** | `tblartEP5OMC50i3` | 8 (含默认) | ✅ 完成 |
| **03-汉字选题库** | `tbl9W6gXtFm8RP0f` | 10 (含默认) | ✅ 完成 |
| **04-Prompt 模板库** | `tbluPy8SM1itFt8c` | 8 (含默认) | ✅ 完成 |

### 视图（Views）

| 表格 | 视图名称 | 类型 | View ID |
| :--- | :--- | :--- | :--- |
| 01-视频制作进度表 | 制作状态看板 | kanban | `vew9WIUNHz` |
| 02-每日任务分配表 | 按人员分组 | grid | `veww45xcLx` |
| 03-汉字选题库 | 按字义分类分组 | grid | `vewrDRJ8DR` |

### 初始数据

- **汉字选题库 (T03)**: 已录入 10 条（牛、马、羊、水、火、山、木、日、月、人）
- **Prompt 模板库 (T04)**: 已录入 `脚本生成_标准版_v1`

---

## 3. 知识库 Wiki（⏸️ 等待最后一步）

| 字段 | 值 |
| :--- | :--- |
| **Space URL** | `https://ecnk3m58ly0g.feishu.cn/wiki/LoWVwTA3Wi0otykiClecf8OgnJs` |
| **Space ID** | `7624435373854231520` |
| **节点 Token** | `LoWVwTA3Wi0otykiClecf8OgnJs` |
| **App C 权限** | ✅ 已在开发者后台授权 `wiki:wiki` |
| **空间成员** | ❌ **还未将 App C 加入知识库空间成员** |

### ⭐ 下次接手首要任务：添加 App C 为空间成员

1. 打开：`https://ecnk3m58ly0g.feishu.cn/wiki/LoWVwTA3Wi0otykiClecf8OgnJs`
2. 右上角 **"···"** → **"空间设置"** → **"成员管理"**
3. 添加 **「大美汉字·制作中心」**（App C）为**管理员**
4. 运行脚本：`node scripts/verify_app_c_access.cjs`
5. 看到两行都是 ✅ 后，运行：`node scripts/init_wiki_structure.cjs`（该脚本由 AI 创建）

### 知识库规划目录（待初始化）

```
大美汉字·制作中心
├── 📁 制作规范
│   ├── 脚本写作规范
│   └── 视频制作标准
├── 📁 每周制作计划
├── 📁 汉字研究资料
└── 📁 Prompt 模板文档
```

---

## 4. 脚本索引（Scripts）

所有脚本在 `f:\wmware\artist-web\scripts\` 目录下，使用 `node <文件名>` 运行：

| 脚本文件 | 用途 | 状态 |
| :--- | :--- | :--- |
| `setup_lark_tables.cjs` | 建表 + 补全字段 | ✅ 已执行 |
| `setup_lark_views.cjs` | 创建看板/分组视图 | ✅ 已执行 |
| `populate_lark_data.cjs` | 录入汉字和 Prompt 初始数据 | ✅ 已执行 |
| `verify_app_c_access.cjs` | 🔬 **验证脚本**：检测 App C 的 Bitable 和 Wiki 双重权限 | 下次先运行 |
| `init_wiki_structure.cjs` | 📁 **待创建**：初始化知识库目录树 | 等权限通了再建 |

> 所有脚本已统一更新为使用 **App C** 凭证，不再引用 App A。

---

## 5. 整体进度

- [x] 架构设计（4张表 + Schema）
- [x] 应用权限配置（已简化为单一 App C）
- [x] 字段创建（全部完成）
- [x] 视图配置（看板 + 分组）
- [x] 初始数据录入（10汉字 + 1 Prompt）
- [x] Bitable 凭证统一（所有脚本迁移至 App C）
- [ ] **⏸️ 知识库 Wiki 初始化**（等 App C 被加入空间成员）
