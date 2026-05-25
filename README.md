# Web3 Research Dashboard

个人 Web3 投研工作台（V1.2 MVP）：单页仪表盘，全 mock 数据，界面语言为简体中文。

## 技术栈

- **Next.js 15**（App Router）
- **React 19**
- **Tailwind CSS 4**（`@tailwindcss/postcss`）
- **TypeScript 5**

## 启动命令

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run lint       # ESLint
npm test           # 冒烟测试（node tests/smoke.test.mjs）
npx tsc --noEmit   # 类型检查
```

## 架构概述

数据与 UI 严格分层，单向依赖：

```
data/  →  lib/  →  app/  →  components/dashboard/
```

| 层级 | 目录 | 职责 |
|------|------|------|
| Mock 数据 | `data/` | 静态快照与 accessor；**仅通过** `data/index.ts` 对外暴露 |
| 业务逻辑 | `lib/` | 纯函数，无 React / fetch；决策合成、校验、展示格式化 |
| 应用壳 | `app/` | `page.tsx` 编排数据与组件；单路由 `/` |
| UI 组件 | `components/dashboard/` | 纯展示，经 props 接收数据 |

## V1.2 MVP 约束

- **仅 mock 数据**：无外部 API、无数据库、无 `fetch` / `axios`
- **单页应用**：所有模块在 `/`，不新增子路由
- **观察池 ≠ 买入清单**：文案避免绝对买卖建议；允许「建议减仓」并附理由
- **首页展示范围**：观察池约 30 币，首页仅 Top 5 异动 + Top 10 Alpha，不渲染完整 30 币表
- **BTC 为周期锚点**，非单纯价格展示
- **模块顺序**（PRD 12.1）：决策 Hero → BTC 周期 → 市场环境 → 异动 Top 5 → 强信号 → Alpha → 仓位建议 → 风险 → 实际仓位对比 → 每日复盘（可折叠）→ 遗留模块（可折叠）
- 所有 V1.2 快照须共用同一 `asOf` 日期（由 `lib/data-guards.ts` 在开发环境校验）

## 文档

- 产品需求：`docs/PRD.md`
- 任务清单：`docs/TASKS.md`
- PRD 同步：`PRD_SOURCE_PATH=/path/to/source.md node scripts/sync-prd-from-source.mjs`
