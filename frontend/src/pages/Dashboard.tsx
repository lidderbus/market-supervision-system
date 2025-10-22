import { useMemo } from 'react';
import { Icon } from '@/components';
import { LAW_DOMAINS } from '@/data/lawDomains';
import { LAW_DETAILS } from '@/data/lawDetails';
import { CASE_LIBRARY } from '@/data/caseLibrary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import type { TabType } from '@/types';

interface DashboardProps {
  onNavigate?: (tab: TabType) => void;
}

/**
 * Dashboard页面 - 系统主页
 * 显示关键指标、法律领域、最新案例、快捷入口等
 */
export default function Dashboard({ onNavigate }: DashboardProps) {
  const [userProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, {
    completedCases: [],
    bookmarks: [],
    score: 0
  });

  // 统计数据
  const stats = useMemo(() => {
    const totalLaws = Object.keys(LAW_DETAILS).length;
    const totalCases = CASE_LIBRARY.length;
    const totalDomains = LAW_DOMAINS.length;
    const completedCases = userProgress.completedCases?.length || 0;
    const progress = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

    return {
      totalLaws,
      totalCases,
      totalDomains,
      completedCases,
      progress
    };
  }, [userProgress]);

  // 最新案例 (取前6个)
  const recentCases = useMemo(() => CASE_LIBRARY.slice(0, 6), []);

  // 快捷入口
  const quickActions = [
    { icon: 'case', title: '智能案例分析', desc: '四步法分析执法案例', tab: 'analysis' as TabType, color: 'blue' },
    { icon: 'law', title: '法律知识图谱', desc: `${stats.totalLaws}部法律全覆盖`, tab: 'knowledge' as TabType, color: 'green' },
    { icon: 'bookmark', title: '执法场景模拟', desc: '实战练习提升能力', tab: 'simulator' as TabType, color: 'purple' },
    { icon: 'chart', title: '处罚裁量计算', desc: '智能计算处罚金额', tab: 'calculator' as TabType, color: 'orange' }
  ];

  return (
    <div className="space-y-4">
      {/* 核心指标 - 现代化卡片设计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="text-white/80 text-xs font-medium">法律法规库</div>
              <div className="text-3xl opacity-40">
                <Icon type="law" size={32} />
              </div>
            </div>
            <div className="text-white text-3xl font-bold mb-1">{stats.totalLaws}</div>
            <div className="text-white/70 text-xs">{stats.totalDomains}大监管领域</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="text-white/80 text-xs font-medium">案例库</div>
              <div className="text-3xl opacity-40">
                <Icon type="case" size={32} />
              </div>
            </div>
            <div className="text-white text-3xl font-bold mb-1">{stats.totalCases}</div>
            <div className="text-white/70 text-xs">真实执法案例</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="text-white/80 text-xs font-medium">学习进度</div>
              <div className="text-3xl opacity-40">
                <Icon type="chart" size={32} />
              </div>
            </div>
            <div className="text-white text-3xl font-bold mb-1">{stats.progress}%</div>
            <div className="text-white/70 text-xs">已完成 {stats.completedCases}/{stats.totalCases} 案例</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="text-white/80 text-xs font-medium">系统评分</div>
              <div className="text-3xl opacity-40">
                <Icon type="star" size={32} />
              </div>
            </div>
            <div className="text-white text-3xl font-bold mb-1">{userProgress.score || 0}</div>
            <div className="text-white/70 text-xs">持续学习中...</div>
          </div>
        </div>
      </div>

      {/* 快捷入口 - 现代玻璃态设计 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/50 p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></span>
          快捷入口
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const colorGradients = {
              blue: 'from-blue-500 to-cyan-500',
              green: 'from-emerald-500 to-teal-500',
              purple: 'from-purple-500 to-pink-500',
              orange: 'from-orange-500 to-red-500'
            };

            return (
              <button
                key={action.tab}
                onClick={() => onNavigate?.(action.tab)}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200/50 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorGradients[action.color as keyof typeof colorGradients]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`text-3xl mb-3 inline-block p-2 rounded-lg bg-gradient-to-br ${colorGradients[action.color as keyof typeof colorGradients]} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon type={action.icon} size={28} />
                  </div>
                  <div className="font-bold text-gray-900 text-sm mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-600">{action.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10大监管领域 - 现代卡片网格 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-cyan-600 rounded-full"></span>
            10大监管领域
          </h3>
          <button
            onClick={() => onNavigate?.('knowledge')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            查看全部 <span className="text-lg">→</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {LAW_DOMAINS.map((domain) => (
            <button
              key={domain.id}
              onClick={() => onNavigate?.('knowledge')}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 p-3 rounded-xl border border-gray-200/50 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
              style={{
                boxShadow: `0 0 0 0 ${domain.color}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 20px -4px ${domain.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
              }}
            >
              <div className="text-2xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                {domain.icon}
              </div>
              <div className="font-semibold text-gray-900 text-xs mb-1 line-clamp-2">{domain.name}</div>
              <div className="text-xs text-gray-500 mb-1">{domain.laws.length}部法律</div>
              <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700">
                {domain.cases}例
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 典型案例精选 - 现代卡片设计 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></span>
            典型案例精选
          </h3>
          <button
            onClick={() => onNavigate?.('analysis')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            查看更多 <span className="text-lg">→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentCases.map((caseItem) => {
            const domain = LAW_DOMAINS.find((d) => d.id === caseItem.domain);
            const difficultyColors = {
              '简单': 'from-green-500/10 to-emerald-500/10 text-green-700',
              '中等': 'from-yellow-500/10 to-orange-500/10 text-orange-700',
              '困难': 'from-red-500/10 to-pink-500/10 text-red-700'
            };

            return (
              <button
                key={caseItem.id}
                onClick={() => onNavigate?.('analysis')}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:scale-102 text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                      {caseItem.title}
                    </h4>
                    {domain && (
                      <span className="text-2xl ml-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300">
                        {domain.icon}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{caseItem.facts}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${difficultyColors[caseItem.difficulty as keyof typeof difficultyColors]}`}>
                      {caseItem.difficulty}
                    </span>
                    {caseItem.keywords.slice(0, 2).map((keyword, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 学习建议 - 现代信息卡片 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-[2px] shadow-2xl">
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon type="info" size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                💡 今日学习建议
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</span>
                  <span>建议重点学习<strong className="text-blue-600">食品安全监管</strong>领域,该领域案例最多({LAW_DOMAINS.find(d => d.id === 2)?.cases}个)</span>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</span>
                  <span>可以从<strong className="text-purple-600">简单难度</strong>案例开始,逐步提升至困难案例</span>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-50/50 transition-colors">
                  <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</span>
                  <span>使用<strong className="text-cyan-600">四步法</strong>(事实识别→法律检索→法律适用→决策)分析案例更高效</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
