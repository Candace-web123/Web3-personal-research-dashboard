Web3 个人投研系统 MVP｜Tasks 开发任务文档







用途：本文件用于同步到 GitHub 仓库的 tasks/ 目录，作为 Cursor / Codex / Claude Code 执行与检查的任务依据。

开发原则：第一版只做本地 mock 数据 + 首页 Dashboard 原型，不接真实 API、不接数据库、不做登录、不接钱包、不调用 AI 模型、不做交易功能。







0\. MVP 第一版范围



0.1 第一版定位



MVP 第一版是一个 Web3 个人投研工作台原型。



目标不是做行情系统，也不是做交易系统，而是帮助个人 Web3 投研者把以下内容集中沉淀：











正在观察的 Web3 资产







每个资产的研究状态







当前判断的风险等级







对项目的信心分







核心研究假设







下一步需要验证的问题







后续 AI 分析能力的框架占位



0.2 第一版必须做











创建可运行的 Next.js + TypeScript + Tailwind CSS 项目







使用 App Router







首页 / 展示个人投研工作台原型







使用本地 mock 数据展示资产观察列表







投研概览数据从本地 mock 资产数据计算得出







展示市场叙事与假设模块







展示 AI 分析框架占位







建立 app、components、data、lib、docs、prompts、scripts、tasks 目录







处理基础空状态和字段缺失状态



0.3 第一版不做











不接真实 API







不接数据库







不做登录







不接钱包







不做自动交易







不做新增资产







不做编辑资产







不做删除资产







不调用 AI 模型生成真实 memo







不做多人协作







不做权限系统



0.4 第一版高风险功能边界



以下功能不得进入第一版：











钱包连接







自动交易







买卖建议







价格预测







实时价格预警







AI 自动生成投资结论







多用户权限







数据库落库







外部行情、链上数据、新闻数据接入



0.5 第一个最小闭环



打开首页

↓

看到页面定位和 mock 数据说明

↓

看到投研概览指标

↓

查看资产观察列表

↓

识别高风险 / 研究中 / 信心分较低资产

↓

查看每个资产的核心假设和下一步动作







1\. 推荐任务执行顺序



第一阶段：项目基础搭建











T01 项目基础搭建与目录结构







T02 定义本地 mock 数据结构与枚举







T03 实现投研概览计算逻辑



第二阶段：核心最小闭环











T04 实现顶部标题区







T05 实现投研概览区







T06 实现资产观察列表区







T07 实现市场叙事与假设模块







T08 实现 AI 分析框架模块



第三阶段：历史记录 / 状态管理











T09 统一异常状态与字段兜底







注意：第一版不做真实历史记录，只处理页面状态和兜底逻辑。



第四阶段：异常处理和体验优化











T10 基础响应式与视觉状态区分



第五阶段：测试和验收











T11 补充 docs 与 prompts 占位







全量检查：页面、数据、AI 模块、目录结构、MVP 边界







2\. 开发任务包







T01｜项目基础搭建与目录结构



任务目标



创建可运行的 MVP 项目，并建立 PRD 要求的基础目录。



对应 PRD 位置











4.1 第一版要做







17 项目目录要求







18.4 目录验收



涉及页面











/



涉及功能











Next.js 项目初始化







TypeScript







Tailwind CSS







App Router







基础目录结构



涉及接口











无



涉及数据字段











无



交互规则











本地启动后可以访问首页 /







首页可以先展示基础占位内容



异常状态











项目不能启动属于 P0 问题







缺少关键目录属于 P0 问题



不做范围











不做业务功能







不做 API







不做数据库







不做登录







不做钱包







不做 AI 调用







不做交易功能



验收标准











项目可本地启动







可以访问 /







包含以下目录：



app/

components/

data/

lib/

docs/

prompts/

scripts/

tasks/



依赖前置任务











无



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请根据 PRD 搭建 Web3 个人投研系统 MVP 的项目基础结构。



技术要求：

\- 使用 Next.js

\- 使用 TypeScript

\- 使用 Tailwind CSS

\- 使用 App Router



目录要求：

\- app

\- components

\- data

\- lib

\- docs

\- prompts

\- scripts

\- tasks



第一版开发边界：

\- 只做本地 mock 数据展示

\- 不接真实 API

\- 不接数据库

