# 市场监管系统 - 测试全面评估报告

> **评估日期**: 2025-10-24
> **项目**: 杭州滨江区市场监管局智能决策系统
> **评估范围**: 前端应用完整测试体系

---

## 📋 执行摘要

### 当前状态
- ❌ **无测试覆盖**: 项目当前没有任何自动化测试
- ❌ **无测试配置**: 未安装测试框架和工具
- ❌ **无测试脚本**: package.json 中缺少测试命令
- ⚠️ **高风险**: 代码变更没有自动化验证机制

### 评估结果
| 类别 | 代码量 | 测试覆盖率 | 风险等级 |
|------|--------|-----------|---------|
| **工具函数** (utils/) | ~200 LOC | 0% | 🔴 高 |
| **自定义 Hooks** (hooks/) | ~100 LOC | 0% | 🔴 高 |
| **UI 组件** (components/) | ~300 LOC | 0% | 🟡 中 |
| **页面组件** (pages/) | ~3,160 LOC | 0% | 🟠 中-高 |
| **数据层** (data/) | ~3,690 LOC | 0% | 🟢 低 |
| **总计** | ~7,450 LOC | **0%** | 🔴 高 |

---

## 🎯 测试策略建议

### 1. 测试金字塔 (Test Pyramid)

```
                 /\
                /  \  E2E测试 (5%)
               /────\
              /      \  集成测试 (15%)
             /────────\
            /          \  单元测试 (80%)
           /────────────\
```

### 推荐测试分布
- **单元测试 (80%)**: 工具函数、Hooks、组件
- **集成测试 (15%)**: 页面组件、用户流程
- **E2E 测试 (5%)**: 关键业务路径

---

## 🛠️ 推荐技术栈

### 核心测试框架

#### 1. Vitest (推荐 ⭐⭐⭐⭐⭐)
**选择理由**:
- ✅ 与 Vite 原生集成，零配置
- ✅ 极快的测试执行速度 (比 Jest 快 10x)
- ✅ 兼容 Jest API (易迁移)
- ✅ 内置代码覆盖率报告
- ✅ TypeScript 原生支持
- ✅ HMR 支持（测试热重载）

