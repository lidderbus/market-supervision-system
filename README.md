# 杭州滨江区市场监管局智能决策系统

> 为新任局长打造的全功能工作助手,助力快速进入角色,提升管理和专业决策能力

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF)](https://vitejs.dev/)

---

## 📊 项目状态

### ✅ 已完成 (第一阶段)

- [x] **现代化前端架构**: Vite + React + TypeScript
- [x] **性能优化基础**:
  - useDebounce Hook (搜索防抖)
  - useLocalStorage Hook (数据持久化)
  - useSearch Hook (智能搜索)
  - 代码分割和懒加载
  - 路径别名配置
- [x] **类型系统**: 完整的TypeScript类型定义
- [x] **UI框架**: Tailwind CSS + 响应式设计
- [x] **页面框架**: 7个核心页面组件骨架
- [x] **工具函数**: 存储、格式化等工具类
- [x] **配置文件**: Vite、TypeScript、PostCSS等
- [x] **文档**: 完整的实施指南和部署文档

### 🚧 待开发 (后续阶段)

- [ ] 数据迁移 (从现有HTML提取)
- [ ] 智能案例分析器完整实现
- [ ] 法律知识图谱可视化
- [ ] 执法场景模拟器
- [ ] 案件管理系统
- [ ] AI法律问答助手
- [ ] 数据分析仪表板
- [ ] 后端API开发
- [ ] 移动端App

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装依赖

```bash
cd ~/market-supervision-system/frontend
npm install
```

### 开发模式

```bash
npm run dev
```

访问: http://localhost:3000

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录

---

## 📁 项目结构

```
market-supervision-system/
├── frontend/                     # 前端项目
│   ├── src/
│   │   ├── components/          # UI组件 (待开发)
│   │   ├── pages/               # 7个页面组件 ✅
│   │   │   ├── Dashboard.tsx    # 仪表板
│   │   │   ├── CaseAnalysis.tsx # 案例分析
│   │   │   ├── KnowledgeGraph.tsx # 知识图谱
│   │   │   ├── Simulator.tsx    # 场景模拟
│   │   │   ├── Calculator.tsx   # 裁量计算器
│   │   │   ├── CaseManagement.tsx # 案件管理 (新功能)
│   │   │   └── Analytics.tsx    # 数据分析 (新功能)
│   │   ├── hooks/               # 自定义Hooks ✅
│   │   │   ├── useDebounce.ts   # 防抖Hook
│   │   │   ├── useLocalStorage.ts # 本地存储Hook
│   │   │   └── useSearch.ts     # 智能搜索Hook
│   │   ├── utils/               # 工具函数 ✅
│   │   │   ├── storage.ts       # 存储工具
│   │   │   └── format.ts        # 格式化工具
│   │   ├── data/                # 数据文件 (待迁移)
│   │   ├── types/               # TypeScript类型 ✅
│   │   ├── services/            # API服务 (待开发)
│   │   ├── App.tsx              # 主应用 ✅
│   │   ├── main.tsx             # 入口文件 ✅
│   │   └── index.css            # 全局样式 ✅
│   ├── index.html               # HTML模板 ✅
│   ├── vite.config.ts           # Vite配置 ✅
│   ├── tsconfig.json            # TS配置 ✅
│   └── package.json             # 依赖配置 ✅
├── backend/                      # 后端项目 (待创建)
└── docs/                         # 文档 ✅
    ├── IMPLEMENTATION_GUIDE.md  # 实施指南
    └── DEPLOY.md                # 部署指南
```

---

## 🎯 核心功能

### 现有功能 (从原系统继承)

1. **智能案例分析器**
   - 377+ 真实案例
   - 四步法分析: 事实认定 → 法律检索 → 法律适用 → 处理决定
   - 难度分级: 简单/中等/困难

2. **法律知识图谱**
   - 10大监管领域 (MECE原则)
   - 56部完整法律详情
   - 相关案例关联

3. **执法场景模拟器**
   - 1508+ 道练习题
   - 自适应学习路径
   - 进度跟踪和得分统计

4. **行政处罚裁量计算器**
   - 智能计算罚款金额
   - 裁量基准参考

### 新增功能 (针对局长需求)

5. **案件管理系统** 🆕
   - 案件全生命周期管理
   - 工作流引擎 (待处理→调查→审批→结案→归档)
   - 期限提醒和文书生成
   - 团队协作和批注

6. **AI法律问答助手** 🆕
   - 智能法律咨询
   - 相似案例推荐
   - 文书自动生成
   - 裁量建议

7. **数据分析仪表板** 🆕
   - 辖区执法统计
   - 违法行为趋势分析
   - 重点监管领域预警
   - 团队绩效看板

---

## 🔧 技术栈

### 前端

- **框架**: React 19.2 + TypeScript 5.9
- **构建**: Vite 7.1
- **样式**: Tailwind CSS 4.1
- **状态管理**: React Hooks + Local Storage
- **路由**: 基于Tab的SPA路由
- **图表**: Recharts / ECharts (待集成)

### 后端 (计划)

- **框架**: FastAPI
- **数据库**: PostgreSQL 14+
- **缓存**: Redis
- **认证**: JWT
- **AI**: Claude API / 本地大模型

### 部署

- **服务器**: 47.111.132.236
- **Web服务器**: Nginx
- **进程管理**: Supervisor / PM2
- **HTTPS**: Let's Encrypt

---

## 📈 性能指标

### 当前性能 (优化后)

- ✅ 代码分割: 按页面懒加载
- ✅ 搜索防抖: 300ms
- ✅ 本地存储: 学习进度持久化
- ✅ TypeScript: 类型安全

### 目标性能

- 🎯 首屏加载: < 2秒
- 🎯 搜索响应: < 100ms
- 🎯 Lighthouse得分: > 90

---

## 📚 文档

- [实施指南](docs/IMPLEMENTATION_GUIDE.md) - 完整开发流程和任务清单
- [部署指南](docs/DEPLOY.md) - 生产环境部署步骤
- [API文档](docs/API.md) - API接口文档 (待创建)

---

## 🗓️ 开发计划

### 第1-2周: 数据迁移和组件开发
- 从HTML提取数据
- 创建共享UI组件
- 完善页面功能

### 第3-4周: 案件管理系统
- CRUD功能
- 工作流引擎
- 文书模板

### 第5-6周: AI集成和数据分析
- AI问答助手
- 数据可视化
- 智能推荐

### 第7-8周: 后端开发
- FastAPI + PostgreSQL
- RESTful API
- 身份认证

### 第9周: 测试和部署
- 自动化测试
- 性能优化
- 生产部署

### 第10周: 培训和上线
- 用户培训
- 文档完善
- 正式上线

---

## 🎨 设计理念

1. **科学性**: 基于MECE方法论和第一性原理
2. **完整性**: 覆盖10大监管领域、99部核心法律
3. **实用性**: 案例驱动学习,真实场景模拟
4. **智能化**: AI辅助决策,数据分析预警
5. **易用性**: 简洁界面,1天培训即可上手

---

## 🤝 贡献

欢迎提出改进建议和Bug报告!

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢滨江区市场监管局对本项目的支持!

---

**项目启动日期**: 2025-10-21
**当前版本**: v1.0.0-alpha
**维护团队**: Claude Code
**联系方式**: 查看项目文档

---

## 🔗 相关链接

- [杭州市市场监管局](https://scjg.hangzhou.gov.cn/)
- [国家市场监督管理总局](https://www.samr.gov.cn/)
- [中国裁判文书网](https://wenshu.court.gov.cn/)

---

**最后更新**: 2025-10-21
