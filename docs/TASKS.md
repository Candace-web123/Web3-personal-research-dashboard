# Web3 Research Dashboard 开发任务包｜V1.2 MVP 守边界版

> **需求依据**：`docs/PRD.md`（V1.2「多资产观察池、数据可信度、代币传导与链下尽调的 **MVP 守边界版**」）。  
> **执行工具**：Cursor / Claude Code / Codex 按任务编号逐步执行；每轮尽量只完成一个 `TASK-xxx`。  
> **归档说明**：`tasks/TASKS_Web3_Research_MVP.md` 为早期「投研工作台」任务包，**勿再执行**；以本文件为准。  
> **PRD 同步**：`node scripts/sync-prd-from-source.mjs`（默认从 Downloads 守边界版同步）。

---

## 0. 当前版本升级目标

本次从「BTC 单点 + 简单 Alpha 看板」升级到 **V1.2 每日投研决策型首页**，核心变化如下：

- **BTC** 继续作为周期判断锚点；首页优先展示周期阶段与操作倾向，而非单一价格。
- **新增多资产观察池**：约 **30 个币种** 作为可维护的「观察宇宙」数据源，**不写死在页面 JSX 的重复行里**，集中在数据层配置。
- **新增主流币异动 Top 5**：从观察宇宙中由规则/静态标注筛出当日展示条目；**首页不展示完整 30 币行情表**。
- **新增 Alpha 观察池 Top 10**：展示评级、状态、风险与「下一步验证」；与「异动 Top 5」区分职责。
- **新增市场环境评分卡**：总分 −5～+5 与「强进攻 / 中性轮动 / 谨慎 / 防守」分类（MVP 用 mock + 简单计算函数即可）。
- **首页信息架构**：升级为 **今日决策卡** 为首屏结论，其次 BTC 周期卡、市场环境卡、**异动 Top 5**、**强链 / 强赛道 / 强协议**、Alpha、仓位与风险提示（顺序对齐 PRD 12.1）；避免做成普通行情列表。
- **强链 / 强赛道 / 强协议**：mock 数据 + 三张 Top 卡（TASK-022），先结论再数据再风险，不接 API。

**MVP 第一版明确不做**：自动 API 采集、实时行情、登录与多用户、自动交易、复杂图表库、付费数据源、机器人推送、**新增独立路由页面**（全部先落在 `/`）。

**30 币原则（写进验收）**：30 币仅观察宇宙 + 扫描输入；**首页只出现 Top 5 异动与 Top 10 Alpha**，不得把 30 行币价表堆到首屏。

---

## 1. 开发阶段总览

### Phase 0：项目现状检查

**目标**：确认 Next.js App Router 结构、`app/page.tsx` 现有区块、`components/dashboard/*`、`data/*`、`lib/*`、`tests/*` 的职责边界，避免重复造轮子或与旧「投研工作台」模块冲突。

### Phase 1：数据模型升级

**目标**：为「分层（S/A/B/C/D）」「池内状态」「市场环境维度分」「Alpha 评级/生命周期」「风险标签」建立 TypeScript 类型与枚举常量，**先类型后 UI**。

### Phase 2：静态数据升级

**目标**：新增/拆分 mock：`~30` 条观察宇宙、`btc-cycle` 快照、`market-environment` 各维度分与总分、`alpha-pool`（含风险字段）、`position-advice` 与「今日最大风险」文案；提供 `data/index.ts` 聚合与轻量校验；在 `lib` 中实现 **Top5 / Top10 / 决策卡** 所需的选择器或映射函数（仍无外部 API）。

### Phase 3：首页决策卡 + BTC 周期卡 + 市场环境评分卡

**目标**：用新组件在首页呈现「结论优先」的三张卡；数据来自 Phase 2 mock + 选择器。

### Phase 4：多资产扫描模块（仅 Top 5）

**目标**：展示「主流币异动 Top 5」：每条含异动摘要、所属链/赛道、与池状态枚举一致；**禁止**渲染完整 30 币表格。

### Phase 5：Alpha 观察池模块（Top 10）

**目标**：展示最多 10 条 Alpha：评级、状态、核心异动、最大风险、下一步验证；与 PRD 中「观察池 ≠ 买入清单」文案一致。

### Phase 6：仓位建议与风险提示模块

**目标**：展示保守型仓位区间卡片（可与用户风险类型 mock 绑定）、「今日是否适合新增仓位」等字段；风险提示与 PRD 预警类型对齐（MVP 可用静态列表 + 优先级标签）。

### Phase 7：测试与整体验收

**目标**：更新 `tests/smoke.test.mjs`（或等价）保证 `pnpm dev` / `pnpm build` 与首页关键文案/区块存在；对照本节验收清单自检。

---

## 2. 详细任务拆解

### TASK-001：项目现状与 PRD 差距盘点

**阶段：** Phase 0  
**优先级：** P0  

**任务目标：**  
在不改代码的前提下，厘清当前仓库与 V1.2 MVP 首页目标的差距，输出后续改动的「禁区与可动区」清单。

**需要修改的文件：**

- 无（仅阅读）

**具体执行内容：**

1. 阅读 `app/page.tsx`，列出当前首页区块与数据来源（mock 路径）。
2. 阅读 `data/types.ts`、`data/assets.ts`、`data/index.ts`、`lib/research-overview.ts`，记录可复用字段与需废弃/并行的模型。
3. 对照 `docs/PRD.md` 中「首页展示优先级」「MVP 不做清单」，写下差距表（缺哪些卡、哪些旧模块应后移至底部「旧版研究模块」或折叠展示——**第一版不删除代码与数据文件**）。

**验收标准：**

