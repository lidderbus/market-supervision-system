#!/bin/bash

echo "=================================="
echo "市场监管局智能决策系统"
echo "=================================="
echo ""
echo "正在启动开发服务器..."
echo ""

cd ~/market-supervision-system/frontend

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "首次运行,正在安装依赖..."
    npm install
fi

# 启动服务器
npm run dev