\- 不做登录

\- 不接钱包

\- 不调用 AI 模型

\- 不做交易功能



本任务只完成项目基础搭建和目录结构。不要实现复杂业务功能。

完成后保证本地启动后可以访问首页 `/`。



Claude Code 检查 Prompt



请检查当前项目是否符合 PRD 和 T01 任务包要求。



重点检查：

1\. 是否使用 Next.js + TypeScript + Tailwind CSS + App Router；

2\. 是否包含 app、components、data、lib、docs、prompts、scripts、tasks 目录；

3\. 本地启动后是否能访问首页 `/`；

4\. 是否误加入 API、数据库、登录、钱包、AI 调用、交易相关代码；

5\. 是否有明显依赖错误或启动错误。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T02｜定义本地 mock 数据结构与枚举



任务目标



将 PRD 中的数据结构落到本地 mock 文件，供 Dashboard 页面使用。



对应 PRD 位置











12 Mock 数据结构说明







13 建议第一版 mock 资产内容







14 数据流转规则



涉及页面











首页 Dashboard /



涉及功能











资产观察列表数据







市场叙事数据







AI 分析框架数据







TypeScript 类型定义







枚举定义



涉及接口











getAssets







getNarratives







getAiFramework







第一版这些不是 HTTP API，只是本地数据读取或 local import。



涉及数据字段



Asset











id







name







symbol







sector







ecosystem







researchStatus







riskLevel







confidenceScore







thesis







nextAction







updatedAt



Narrative











id







title







sector







signal







question







priority







status



AiFramework











id







dimension







description







requiredData







status



交互规则











mock 数据必须独立放在 data/ 目录







不允许写死在页面组件里







数据结构要方便后续替换为 API / DB



异常状态











允许通过清空数组测试空状态







允许通过删除字段测试兜底展示



不做范围











不接数据库







不请求外部 API







不调用 AI







不写新增 / 编辑 / 删除逻辑



验收标准











assets 至少 6-8 条







narratives 至少 3 条







aiFramework 至少 5 个维度







有清晰 TypeScript 类型







有明确枚举



依赖前置任务











T01



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请根据 PRD 创建本地 mock 数据文件，不要写死在页面组件里。



需要包含三类数据：

1\. assets

2\. narratives

3\. aiFramework



assets 字段包括：

\- id

\- name

\- symbol

\- sector

\- ecosystem

\- researchStatus

\- riskLevel

\- confidenceScore

\- thesis

\- nextAction

\- updatedAt



narratives 字段包括：

\- id

\- title

\- sector

\- signal

\- question

\- priority

\- status



aiFramework 字段包括：

\- id

\- dimension

\- description

\- requiredData

\- status



要求：

\- assets 至少包含 6-8 条资产

\- narratives 至少包含 3 条叙事

\- aiFramework 至少包含 5 个分析维度

\- 定义清晰的 TypeScript 类型和枚举

\- mock 数据放在 data 目录

\- 类型可以放在 data 或 lib/types 中，但需要结构清晰



不要接数据库，不要请求外部 API，不要实现新增、编辑、删除功能。



Claude Code 检查 Prompt



请检查当前项目的 mock 数据是否符合 PRD 和 T02 任务包要求。



重点检查：

1\. assets、narratives、aiFramework 是否独立放在 data 目录；

2\. mock 数据是否没有写死在页面组件中；

3\. assets 字段是否包含 id、name、symbol、sector、ecosystem、researchStatus、riskLevel、confidenceScore、thesis、nextAction、updatedAt；

4\. narratives 字段是否包含 id、title、sector、signal、question、priority、status；

5\. aiFramework 字段是否包含 id、dimension、description、requiredData、status；

6\. 是否定义了清晰的 TypeScript 类型和枚举；

7\. 是否误接数据库或外部 API。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T03｜实现投研概览计算逻辑



任务目标



根据 assets 自动计算投研概览指标，不能手写死。



对应 PRD 位置











8 投研概览区







14.3 投研概览计算规则







18.2 数据验收



涉及页面











首页 Dashboard /



涉及功能











观察资产数







活跃研究数







平均信心分







高风险项数量



涉及接口











calculateResearchOverview



涉及数据字段











assets.length







researchStatus







riskLevel







confidenceScore