- [ ] 产出一份可在对话中粘贴的《现状 vs V1.2 MVP》对照（区块级）。
- [ ] 明确写出：30 币基础数据与异动 Top 5 分别计划落在哪些 `data/*.ts` 文件（如 `watchlist-universe.ts` + `movers-top5.ts`）。
- [ ] 确认本轮后续任务不会引入新路由页面。

**不允许做：**

- 不允许修改任何 `.tsx` / `.ts` / `.mjs` / `data` / `lib` / `tests` 文件。
- 不允许安装依赖或运行会改写锁文件的安装类命令（若仅只读 `pnpm lint` 可选，非必须）。

**依赖任务：**

- 无

---

### TASK-002：V1.2 核心类型与资产分层模型

**阶段：** Phase 1  
**优先级：** P0  

**任务目标：**  
定义「观察宇宙」单条资产的类型：分层（S/A/B/C/D）、符号、名称、链、赛道、是否参与 Alpha 评分体系等，为 30 币 mock 打底。

**需要修改的文件：**

- `data/types.ts`（可拆分 `data/types/v12.ts` 再 re-export，但需评估导入路径变更面）

**具体执行内容：**

1. 新增 `WatchlistTier`（或等价）枚举：`S` 锚点、`A` 核心主流、`B` 稳定币、`C` 主流板块、`D` 热点/Alpha 候选。
2. 定义 `WatchlistUniverseEntry`：至少含 `id`、`symbol`、`name`、`tier`、`chain`、`sector`、`notes?`。
3. 为稳定币条目增加 `excludeFromAlphaScoring?: true` 之类显式标记（与 PRD「稳定币不参与 Alpha 同一评分体系」一致）。
4. 导出类型供后续 mock 与组件使用。

**验收标准：**

- [ ] `pnpm exec tsc --noEmit` 通过（若项目未配置脚本，以 IDE 类型检查无报错为准）。
- [ ] 分层枚举与 PRD 四-1.3 表语义一致（命名可略不同，注释说明映射）。
- [ ] 单文件职责清晰：类型不依赖 React。

**不允许做：**

- 不允许修改 `app/page.tsx` 或新增组件文件（本任务仅类型）。
- 不允许引入重型 schema 库（如 zod）除非团队已统一；MVP 优先手写类型。

**依赖任务：**

- TASK-001

---

### TASK-003：市场环境、Alpha 状态与风险标签枚举

**阶段：** Phase 1  
**优先级：** P0  

**任务目标：**  
补齐「市场环境分类」「池内资产状态」「Alpha 评级」「生命周期/风险标签」等枚举与小型联合类型，避免魔法字符串散落在 UI。

**需要修改的文件：**

- `data/types.ts`（或与 TASK-002 共用的新类型文件）

**具体执行内容：**

1. 定义 `MarketRegime`：`StrongRiskOn` | `NeutralRotation` | `Cautious` | `Defensive`（可用英文枚举 + 中文展示映射函数放 `lib` 后续任务）。
2. 定义 `UniverseAssetStatus`：对齐 PRD 四-1.6（普通观察 / 异动观察 / Alpha 候选 / 重点深挖 / 风险升高 / 移除）— 英文枚举 + 注释映射中文。
3. 定义 `AlphaGrade`：`A|B|C|D` 与可选 `AlphaLifecycleState`（若 PRD 二十二章生命周期要预览，可标为可选字段）。
4. 定义 `RiskTag`：`P0|P1|P2|P3` + `code` + `message` 结构（或等价），供风险提示列表复用。

**验收标准：**

- [ ] 所有枚举在 `data` mock 中可被引用且无循环依赖。
- [ ] 与 PRD 5.3、4-1.6、23.3 的语义一致（允许英文常量名，需在注释标注中文业务名）。

**不允许做：**

- 不允许写具体 mock 数值（放到 TASK-004 及以后）。
- 不允许新增 `app` 路由。

**依赖任务：**

- TASK-002

---

### TASK-004：30 币种观察宇宙 mock（可配置、可扩展）

**阶段：** Phase 2  
**优先级：** P0  

**任务目标：**  
建立约 **30 条** `WatchlistUniverseEntry` 的静态数组；**仅维护基础币种信息**（分层、链、赛道等）。**当日异动 Top 5 的展示字段**由独立文件 `data/movers-top5.ts` 维护（字段约定见 TASK-010 / TASK-014），不要塞进 `WATCHLIST_UNIVERSE`。

**需要修改的文件：**

- `data/watchlist-universe.ts`（新建）或 `data/universe.ts`（新建）
- `data/movers-top5.ts`（新建，当日异动 Top 5；可与本任务同批提交）
- `data/index.ts`（导出新数组）

**具体执行内容：**

1. 新建文件，导出 `WATCHLIST_UNIVERSE` 常量数组，长度 **25～32** 条，**目标约 30 条**。
2. 覆盖 S/A/B/C/D 各层；稳定币放在 B 层并标记不参与 Alpha 评分字段。
3. `symbol` 唯一；`id` 稳定（便于测试 snapshot）；`movers-top5.ts` 中 `assetId` 与之一致以便关联。
4. 新建 `data/movers-top5.ts`，导出 **至多 5 条**「当日异动」记录；每条至少包含：`assetId`、`symbol`、`name`、`priceChange24h`、`volumeNote`、`moverReason`、`status`；可选 `priceChange7d`、`riskNote`。
5. 在 `data/index.ts` 聚合导出，避免组件直接深层路径导入混乱（按团队习惯选择）。

**验收标准：**

- [ ] `WATCHLIST_UNIVERSE` 长度满足 **25～32** 条、**目标约 30 条**；与 PRD「约 30」一致。
- [ ] `MOVERS_TOP5`（或等价导出名）至多 5 条，字段满足上条约定。
- [ ] 无重复 `symbol`；每条记录 `tier`、`chain`、`sector` 齐全。
- [ ] **没有任何页面文件在本任务被修改**。