**安装命令**:
```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

#### 2. React Testing Library
**用途**: React 组件测试
**优势**:
- 基于用户行为的测试方式
- 避免实现细节测试
- 社区最佳实践

**安装命令**:
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### 3. Playwright (可选)
**用途**: E2E 端到端测试
**特点**:
- 跨浏览器测试 (Chrome, Firefox, Safari)
- 自动等待机制
- 强大的调试工具

---

## 📊 详细测试需求分析

### 优先级 P0 - 核心工具函数 (必须测试)

#### `/utils/format.ts` (62 行)

**需要测试的函数**:

##### 1. `formatDate()`
```typescript
// 测试用例设计
✓ 应正确格式化日期字符串为 YYYY-MM-DD
✓ 应正确格式化日期对象
✓ 应支持自定义格式 (YYYY-MM-DD HH:mm:ss)
✓ 应正确处理月份和日期的前导零 (01, 02...)
✓ 边界情况: 无效日期应返回 "Invalid Date"
```

**风险**: 🔴 高 - 日期格式化错误会影响案件管理和数据分析

##### 2. `formatRelativeTime()`
```typescript
// 测试用例设计
✓ 60秒内应返回 "刚刚"
✓ 1小时内应返回 "X分钟前"
✓ 24小时内应返回 "X小时前"
✓ 30天内应返回 "X天前"
✓ 1年内应返回 "X个月前"
✓ 超过1年应返回 "X年前"
✓ 应正确处理未来时间 (负数差值)
```

**风险**: 🟡 中 - 影响用户体验，不影响核心功能

##### 3. `truncateText()`
```typescript
// 测试用例设计
✓ 文本长度小于 maxLength 应返回原文本
✓ 文本长度大于 maxLength 应截断并添加后缀
✓ 应正确计算后缀长度
✓ 空字符串应返回空字符串
✓ maxLength 为 0 应返回空字符串或后缀
```

**风险**: 🟢 低 - 仅影响显示

##### 4. `highlightKeyword()`
```typescript
// 测试用例设计
✓ 应正确高亮单个关键词
✓ 应支持大小写不敏感匹配 (gi 标志)
✓ 应高亮所有匹配项
✓ 空关键词应返回原文本
✓ 应正确处理特殊字符 (需转义)
✓ 应返回包含 <mark> 标签的 HTML
```

**风险**: 🟢 低 - 仅影响搜索高亮显示

---

#### `/utils/storage.ts` (66 行)

**需要测试的方法**:

##### 1. `Storage.set()`
```typescript
// 测试用例设计
✓ 应正确存储字符串值
✓ 应正确序列化对象
✓ 应正确序列化数组
✓ 应正确处理 null 和 undefined
✓ 应捕获 JSON.stringify 错误
✓ 应调用 localStorage.setItem
```

##### 2. `Storage.get()`
```typescript
// 测试用例设计
✓ 应正确读取存储的值
✓ 应正确反序列化对象
✓ 键不存在时应返回 defaultValue
✓ 键不存在且无 defaultValue 应返回 null
✓ JSON 解析错误应返回 defaultValue
✓ 应捕获异常并返回 defaultValue
```

##### 3. `Storage.remove()`
```typescript
// 测试用例设计
✓ 应正确删除指定键
✓ 应调用 localStorage.removeItem
✓ 删除不存在的键不应报错
```

##### 4. `Storage.clear()`
```typescript
// 测试用例设计
✓ 应清空所有存储
✓ 应调用 localStorage.clear
```

**风险**: 🔴 高 - 存储失败会导致用户进度丢失

---

### 优先级 P1 - 自定义 Hooks (高优先级)

#### `/hooks/useLocalStorage.ts` (62 行)

**测试用例设计**:

```typescript
describe('useLocalStorage', () => {
  ✓ 应从 localStorage 读取初始值
  ✓ 初始值不存在时应使用 initialValue
  ✓ setValue 应更新状态和 localStorage
  ✓ 应支持函数式更新 (setValue(prev => prev + 1))
  ✓ 应监听其他标签页的 storage 事件
  ✓ storage 事件应触发状态更新
  ✓ JSON 解析错误应返回 initialValue
  ✓ SSR 环境 (window undefined) 应返回 initialValue
  ✓ 组件卸载时应移除事件监听器
})
```

**测试复杂度**: 🟡 中 - 需要 mock localStorage 和 StorageEvent

**风险**: 🔴 高 - 这是状态持久化的核心 Hook

---

#### `/hooks/useDebounce.ts` (24 行)

**测试用例设计**:

```typescript
describe('useDebounce', () => {
  ✓ 应在 delay 后返回新值
  ✓ delay 期间多次更新应只触发一次
  ✓ 应正确清理 timeout
  ✓ delay 参数变化应重新设置 timer
  ✓ 组件卸载时应清理未完成的 timer
})
```

**测试复杂度**: 🟡 中 - 需要使用 fake timers (vi.useFakeTimers)

**风险**: 🟡 中 - 影响搜索体验

---

#### `/hooks/useSearch.ts`

**测试用例设计**:

```typescript
describe('useSearch', () => {
  ✓ 应正确搜索法律法规 (LAW_DETAILS)
  ✓ 应正确搜索案例 (CASE_LIBRARY)
  ✓ 应正确搜索领域 (LAW_DOMAINS)
  ✓ 空查询应返回空数组
  ✓ 应支持多字段搜索 (name, fullName, summary)
  ✓ 应限制结果数量 (最多10条)
  ✓ 应使用 useDebounce 防抖
  ✓ 搜索结果应包含 type 和 preview
})
```

**风险**: 🟠 中-高 - 搜索是核心功能

---

### 优先级 P2 - UI 组件 (中优先级)

#### `/components/Card.tsx` (85 行)

**测试用例设计**:

```typescript
describe('Card', () => {
  describe('Card 主组件', () => {
    ✓ 应渲染子元素
    ✓ 应应用自定义 className
    ✓ hoverable=true 应添加 hover 样式
    ✓ onClick 存在时应添加 cursor-pointer
    ✓ 应正确应用 padding (none/sm/md/lg)
    ✓ 点击时应触发 onClick 回调
  })

  describe('CardHeader', () => {
    ✓ 应渲染子元素
    ✓ 应应用 mb-4 类
  })

  describe('CardTitle', () => {
    ✓ 应渲染 h3 标签
    ✓ 应应用正确的样式类
  })

  describe('CardContent', () => {
    ✓ 应渲染内容
    ✓ 应应用 text-gray-700
  })

  describe('CardFooter', () => {
    ✓ 应渲染子元素
    ✓ 应显示顶部边框
  })
})
```

**风险**: 🟢 低 - 样式组件，不影响业务逻辑

---

#### `/components/Button.tsx`

```typescript
describe('Button', () => {
  ✓ 应渲染按钮文本
  ✓ 应支持不同的 variant (primary/secondary/danger)
  ✓ 应支持不同的 size (sm/md/lg)
  ✓ disabled 状态应禁用点击
  ✓ disabled 状态应添加禁用样式
  ✓ 应触发 onClick 事件
  ✓ loading 状态应显示加载指示器
  ✓ 应支持 icon 属性
})
```

---

#### `/components/Modal.tsx`

```typescript
describe('Modal', () => {
  ✓ isOpen=false 时不应渲染
  ✓ isOpen=true 时应渲染 modal
  ✓ 应渲染标题和内容
  ✓ 点击关闭按钮应触发 onClose
  ✓ 点击遮罩层应触发 onClose
  ✓ Escape 键应触发 onClose
  ✓ 应正确应用 size (sm/md/lg/xl)

  describe('ConfirmModal', () => {
    ✓ 应显示确认和取消按钮
    ✓ 点击确认应触发 onConfirm
    ✓ 点击取消应触发 onCancel
    ✓ 应支持自定义按钮文本
  })
})
```

---

#### `/components/SearchBar.tsx`

```typescript
describe('SearchBar', () => {
  ✓ 应渲染搜索输入框
  ✓ 应显示占位符文本
  ✓ 输入时应触发 onChange
  ✓ 应支持受控组件模式
  ✓ 应显示搜索图标
  ✓ 有值时应显示清除按钮
  ✓ 点击清除按钮应清空输入
  ✓ Enter 键应触发 onSearch
})
```

---

#### `/components/Badge.tsx`

```typescript
describe('Badge', () => {
  ✓ 应渲染徽章文本
  ✓ 应支持不同的 variant

  describe('DifficultyBadge', () => {
    ✓ "简单" 应显示绿色
    ✓ "中等" 应显示黄色
    ✓ "困难" 应显示红色
    ✓ 应显示正确的图标
  })
})
```

---

#### `/components/Icon.tsx`

```typescript
describe('Icon', () => {
  ✓ 应渲染正确的 emoji
  ✓ 应支持自定义 size
  ✓ 未知类型应返回默认图标
  ✓ 应正确应用样式
})
```

---

### 优先级 P3 - 页面组件 (集成测试)

由于页面组件较复杂，建议采用**集成测试**方式，测试关键用户流程。

#### `/pages/CaseAnalysis.tsx` (452 行)

**关键测试场景**:

```typescript
describe('CaseAnalysis - 案例分析页面', () => {
  ✓ 应显示案例列表
  ✓ 应支持按领域过滤案例
  ✓ 应支持按难度过滤案例
  ✓ 应支持搜索案例
  ✓ 点击案例应显示详情
  ✓ 应显示四步分析法 (事实/法律/适用/决策)
  ✓ 应支持标记案例为已完成
  ✓ 已完成案例应显示对勾标记
  ✓ 应保存用户进度到 localStorage
  ✓ 应支持添加/移除书签
})
```

**风险**: 🔴 高 - 核心功能模块

---

#### `/pages/KnowledgeGraph.tsx` (386 行)

```typescript
describe('KnowledgeGraph - 知识图谱', () => {
  ✓ 应显示10大监管领域
  ✓ 点击领域应显示法律列表
  ✓ 点击法律应显示详情
  ✓ 法律详情应包含关键信息 (发布机构/生效日期/条款)
  ✓ 应支持搜索法律
  ✓ 应支持收藏法律
})
```

---

#### `/pages/Calculator.tsx` (385 行)

```typescript
describe('Calculator - 裁量计算器', () => {
  ✓ 应显示违法金额输入
  ✓ 应显示主观过错选择器
  ✓ 应显示后果严重程度选择器
  ✓ 应显示整改态度选择器
  ✓ 应正确计算罚款金额
  ✓ 计算公式应正确 (基础金额 × 系数)
  ✓ 应显示处罚建议
  ✓ 应支持重置表单
})
```

**风险**: 🔴 高 - 涉及金额计算，必须测试

---

#### `/pages/CaseManagement.tsx` (694 行)

```typescript
describe('CaseManagement - 案件管理', () => {
  ✓ 应显示案件列表
  ✓ 应支持创建新案件
  ✓ 应验证必填字段
  ✓ 应支持编辑案件
  ✓ 应支持删除案件
  ✓ 应支持更新案件状态
  ✓ 应支持添加备注
  ✓ 应支持搜索案件
  ✓ 应支持按状态过滤
  ✓ 应保存到 localStorage
  ✓ 刷新后应恢复数据
})
```

**风险**: 🔴 高 - 案件管理是核心 CRUD 功能

---

#### `/pages/Dashboard.tsx` (267 行)

```typescript
describe('Dashboard - 仪表板', () => {
  ✓ 应显示统计卡片
  ✓ 应显示法律法规总数
  ✓ 应显示案例总数
  ✓ 应显示学习进度
  ✓ 应显示用户得分
  ✓ 应显示快捷入口
  ✓ 点击快捷入口应跳转
  ✓ 应显示最新案例
  ✓ 应显示法律领域网格
})
```

---

#### `/pages/Analytics.tsx` (436 行)

```typescript
describe('Analytics - 数据分析', () => {
  ✓ 应显示统计图表
  ✓ 应显示法律领域使用频率
  ✓ 应显示案件处理时间分析
  ✓ 应显示用户行为统计
  ✓ 应支持时间范围选择
  ✓ 图表应正确渲染数据
})
```

---

#### `/pages/Simulator.tsx` (540 行)

```typescript
describe('Simulator - 场景模拟', () => {
  ✓ 应显示场景列表
  ✓ 应支持选择场景
  ✓ 应显示题目
  ✓ 应支持选择答案
  ✓ 应验证答案正确性
  ✓ 应显示答案解析
  ✓ 应计算得分
  ✓ 应保存学习进度
})
```

---

### 优先级 P4 - 数据层验证 (低优先级)

#### `/data/lawDomains.ts`, `/data/lawDetails.ts`

**测试用例**:

```typescript
describe('数据完整性验证', () => {
  ✓ LAW_DOMAINS 应包含10个领域
  ✓ 每个领域应有 id, name, icon, color, laws
  ✓ LAW_DETAILS 应是有效的数组
  ✓ 每个法律应有 id, name, fullName, issuer
  ✓ 所有 laws 引用应在 LAW_DETAILS 中存在
  ✓ 日期格式应正确 (YYYY-MM-DD)
  ✓ 不应有重复的 ID
})
```

**风险**: 🟢 低 - 静态数据，手动验证即可

---

## 📝 推荐测试配置

### 1. Vitest 配置 (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
      // 覆盖率目标
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
    // 并行测试
    threads: true,
    // 测试超时
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
});
```