交互规则











页面展示计算结果







数据变化后概览自动变化







计算逻辑放在 lib/ 中，不要散落在组件里



异常状态











confidenceScore < 0 或 confidenceScore > 100：不计入平均分







非数字 confidenceScore：不计入平均分







非法 riskLevel：不计入高风险数量







assets 为空：totalAssets 为 0，averageConfidence 可显示为 null 或 -



不做范围











不做图表







不做趋势







不做真实 API 计算







不做后端接口



验收标准











totalAssets = assets.length







activeResearchCount = researchStatus === Researching 的数量







averageConfidence = 有效 confidenceScore 平均值







highRiskCount = riskLevel === High 的数量







修改 assets mock 后，概览会自动变化







没有手写死概览数据



依赖前置任务











T02



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请在 lib 中实现投研概览计算逻辑。



输入：

\- assets 数组



输出：

\- totalAssets

\- activeResearchCount

\- averageConfidence

\- highRiskCount



计算规则：

1\. totalAssets = assets 数组长度

2\. activeResearchCount = researchStatus 等于 Researching 的资产数量

3\. averageConfidence 只统计 0-100 范围内的有效 confidenceScore

4\. highRiskCount 只统计 riskLevel 等于 High 的资产



异常规则：

\- confidenceScore 小于 0 或大于 100，不计入平均分

\- 非数字 confidenceScore，不计入平均分

\- riskLevel 不属于 Low / Medium / High，不计入高风险项

\- assets 为空时不要报错



要求：

\- 计算逻辑独立于页面组件

\- 不要在组件里重复写计算逻辑

\- 不要手写死概览数据



Claude Code 检查 Prompt



请检查投研概览计算逻辑是否符合 PRD 和 T03 任务包要求。



重点检查：

1\. totalAssets 是否等于 assets 数组长度；

2\. activeResearchCount 是否只统计 researchStatus = Researching；

3\. averageConfidence 是否只统计 0-100 的有效 confidenceScore；

4\. highRiskCount 是否只统计 riskLevel = High；

5\. confidenceScore 小于 0 或大于 100 是否不计入平均分；

6\. 非法 riskLevel 是否不计入高风险项；

7\. 计算逻辑是否独立在 lib 中，而不是散落在组件里；

8\. 是否存在手写死概览数据的问题。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T04｜实现顶部标题区



任务目标



让用户明确这是 Web3 个人投研工作台，不是行情工具、交易工具或 AI 自动投资系统。



对应 PRD 位置











7 顶部标题区



涉及页面











首页 Dashboard /



涉及功能











页面标题







页面副标题







数据来源说明



涉及接口











无



涉及数据字段











无



交互规则











静态展示







不需要点击







不需要跳转



异常状态











无



不做范围











不做登录入口







不做钱包入口







不做交易按钮







不做用户头像







不做价格行情入口



验收标准



页面展示以下信息：











标题：Web3 投研工作台







副标题：表达“用一个轻量系统沉淀观察资产、研究假设、风险判断和下一步行动”







数据说明：明确当前为 MVP 原型，数据来自本地 mock，暂未接入真实行情、数据库和 AI 生成能力



依赖前置任务











T01



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请实现首页 Dashboard 的顶部标题区组件。



展示内容：

1\. 页面标题：Web3 投研工作台

2\. 页面副标题：用一个轻量系统沉淀观察资产、研究假设、风险判断和下一步行动。

3\. 数据说明：MVP 原型阶段：当前数据均为本地 mock，暂未接入真实行情、数据库和 AI 生成能力。



要求：

\- 只做静态展示

\- 不添加登录入口

\- 不添加钱包入口

\- 不添加交易入口

\- 不添加真实行情或 AI 生成入口



Claude Code 检查 Prompt



请检查首页顶部标题区是否符合 PRD 和 T04 任务包要求。



重点检查：

1\. 是否展示“Web3 投研工作台”；

2\. 是否说明这是管理观察资产、研究假设、风险判断和下一步行动的轻量系统；

3\. 是否明确说明当前为 MVP 原型，数据来自本地 mock；

4\. 是否误导用户认为已经接入真实行情、数据库或 AI；

5\. 是否出现登录、钱包、交易入口。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T05｜实现投研概览区



任务目标



展示当前投研池整体状态。