**不允许做：**

- 不允许在 `app/page.tsx` 内手写 30 行币种 JSX。
- 不允许接入外部 API。

**依赖任务：**

- TASK-002、TASK-003

---

### TASK-005：BTC 周期快照 mock

**阶段：** Phase 2  
**优先级：** P0  

**任务目标：**  
提供单对象描述「BTC 周期卡」所需字段：价格、阶段枚举、关键指标占位、操作倾向、是否支持观察山寨 Alpha、风险提示。

**需要修改的文件：**

- `data/btc-cycle.ts`（新建）
- `data/types.ts`（若需 `BtcCycleSnapshot` 类型）
- `data/index.ts`

**具体执行内容：**

1. 定义 `BtcCycleSnapshot`（可放 types）：包含 PRD 4.4 列出的字段子集（MVP 允许部分 `string` 占位值）。
2. 导出 `BTC_CYCLE_SNAPSHOT` 常量，数值为合理静态 mock。
3. 周期阶段使用明确枚举（与 PRD 4.3 分类对应）。

**验收标准：**

- [ ] 单快照对象可被卡片组件直接消费（字段名稳定）。
- [ ] 与 PRD「BTC 为锚点」叙述一致：ETH 不混进该对象。

**不允许做：**

- 不允许实现真实链上指标计算。
- 不允许新增图表库。

**依赖任务：**

- TASK-002

---

### TASK-006：每日市场环境评分 mock

**阶段：** Phase 2  
**优先级：** P0  

**任务目标：**  
用 mock 表达 Stablecoins / TVL / DEX Volume / ETF/DAT / 宏观政策 五维 **−1/0/+1** 分与总分，并给出 `MarketRegime` 分类结果。

**需要修改的文件：**

- `data/market-environment.ts`（新建）
- `data/types.ts`（若需 `MarketEnvironmentSnapshot`）
- `data/index.ts`

**具体执行内容：**

1. 定义 `MarketEnvironmentSnapshot`：维度分、总分、`regime`、一句「今日结论」、`topRisks: RiskTag[]`（可空）；并包含决策卡摘要所需 **`ethAndMainstreamSummary: string`**（ETH / 主流资产状态一句话）、**`stablecoinLiquiditySummary: string`**（稳定币流动性一句话）。
2. 导出 `MARKET_ENVIRONMENT_SNAPSHOT`；总分与 `regime` 一致（人工对齐 PRD 5.3 表）。
3. 预留 `asOf: string`（ISO 日期）字段，便于决策卡展示。

**验收标准：**

- [ ] 五维分与总分可被人肉核对（文档级说明即可，不要求 UI）。
- [ ] `regime` 使用 TASK-003 枚举。
- [ ] `ethAndMainstreamSummary`、`stablecoinLiquiditySummary` 非空字符串，语义分别对应 PRD 决策卡中「ETH/主流资产状态」「稳定币流动性」摘要。

**不允许做：**

- 不允许实现 PRD 第二十章完整自动评分引擎（MVP 手写 mock 即可）。
- 不允许调用外部宏观 API。

**依赖任务：**

- TASK-003

---

### TASK-007：Alpha 观察池 mock（含评级、状态、验证与风险）

**阶段：** Phase 2  
**优先级：** P0  

**任务目标：**  
提供 **最多 10 条** 展示用 Alpha 记录（可静态给出 10 条，或给 12 条并在选择器裁切）；字段覆盖 PRD Alpha 表与「下一步验证」。

**需要修改的文件：**

- `data/alpha-pool.ts`（新建）
- `data/types.ts`（若需 `AlphaPoolEntry`）
- `data/index.ts`

**具体执行内容：**

1. 定义 `AlphaPoolEntry`：项目名、Token、链、赛道、核心异动摘要、代币传导判断、估值/供给摘要、催化、最大风险、`grade`、`status`/`lifecycle`、`nextVerification`、`holderNotes?`。
2. 导出 `ALPHA_POOL` 数组；长度 ≥10 时文档说明首页仅取前 10。
3. 与 `RiskTag` 可组合：每条含 `risks: RiskTag[]`。

**验收标准：**

- [ ] 至少 8 条记录，推荐 10 条，便于 UI 稳定占位。
- [ ] 每条含「为什么进池」的可读短文本字段（如 `thesisLine`）。
- [ ] 不含真实投资建议措辞（保持「观察池≠买入清单」）。

**不允许做：**

- 不允许把 30 币宇宙全量标成 Alpha。
- 不允许接入 LLM 生成文案。

**依赖任务：**

- TASK-002、TASK-003

---

### TASK-008：仓位建议、今日深挖与「不建议追高」mock

**阶段：** Phase 2  
**优先级：** P0  

**任务目标：**  
提供 `PositionAdviceSnapshot`：用户风险类型（保守默认）、BTC/ETH、稳定币、Alpha、高风险热点占比区间文案；布尔字段「是否适合新增仓位」「是否只观察」；`deepDiveProjects`（1～3）；`doNotChase` 列表字符串。

**需要修改的文件：**

- `data/position-advice.ts`（新建）
- `data/types.ts`
- `data/index.ts`

**具体执行内容：**

1. 定义并与 PRD 11.4 保守型区间表对齐（可用字符串区间如 `"50-70%"`）。
2. 与 `MARKET_ENVIRONMENT_SNAPSHOT`、`BTC_CYCLE_SNAPSHOT` 的 `asOf` 对齐同一天（手写一致即可）。
3. 增加 `rationale: string[]` 2～4 条要点，供卡片列表展示。