---

### 2. 测试环境设置 (`src/test/setup.ts`)

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展 Vitest 断言
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia (Tailwind CSS 需要)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

### 3. 更新 `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",

    // 新增测试脚本
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  },
  "devDependencies": {
    // 现有依赖...

    // 测试框架
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "@vitest/coverage-v8": "^1.0.4",

    // React 测试工具
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",

    // DOM 环境
    "jsdom": "^23.0.1",

    // Mock 工具
    "happy-dom": "^12.10.3"
  }
}
```

---

## 🧪 示例测试代码

### 示例 1: 工具函数测试

**文件**: `src/utils/__tests__/format.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, truncateText, highlightKeyword } from '../format';

describe('format 工具函数', () => {
  describe('formatDate', () => {
    it('应正确格式化日期为 YYYY-MM-DD', () => {
      const date = new Date('2025-10-24T12:00:00');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-10-24');
    });

    it('应正确格式化日期时间', () => {
      const date = new Date('2025-10-24T08:30:45');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-10-24 08:30:45');
    });

    it('应正确处理字符串日期', () => {
      expect(formatDate('2025-10-24', 'YYYY-MM-DD')).toBe('2025-10-24');
    });

    it('应正确添加前导零', () => {
      const date = new Date('2025-01-05T03:05:08');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-01-05 03:05:08');
    });
  });

  describe('formatRelativeTime', () => {
    const now = new Date();

    it('60秒内应返回 "刚刚"', () => {
      const past = new Date(now.getTime() - 30 * 1000); // 30秒前
      expect(formatRelativeTime(past)).toBe('刚刚');
    });

    it('1小时内应返回分钟数', () => {
      const past = new Date(now.getTime() - 15 * 60 * 1000); // 15分钟前
      expect(formatRelativeTime(past)).toBe('15分钟前');
    });

    it('24小时内应返回小时数', () => {
      const past = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5小时前
      expect(formatRelativeTime(past)).toBe('5小时前');
    });

    it('30天内应返回天数', () => {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7天前
      expect(formatRelativeTime(past)).toBe('7天前');
    });

    it('1年内应返回月数', () => {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90天前
      expect(formatRelativeTime(past)).toBe('3个月前');
    });

    it('超过1年应返回年数', () => {
      const past = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000); // 400天前
      expect(formatRelativeTime(past)).toBe('1年前');
    });
  });

  describe('truncateText', () => {
    it('短文本应返回原文本', () => {
      expect(truncateText('短文本', 10)).toBe('短文本');
    });

    it('长文本应截断并添加后缀', () => {
      expect(truncateText('这是一段很长的文本', 5, '...')).toBe('这是...'); // 5 - 3 = 2 个字符
    });

    it('应支持自定义后缀', () => {
      expect(truncateText('Hello World', 8, '>>>')).toBe('Hello>>>');
    });

    it('空字符串应返回空字符串', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('highlightKeyword', () => {
    it('应正确高亮关键词', () => {
      const result = highlightKeyword('食品安全法', '食品');
      expect(result).toBe('<mark class="bg-yellow-200">食品</mark>安全法');
    });

    it('应支持大小写不敏感', () => {
      const result = highlightKeyword('Food Safety Law', 'food');
      expect(result).toContain('<mark');
    });

    it('空关键词应返回原文本', () => {
      expect(highlightKeyword('测试文本', '')).toBe('测试文本');
    });

    it('应高亮所有匹配项', () => {
      const result = highlightKeyword('食品安全与食品监管', '食品');
      const matches = result.match(/<mark/g);
      expect(matches).toHaveLength(2);
    });
  });
});
```

---

### 示例 2: Hook 测试

**文件**: `src/hooks/__tests__/useDebounce.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应返回初始值', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('应在延迟后更新值', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    // 更新值
    rerender({ value: 'updated' });

    // 立即检查 - 应该还是旧值
    expect(result.current).toBe('initial');

    // 快进时间
    vi.advanceTimersByTime(500);

    // 应该更新为新值
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('延迟期间多次更新应只触发一次', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'v1' } }
    );

    rerender({ value: 'v2' });
    vi.advanceTimersByTime(200);

    rerender({ value: 'v3' });
    vi.advanceTimersByTime(200);

    rerender({ value: 'v4' });
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe('v4'); // 应该是最后一次的值
    });
  });

  it('组件卸载时应清理 timer', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
```

---

### 示例 3: 组件测试

**文件**: `src/components/__tests__/Card.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card';

describe('Card 组件', () => {
  describe('Card 主组件', () => {
    it('应渲染子元素', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应应用自定义 className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('hoverable=true 应添加 hover 样式', () => {
      const { container } = render(<Card hoverable>Content</Card>);
      expect(container.firstChild).toHaveClass('hover:shadow-lg');
    });

    it('应正确应用 padding', () => {
      const { container: sm } = render(<Card padding="sm">SM</Card>);
      expect(sm.firstChild).toHaveClass('p-3');

      const { container: md } = render(<Card padding="md">MD</Card>);
      expect(md.firstChild).toHaveClass('p-4');

      const { container: lg } = render(<Card padding="lg">LG</Card>);
      expect(lg.firstChild).toHaveClass('p-6');
    });

    it('点击时应触发 onClick 回调', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Card onClick={handleClick}>Clickable</Card>);

      await user.click(screen.getByText('Clickable'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('onClick 存在时应添加 cursor-pointer', () => {
      const { container } = render(<Card onClick={() => {}}>Content</Card>);
      expect(container.firstChild).toHaveClass('cursor-pointer');
    });
  });

  describe('CardHeader', () => {
    it('应渲染子元素', () => {
      render(<CardHeader>Header</CardHeader>);
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('应应用 mb-4 类', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      expect(container.firstChild).toHaveClass('mb-4');
    });
  });

  describe('CardTitle', () => {
    it('应渲染 h3 标签', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H3');
    });

    it('应应用正确的样式类', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
    });
  });

  describe('CardContent', () => {
    it('应渲染内容', () => {
      render(<CardContent>Content Text</CardContent>);
      expect(screen.getByText('Content Text')).toBeInTheDocument();
    });

    it('应应用 text-gray-700', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild).toHaveClass('text-gray-700');
    });
  });

  describe('CardFooter', () => {
    it('应渲染子元素', () => {
      render(<CardFooter>Footer</CardFooter>);
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('应显示顶部边框', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveClass('border-t', 'border-gray-200');
    });
  });

  describe('复合组件', () => {
    it('应正确渲染完整卡片', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>卡片标题</CardTitle>
          </CardHeader>
          <CardContent>卡片内容</CardContent>
          <CardFooter>卡片底部</CardFooter>
        </Card>
      );

      expect(screen.getByText('卡片标题')).toBeInTheDocument();
      expect(screen.getByText('卡片内容')).toBeInTheDocument();
      expect(screen.getByText('卡片底部')).toBeInTheDocument();
    });
  });
});
```

---

### 示例 4: localStorage Mock 测试

**文件**: `src/utils/__tests__/storage.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage, STORAGE_KEYS } from '../storage';