对应 PRD 位置











8 投研概览区







18.2 数据验收



涉及页面











首页 Dashboard /



涉及功能











观察资产数







活跃研究数







平均信心分







高风险项数量



涉及接口











calculateResearchOverview



涉及数据字段











totalAssets







activeResearchCount







averageConfidence







highRiskCount



交互规则











使用 T03 的计算结果渲染







组件只负责展示，不重复写计算逻辑







暂不支持点击跳转



异常状态











无有效信心分时，平均信心分显示 -







assets 为空时，指标应合理展示为 0 或 -



不做范围











不做趋势图







不做图表







不做筛选







不做点击跳转







不请求真实数据



验收标准











展示 4 个概览指标







数据来自 calculateResearchOverview







改动 mock assets 后，概览自动变化







没有手写死数据



依赖前置任务











T03



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请实现投研概览区组件。



展示 4 个指标：

1\. 观察资产数

2\. 活跃研究数

3\. 平均信心分

4\. 高风险项数量



要求：

\- 数据必须来自 calculateResearchOverview 的计算结果

\- 不能在组件里手写死指标

\- 不能在组件里重复写复杂计算逻辑

\- 平均信心分无有效值时显示 "-"

\- 只做展示，不做图表、不做趋势、不做点击跳转、不请求真实数据



Claude Code 检查 Prompt



请检查投研概览区是否符合 PRD 和 T05 任务包要求。



重点检查：

1\. 是否展示观察资产数、活跃研究数、平均信心分、高风险项数量；

2\. 数据是否来自 calculateResearchOverview，而不是组件内写死；

3\. assets 改动后概览是否会自动变化；

4\. 无有效 confidenceScore 时是否显示 "-" 或合理空值；

5\. 是否误做趋势图、真实数据请求或跳转。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T06｜实现资产观察列表区



任务目标



展示当前观察资产及其研究状态、风险等级、信心分、核心假设和下一步动作。



对应 PRD 位置











9 资产观察列表







16 异常状态与空状态







18.2 数据验收



涉及页面











首页 Dashboard /



涉及功能











资产列表展示







状态展示







风险等级展示







字段缺失兜底







空状态



涉及接口











getAssets



涉及数据字段











name







symbol







sector







ecosystem







researchStatus







riskLevel







confidenceScore







thesis







nextAction







updatedAt



交互规则











只读展示







不支持新增







不支持编辑







不支持删除







不支持搜索







不支持筛选







不跳转详情页



异常状态



字段缺失时按以下规则展示：















缺失字段







默认展示











sector







未分类











ecosystem







未填写











researchStatus







待观察











riskLevel







未评估











confidenceScore







\-











thesis







暂无核心假设











nextAction







暂无下一步动作











updatedAt







未更新



assets 为空时展示：



暂无观察资产。请在 mock 数据中添加资产后查看。



不做范围











不做详情页







不做新增资产







不做编辑资产







不做删除资产







不做筛选







不做搜索







不做真实行情



验收标准











至少展示 5 条 mock 资产







字段展示完整







字段缺失时有兜底







assets 为空时有空状态







页面不崩溃







没有新增 / 编辑 / 删除入口



依赖前置任务











T02



预计复杂度



中



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请实现资产观察列表组件。



数据来源：

\- 本地 assets mock

\- 不要写死在组件里



展示字段：

\- 项目名称 name

\- Symbol

\- 赛道 sector

\- 公链生态 ecosystem

\- 研究状态 researchStatus

\- 风险等级 riskLevel

\- 信心分 confidenceScore

\- 核心假设 thesis

\- 下一步动作 nextAction

\- 更新时间 updatedAt



第一版交互边界：

\- 只读展示

\- 不支持新增

\- 不支持编辑

\- 不支持删除

\- 不支持搜索

\- 不支持筛选

\- 不支持详情页跳转



字段缺失兜底：

\- sector 显示“未分类”

\- ecosystem 显示“未填写”

\- researchStatus 显示“待观察”

\- riskLevel 显示“未评估”

\- confidenceScore 显示“-”

\- thesis 显示“暂无核心假设”

\- nextAction 显示“暂无下一步动作”

\- updatedAt 显示“未更新”



空状态：

assets 为空时展示“暂无观察资产。请在 mock 数据中添加资产后查看。”



