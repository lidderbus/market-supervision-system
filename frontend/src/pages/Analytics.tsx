import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Icon, Badge } from '@/components';
import { LAW_DOMAINS } from '@/data/lawDomains';
import { LAW_DETAILS } from '@/data/lawDetails';
import { CASE_LIBRARY } from '@/data/caseLibrary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import type { CaseManagement } from '@/types';

/**
 * Analytics页面 - 数据分析仪表板
 * 辖区执法数据可视化分析
 */
export default function Analytics() {
  const [userProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, {
    completedCases: [] as number[],
    bookmarks: [] as string[],
    score: 0
  });

  const [managementCases] = useLocalStorage<CaseManagement[]>(STORAGE_KEYS.CASE_MANAGEMENT, []);

  // 按领域统计案例
  const domainStats = useMemo(() => {
    return LAW_DOMAINS.map((domain) => {
      const domainCases = CASE_LIBRARY.filter((c) => c.domain === domain.id);
      const completedCount = domainCases.filter((c) =>
        userProgress.completedCases.includes(c.id)
      ).length;

      return {
        ...domain,
        totalCases: domainCases.length,
        completedCases: completedCount,
        completionRate: domainCases.length > 0 ? (completedCount / domainCases.length) * 100 : 0
      };
    }).sort((a, b) => b.totalCases - a.totalCases);
  }, [userProgress.completedCases]);

  // 按难度统计
  const difficultyStats = useMemo(() => {
    const stats = {
      简单: { total: 0, completed: 0 },
      中等: { total: 0, completed: 0 },
      困难: { total: 0, completed: 0 }
    };

    CASE_LIBRARY.forEach((c) => {
      stats[c.difficulty].total++;
      if (userProgress.completedCases.includes(c.id)) {
        stats[c.difficulty].completed++;
      }
    });

    return Object.entries(stats).map(([difficulty, data]) => ({
      difficulty,
      total: data.total,
      completed: data.completed,
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0
    }));
  }, [userProgress.completedCases]);

  // 案件管理统计
  const managementStats = useMemo(() => {
    const byStatus = {
      pending: managementCases.filter((c) => c.status === 'pending').length,
      investigating: managementCases.filter((c) => c.status === 'investigating').length,
      resolved: managementCases.filter((c) => c.status === 'resolved').length,
      closed: managementCases.filter((c) => c.status === 'closed').length
    };

    const byPriority = {
      urgent: managementCases.filter((c) => c.priority === 'urgent').length,
      high: managementCases.filter((c) => c.priority === 'high').length,
      medium: managementCases.filter((c) => c.priority === 'medium').length,
      low: managementCases.filter((c) => c.priority === 'low').length
    };

    return { byStatus, byPriority };
  }, [managementCases]);

  // 学习进度统计
  const learningStats = useMemo(() => {
    const totalCases = CASE_LIBRARY.length;
    const completedCases = userProgress.completedCases.length;
    const totalLaws = Object.keys(LAW_DETAILS).length;
    const bookmarkedLaws = userProgress.bookmarks.filter((b) => b.startsWith('law_')).length;

    return {
      totalCases,
      completedCases,
      completionRate: totalCases > 0 ? (completedCases / totalCases) * 100 : 0,
      totalLaws,
      bookmarkedLaws,
      score: userProgress.score || 0
    };
  }, [userProgress]);

  // 热门法律 (基于案例引用次数)
  const popularLaws = useMemo(() => {
    const lawCounts: Record<string, number> = {};

    CASE_LIBRARY.forEach((caseItem) => {
      caseItem.laws.forEach((law) => {
        lawCounts[law] = (lawCounts[law] || 0) + 1;
      });
    });

    return Object.entries(lawCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([law, count]) => ({ law, count }));
  }, []);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📊 数据分析仪表板</h1>
            <p className="text-cyan-100">数据洞察 · 趋势分析 · 智能决策</p>
          </div>
          <div className="hidden md:block text-6xl">
            <Icon type="chart" size={80} />
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-100 text-sm mb-1">学习完成率</div>
              <div className="text-4xl font-bold">{learningStats.completionRate.toFixed(1)}%</div>
              <div className="text-blue-100 text-xs mt-2">
                {learningStats.completedCases}/{learningStats.totalCases} 案例
              </div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="chart" size={60} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-100 text-sm mb-1">累计积分</div>
              <div className="text-4xl font-bold">{learningStats.score}</div>
              <div className="text-green-100 text-xs mt-2">持续学习中</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="star" size={60} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-100 text-sm mb-1">收藏法律</div>
              <div className="text-4xl font-bold">{learningStats.bookmarkedLaws}</div>
              <div className="text-purple-100 text-xs mt-2">
                总计 {learningStats.totalLaws} 部
              </div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="bookmark" size={60} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-100 text-sm mb-1">管理案件</div>
              <div className="text-4xl font-bold">{managementCases.length}</div>
              <div className="text-orange-100 text-xs mt-2">
                待处理 {managementStats.byStatus.pending}
              </div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="case" size={60} />
            </div>
          </div>
        </Card>
      </div>

      {/* 监管领域分析 */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Icon type="domain" size={20} /> 监管领域分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainStats.map((domain) => (
              <div key={domain.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{domain.icon}</span>
                    <span className="font-medium text-gray-900">{domain.name}</span>
                    <Badge variant="default" size="sm">
                      {domain.totalCases}案例
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    已学习 {domain.completedCases} / {domain.totalCases} ({domain.completionRate.toFixed(0)}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${domain.completionRate}%`,
                      backgroundColor: domain.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 难度分布 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Icon type="chart" size={20} /> 难度分布分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {difficultyStats.map((stat) => (
                <div key={stat.difficulty}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          stat.difficulty === '简单'
                            ? 'success'
                            : stat.difficulty === '中等'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {stat.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {stat.completed} / {stat.total}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stat.completionRate.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stat.difficulty === '简单'
                          ? 'bg-green-500'
                          : stat.difficulty === '中等'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 案件管理统计 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Icon type="case" size={20} /> 案件管理统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 按状态 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">按状态分布</h4>
                <div className="space-y-2">
                  {Object.entries(managementStats.byStatus).map(([status, count]) => {
                    const total = managementCases.length || 1;
                    const percentage = (count / total) * 100;
                    const statusMap = {
                      pending: { label: '待处理', color: 'bg-yellow-500' },
                      investigating: { label: '调查中', color: 'bg-blue-500' },
                      resolved: { label: '已结案', color: 'bg-green-500' },
                      closed: { label: '已归档', color: 'bg-gray-500' }
                    };
                    const info = statusMap[status as keyof typeof statusMap];

                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-600">{info.label}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${info.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-gray-900 text-right">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 按优先级 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">按优先级分布</h4>
                <div className="space-y-2">
                  {Object.entries(managementStats.byPriority).map(([priority, count]) => {
                    const total = managementCases.length || 1;
                    const percentage = (count / total) * 100;
                    const priorityMap = {
                      urgent: { label: '紧急', color: 'bg-red-600' },
                      high: { label: '高', color: 'bg-orange-500' },
                      medium: { label: '中', color: 'bg-blue-500' },
                      low: { label: '低', color: 'bg-gray-400' }
                    };
                    const info = priorityMap[priority as keyof typeof priorityMap];

                    return (
                      <div key={priority} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-600">{info.label}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${info.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-gray-900 text-right">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 热门法律TOP10 */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Icon type="law" size={20} /> 热门法律TOP10
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularLaws.map((item, idx) => (
              <div key={item.law} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm line-clamp-1">{item.law}</div>
                  <div className="text-xs text-gray-500">引用 {item.count} 次</div>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="info" size="sm">
                    {item.count}案例
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 学习建议 */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              <Icon type="info" size={48} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">💡 数据洞察与建议</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>学习进度:</strong> 您已完成 {learningStats.completionRate.toFixed(1)}% 的案例学习,
                    {learningStats.completionRate < 30
                      ? '建议加强练习'
                      : learningStats.completionRate < 70
                      ? '保持学习节奏'
                      : '非常优秀,继续保持'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>重点领域:</strong>{' '}
                    {domainStats[0]?.name} 领域案例最多({domainStats[0]?.totalCases}个),建议优先学习
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>热门法律:</strong> 《{popularLaws[0]?.law}》 被引用 {popularLaws[0]?.count}{' '}
                    次,是执法实践中最常用的法律
                  </span>
                </li>
                {managementStats.byStatus.pending > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">•</span>
                    <span>
                      <strong>案件提醒:</strong> 您有 {managementStats.byStatus.pending}{' '}
                      个待处理案件,请及时跟进
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
