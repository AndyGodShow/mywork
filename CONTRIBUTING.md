# Contributing

感谢你愿意参与 Casino Education Simulator。这个项目欢迎修复 bug、补充测试、优化交互、改进文档，以及新增适合概率教育的模拟能力。

## 开始之前

- 本项目只面向数学教育与概率研究，不接受真实赌博、充值提现、下注推广、套利承诺等功能。
- 请不要在 Issue、PR、截图、提交信息或测试数据里包含真实个人信息、API Key、部署项目 ID、钱包地址、后台截图或带 token 的 URL。
- 贡献代码即表示你同意你的贡献按照本仓库的 MIT License 发布。
- 请遵守 [Code of Conduct](CODE_OF_CONDUCT.md)。

## 本地开发

```bash
npm install
npm run dev
```

提交前建议运行：

```bash
npm test
npm run lint
npm run build
```

## 贡献流程

1. Fork 仓库并创建一个语义清晰的分支，例如 `fix/roulette-payout` 或 `docs/open-source-guide`。
2. 保持改动聚焦，避免把重构、格式化和功能变更混在一个 PR。
3. 为规则、赔付、模拟引擎、资金计算等逻辑改动补充或更新测试。
4. 在 PR 描述中说明改动目的、验证方式，以及是否影响教育说明或概率数据。
5. 如果改动涉及 UI，请附上简短截图或说明主要交互变化。

## 代码约定

- 优先沿用现有 React、TypeScript、CSS Modules 和 Vitest 结构。
- 共享能力放在 `src/components`、`src/hooks`、`src/logic` 或 `src/utils`，游戏专属逻辑留在对应 `src/games/*` 目录。
- 概率、赔率、赌场优势等数字要能从规则或测试中追踪，避免只在 UI 文案里硬编码无法验证的结论。
- 不提交 `dist/`、`.vercel/`、`.env*`、coverage、本地日志或分析输出。

## Issue 建议

提交问题时尽量包含：

- 复现步骤；
- 期望行为和实际行为；
- 浏览器和设备信息；
- 相关游戏、模式、下注策略或 URL Hash；
- 不含隐私信息的截图或录屏。

## 适合新贡献者的任务

- 修正文档中的表达或翻译；
- 给现有规则补充测试；
- 优化移动端布局；
- 增加某个策略的教育说明；
- 改进模拟结果的可读性。
