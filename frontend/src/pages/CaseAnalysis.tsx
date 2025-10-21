import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Icon,
  Badge,
  Button,
  Modal,
  SearchBar
} from '@/components';
import { CASE_LIBRARY } from '@/data/caseLibrary';
import { LAW_DOMAINS } from '@/data/lawDomains';
import { LAW_DETAILS } from '@/data/lawDetails';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import type { Case, SearchResult } from '@/types';

/**
 * CaseAnalysis页面 - 智能案例分析
 * 采用"四步法": 事实识别 → 法律检索 → 法律适用 → 决策制定
 */
export default function CaseAnalysis() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userProgress, setUserProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, {
    completedCases: [] as number[],
    bookmarks: [] as string[],
    score: 0
  });

  // 过滤案例
  const filteredCases = useMemo(() => {
    let cases = CASE_LIBRARY;

    // 按领域过滤
    if (selectedDomain !== null) {
      cases = cases.filter((c) => c.domain === selectedDomain);
    }

    // 按难度过滤
    if (selectedDifficulty) {
      cases = cases.filter((c) => c.difficulty === selectedDifficulty);
    }

    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cases = cases.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.facts.toLowerCase().includes(query) ||
          c.keywords.some((k) => k.toLowerCase().includes(query))
      );
    }

    return cases;
  }, [selectedDomain, selectedDifficulty, searchQuery]);

  // 搜索功能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 搜索结果
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery) return [];

    return filteredCases.slice(0, 10).map((c) => ({
      type: 'case',
      id: c.id,
      title: c.title,
      preview: c.facts.substring(0, 100) + '...',
      difficulty: c.difficulty
    }));
  }, [searchQuery, filteredCases]);

  // 选中案例
  const handleSelectCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setCurrentStep(0);
  };

  // 关闭案例详情
  const handleCloseCase = () => {
    setSelectedCase(null);
    setCurrentStep(0);
  };

  // 标记案例完成
  const handleCompleteCase = () => {
    if (selectedCase && !userProgress.completedCases.includes(selectedCase.id)) {
      setUserProgress({
        ...userProgress,
        completedCases: [...userProgress.completedCases, selectedCase.id],
        score: userProgress.score + (selectedCase.difficulty === '困难' ? 30 : selectedCase.difficulty === '中等' ? 20 : 10)
      });
    }
  };

  // 四步法步骤
  const analysisSteps = [
    {
      step: 1,
      title: '事实识别',
      icon: 'search',
      description: '识别案件关键事实和证据',
      color: 'blue'
    },
    {
      step: 2,
      title: '法律检索',
      icon: 'law',
      description: '查找适用的法律法规',
      color: 'green'
    },
    {
      step: 3,
      title: '法律适用',
      icon: 'bookmark',
      description: '分析法律条款与案件事实的对应关系',
      color: 'purple'
    },
    {
      step: 4,
      title: '决策制定',
      icon: 'success',
      description: '确定处罚措施和执法决定',
      color: 'orange'
    }
  ];

  // 统计数据
  const stats = useMemo(() => {
    const total = CASE_LIBRARY.length;
    const completed = userProgress.completedCases.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byDifficulty = {
      简单: CASE_LIBRARY.filter((c) => c.difficulty === '简单').length,
      中等: CASE_LIBRARY.filter((c) => c.difficulty === '中等').length,
      困难: CASE_LIBRARY.filter((c) => c.difficulty === '困难').length
    };

    return { total, completed, progress, byDifficulty };
  }, [userProgress.completedCases]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📂 智能案例分析</h1>
            <p className="text-blue-100">四步法系统化分析执法案例</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.completed}/{stats.total}</div>
              <div className="text-sm text-blue-100">已完成案例</div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <SearchBar
              placeholder="搜索案例标题、关键词、案情描述..."
              onSearch={handleSearch}
              results={searchResults}
              onResultClick={(result) => {
                const caseItem = CASE_LIBRARY.find((c) => c.id === result.id);
                if (caseItem) handleSelectCase(caseItem);
              }}
            />

            {/* 过滤器 */}
            <div className="flex flex-wrap gap-3">
              {/* 领域过滤 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">领域:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDomain === null ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDomain(null)}
                  >
                    全部
                  </Button>
                  {LAW_DOMAINS.slice(0, 5).map((domain) => (
                    <Button
                      key={domain.id}
                      variant={selectedDomain === domain.id ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDomain(domain.id)}
                    >
                      {domain.icon} {domain.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 难度过滤 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">难度:</span>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDifficulty === null ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                  >
                    全部
                  </Button>
                  {['简单', '中等', '困难'].map((diff) => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                    >
                      {diff} ({stats.byDifficulty[diff as keyof typeof stats.byDifficulty]})
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 当前过滤结果 */}
            <div className="text-sm text-gray-600">
              显示 <strong>{filteredCases.length}</strong> 个案例
              {selectedDomain && ` · ${LAW_DOMAINS.find((d) => d.id === selectedDomain)?.name}`}
              {selectedDifficulty && ` · ${selectedDifficulty}难度`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 案例列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((caseItem) => {
          const domain = LAW_DOMAINS.find((d) => d.id === caseItem.domain);
          const isCompleted = userProgress.completedCases.includes(caseItem.id);

          return (
            <Card
              key={caseItem.id}
              hoverable
              onClick={() => handleSelectCase(caseItem)}
              className="relative"
            >
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <Badge variant="success" size="sm">
                    <Icon type="success" size={14} /> 已完成
                  </Badge>
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
                    {caseItem.title}
                  </h3>
                  {domain && <span className="text-2xl ml-2">{domain.icon}</span>}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{caseItem.facts}</p>

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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 案例详情Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={handleCloseCase}
          title={selectedCase.title}
          size="xl"
          footer={
            <>
              <Button variant="outline" onClick={handleCloseCase}>
                关闭
              </Button>
              {!userProgress.completedCases.includes(selectedCase.id) && (
                <Button variant="primary" onClick={handleCompleteCase}>
                  <Icon type="success" size={18} /> 标记完成
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-6">
            {/* 案例基本信息 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  variant={
                    selectedCase.difficulty === '简单'
                      ? 'success'
                      : selectedCase.difficulty === '中等'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {selectedCase.difficulty}
                </Badge>
                {LAW_DOMAINS.find((d) => d.id === selectedCase.domain) && (
                  <span className="text-sm text-gray-600">
                    {LAW_DOMAINS.find((d) => d.id === selectedCase.domain)?.icon}{' '}
                    {LAW_DOMAINS.find((d) => d.id === selectedCase.domain)?.name}
                  </span>
                )}
                <div className="flex gap-1">
                  {selectedCase.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="default" size="sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* 四步法流程 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">📋 四步法分析流程</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {analysisSteps.map((step, idx) => (
                  <button
                    key={step.step}
                    onClick={() => setCurrentStep(idx)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      currentStep === idx
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      <Icon type={step.icon} size={32} />
                    </div>
                    <div className="text-xs font-semibold">{step.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 步骤内容 */}
            <div className="bg-gray-50 rounded-lg p-4">
              {currentStep === 0 && (
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                    <Icon type="search" size={20} /> 步骤1: 事实识别
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCase.facts}</p>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <Icon type="law" size={20} /> 步骤2: 法律检索
                  </h4>
                  <div className="space-y-2">
                    {selectedCase.laws.map((law, idx) => {
                      const lawName = law.split('第')[0];
                      const lawDetail = LAW_DETAILS[lawName];

                      return (
                        <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                          <div className="font-medium text-gray-900">{law}</div>
                          {lawDetail && (
                            <div className="text-sm text-gray-600 mt-1">{lawDetail.summary}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                    <Icon type="bookmark" size={20} /> 步骤3: 法律适用
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCase.reasoning}</p>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                    <Icon type="success" size={20} /> 步骤4: 决策制定
                  </h4>
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="font-medium text-orange-900 mb-1">处罚决定:</div>
                    <p className="text-orange-800">{selectedCase.penalty}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <Icon type="arrowLeft" size={18} /> 上一步
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={currentStep === 3}
              >
                下一步 <Icon type="arrowRight" size={18} />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
