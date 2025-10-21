# 杭州滨江区市场监管局智能决策系统 - 完整实施指南

## 📋 项目概述

本系统是为杭州滨江区市场监管局新任局长打造的全功能工作助手系统,旨在帮助局长快速进入角色,提升管理和专业决策能力。

### 核心特性

✅ **已完成的基础架构**
- Vite + React + TypeScript 现代化前端架构
- 性能优化: useDebounce, useMemo, useCallback hooks
- 代码分割和懒加载 (按页面)
- 本地存储持久化 (学习进度、收藏等)
- TypeScript 类型安全
- Tailwind CSS 样式系统

🚧 **待完成的核心功能**
1. 数据迁移: 从现有HTML文件提取法律、案例数据
2. 智能案例分析器 (四步法)
3. 法律知识图谱 (MECE结构)
4. 执法场景模拟器 (1508+题)
5. 案件管理系统 (全新功能)
6. AI法律问答助手 (全新功能)
7. 数据分析仪表板 (全新功能)
8. 后端API开发
9. 移动端适配

---

## 🏗️ 项目结构

```
market-supervision-system/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/           # 页面组件 (已创建7个)
│   │   ├── hooks/           # 自定义Hooks (防抖、存储、搜索)
│   │   ├── utils/           # 工具函数
│   │   ├── data/            # 数据文件
│   │   ├── types/           # TypeScript类型定义
│   │   ├── services/        # API服务
│   │   ├── App.tsx          # 主应用组件
│   │   ├── main.tsx         # 入口文件
│   │   └── index.css        # 全局样式
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/                  # 后端项目(待创建)
└── docs/                     # 文档
```

---

## 🚀 快速开始

### 1. 开发环境启动

```bash
cd ~/market-supervision-system/frontend
npm run dev
```

访问: http://localhost:3000

### 2. 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录

### 3. 预览生产版本

```bash
npm run preview
```

---

## 📝 后续开发任务清单

### 阶段1: 数据迁移和组件完善 (第1-2周)

#### 任务1.1: 提取现有系统数据

```bash
# 从现有HTML文件提取数据
# 位置: /tmp/market-supervision-system.html

需要提取:
- LAW_DETAILS (56部法律详情) → src/data/lawDetails.ts
- LAW_DOMAINS (10大监管领域) → src/data/lawDomains.ts
- CASE_LIBRARY (377+案例) → src/data/caseLibrary.ts
```

**实施步骤**:
1. 使用脚本从HTML提取JSON数据
2. 创建 TypeScript 数据文件
3. 添加数据验证和类型检查

#### 任务1.2: 创建共享UI组件

需要创建的组件:
- `components/Icon.tsx` - SVG图标组件
- `components/SearchBar.tsx` - 智能搜索栏
- `components/Modal.tsx` - 模态框
- `components/Card.tsx` - 卡片组件
- `components/Badge.tsx` - 标签组件
- `components/Button.tsx` - 按钮组件

#### 任务1.3: 完善页面功能

**CaseAnalysis.tsx** (案例分析页面)
- 左侧: 案例库列表 (支持筛选、搜索)
- 右侧: 四步法分析展示
  1. 事实认定
  2. 法律检索
  3. 法律适用
  4. 处理决定
- 功能: 收藏案例、添加笔记

**KnowledgeGraph.tsx** (知识图谱页面)
- 10大领域卡片展示
- 点击查看领域下的法律列表
- 法律详情模态框 (条文、案例、要点)
- 法律间关联关系可视化

**Simulator.tsx** (场景模拟页面)
- 练习题系统 (每个案例4道题)
- 进度跟踪和得分统计
- 答题反馈和解析
- 错题本功能

### 阶段2: 案件管理系统 (第3-4周)

#### 任务2.1: 案件CRUD功能

创建文件: `src/pages/CaseManagement/`
- `CaseList.tsx` - 案件列表
- `CaseForm.tsx` - 案件表单
- `CaseDetail.tsx` - 案件详情
- `CaseWorkflow.tsx` - 审批流程

#### 任务2.2: 工作流引擎

状态流转:
```
待处理 → 调查中 → 待审批 → 已结案 → 已归档
```

功能:
- 案件分配
- 期限提醒
- 文书生成 (使用模板)
- 附件上传
- 操作日志

### 阶段3: AI集成和数据分析 (第5-6周)

#### 任务3.1: AI法律问答助手

```typescript
// src/services/aiService.ts

export async function askLegalQuestion(question: string): Promise<string> {
  // 集成Claude API或本地大模型
  // 提供法律咨询、案例推荐、文书生成等功能
}
```

#### 任务3.2: 数据分析仪表板

创建可视化组件:
- 执法统计图表 (使用 recharts 或 echarts)
- 违法行为趋势分析
- 重点监管领域预警
- 团队绩效看板
- 数据导出功能