**验收标准：**

- [ ] 保守型默认清晰；若提供平衡型，仅作为可选字段，不默认展示。
- [ ] 明确包含「今日重点深挖 1～3」项目名列表字段。

**不允许做：**

- 不允许实现用户设置面板（风险类型切换可 mock 写死为保守）。
- 不允许推荐具体买入价。

**依赖任务：**

- TASK-005、TASK-006

---

### TASK-009：数据聚合、导出与轻量校验助手

**阶段：** Phase 2  
**优先级：** P1  

**任务目标：**  
统一从 `data/index.ts` 导出 V1.2 相关快照；提供 `assertWatchlistUniverse` 等轻量开发期校验（仅在 dev import 或测试中使用，避免生产抛错）。

**需要修改的文件：**

- `data/index.ts`
- `lib/data-guards.ts`（新建，可选）或 `lib/v12-data.ts`

**具体执行内容：**

1. 聚合导出：`WATCHLIST_UNIVERSE`、`MOVERS_TOP5`（或 `data/movers-top5.ts` 的默认导出）、`BTC_CYCLE_SNAPSHOT`、`MARKET_ENVIRONMENT_SNAPSHOT`、`ALPHA_POOL`、`POSITION_ADVICE_SNAPSHOT`。
2. 实现 `getWatchlistUniverse()` 等纯函数封装（便于未来替换为 API）。
3. 可选：校验 universe 长度、symbol 唯一、`ALPHA_POOL.length` 上限。

**验收标准：**

- [ ] 其他模块只需依赖 `data` 公共入口即可拿到 V1.2 mock。
- [ ] 无对 `window` / `fetch` 的引用。

**不允许做：**

- 不允许修改组件样式。
- 不允许引入数据库。

**依赖任务：**

- TASK-004～TASK-008

---

### TASK-010：选择器与决策卡数据合成（lib）

**阶段：** Phase 2 / Phase 3 前置  
**优先级：** P0  

**任务目标：**  
在 `lib` 中实现纯函数：`getTopMovers5(...)`、`getAlphaTop10(pool)`、`buildDecisionCardModel(...)`，把 PRD「今日决策卡字段」合成单一 DTO 供 UI 使用。

**需要修改的文件：**

- `lib/v12-decision.ts`（新建，推荐）或扩展现有 `lib/research-overview.ts`（若扩展，需注释旧逻辑用途避免混淆）

**具体执行内容：**

1. **`getTopMovers5`（MVP 约定）**：**优先**读取独立文件 **`data/movers-top5.ts`** 中的当日列表（导出如 `MOVERS_TOP5`）。每条至少：`assetId`、`symbol`、`name`、`priceChange24h`、`volumeNote`、`moverReason`、`status`；可选 `priceChange7d`、`riskNote`。需要链/赛道等基础信息时，用 `assetId` **join** `WATCHLIST_UNIVERSE`，**不要把异动展示字段塞进 universe**。
2. `getAlphaTop10`：对 `ALPHA_POOL` 排序或截取前 10，规则写注释。
3. `buildDecisionCardModel`：组合环境快照、BTC 快照、仓位快照、Top5 movers（含符号列表供摘要区展示）、最大风险标签，产出 `DecisionCardViewModel` 类型（定义于 `data/types.ts` 或 `lib` 旁）；**ETH/主流与稳定币摘要**须直接使用 `MarketEnvironmentSnapshot.ethAndMainstreamSummary` 与 `MarketEnvironmentSnapshot.stablecoinLiquiditySummary`，不得在 lib 内写死文案替代。

**验收标准：**

- [ ] UI 层后续不写业务拼接逻辑，只消费 view model。
- [ ] 单测可选：若暂无框架，至少在 `tests/smoke.test.mjs` 中断言函数可运行（TASK-018 可补）。

**不允许做：**

- 不允许在 `lib` 内引用 React。
- 不允许访问网络。

**依赖任务：**

- TASK-009

---

### TASK-011：今日决策卡组件

**阶段：** Phase 3  
**优先级：** P0  

**任务目标：**  
实现「今日决策卡」：日期、环境、总分、BTC 阶段、ETH/主流状态摘要、稳定币流动性摘要、Top5 异动符号、操作倾向、最大风险 1～3 条、是否新增 Alpha、一句话结论。

**需要修改的文件：**

- `components/dashboard/decision-card.tsx`（新建）
- `lib/display-utils.ts`（可选：中文格式化）

**具体执行内容：**

1. 纯展示组件 + props：`DecisionCardViewModel`。
2. **ETH/主流状态摘要**、**稳定币流动性摘要**两条文案必须来自 `MarketEnvironmentSnapshot` 的 **`ethAndMainstreamSummary`** 与 **`stablecoinLiquiditySummary`**（由 `buildDecisionCardModel` 或 props 链路注入）；**禁止在组件内写死**这两句或硬编码替代字符串。
3. 样式与现有 Tailwind 风格一致；移动端纵向堆叠。
4. 文案严格非喊单：使用「观察」「不建议」「风险提示」等措辞。

**验收标准：**

- [ ] 首屏可读，信息层级：结论 > 风险 > 细节列表。
- [ ] 不依赖未定义的 mock 字段（类型驱动）。
- [ ] 决策卡上展示的 ETH/主流摘要、稳定币流动性摘要可在 `data/market-environment.ts` 中改 mock 即变化，无需改组件文案常量。

**不允许做：**

- 不允许在本组件内 `fetch`。
- 不允许一次渲染 30 个币种。
- 不允许在组件内为 `ethAndMainstreamSummary` / `stablecoinLiquiditySummary` 提供硬编码 fallback 业务句子（缺失时可用「—」占位，但不得替代为固定投研结论）。

