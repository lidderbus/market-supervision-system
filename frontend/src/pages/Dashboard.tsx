import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Icon, Badge, Button } from '@/components';
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
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">欢迎,局长!</h1>
            <p className="text-blue-100 text-lg">杭州滨江区市场监管局 · 智能决策辅助系统</p>
          </div>
          <div className="hidden md:block text-6xl">
            <Icon type="admin" size={80} />
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-100 text-sm mb-1">法律法规库</div>
              <div className="text-4xl font-bold">{stats.totalLaws}</div>
              <div className="text-blue-100 text-xs mt-2">{stats.totalDomains}大监管领域</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="law" size={60} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-100 text-sm mb-1">案例库</div>
              <div className="text-4xl font-bold">{stats.totalCases}</div>
              <div className="text-green-100 text-xs mt-2">真实执法案例</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="case" size={60} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-100 text-sm mb-1">学习进度</div>
              <div className="text-4xl font-bold">{stats.progress}%</div>
              <div className="text-purple-100 text-xs mt-2">
                已完成 {stats.completedCases}/{stats.totalCases} 案例
              </div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="chart" size={60} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-100 text-sm mb-1">系统评分</div>
              <div className="text-4xl font-bold">{userProgress.score || 0}</div>
              <div className="text-orange-100 text-xs mt-2">持续学习中...</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="star" size={60} />
            </div>
          </div>
        </Card>
      </div>

      {/* 快捷入口 */}
      <Card>
        <CardHeader>
          <CardTitle>快捷入口</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.tab}
                onClick={() => onNavigate?.(action.tab)}
                className={`p-6 border-2 border-gray-200 rounded-lg hover:border-${action.color}-500 hover:bg-${action.color}-50 hover:shadow-md transition-all text-left group`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  <Icon type={action.icon} size={48} />
                </div>
                <div className="font-semibold text-gray-900 mb-1">{action.title}</div>
                <div className="text-sm text-gray-600">{action.desc}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 10大监管领域 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>10大监管领域</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('knowledge')}>
              查看全部 →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {LAW_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => onNavigate?.('knowledge')}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
                style={{ borderLeftWidth: '4px', borderLeftColor: domain.color }}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {domain.icon}
                </div>
                <div className="font-medium text-gray-900 text-sm mb-1">{domain.name}</div>
                <div className="text-xs text-gray-600">{domain.laws.length}部法律</div>
                <Badge variant="info" size="sm" className="mt-2">
                  {domain.cases}个案例
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最新案例 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>典型案例精选</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('analysis')}>
              查看更多 →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCases.map((caseItem) => {
              const domain = LAW_DOMAINS.find((d) => d.id === caseItem.domain);
              return (
                <button
                  key={caseItem.id}
                  onClick={() => onNavigate?.('analysis')}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {caseItem.title}
                    </h4>
                    {domain && (
                      <span className="text-2xl ml-2 flex-shrink-0">{domain.icon}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{caseItem.facts}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        caseItem.difficulty === '简单'
                          ? 'success'
                          : caseItem.difficulty === '中等'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {caseItem.difficulty}
                    </Badge>
                    {caseItem.keywords.slice(0, 2).map((keyword, idx) => (
                      <Badge key={idx} variant="default" size="sm">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 学习建议 */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              <Icon type="info" size={48} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">💡 今日学习建议</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>建议重点学习<strong>食品安全监管</strong>领域,该领域案例最多({LAW_DOMAINS.find(d => d.id === 2)?.cases}个)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>可以从<strong>简单难度</strong>案例开始,逐步提升至困难案例</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>使用<strong>四步法</strong>(事实识别→法律检索→法律适用→决策)分析案例更高效</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