Claude Code 检查 Prompt



请检查资产观察列表是否符合 PRD 和 T06 任务包要求。



重点检查：

1\. 是否展示项目名称、Symbol、赛道、公链生态、研究状态、风险等级、信心分、核心假设、下一步动作、更新时间；

2\. 数据是否来自 assets mock，而不是写死在组件中；

3\. 是否只读展示，没有新增、编辑、删除、搜索、筛选、详情页跳转；

4\. 字段缺失时是否按 PRD 兜底展示；

5\. assets 为空时是否展示“暂无观察资产。请在 mock 数据中添加资产后查看。”；

6\. confidenceScore 越界时页面是否不崩；

7\. riskLevel 非法时是否显示“未评估”。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T07｜实现市场叙事与假设模块



任务目标



展示当前关注的 Web3 市场叙事、信号和待验证问题。



对应 PRD 位置











10 市场叙事与假设







12.2 市场叙事 mock 数据



涉及页面











首页 Dashboard /



涉及功能











叙事列表展示







当前信号展示







待验证问题展示







优先级展示







状态展示







空状态



涉及接口











getNarratives



涉及数据字段











title







sector







signal







question







priority







status



交互规则











只读展示







不新增







不编辑







不删除







不跳转详情



异常状态



narratives 为空时展示：



暂无市场叙事假设。后续可在此沉淀关注方向和待验证问题。



不做范围











不做新闻流







不做行情列表







不做实时资讯







不做新增叙事







不做编辑叙事







不做删除叙事



验收标准











能展示叙事标题、关联赛道、当前信号、待验证问题、优先级、状态







空数组时页面不崩溃







不请求真实新闻或行情数据



依赖前置任务











T02



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请实现市场叙事与假设模块。



数据来源：

\- 本地 narratives mock



展示字段：

\- title

\- sector

\- signal

\- question

\- priority

\- status



模块定位：

\- 这是市场叙事和研究假设沉淀模块

\- 不是新闻流

\- 不是行情列表



第一版边界：

\- 只读展示

\- 不支持新增

\- 不支持编辑

\- 不支持删除

\- 不接真实新闻

\- 不接行情 API



空状态：

narratives 为空时展示“暂无市场叙事假设。后续可在此沉淀关注方向和待验证问题。”



Claude Code 检查 Prompt



请检查市场叙事与假设模块是否符合 PRD 和 T07 任务包要求。



重点检查：

1\. 是否展示 title、sector、signal、question、priority、status；

2\. 数据是否来自 narratives mock；

3\. 是否表达这是叙事和假设沉淀，不是新闻流或行情列表；

4\. narratives 为空时是否展示空状态；

5\. 是否误做新增、编辑、删除或真实新闻数据接入。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T08｜实现 AI 分析框架模块



任务目标



展示后续 AI memo 的分析维度。第一版只做占位，不调用 AI。



对应 PRD 位置











11 AI 分析框架







12.3 AI 分析框架 mock 数据







18.3 AI 模块验收



涉及页面











首页 Dashboard /



涉及功能











AI 分析维度展示







分析说明展示







后续需要的数据展示







当前状态展示







空状态



涉及接口











getAiFramework



涉及数据字段











dimension







description







requiredData







status



交互规则











只展示框架







不生成 memo







不调用 LLM







不评分







不重新生成



异常状态



aiFramework 为空时展示：



暂无 AI 分析框架。后续可配置评分维度和投研 memo 模板。



不做范围











不调用 AI 模型







不生成投研 memo







不生成评分







不自动提取风险点







不自动生成下一步问题







不保存 AI 结果



验收标准











至少展示 5 个 AI 分析维度







每个维度包含 dimension、description、requiredData、status







明确说明第一版只展示分析框架







不存在任何 AI 请求代码



依赖前置任务











T02



预计复杂度



低



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请实现 AI 分析框架模块。



数据来源：

\- 本地 aiFramework mock



展示字段：

\- dimension

\- description

\- requiredData

\- status



模块说明文案：

AI 分析框架将在后续版本接入 LLM，用于根据项目资料、市场数据和研究假设生成结构化投研 memo。MVP 第一版仅展示分析维度，不生成真实内容。



第一版边界：

\- 不调用任何 AI 模型