**依赖任务：**

- TASK-010

---

### TASK-012：BTC 周期卡组件

**阶段：** Phase 3  
**优先级：** P0  

**任务目标：**  
展示 `BtcCycleSnapshot` 核心字段；突出周期阶段与操作倾向；指标可折叠或分组为「链上 / 情绪 / 资金 / 宏观」占位。

**需要修改的文件：**

- `components/dashboard/btc-cycle-card.tsx`（新建）

**具体执行内容：**

1. Props 接收 `BtcCycleSnapshot`。
2. 对缺失指标使用 `—` 占位（为未来 N/A 预留）。
3. 与决策卡重复的文案控制在一行以内，避免整页重复冗长。

**验收标准：**

- [ ] 普通用户可理解「我现在处于什么阶段」。
- [ ] 组件无业务计算，仅展示。

**不允许做：**

- 不允许引入图表库绘制 K 线。
- 不允许修改 `data/btc-cycle.ts` 内数值来「适配 UI」（应改展示逻辑）。

**依赖任务：**

- TASK-005、TASK-010

---

### TASK-013：市场环境评分卡组件

**阶段：** Phase 3  
**优先级：** P0  

**任务目标：**  
展示五维分数、总分、`MarketRegime` 中文标签、今日结论文案；可选展示小型「维度行」表格。

**需要修改的文件：**

- `components/dashboard/market-environment-card.tsx`（新建）

**具体执行内容：**

1. 维度分用颜色弱编码（正/零/负），避免过度视觉噪音。
2. 显示 `asOf` 日期与数据来源声明「mock」。

**验收标准：**

- [ ] 用户可读懂「今天偏进攻还是防守」。
- [ ] 与 PRD 5.2 五维一致，不多不少。

**不允许做：**

- 不允许实现历史折线图（Phase 2+ / P2）。
- 不允许接入真实 ETF 流数据。

**依赖任务：**

- TASK-006、TASK-010

---

### TASK-014：主流币异动 Top 5 模块

**阶段：** Phase 4  
**优先级：** P0  

**任务目标：**  
展示 5 行「异动」：强调原因与状态，不是纯涨跌幅排行；**禁止**附带完整 30 币表格。

**需要修改的文件：**

- `components/dashboard/movers-top5.tsx`（新建）
- `data/movers-top5.ts`（若 TASK-004 已创建则本任务以消费/补全字段为主；字段结构与 TASK-004/010 保持一致）

**具体执行内容：**

1. 数据源为 **`data/movers-top5.ts`**：`WATCHLIST_UNIVERSE` **只**提供基础币种信息；**当日异动展示**（涨跌幅、成交量说明、异动理由等）**只读 movers 文件**。每行字段映射：`priceChange24h`、`priceChange7d?`、`volumeNote`、`moverReason`（UI 可显示为「原因」）、`status`、`riskNote?`；`symbol`/`name` 与 movers 一致或与 universe join 后展示。`tier` 等基础字段如需展示，经 `assetId` join `WATCHLIST_UNIVERSE`。
2. 标题区提示：「来自观察宇宙扫描，非全市场排名」。
3. 明确空状态：若不足 5 条，用占位行说明「mock 未配置」。

**验收标准：**

- [ ] 恰好最多渲染 5 数据行（不含表头）。
- [ ] 页面其他区域不出现 30 币完整列表。
- [ ] 异动理由、成交量说明等**不依赖**在 `WATCHLIST_UNIVERSE` 条目中重复存储（单一事实来源：`movers-top5.ts`）。

**不允许做：**

- 不允许新增 `/watchlist` 路由页。
- 不允许把 Alpha 池与异动池混为同一列表组件。
- 不允许为省事把 `moverReason` / `volumeNote` 等只写在 universe 里而不走 `movers-top5.ts`。

**依赖任务：**

- TASK-004、TASK-010

---

### TASK-015：Alpha 观察池 Top 10 模块

**阶段：** Phase 5  
**优先级：** P0  

**任务目标：**  
表格或卡片列表展示最多 10 个 Alpha；字段含评级、状态、风险、下一步验证。

**需要修改的文件：**

- `components/dashboard/alpha-pool-top10.tsx`（新建）

**具体执行内容：**

1. 列头与 PRD 9.4 对齐（可删减到 MVP 最小列集）。
2. 对 `P0` 风险使用醒目但非惊恐式样式。
3. 顶部固定一句免责声明：「观察池 ≠ 买入清单」。

**验收标准：**

- [ ] 最多 10 条；超出数据在选择器层已被裁剪。
- [ ] 每条含「下一步验证」非空字符串。

**不允许做：**

- 不允许跳转外链钱包或交易所。
- 不允许内嵌复杂筛选器（P2）。

**依赖任务：**

- TASK-007、TASK-010

---

### TASK-016：仓位建议卡 + 风险提示卡

**阶段：** Phase 6  
**优先级：** P0  

**任务目标：**  
展示保守型仓位区间与纪律要点（可引用 PRD 11.6 精简版）；风险提示卡聚合 `MARKET_ENVIRONMENT_SNAPSHOT.topRisks` 与仓位快照中的「不建议操作」。

**需要修改的文件：**

- `components/dashboard/position-advice-card.tsx`（新建）
- `components/dashboard/risk-warnings-card.tsx`（新建）

**具体执行内容：**

1. 仓位卡：四行占比（BTC/ETH、稳定币、Alpha、高风险热点）+ 「今日是否适合新增仓位」。
2. 风险卡：列表展示 `RiskTag`，按 `P0>P1>P2>P3` 排序。
3. 重用 `lib/display-utils.ts` 若有百分比格式化。

**验收标准：**

