import { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Icon,
  Badge,
  Button,
  Modal,
  SearchBar
} from '@/components';
import { LAW_DETAILS } from '@/data/lawDetails';
import { LAW_DOMAINS } from '@/data/lawDomains';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import type { SearchResult } from '@/types';

/**
 * KnowledgeGraph页面 - 法律知识图谱
 * MECE结构化展示10大监管领域和100部法律法规
 */
export default function KnowledgeGraph() {
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'domain' | 'list'>('domain');
  const [userProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, {
    completedCases: [] as number[],
    bookmarks: [] as string[],
    score: 0
  });

  // 获取选中领域的法律列表
  const domainLaws = useMemo(() => {
    if (selectedDomain === null) return [];
    const domain = LAW_DOMAINS.find((d) => d.id === selectedDomain);
    return domain?.laws || [];
  }, [selectedDomain]);

  // 过滤法律列表
  const filteredLaws = useMemo(() => {
    let laws = Object.entries(LAW_DETAILS);

    // 按领域过滤
    if (selectedDomain !== null) {
      const domain = LAW_DOMAINS.find((d) => d.id === selectedDomain);
      if (domain) {
        laws = laws.filter(([name]) => domain.laws.includes(name));
      }
    }

    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      laws = laws.filter(
        ([name, detail]) =>
          name.toLowerCase().includes(query) ||
          detail.fullName.toLowerCase().includes(query) ||
          detail.summary.toLowerCase().includes(query)
      );
    }

    return laws;
  }, [selectedDomain, searchQuery]);

  // 搜索结果
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery) return [];

    return filteredLaws.slice(0, 10).map(([name, detail]) => ({
      type: 'law',
      name: name,
      fullName: detail.fullName,
      preview: detail.summary
    }));
  }, [searchQuery, filteredLaws]);

  // 选中法律
  const handleSelectLaw = (lawName: string) => {
    setSelectedLaw(lawName);
  };

  // 关闭法律详情
  const handleCloseLaw = () => {
    setSelectedLaw(null);
  };

  // 统计数据
  const stats = useMemo(() => {
    const totalLaws = Object.keys(LAW_DETAILS).length;
    const totalDomains = LAW_DOMAINS.length;
    const bookmarkedLaws = userProgress.bookmarks.filter((b) => b.startsWith('law_')).length;

    return { totalLaws, totalDomains, bookmarkedLaws };
  }, [userProgress.bookmarks]);

  // 获取法律详情
  const selectedLawDetail = selectedLaw ? LAW_DETAILS[selectedLaw] : null;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📕 法律知识图谱</h1>
            <p className="text-green-100">MECE结构化展示 · {stats.totalDomains}大领域 · {stats.totalLaws}部法律</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.bookmarkedLaws}</div>
              <div className="text-sm text-green-100">已收藏法律</div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和视图切换 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <SearchBar
              placeholder="搜索法律名称、法律摘要..."
              onSearch={setSearchQuery}
              results={searchResults}
              onResultClick={(result) => {
                if (result.name) handleSelectLaw(result.name);
              }}
            />

            {/* 视图切换和过滤 */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* 视图模式 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">视图:</span>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'domain' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('domain')}
                  >
                    <Icon type="domain" size={16} /> 领域视图
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <Icon type="law" size={16} /> 列表视图
                  </Button>
                </div>
              </div>

              {/* 当前过滤 */}
              <div className="text-sm text-gray-600">
                显示 <strong>{filteredLaws.length}</strong> 部法律
                {selectedDomain && ` · ${LAW_DOMAINS.find((d) => d.id === selectedDomain)?.name}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 领域视图 */}
      {viewMode === 'domain' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {LAW_DOMAINS.map((domain) => (
            <Card
              key={domain.id}
              hoverable
              onClick={() => setSelectedDomain(domain.id)}
              className={`relative ${
                selectedDomain === domain.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ borderLeftWidth: '4px', borderLeftColor: domain.color }}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3">{domain.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{domain.name}</h3>
                <div className="text-sm text-gray-600 mb-3">{domain.keyPoints}</div>
                <div className="flex justify-center gap-2">
                  <Badge variant="info" size="sm">
                    {domain.laws.length}部法律
                  </Badge>
                  <Badge variant="success" size="sm">
                    {domain.cases}案例
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 选中领域的法律列表 */}
      {viewMode === 'domain' && selectedDomain !== null && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {LAW_DOMAINS.find((d) => d.id === selectedDomain)?.icon}{' '}
                {LAW_DOMAINS.find((d) => d.id === selectedDomain)?.name}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDomain(null)}>
                <Icon type="close" size={16} /> 清除选择
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {domainLaws.map((lawName) => {
                const lawDetail = LAW_DETAILS[lawName];
                if (!lawDetail) return null;

                return (
                  <button
                    key={lawName}
                    onClick={() => handleSelectLaw(lawName)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl">{lawDetail.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {lawName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{lawDetail.fullName}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{lawDetail.summary}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>{lawDetail.effectiveDate}</span>
                      {lawDetail.relatedCases && (
                        <Badge variant="default" size="sm">
                          {lawDetail.relatedCases.length}案例
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 列表视图 */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredLaws.map(([lawName, lawDetail]) => (
            <Card key={lawName} hoverable onClick={() => handleSelectLaw(lawName)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{lawDetail.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{lawName}</h3>
                        <p className="text-sm text-gray-600">{lawDetail.fullName}</p>
                      </div>
                      {lawDetail.relatedCases && (
                        <Badge variant="info" size="sm">
                          {lawDetail.relatedCases.length}案例
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">{lawDetail.summary}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>发布: {lawDetail.issuer}</span>
                      <span>生效: {lawDetail.effectiveDate}</span>
                      {lawDetail.lastRevision && <span>修订: {lawDetail.lastRevision}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 法律详情Modal */}
      {selectedLawDetail && selectedLaw && (
        <Modal
          isOpen={!!selectedLawDetail}
          onClose={handleCloseLaw}
          title={selectedLaw}
          size="xl"
          footer={
            <Button variant="outline" onClick={handleCloseLaw}>
              关闭
            </Button>
          }
        >
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">完整名称:</span>
                  <span className="ml-2 font-medium">{selectedLawDetail.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-600">发布机构:</span>
                  <span className="ml-2 font-medium">{selectedLawDetail.issuer}</span>
                </div>
                <div>
                  <span className="text-gray-600">生效日期:</span>
                  <span className="ml-2 font-medium">{selectedLawDetail.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">最后修订:</span>
                  <span className="ml-2 font-medium">{selectedLawDetail.lastRevision}</span>
                </div>
              </div>
            </div>

            {/* 法律摘要 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Icon type="info" size={20} /> 法律摘要
              </h3>
              <p className="text-gray-700">{selectedLawDetail.summary}</p>
            </div>

            {/* 核心条款 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon type="bookmark" size={20} /> 核心条款 ({selectedLawDetail.keyProvisions.length}条)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedLawDetail.keyProvisions.map((provision, idx) => (
                  <div key={idx} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm text-gray-800">{provision}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 处罚规定 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Icon type="warning" size={20} /> 处罚规定
              </h3>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">{selectedLawDetail.penalties}</p>
              </div>
            </div>

            {/* 实操要点 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon type="success" size={20} /> 实操要点 ({selectedLawDetail.practicalPoints.length}条)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedLawDetail.practicalPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <p className="text-sm text-gray-700 flex-1">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 相关案例 */}
            {selectedLawDetail.relatedCases && selectedLawDetail.relatedCases.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon type="case" size={20} /> 相关案例 ({selectedLawDetail.relatedCases.length}个)
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedLawDetail.relatedCases.map((caseText, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-3">
                      <p className="text-sm text-gray-800">{caseText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