\- 不请求任何 AI API

\- 不生成 memo

\- 不生成评分

\- 不自动分析风险

\- 不保存 AI 结果



空状态：

aiFramework 为空时展示“暂无 AI 分析框架。后续可配置评分维度和投研 memo 模板。”



Claude Code 检查 Prompt



请检查 AI 分析框架模块是否符合 PRD 和 T08 任务包要求。



重点检查：

1\. 是否至少展示 5 个 AI 分析维度；

2\. 每个维度是否包含 dimension、description、requiredData、status；

3\. 是否明确说明第一版只展示分析维度，不生成真实 AI memo；

4\. 是否存在任何 AI 模型调用、API 请求、生成 memo、自动评分逻辑；

5\. aiFramework 为空时是否展示空状态；

6\. 文案是否避免误导用户认为 AI 已经在分析。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T09｜统一异常状态与字段兜底



任务目标



保证 mock 数据为空、字段缺失或字段异常时，页面不崩溃。



对应 PRD 位置











16 异常状态与空状态







18 页面验收







18.2 数据验收



涉及页面











首页 Dashboard /



涉及功能











空状态







字段缺失兜底







非法字段处理







概览计算异常处理



涉及接口











getAssets







getNarratives







getAiFramework







calculateResearchOverview



涉及数据字段











所有展示字段



交互规则











数据异常时展示默认值







页面不能崩溃







不把非法数据纳入统计



异常状态



必须覆盖：











assets 为空数组







narratives 为空数组







aiFramework 为空数组







asset 字段缺失







confidenceScore 小于 0







confidenceScore 大于 100







confidenceScore 非数字







riskLevel 非法







researchStatus 非法



不做范围











不做错误上报系统







不做日志系统







不做 API 异常处理







不做权限异常处理



验收标准











清空 assets 后页面不崩







清空 narratives 后页面不崩







清空 aiFramework 后页面不崩







删除部分字段后页面不崩







非法 confidenceScore 不计入平均分







非法 riskLevel 不计入高风险项







页面展示 PRD 指定兜底文案



依赖前置任务











T06







T07







T08



预计复杂度



中



是否属于 MVP 第一版



是



给 Cursor / Codex 的执行 Prompt



请统一处理 Dashboard 的异常状态和字段兜底。



必须处理：

1\. assets 为空数组

2\. narratives 为空数组

3\. aiFramework 为空数组

4\. asset 字段缺失

5\. confidenceScore 小于 0

6\. confidenceScore 大于 100

7\. confidenceScore 非数字

8\. riskLevel 非法

9\. researchStatus 非法



资产字段缺失兜底：

\- sector 显示“未分类”

\- ecosystem 显示“未填写”

\- researchStatus 显示“待观察”

\- riskLevel 显示“未评估”

\- confidenceScore 显示“-”

\- thesis 显示“暂无核心假设”

\- nextAction 显示“暂无下一步动作”

\- updatedAt 显示“未更新”



统计规则：

\- 非法 confidenceScore 不计入平均信心分

\- 非法 riskLevel 不计入高风险项



要求：

\- 页面不能崩溃

\- 不要添加 API 错误逻辑

\- 不要做权限异常

\- 不要新增功能



Claude Code 检查 Prompt



请检查异常状态和字段兜底是否符合 PRD 和 T09 任务包要求。



请手动或静态检查以下场景：

1\. assets 为空数组；

2\. narratives 为空数组；

3\. aiFramework 为空数组；

4\. asset.sector 缺失；

5\. asset.ecosystem 缺失；

6\. asset.researchStatus 缺失或非法；

7\. asset.riskLevel 缺失或非法；

8\. confidenceScore 小于 0；

9\. confidenceScore 大于 100；

10\. confidenceScore 非数字；

11\. thesis、nextAction、updatedAt 缺失。



检查页面是否不崩溃、是否展示 PRD 指定默认文案、是否不把非法分数计入平均信心分、是否不把非法风险等级计入高风险统计。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T10｜基础响应式与视觉状态区分



任务目标



提升页面可读性，让状态、风险、优先级更容易识别。



对应 PRD 位置











22 P1 建议完成



涉及页面











首页 Dashboard /



涉及功能











响应式布局







风险等级标签







研究状态标签







优先级标签







