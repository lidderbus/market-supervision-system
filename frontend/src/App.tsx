import { lazy, Suspense } from 'react';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { STORAGE_KEYS } from '@utils/storage';
import type { TabType } from '@/types';

// 懒加载页面组件 - 实现代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CaseAnalysis = lazy(() => import('./pages/CaseAnalysis'));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Calculator = lazy(() => import('./pages/Calculator'));
const CaseManagement = lazy(() => import('./pages/CaseManagement'));
const Analytics = lazy(() => import('./pages/Analytics'));

// 加载指示器组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">加载中...</p>
    </div>
  </div>
);

function App() {
  // 使用本地存储持久化当前标签页
  const [activeTab, setActiveTab] = useLocalStorage<TabType>(
    STORAGE_KEYS.LAST_ACTIVE_TAB,
    'dashboard'
  );

  // 渲染当前活动页面
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'analysis':
        return <CaseAnalysis />;
      case 'knowledge':
        return <KnowledgeGraph />;
      case 'simulator':
        return <Simulator />;
      case 'calculator':
        return <Calculator />;
      case 'caseManagement':
        return <CaseManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                市场监管法律智能决策系统
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                仪表板
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'analysis'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                案例分析
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'knowledge'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                知识图谱
              </button>
              <button
                onClick={() => setActiveTab('caseManagement')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'caseManagement'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                案件管理
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                数据分析
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}

export default App;