describe('Storage 工具类', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('set', () => {
    it('应正确存储字符串值', () => {
      Storage.set('test_key', 'test_value');
      expect(localStorage.getItem('test_key')).toBe('"test_value"');
    });

    it('应正确序列化对象', () => {
      const obj = { name: 'test', count: 42 };
      Storage.set('test_obj', obj);

      const stored = localStorage.getItem('test_obj');
      expect(stored).toBe(JSON.stringify(obj));
    });

    it('应正确序列化数组', () => {
      const arr = [1, 2, 3];
      Storage.set('test_arr', arr);

      const stored = localStorage.getItem('test_arr');
      expect(stored).toBe(JSON.stringify(arr));
    });

    it('应捕获 JSON.stringify 错误', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 创建循环引用对象
      const circular: any = { a: 1 };
      circular.self = circular;

      Storage.set('circular', circular);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('get', () => {
    it('应正确读取存储的值', () => {
      localStorage.setItem('test', JSON.stringify({ value: 123 }));

      const result = Storage.get('test');
      expect(result).toEqual({ value: 123 });
    });

    it('键不存在时应返回 defaultValue', () => {
      const result = Storage.get('non_existent', 'default');
      expect(result).toBe('default');
    });

    it('键不存在且无 defaultValue 应返回 null', () => {
      const result = Storage.get('non_existent');
      expect(result).toBeNull();
    });

    it('JSON 解析错误应返回 defaultValue', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('invalid', 'invalid json');

      const result = Storage.get('invalid', 'fallback');
      expect(result).toBe('fallback');

      consoleSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('应正确删除指定键', () => {
      localStorage.setItem('to_remove', '"value"');

      Storage.remove('to_remove');

      expect(localStorage.getItem('to_remove')).toBeNull();
    });

    it('删除不存在的键不应报错', () => {
      expect(() => Storage.remove('non_existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('应清空所有存储', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      Storage.clear();

      expect(localStorage.length).toBe(0);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('应包含所有预定义的键', () => {
      expect(STORAGE_KEYS).toHaveProperty('USER_PROGRESS');
      expect(STORAGE_KEYS).toHaveProperty('BOOKMARKED_LAWS');
      expect(STORAGE_KEYS).toHaveProperty('CASE_NOTES');
      expect(STORAGE_KEYS).toHaveProperty('COMPLETED_CASES');
      expect(STORAGE_KEYS).toHaveProperty('USER_SCORE');
      expect(STORAGE_KEYS).toHaveProperty('THEME_PREFERENCE');
      expect(STORAGE_KEYS).toHaveProperty('LAST_ACTIVE_TAB');
      expect(STORAGE_KEYS).toHaveProperty('CASE_MANAGEMENT');
    });
  });
});
```

---

## 📈 实施计划

### 第1周: 基础设施搭建

#### 任务清单
- [ ] 安装测试依赖 (Vitest, React Testing Library)
- [ ] 创建 `vitest.config.ts` 配置文件
- [ ] 创建 `src/test/setup.ts` 测试环境设置
- [ ] 更新 `package.json` 添加测试脚本
- [ ] 配置 CI/CD 集成 (GitHub Actions / GitLab CI)

#### 验收标准
- ✅ `npm run test` 命令可以正常执行
- ✅ `npm run test:coverage` 生成覆盖率报告
- ✅ 测试 UI 界面可访问 (`npm run test:ui`)

---

### 第2周: 工具函数测试 (P0)

#### 任务清单
- [ ] `src/utils/__tests__/format.test.ts` (4个函数)
- [ ] `src/utils/__tests__/storage.test.ts` (4个方法)
- [ ] `src/utils/__tests__/caseExtractor.test.ts`

#### 目标覆盖率
- ✅ 工具函数: **100%** 覆盖率

---

### 第3周: Hooks 测试 (P1)

#### 任务清单
- [ ] `src/hooks/__tests__/useDebounce.test.ts`
- [ ] `src/hooks/__tests__/useLocalStorage.test.ts`
- [ ] `src/hooks/__tests__/useSearch.test.ts`

#### 目标覆盖率
- ✅ Hooks: **90%+** 覆盖率

---

### 第4周: UI 组件测试 (P2)

#### 任务清单
- [ ] `src/components/__tests__/Card.test.tsx`
- [ ] `src/components/__tests__/Button.test.tsx`
- [ ] `src/components/__tests__/Modal.test.tsx`
- [ ] `src/components/__tests__/SearchBar.test.tsx`
- [ ] `src/components/__tests__/Badge.test.tsx`
- [ ] `src/components/__tests__/Icon.test.tsx`

#### 目标覆盖率
- ✅ 组件: **80%+** 覆盖率

---

### 第5-6周: 页面集成测试 (P3)

#### 任务清单
- [ ] `src/pages/__tests__/Dashboard.test.tsx`
- [ ] `src/pages/__tests__/CaseAnalysis.test.tsx`
- [ ] `src/pages/__tests__/KnowledgeGraph.test.tsx`
- [ ] `src/pages/__tests__/Calculator.test.tsx`
- [ ] `src/pages/__tests__/CaseManagement.test.tsx`
- [ ] `src/pages/__tests__/Analytics.test.tsx`
- [ ] `src/pages/__tests__/Simulator.test.tsx`

#### 目标覆盖率
- ✅ 页面: **70%+** 覆盖率

---

### 第7周: E2E 测试 (可选)

#### 工具选择: Playwright

#### 关键测试场景
- [ ] 用户登录流程
- [ ] 案例分析完整流程
- [ ] 案件创建和管理流程
- [ ] 裁量计算器使用流程

---

### 第8周: 优化和文档

#### 任务清单
- [ ] 达到总体覆盖率目标 (**80%+**)
- [ ] 编写测试文档
- [ ] 优化测试性能
- [ ] 添加测试最佳实践指南
- [ ] CI/CD 集成完善

---

## 🎯 覆盖率目标

### 总体目标

| 指标 | 目标 | 理想 |
|------|------|------|
| **语句覆盖率** (Statements) | 80% | 90% |
| **分支覆盖率** (Branches) | 70% | 80% |
| **函数覆盖率** (Functions) | 80% | 90% |
| **行覆盖率** (Lines) | 80% | 90% |

### 分模块目标

| 模块 | 覆盖率目标 |
|------|-----------|
| `utils/` | 100% |
| `hooks/` | 90% |
| `components/` | 80% |
| `pages/` | 70% |
| `data/` | 50% (数据验证) |

---

## 🚨 风险与挑战

### 1. localStorage 依赖
**问题**: 所有状态依赖 localStorage，测试需要大量 mock
**解决方案**:
- 使用 Vitest 的 `vi.stubGlobal()` mock localStorage
- 在 `setup.ts` 中统一配置
- 每个测试后自动清理 (`afterEach(() => localStorage.clear())`)

### 2. React 19 兼容性
**问题**: React 19 是最新版本，部分测试库可能不兼容
**解决方案**:
- 优先使用 React Testing Library v14+
- 关注官方更新和兼容性公告
- 必要时降级到 React 18

### 3. Tailwind CSS 测试
**问题**: 动态类名难以测试
**解决方案**:
- 测试类名是否存在而非具体样式
- 使用 `toHaveClass()` 断言
- 视觉回归测试使用 Chromatic (可选)

### 4. 大数据量测试
**问题**: `LAW_DETAILS` 包含 3,000+ 行数据，测试可能很慢
**解决方案**:
- 使用测试数据 fixtures (精简版数据)
- Mock 数据导入
- 仅测试数据结构而非全量数据

---

## 💡 最佳实践建议

### 1. 测试文件组织

```
src/
├── components/
│   ├── Card.tsx
│   └── __tests__/
│       └── Card.test.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── __tests__/
│       └── useDebounce.test.ts
└── utils/
    ├── format.ts
    └── __tests__/
        └── format.test.ts
```

### 2. 命名规范

- 测试文件: `*.test.ts` 或 `*.test.tsx`
- 测试套件: `describe('组件/函数名', () => {})`
- 测试用例: `it('应该做什么', () => {})`

### 3. AAA 模式

```typescript
it('应该返回正确的值', () => {
  // Arrange - 准备
  const input = 'test';

  // Act - 执行
  const result = myFunction(input);

  // Assert - 断言
  expect(result).toBe('expected');
});
```

### 4. 测试隔离

- 每个测试应独立运行
- 使用 `beforeEach`/`afterEach` 清理状态
- 避免测试间的依赖

### 5. 有意义的断言

```typescript
// ❌ 不好
expect(result).toBeTruthy();

// ✅ 好
expect(result).toBe('expected value');
```

---

## 📚 参考资源

### 官方文档
- [Vitest 官方文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 教程
- [Vitest 完全指南](https://vitest.dev/guide/)
- [React 测试最佳实践](https://reactjs.org/docs/testing.html)
- [如何写好单元测试](https://kentcdodds.com/blog/write-tests)

---

## 🔗 附录

### A. 快速开始命令

```bash
# 1. 安装依赖
cd frontend
npm install -D vitest @vitest/ui @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom

# 2. 创建配置文件
touch vitest.config.ts
touch src/test/setup.ts

# 3. 运行测试
npm run test          # 监听模式
npm run test:run      # 运行一次
npm run test:coverage # 生成覆盖率报告
npm run test:ui       # 打开测试 UI
```

### B. 示例测试命令

```bash
# 运行单个测试文件
npm run test format.test.ts

# 运行特定测试套件
npm run test -t "formatDate"

# 更新快照
npm run test -- -u

# 监听模式 (默认)
npm run test

# CI 模式 (运行一次并退出)
npm run test:run
```

---

## 📊 总结

### 当前状态
- ❌ **零测试覆盖** - 项目存在高风险
- ❌ **无自动化验证** - 代码变更无法验证
- ❌ **无质量保障** - 重构和功能迭代风险高

### 推荐方案
1. **立即行动**: 搭建测试基础设施 (Vitest + RTL)
2. **优先级**: 工具函数 → Hooks → 组件 → 页面
3. **覆盖率目标**: 80% 总体覆盖率
4. **时间投入**: 8周完成完整测试体系

### 预期收益
- ✅ **代码质量提升**: 及早发现 bug
- ✅ **重构信心**: 安全重构代码
- ✅ **文档价值**: 测试即文档
- ✅ **团队协作**: 降低沟通成本
- ✅ **长期维护**: 降低维护成本

---

**评估人**: Claude Code
**评估完成日期**: 2025-10-24
**下次审查日期**: 建议每2周审查测试覆盖率进展