- [ ] 文案体现「非喊单、非保证收益」。
- [ ] 两卡片数据来源均为 mock snapshots，无本地 state 杜撰。

**不允许做：**

- 不允许根据实时行情动态改文案（MVP）。
- 不允许合并成单卡导致信息密度过高难以阅读（可分两卡）。

**依赖任务：**

- TASK-008、TASK-010

---

### TASK-017：首页 `app/page.tsx` 信息架构重组

**阶段：** Phase 7  
**优先级：** P0  

**任务目标：**  
将 `/` 首页调整为 V1.2 顺序（对齐 **PRD 12.1** 与 **PRD 19.3**）：

**决策卡 → BTC 周期卡 → 市场环境卡 → 异动 Top 5 → 今日资金与结构（强链 Top 3 / 强赛道 Top 3 / 强协议 Top 5）→ Alpha Top 10 → 仓位与风险**

**旧模块**（投研概览、资产大表、叙事、AI 框架）**第一版不删除**、**不删除旧数据文件**；统一移至页面底部 **「旧版研究模块」** 区域，**默认折叠**（`<details>`）。强信号区块由 **TASK-022** 接入。

**需要修改的文件：**

- `app/page.tsx`
- （可选）`app/layout.tsx` 仅元信息标题更新

**具体执行内容：**

1. 引入新组件与 `data/index.ts` 导出对象。
2. 保留「数据来源：mock」说明在页头或页脚。
3. 确保移动端纵向顺序符合 PRD 12.1 / 19.3：**异动在强链 / 赛道 / 协议之前**；旧模块仅在 V1.2 主流程之后出现。
4. 在 PR 描述中说明：旧模块暂存底部/折叠的原因与后续清理计划（可选）。

**验收标准：**

- [x] 首页首屏可见决策卡与 BTC/环境卡之一（视视口而定，至少决策卡在首屏）。
- [x] 无 30 币全表出现在首页任意位置（首屏仅 Top 5 异动 + Top 10 Alpha）。
- [x] 首页模块顺序：市场环境之后为 **异动 Top 5**，再为 **今日资金与结构 / 强链赛道协议**。
- [x] `npm run dev` / `npm run build` 首页无运行时错误。
- [x] 投研概览、资产表、叙事、AI 框架等旧模块仍可通过底部「旧版研究模块」折叠区访问，**未删除**相关组件与 `data` 文件。

**不允许做：**

- 不允许新增 `app/**/page.tsx` 子路由。
- 不允许引入图表依赖库。
- 不允许在本任务中删除旧模块组件文件或删除 `data/assets.ts` 等旧数据文件（仅调整首页布局与展示顺序/折叠）。

**依赖任务：**

- TASK-011～TASK-016、TASK-022B

---

### TASK-018：冒烟测试与 V1.2 MVP 验收勾选

**阶段：** Phase 7  
**优先级：** P1  

**任务目标：**  
更新 `tests/smoke.test.mjs`：断言首页仍存在关键标题文案（决策卡 / BTC / 市场 / Top5 / Alpha / 仓位 / 风险之一组）；可选运行 `pnpm build`。

**需要修改的文件：**

- `tests/smoke.test.mjs`
- （可选）`package.json` scripts 不加新依赖前提下微调测试命令文档说明

**具体执行内容：**

1. 选取稳定、不易频繁改动的 `data-testid` 或可见标题字符串做断言。
2. 记录手动验收清单对应 PRD 25.4 中与本项目相关的子集（首页决策卡、多资产池配置、Top5、Alpha、仓位、风险）。

**验收标准：**

- [x] `npm test` / `node tests/smoke.test.mjs` 通过（含 V1.2 首页与 TASK-022 强信号断言）。
- [x] 文档式验收清单见本文件 **附录 A**（持续维护）。

**不允许做：**

- 不允许引入 Playwright/Cypress 等大型 E2E 栈（除非仓库已存在；当前未见则不要加）。

**依赖任务：**

- TASK-017、TASK-022B

---

## 2.1 TASK-022：强链 / 强赛道 / 强协议（已完成）

> 对应 PRD 第六章～第八章、12.1（9～11 项）、19.2「今日最强方向」。代码已合并；拆为 022A（数据）+ 022B（UI）。

### TASK-022A：强信号 mock 数据结构与类型

**阶段：** Phase 8｜**优先级：** P0｜**状态：** 已完成

**实现位置：**

- `data/types.ts`：`StrongChainKind`、`StrongChainEntry`、`StrongSectorEntry`、`StrongProtocolEntry`、`StrongSignalsDailySnapshot`、`DecisionCardViewModel.strongestDirection`
- `data/strong-signals.ts`：`STRONG_SIGNALS_DAILY_SNAPSHOT`（强链 3 / 强赛道 3 / 强协议 5）
- `data/index.ts`：`getStrongSignalsDailySnapshot`、`getV12MockSnapshots().strongSignals`
- `lib/strong-signals.ts`：`getStrongChainTop3`、`getStrongSectorTop3`、`getStrongProtocolTop5`
- `lib/data-guards.ts`：`assertStrongSignals`

**验收：** mock 仅人工录入；无 API；无复杂评分算法。

---

### TASK-022B：首页强信号三卡 + 决策卡最强方向

**阶段：** Phase 8｜**优先级：** P0｜**状态：** 已完成

**实现位置：**

- `components/dashboard/strong-signal-entry-layout.tsx`（先结论 → 关键数据 → 风险）
- `components/dashboard/strong-chain-top.tsx`、`strong-sector-top.tsx`、`strong-protocol-top.tsx`
- `app/page.tsx`：「今日资金与结构」母版 + 三卡；`buildDecisionCardModel` 注入 `strongestDirection`
- `components/dashboard/decision-card.tsx`：`LABEL_STRONGEST` / `strongestDirection`
- `tests/smoke.test.mjs`：强信号文件与接线断言

