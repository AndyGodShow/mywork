#!/bin/bash
# 开启严苛模式：任何一行命令返回非零（报错）立刻中止脚本
set -e

echo -e "\n🔍 [质量门禁 1/2] 正在执行严格代码规范检查 (Lint)..."
npm run lint

echo -e "\n🧪 [质量门禁 2/2] 正在运行核心业务单元测试 (Test)..."
npm run test -- --run

# 检查是否有未保存的改动
if git diff-index --quiet HEAD --; then
    echo -e "\n⚡ 检测完毕：当前没有尚未提交的代码改动。系统已受到保护，部署流程终止，防止空气提交浪费云端资源。"
    exit 0
fi

# 聚合一切改动进行光速提交
echo -e "\n📦 质量门禁通过，没有任何语法与业务逻辑错误！正在打包发布..."
git add .
git commit -m "deploy: $(date +'%Y-%m-%d %H:%M:%S') auto-deploy via script"

echo -e "\n🚀 正在光速推送至 GitHub 触发 Vercel 自动构建..."
git push origin main

echo -e "\n✅ 发布完成！线上环境将在大约 1-2 分钟内同步最新代码。\n"