AI 状态标签



涉及接口











无



涉及数据字段











researchStatus







riskLevel







priority







status



交互规则











不改变业务逻辑







只增强展示







非法状态仍显示兜底文案



异常状态











非法状态仍然使用默认值







移动端不能严重横向溢出



不做范围











不做复杂设计系统







不引入大型 UI 框架，除非项目已有







不新增筛选







不新增搜索







不新增详情页







不新增交互功能



验收标准











桌面端模块排版清晰







移动端基本可读







状态有视觉区分







风险等级有视觉区分







不影响现有业务逻辑



依赖前置任务











T05







T06







T07







T08



预计复杂度



中



是否属于 MVP 第一版



是，P1



给 Cursor / Codex 的执行 Prompt



请为 Dashboard 做基础响应式布局和视觉状态区分。



要求：

1\. 桌面端模块排版清晰

2\. 移动端不出现明显横向溢出

3\. riskLevel 使用清晰标签展示

4\. researchStatus 使用清晰标签展示

5\. priority 和 status 使用清晰标签展示

6\. 非法状态仍然显示兜底文案



限制：

\- 不要改变数据结构

\- 不要改变业务逻辑

\- 不要新增筛选

\- 不要新增搜索

\- 不要新增详情页

\- 不要新增复杂交互

\- 不要引入复杂设计系统



Claude Code 检查 Prompt



请检查响应式布局和视觉状态是否符合 PRD 和 T10 任务包要求。



重点检查：

1\. 桌面端模块是否清晰；

2\. 移动端是否没有明显横向溢出；

3\. riskLevel 是否有视觉区分；

4\. researchStatus 是否有视觉区分；

5\. priority 和 status 是否有清晰标签；

6\. 非法状态是否仍走兜底展示；

7\. 是否为了视觉优化误加了筛选、搜索、详情页或复杂交互。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







T11｜补充 docs 与 prompts 占位



任务目标



补充项目说明文档和后续 AI prompt 占位，方便后续扩展 API / DB / LLM。



对应 PRD 位置











17 项目目录要求







18.4 目录验收







19 后续版本方向



涉及页面











无



涉及功能











项目说明







数据结构说明







后续接入说明







AI prompt 占位



涉及接口











无



涉及数据字段











Asset







Narrative







AiFramework







ResearchOverview



交互规则











无



异常状态











无



不做范围











不写真实 AI 调用代码







不写真实 API 逻辑







不写数据库迁移







不写爬虫脚本







不写自动交易脚本



验收标准



docs 中至少说明：











MVP 产品边界







第一版做什么 / 不做什么







项目目录结构







mock 数据结构







投研概览计算口径







后续 API / DB / LLM 接入方向



prompts 中至少说明：











AI memo prompt 后续用途







第一版不调用 AI 模型







第一版不生成真实 memo



依赖前置任务











T02







T03







T08



预计复杂度



低



是否属于 MVP 第一版



是，P1



给 Cursor / Codex 的执行 Prompt



请补充 docs 和 prompts 占位文件。



docs 中需要说明：

1\. MVP 产品边界

2\. 第一版做什么

3\. 第一版不做什么

4\. 项目目录结构

5\. Asset 数据结构

6\. Narrative 数据结构

7\. AiFramework 数据结构

8\. ResearchOverview 计算口径

9\. 后续 API / DB / LLM 接入方向



prompts 中需要说明：

1\. AI memo prompt 是后续版本占位

2\. 第一版不调用 AI 模型

3\. 第一版不生成真实 memo

4\. 后续接入 LLM 时再完善 prompt



限制：

\- 不要实现任何 AI 调用代码

\- 不要实现 API

\- 不要实现数据库

\- 不要写爬虫脚本

\- 不要写自动交易相关内容



Claude Code 检查 Prompt



请检查 docs 和 prompts 是否符合 PRD 和 T11 任务包要求。



重点检查：

1\. docs 是否说明 MVP 产品边界；

2\. docs 是否说明目录结构；

3\. docs 是否说明 Asset、Narrative、AiFramework、ResearchOverview 数据结构；

4\. docs 是否说明投研概览计算口径；

5\. docs 是否说明后续 API / DB / LLM 接入方向；

6\. prompts 是否只是 AI memo 占位说明；