**验收：** 首页顺序为 … → 市场环境 → **异动 Top 5** → 强链/赛道/协议 → Alpha → 仓位/风险。

---

## 2.2 TASK-019：数据可信度（已完成）

**阶段：** Phase 8｜**优先级：** P1｜**状态：** 已完成

**实现位置：**

- `data/types.ts`：`DataProvenance`、`CardDataProvenanceSummary`、`DataFreshnessStatus`
- `data/data-provenance.ts`：`DATA_PROVENANCE_DAILY_SNAPSHOT`（决策 / BTC / 市场环境三卡）
- `lib/data-provenance.ts`：`getCardDataProvenance`、`resolveOverallDataStatus`
- `lib/display-utils.ts`：状态文案与色板
- `components/dashboard/data-provenance-footer.tsx`：卡片底部「数据时间 + 状态 + 来源明细」
- `decision-card` / `btc-cycle-card` / `market-environment-card`：接入 `dataProvenance` prop
- `lib/data-guards.ts`：`assertDataProvenance`

**验收：** 三卡底部可见数据时间与状态；延迟 / 口径冲突有黄色 / 橙色提示；mock 不接 API。

---

## 2.3 TASK-020：代币传导结构化（已完成）

**阶段：** Phase 8｜**优先级：** P1｜**状态：** 已完成

**实现位置：**

- `data/types.ts`：`TokenTransmissionType`、`TokenTransmissionStrength`、`TokenTransmissionJudgement`
- `data/alpha-pool.ts`：10 条 Alpha 全部改为结构化 `tokenTransmission`
- `lib/token-transmission.ts`：格式化、色板、`assertAlphaTokenTransmission`（A 级不得弱/无传导）
- `components/dashboard/alpha-pool-card.tsx`：`TokenTransmissionBlock`（类型 / 强度 / 依据 / 备注）

**验收：** Alpha 卡每条可见传导标签；HYPE 为回购型+强，WLD 为无传导+D 级；冒烟与 `assertAlphaPool` 通过。

---

## 2.4 TASK-021：链下尽调结构化（已完成）

**阶段：** Phase 8｜**优先级：** P1｜**状态：** 已完成

**实现位置：**

- `data/types.ts`：`OffchainDueDiligence`、`OffchainDueDiligenceStatus`、`OffchainDueDiligenceRiskLevel`
- `data/alpha-pool.ts`：10 条 Alpha 均含 `offchainDueDiligence` mock
- `lib/data-guards.ts`：`assertAlphaOffchainDueDiligence`（并入 `assertAlphaPool`）
- `components/dashboard/alpha-pool-card.tsx`：`OffchainDueDiligenceBlock`（折叠区展示）

**验收：** 五维状态 + 风险等级 + 关键发现 + 待确认问题 + 复核日期；WLD/ENA 高风险；未改首页布局。

---

## 2.5 TASK-023：每日复盘区（已完成）

**阶段：** Phase 8｜**优先级：** P1｜**状态：** 已完成

**实现位置：**

- `data/types.ts`：`DailyReviewSnapshot`
- `data/daily-review.ts`：`DAILY_REVIEW_SNAPSHOT`
- `data/index.ts`：`getDailyReviewSnapshot()`
- `components/dashboard/daily-review-card.tsx`：折叠式 `DailyReviewCard`
- `app/page.tsx`：仓位/风险之后、旧版模块之前
- `lib/data-guards.ts`：`assertDailyReviewSnapshot`

**验收：** 观察记录语气；无买卖建议；主流程顺序未变；`asOf` 与其他快照对齐。

---

## 2.6 TASK-024：实际仓位对比分析 MVP（已完成）

**阶段：** Phase 8｜**优先级：** P1｜**状态：** 已完成

**任务目标：** 用户上传实际仓位截图（仅本地预览），手动录入 / 校正四类仓位比例，与系统「个人风险暴露参考框架」规则化对比；输出带依据的**个人仓位建议**（含判断依据 / 适用条件 / 风险提醒 / 失效条件）；明确 MVP 与未来阶段边界；**不自动交易、不自动下单**，禁止必买/必卖/稳赚类喊单。

**实现位置：**

- `data/types.ts`：`ActualPositionInput`、`ActualPositionCompareResult`、`ActualPositionAnalysisMode` 等
- `lib/actual-position-compare.ts`：`buildActualPositionCompareResult`、`parseAllocationRange`
- `components/dashboard/actual-position-compare-card.tsx`：`ActualPositionCompareCard`（client；`type="file"` + 本地预览）
- `app/page.tsx`：仓位 / 风险之后、每日复盘之前
- `tests/smoke.test.mjs`：TASK-024 断言

**验收勾选：**

- [x] 实际仓位上传（本地预览，不上传服务器）
- [x] 手动校正四类核心比例 + 可选字段
- [x] 与系统参考框架对比（偏差明细）
- [x] 偏差诊断（总体结论 + 不妥之处）
- [x] 当前 MVP：手动录入 + 规则化对比
- [x] 未来阶段：真实数据 + 模型化分析（`futureDataNeeds` 预留）
- [x] 个人仓位建议（`positionRecommendations`：动作 + 依据 + 条件 + 风险 + 失效）
- [x] 产品边界：允许「建议减仓/加仓」类明确建议；禁止自动交易、必买必卖、保证收益

---

## 2.7 TASK-025：首页决策流程 / UI 产品结构优化（进行中）

**阶段：** Phase 8｜**优先级：** P1｜**状态：** 进行中（`feature/task-025-ui-product-review`）