### 阶段4: 后端API开发 (第7-8周)

#### 任务4.1: 使用FastAPI-CRUD-Generator

```bash
# 使用现有Skill生成后端API

cd ~/market-supervision-system/backend

# 安装依赖
pip install fastapi uvicorn sqlalchemy psycopg2-binary

# 数据库模型:
- User (用户)
- Case (案件)
- LawDocument (法律文档)
- UserProgress (学习进度)
- Bookmark (收藏)
- Note (笔记)
```

#### 任务4.2: API端点设计

```
POST   /api/auth/login          # 用户登录
GET    /api/users/me            # 获取当前用户
GET    /api/cases               # 案件列表
POST   /api/cases               # 创建案件
GET    /api/cases/:id           # 案件详情
PUT    /api/cases/:id           # 更新案件
DELETE /api/cases/:id           # 删除案件
POST   /api/ai/ask              # AI问答
GET    /api/analytics/stats     # 统计数据
GET    /api/laws                # 法律列表
GET    /api/laws/:name          # 法律详情
POST   /api/bookmarks           # 添加收藏
GET    /api/progress            # 学习进度
```

### 阶段5: 测试和部署 (第9周)

#### 任务5.1: 自动化测试

```bash
# 安装测试依赖
npm install --save-dev vitest @testing-library/react @testing-library/user-event

# 创建测试文件
src/
  __tests__/
    hooks/
      useDebounce.test.ts
      useLocalStorage.test.ts
    components/
      SearchBar.test.tsx
    pages/
      Dashboard.test.tsx
```

#### 任务5.2: 部署到服务器

使用 Deployment-Script-Generator Skill:

```bash
# 生成部署脚本
/Deployment-Script-Generator

# 目标服务器: 47.111.132.236
# 部署路径: /var/www/market-supervision
```

部署步骤:
1. 构建前端: `npm run build`
2. 上传到服务器
3. 配置Nginx反向代理
4. 启动后端API服务
5. 配置HTTPS证书

---

## 🎯 优化建议

### 性能优化

1. **图片优化**
   - 使用WebP格式
   - 实现懒加载
   - 添加占位符

2. **数据缓存**
   ```typescript
   // src/hooks/useCache.ts
   export function useCache<T>(key: string, fetcher: () => Promise<T>) {
     // 实现带过期时间的缓存
   }
   ```

3. **虚拟滚动**
   - 案例列表使用 react-window
   - 提升长列表性能

### 用户体验优化

1. **离线支持**
   - 配置Service Worker
   - 实现PWA离线缓存

2. **移动端优化**
   - 响应式设计已完成
   - 添加手势操作
   - 优化触摸交互

3. **无障碍性**
   - 添加ARIA标签
   - 键盘导航支持
   - 屏幕阅读器兼容

---

## 🔐 安全建议

1. **身份认证**
   - JWT Token认证
   - 角色权限管理 (RBAC)
   - 会话超时处理

2. **数据安全**
   - HTTPS加密传输
   - 敏感数据加密存储
   - SQL注入防护

3. **审计日志**
   - 记录所有操作
   - 定期审计review
   - 异常行为告警

---

## 📚 参考资料

- React 文档: https://react.dev
- Vite 文档: https://vitejs.dev
- TypeScript 文档: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- FastAPI 文档: https://fastapi.tiangolo.com

---

## 🆘 问题排查

### 常见问题

**Q: npm install 报错**
A: 清除缓存 `rm -rf node_modules package-lock.json && npm install`

**Q: TypeScript 编译错误**
A: 检查 tsconfig.json 中的路径映射配置

**Q: Vite 启动慢**
A: 检查依赖预构建，可以在 vite.config.ts 中配置 optimizeDeps

**Q: 生产构建体积过大**
A: 检查是否正确配置了代码分割和tree-shaking

---

## ✅ 验收标准

系统完成后应满足:

1. ✅ 性能指标
   - 首屏加载 < 2秒
   - 搜索响应 < 100ms
   - Lighthouse得分 > 90

2. ✅ 功能完整性
   - 覆盖局长日常工作90%场景
   - 所有核心功能可用
   - 数据准确完整

3. ✅ 易用性
   - 新用户1天内上手
   - 界面简洁直观
   - 操作流程顺畅

4. ✅ 可维护性
   - 代码规范统一
   - 文档完整
   - 易于扩展

---

## 📅 开发里程碑

- **第2周末**: 数据迁移和基础组件完成
- **第4周末**: 案例分析、知识图谱、模拟器功能完成
- **第6周末**: 案件管理系统完成
- **第8周末**: AI集成和数据分析完成
- **第9周末**: 测试和部署完成
- **第10周**: 用户培训和上线

---

**项目负责人**: Claude Code
**最后更新**: 2025-10-21
**版本**: v1.0.0
