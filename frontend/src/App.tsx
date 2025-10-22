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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* 顶部导航栏 - 现代玻璃态设计 */}
      <nav className="bg-white/70 backdrop-blur-2xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg sm:text-2xl">⚖️</span>
                </div>
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  市场监管法律智能决策系统
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                仪表板
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'analysis'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                案例分析
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'knowledge'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                知识图谱
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'simulator'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                场景模拟
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'calculator'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                裁量计算
              </button>
              <button
                onClick={() => setActiveTab('caseManagement')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'caseManagement'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                案件管理
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                数据分析
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <Suspense fallback={<LoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>

      {/* 添加CSS隐藏滚动条 */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;