**任务目标：** 在不改变守边界 MVP 能力的前提下，优化首页决策工作流与宽屏产品结构，使主线更清晰：**今日决策 → 风险暴露 → 实际仓位对比 → 个人仓位建议 → 每日复盘**。

**实现位置：**

- `components/dashboard/dashboard-header.tsx`：顶栏与版本标识
- `components/dashboard/decision-hero-card.tsx`：今日决策 Hero
- `components/dashboard/risk-warnings-card.tsx`：`variant="detailed"` 风险预警
- `components/dashboard/position-advice-card.tsx`：`variant="v4"` 个人风险暴露参考
- `app/page.tsx`：`max-w-[1248px]` 宽屏布局与模块顺序
- `data/risk-warnings-dashboard.ts`：风险预警看板数据
- `tests/smoke.test.mjs`：TASK-025 首页结构 / UI 组件断言

**验收勾选：**

- [x] `DashboardHeader` + `DecisionHeroCard` 接线
- [x] BTC / 市场环境 `variant="compact"`
- [x] 仓位建议 v4 + 风险预警 detailed
- [x] 与 TASK-024 实际仓位对比卡共存且顺序正确
- [ ] 与墨刀 `web3-research-v12_v4.html` 视觉细节完全对齐（可迭代）

---

## 3. 推荐任务顺序

> 原则：**一次只执行一个任务**；完成验收后再进入下一编号。

1. TASK-001  
2. TASK-002  
3. TASK-003  
4. TASK-004  
5. TASK-005  
6. TASK-006  
7. TASK-007  
8. TASK-008  
9. TASK-009  
10. TASK-010  
11. TASK-011  
12. TASK-012  
13. TASK-013  
14. TASK-014  
15. TASK-015  
16. TASK-016  
17. TASK-017  
18. TASK-018  
19. TASK-022A → TASK-022B（**已完成**）  
20. TASK-019（数据可信度）  
21. TASK-020（代币传导）  
22. TASK-021（链下尽调）  
23. TASK-023（复盘区）  
24. TASK-024（实际仓位对比分析 MVP，**已完成**）  
25. TASK-025（首页决策流程 / UI 产品结构优化，**进行中**）

并行建议：TASK-019 / 020 / 021 可在 TASK-022 完成后并行；**一次提交仍建议单任务**。

---

## 4. 当前建议执行任务

**代码基线：** TASK-001～024 已完成；TASK-025 进行中（V1.2 首页主流程 + 实际仓位对比 + 决策 Hero / 宽屏布局 + 复盘折叠区）。

**下一步：**

1. 完成 TASK-025 墨刀宽屏 UI 细节对齐与验收
2. 补充手动覆盖 UI（PRD 21.7，可单开 TASK）
3. 或进入 PRD 第二十六章「未来数据接入」相关迭代

### 下一轮可直接复制给 Cursor 的执行 Prompt（TASK-024 · 墨刀）

```text
请基于当前 app/page.tsx 信息架构输出墨刀首页线框说明（不修改代码）。

顺序：决策卡 → BTC → 环境 → 异动 → 强链/赛道/协议 → Alpha → 仓位/风险 → 每日复盘（折叠）→ 旧版模块（折叠）。

标注：数据可信度底栏、Alpha 传导/尽调折叠、复盘字段分区。
```

---

## 5.（可选）Phase 2 / P2 后置项索引

以下内容来自 PRD 守边界版 **明确暂缓** 或 TASK-019～024 之后的迭代：

- 多钱包净值、自动交易、复杂回测、个性化权重、推送机器人（PRD 25.3）。
- 强链 / 强赛道 / 强协议 **独立路由页** 与历史曲线（首页 Top 榜已由 TASK-022 覆盖）。
- 历史观察池跟踪表、升级/降级规则引擎全自动化（PRD 十、二十二章）。
- 飞书 / Notion / Make.com 自动采集（PRD 十五、十六章）。
- 实时分钟级行情、登录与多用户、付费数据源。

---

## 附录 A：PRD 25.4 MVP 验收勾选（首页子集）

> 与当前代码基线同步；守边界版 PRD 全量验收另含 019～023 未勾选项。

| 验收项 | 标准摘要 | 勾选 |
|--------|----------|------|
| 首页决策卡 | 环境、BTC 周期、操作倾向、最大风险、最强方向 | [x] |
| BTC 周期卡 | 价格、阶段、关键指标占位、操作倾向 | [x] |
| 市场环境卡 | 五维分、总分、环境分类 | [x] |
| 多资产观察池配置 | ~30 币、`data/watchlist-universe.ts` | [x] |
| 主流币异动 Top 5 | ≤5 条，有异动原因 | [x] |
| 强链/赛道/协议 Top | Top3/3/5（TASK-022） | [x] |
| Alpha 观察池 | ≤10 条，评级/状态/下一步验证 | [x] |
| 仓位建议 | 保守型区间 + 是否新增仓位 | [x] |
| 首页顺序 | 异动在强链/赛道/协议之前（PRD 12.1） | [x] |
| 旧版模块折叠 | 底部 `<details>`，不占首屏 | [x] |
| 数据可信度 | 来源/时间/状态（TASK-019） | [x] |
| 代币传导结构化 | 类型/强度/依据（TASK-020） | [x] |
| 链下尽调 | 重点跟踪项目清单（TASK-021） | [x] |
| 每日复盘 | 3～5 字段可记录（TASK-023） | [x] |
| 实际仓位对比分析 | 本地截图 + 手动比例 + 规则化对比（TASK-024） | [x] |
| 移动端可读 | 决策卡置顶、纵向卡片（12.8） | [x] |
| 冒烟测试 | `npm test` + `npm run build` | [x] |
| PRD 文档 | `docs/PRD.md` 守边界版 | [x] |
