# 下一步开发任务

## 🎯 本周任务 (Week 1 剩余时间)

### 1. 数据迁移 (优先级: P0)

**目标**: 从现有HTML文件提取数据到TypeScript文件

**步骤**:
```bash
# 源文件位置
/tmp/market-supervision-system.html

# 目标文件
frontend/src/data/lawDetails.ts      # 56部法律详情
frontend/src/data/lawDomains.ts      # 10大监管领域
frontend/src/data/caseLibrary.ts     # 377+个案例
```

**提取脚本**:
```javascript
// 在浏览器控制台运行
// 打开: http://47.111.132.236/market-supervision-law-system.html

// 1. 提取LAW_DETAILS
console.log(JSON.stringify(LAW_DETAILS, null, 2));

// 2. 提取LAW_DOMAINS  
console.log(JSON.stringify(LAW_DOMAINS, null, 2));

// 3. 提取CASE_LIBRARY
console.log(JSON.stringify(CASE_LIBRARY, null, 2));
```

### 2. 创建共享UI组件 (优先级: P0)

**需要创建的组件**:
- [ ] `components/Icon.tsx` - SVG图标库
- [ ] `components/SearchBar.tsx` - 搜索栏
- [ ] `components/Modal.tsx` - 模态框
- [ ] `components/Card.tsx` - 卡片组件
- [ ] `components/Badge.tsx` - 标签
- [ ] `components/Button.tsx` - 按钮

### 3. 完善案例分析页面 (优先级: P1)

**功能清单**:
- [ ] 左侧案例列表
- [ ] 筛选器 (领域、难度)
- [ ] 搜索功能
- [ ] 右侧四步法展示
- [ ] 收藏功能

---

## 📅 下周任务 (Week 2)

### 1. 知识图谱页面 (P0)
- [ ] 10大领域卡片展示
- [ ] 法律详情模态框
- [ ] 法律列表展示
- [ ] 关联关系可视化

### 2. 场景模拟器页面 (P1)
- [ ] 练习题系统
- [ ] 答题逻辑
- [ ] 得分统计
- [ ] 进度跟踪

### 3. 开始案件管理系统 (P0)
- [ ] 数据模型设计
- [ ] 列表页面
- [ ] 详情页面
- [ ] 表单页面

---

## 🚀 快速启动下一步开发

### 1. 启动开发服务器

```bash
cd ~/market-supervision-system/frontend
npm run dev
```

### 2. 打开编辑器

推荐使用VS Code:
```bash
code ~/market-supervision-system
```

### 3. 创建新组件模板

```bash
# 创建组件
mkdir -p ~/market-supervision-system/frontend/src/components
cd ~/market-supervision-system/frontend/src/components

# 示例: Icon组件
cat > Icon.tsx << 'COMPONENT'
interface IconProps {
  type: string;
  className?: string;
}

export default function Icon({ type, className = "w-6 h-6" }: IconProps) {
  // SVG图标实现
  return <svg className={className}>...</svg>;
}
COMPONENT
```

---

## 📝 开发检查清单

### 每完成一个功能

- [ ] TypeScript编译通过
- [ ] 页面正常显示
- [ ] 响应式设计测试
- [ ] 浏览器控制台无错误
- [ ] 代码格式化
- [ ] 提交Git (如使用版本控制)

### 每天结束时

- [ ] 构建测试 (`npm run build`)
- [ ] 更新README (如有新功能)
- [ ] 记录遇到的问题
- [ ] 规划明天任务

---

## 🆘 遇到问题?

### TypeScript错误
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 构建错误
```bash
# 检查配置文件
cat vite.config.ts
cat tsconfig.json
```

### 样式不生效
```bash
# 检查Tailwind配置
cat tailwind.config.js
cat postcss.config.js
```

---

## 📚 参考资料

- **Vite**: https://vitejs.dev/guide/
- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind**: https://tailwindcss.com/docs

---

**准备好了吗? 让我们继续! 🚀**

