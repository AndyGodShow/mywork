#!/bin/bash
# 开启严苛模式：任何一行命令返回非零（报错）立刻中止脚本
set -e

echo -e "\n🔍 [质量门禁 1/2] 正在执行严格代码规范检查 (Lint)..."
npm run lint

echo -e "\n🧪 [质量门禁 2/2] 正在运行核心业务单元测试 (Test)..."
npm run test -- --run

# 聚合一切改动 (包括新建的未追踪文件)
git add .

# 检查是否有未保存的改动 (此时检查已暂存的区)
if git diff --staged --quiet; then
    echo -e "\n⚡ 检测完毕：当前没有任何实质性代码改动。系统暂未发布，保护云端资源。"
    exit 0
fi

echo -e "\n📦 质量门禁通过，正在打包发布..."
git commit -m "deploy: $(date +'%Y-%m-%d %H:%M:%S') auto-deploy via script"

echo -e "\n🚀 正在光速推送至 GitHub 触发 Vercel 自动构建..."
git push origin main

echo -e "\n✅ 发布完成！线上环境将在大约 1-2 分钟内同步最新代码。\n"