7\. 是否误实现 AI 调用代码或真实 prompt 执行逻辑。



请按 P0 / P1 / P2 输出问题。

最后输出可直接交给 Cursor 修复的 Prompt。







3\. 第一条适合交给 Cursor 的 Prompt



如果只想先启动第一个最小闭环，可以直接把下面这条发给 Cursor：



当前任务是开发 Web3 个人投研系统 MVP 的第一个最小闭环。



请只完成本地 mock 资产投研 Dashboard。



技术要求：

\- 使用 Next.js

\- 使用 TypeScript

\- 使用 Tailwind CSS

\- 使用 App Router



目录要求：

\- app

\- components

\- data

\- lib

\- docs

\- prompts

\- scripts

\- tasks



第一版页面：

\- 首页路径为 `/`

\- 展示顶部标题

\- 展示 mock 数据说明

\- 展示投研概览

\- 展示资产观察列表



数据要求：

\- 在 data 中建立 assets mock 数据

\- assets 至少 6-8 条

\- 不要把 mock 数据写死在页面组件里



计算要求：

\- 在 lib 中实现 calculateResearchOverview

\- 投研概览必须从 assets 自动计算

\- 不能手写死概览指标



资产列表要求：

\- 只读展示

\- 展示项目名称、Symbol、赛道、公链生态、研究状态、风险等级、信心分、核心假设、下一步动作、更新时间



严格不要做：

\- 不接真实 API

\- 不接数据库

\- 不做登录

\- 不接钱包

\- 不调用 AI 模型

\- 不做交易功能

\- 不做新增资产

\- 不做编辑资产

\- 不做删除资产

\- 不做搜索

\- 不做筛选

\- 不做详情页







4\. 全量验收 Prompt



完成全部任务后，可以把下面这条交给 Claude Code 做最终检查：



请基于 PRD 和 tasks 任务文档，对当前 Web3 个人投研系统 MVP 进行全量检查。



检查范围：



一、MVP 边界

1\. 是否只做本地 mock 数据展示；

2\. 是否没有接真实 API；

3\. 是否没有接数据库；

4\. 是否没有登录；

5\. 是否没有钱包；

6\. 是否没有 AI 模型调用；

7\. 是否没有交易功能；

8\. 是否没有新增 / 编辑 / 删除资产功能。



二、页面结构

1\. 首页 `/` 是否可访问；

2\. 是否包含顶部标题区；

3\. 是否包含投研概览区；

4\. 是否包含资产观察列表区；

5\. 是否包含市场叙事与假设区；

6\. 是否包含 AI 分析框架区。



三、数据结构

1\. assets 是否符合 PRD 字段；

2\. narratives 是否符合 PRD 字段；

3\. aiFramework 是否符合 PRD 字段；

4\. mock 数据是否独立在 data 目录；

5\. 页面组件是否没有写死 mock 数据。



四、计算逻辑

1\. totalAssets 是否由 assets.length 得出；

2\. activeResearchCount 是否统计 Researching；

3\. averageConfidence 是否只统计 0-100 有效分数；

4\. highRiskCount 是否只统计 High；

5\. 非法数据是否不会污染统计结果。



五、异常状态

1\. assets 为空是否有空状态；

2\. narratives 为空是否有空状态；

3\. aiFramework 为空是否有空状态；

4\. 字段缺失是否有兜底文案；

5\. confidenceScore 越界是否显示为 "-"；

6\. riskLevel 非法是否显示为“未评估”；

7\. 页面是否不崩溃。



六、AI 模块

1\. 是否只展示分析框架；

2\. 是否至少展示 5 个分析维度；

3\. 是否明确说明第一版不生成真实 AI memo；

4\. 是否没有任何 AI API 请求或模型调用代码。



七、目录与文档

1\. 是否包含 app、components、data、lib、docs、prompts、scripts、tasks；

2\. docs 是否说明 MVP 边界和数据结构；

3\. prompts 是否只是后续 AI memo 占位；

4\. tasks 是否记录任务拆解。



请输出：

1\. 总体结论：是否可以作为 MVP 第一版提交；

2\. P0 问题；

3\. P1 问题；

4\. P2 问题；

5\. 可直接交给 Cursor 修复的 Prompt；

6\. 不建议现在做、应放到后续版本的功能清单。







