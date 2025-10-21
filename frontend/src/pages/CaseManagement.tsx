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
import { LAW_DOMAINS } from '@/data/lawDomains';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import type { CaseManagement as CaseManagementType, SearchResult } from '@/types';

/**
 * CaseManagement页面 - 案件管理系统
 * 案件登记、跟踪、审批、归档全流程管理
 */
export default function CaseManagement() {
  const [cases, setCases] = useLocalStorage<CaseManagementType[]>(
    STORAGE_KEYS.CASE_MANAGEMENT,
    []
  );
  const [selectedCase, setSelectedCase] = useState<CaseManagementType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<CaseManagementType['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<CaseManagementType['priority'] | 'all'>(
    'all'
  );
  const [formData, setFormData] = useState<Partial<CaseManagementType>>({
    caseNumber: `CASE-${Date.now()}`,
    title: '',
    domain: 1,
    status: 'pending',
    priority: 'medium',
    assignee: '待分配',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: '',
    attachments: [],
    relatedLaws: [],
    notes: ''
  });

  // 过滤案件
  const filteredCases = useMemo(() => {
    let result = cases;

    if (filterStatus !== 'all') {
      result = result.filter((c) => c.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      result = result.filter((c) => c.priority === filterPriority);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.caseNumber.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.assignee.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [cases, filterStatus, filterPriority, searchQuery]);

  // 统计数据
  const stats = useMemo(() => {
    return {
      pending: cases.filter((c) => c.status === 'pending').length,
      investigating: cases.filter((c) => c.status === 'investigating').length,
      resolved: cases.filter((c) => c.status === 'resolved').length,
      closed: cases.filter((c) => c.status === 'closed').length
    };
  }, [cases]);

  // 搜索结果
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery) return [];

    return filteredCases.slice(0, 5).map((c) => ({
      type: 'case',
      id: c.id,
      title: c.title,
      preview: `${c.caseNumber} - ${c.description.substring(0, 50)}...`
    }));
  }, [searchQuery, filteredCases]);

  // 创建新案件
  const handleCreateCase = () => {
    if (!formData.title || !formData.description) {
      alert('请填写案件标题和描述');
      return;
    }

    const newCase: CaseManagementType = {
      id: `case-${Date.now()}`,
      caseNumber: formData.caseNumber || `CASE-${Date.now()}`,
      title: formData.title,
      domain: formData.domain || 1,
      status: formData.status || 'pending',
      priority: formData.priority || 'medium',
      assignee: formData.assignee || '待分配',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: formData.description,
      attachments: formData.attachments || [],
      relatedLaws: formData.relatedLaws || [],
      notes: formData.notes || '',
      deadline: formData.deadline
    };

    setCases([...cases, newCase]);
    setIsCreating(false);
    resetForm();
  };

  // 更新案件
  const handleUpdateCase = () => {
    if (!selectedCase) return;

    const updatedCases = cases.map((c) =>
      c.id === selectedCase.id
        ? { ...selectedCase, updatedAt: new Date().toISOString() }
        : c
    );

    setCases(updatedCases);
    setSelectedCase(null);
  };

  // 删除案件
  const handleDeleteCase = (id: string) => {
    if (confirm('确定要删除此案件吗?')) {
      setCases(cases.filter((c) => c.id !== id));
      setSelectedCase(null);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      caseNumber: `CASE-${Date.now()}`,
      title: '',
      domain: 1,
      status: 'pending',
      priority: 'medium',
      assignee: '待分配',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: '',
      attachments: [],
      relatedLaws: [],
      notes: ''
    });
  };

  // 状态标签
  const getStatusBadge = (status: CaseManagementType['status']) => {
    const statusMap = {
      pending: { variant: 'warning' as const, label: '待处理' },
      investigating: { variant: 'info' as const, label: '调查中' },
      resolved: { variant: 'success' as const, label: '已结案' },
      closed: { variant: 'default' as const, label: '已归档' }
    };
    return statusMap[status];
  };

  // 优先级标签
  const getPriorityBadge = (priority: CaseManagementType['priority']) => {
    const priorityMap = {
      low: { variant: 'default' as const, label: '低' },
      medium: { variant: 'info' as const, label: '中' },
      high: { variant: 'warning' as const, label: '高' },
      urgent: { variant: 'danger' as const, label: '紧急' }
    };
    return priorityMap[priority];
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📁 案件管理系统</h1>
            <p className="text-indigo-100">案件登记 · 流程跟踪 · 协同办理 · 归档管理</p>
          </div>
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            <Icon type="plus" size={18} /> 新建案件
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white cursor-pointer"
          hoverable
          onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-100 text-sm mb-1">待处理</div>
              <div className="text-4xl font-bold">{stats.pending}</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="warning" size={60} />
            </div>
          </div>
        </Card>

        <Card
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer"
          hoverable
          onClick={() => setFilterStatus(filterStatus === 'investigating' ? 'all' : 'investigating')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-100 text-sm mb-1">调查中</div>
              <div className="text-4xl font-bold">{stats.investigating}</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="search" size={60} />
            </div>
          </div>
        </Card>

        <Card
          className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer"
          hoverable
          onClick={() => setFilterStatus(filterStatus === 'resolved' ? 'all' : 'resolved')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-100 text-sm mb-1">已结案</div>
              <div className="text-4xl font-bold">{stats.resolved}</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="success" size={60} />
            </div>
          </div>
        </Card>

        <Card
          className="bg-gradient-to-br from-gray-500 to-gray-600 text-white cursor-pointer"
          hoverable
          onClick={() => setFilterStatus(filterStatus === 'closed' ? 'all' : 'closed')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-100 text-sm mb-1">已归档</div>
              <div className="text-4xl font-bold">{stats.closed}</div>
            </div>
            <div className="text-5xl opacity-50">
              <Icon type="archive" size={60} />
            </div>
          </div>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <SearchBar
              placeholder="搜索案件编号、标题、描述、经办人..."
              onSearch={setSearchQuery}
              results={searchResults}
              onResultClick={(result) => {
                const caseItem = cases.find((c) => c.id === result.id);
                if (caseItem) setSelectedCase(caseItem);
              }}
            />

            {/* 过滤器 */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">状态:</span>
                <div className="flex gap-2">
                  {['all', 'pending', 'investigating', 'resolved', 'closed'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status as typeof filterStatus)}
                    >
                      {status === 'all'
                        ? '全部'
                        : status === 'pending'
                        ? '待处理'
                        : status === 'investigating'
                        ? '调查中'
                        : status === 'resolved'
                        ? '已结案'
                        : '已归档'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">优先级:</span>
                <div className="flex gap-2">
                  {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
                    <Button
                      key={priority}
                      variant={filterPriority === priority ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPriority(priority as typeof filterPriority)}
                    >
                      {priority === 'all'
                        ? '全部'
                        : priority === 'urgent'
                        ? '紧急'
                        : priority === 'high'
                        ? '高'
                        : priority === 'medium'
                        ? '中'
                        : '低'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="ml-auto text-sm text-gray-600">
                显示 <strong>{filteredCases.length}</strong> 个案件
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 案件列表 */}
      {filteredCases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-lg">暂无案件</p>
            <p className="text-sm mt-2">点击"新建案件"创建第一个案件</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((caseItem) => {
            const domain = LAW_DOMAINS.find((d) => d.id === caseItem.domain);
            const statusBadge = getStatusBadge(caseItem.status);
            const priorityBadge = getPriorityBadge(caseItem.priority);

            return (
              <Card key={caseItem.id} hoverable onClick={() => setSelectedCase(caseItem)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{domain?.icon || '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                            <Badge variant={statusBadge.variant} size="sm">
                              {statusBadge.label}
                            </Badge>
                            <Badge variant={priorityBadge.variant} size="sm">
                              {priorityBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{caseItem.caseNumber}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {caseItem.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>领域: {domain?.name}</span>
                        <span>经办人: {caseItem.assignee}</span>
                        <span>创建: {formatDate(caseItem.createdAt)}</span>
                        <span>更新: {formatDate(caseItem.updatedAt)}</span>
                        {caseItem.deadline && (
                          <span className="text-orange-600">
                            截止: {formatDate(caseItem.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 新建案件Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          resetForm();
        }}
        title="新建案件"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleCreateCase}>
              <Icon type="success" size={18} /> 创建案件
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                resetForm();
              }}
            >
              取消
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* 案件编号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              案件编号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 案件标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              案件标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="请输入案件标题"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 领域 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">监管领域</label>
            <select
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {LAW_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.icon} {domain.name}
                </option>
              ))}
            </select>
          </div>

          {/* 状态和优先级 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as CaseManagementType['status']
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="pending">待处理</option>
                <option value="investigating">调查中</option>
                <option value="resolved">已结案</option>
                <option value="closed">已归档</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as CaseManagementType['priority']
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
          </div>

          {/* 经办人 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">经办人</label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              placeholder="请输入经办人姓名"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 案件描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              案件描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请详细描述案件情况"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* 案件详情Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`案件详情 - ${selectedCase.caseNumber}`}
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleUpdateCase}>
                <Icon type="success" size={18} /> 保存修改
              </Button>
              <Button variant="danger" onClick={() => handleDeleteCase(selectedCase.id)}>
                <Icon type="delete" size={18} /> 删除案件
              </Button>
              <Button variant="outline" onClick={() => setSelectedCase(null)}>
                关闭
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">案件标题</label>
                <input
                  type="text"
                  value={selectedCase.title}
                  onChange={(e) => setSelectedCase({ ...selectedCase, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                  <select
                    value={selectedCase.status}
                    onChange={(e) =>
                      setSelectedCase({
                        ...selectedCase,
                        status: e.target.value as CaseManagementType['status']
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="pending">待处理</option>
                    <option value="investigating">调查中</option>
                    <option value="resolved">已结案</option>
                    <option value="closed">已归档</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                  <select
                    value={selectedCase.priority}
                    onChange={(e) =>
                      setSelectedCase({
                        ...selectedCase,
                        priority: e.target.value as CaseManagementType['priority']
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="urgent">紧急</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">经办人</label>
                <input
                  type="text"
                  value={selectedCase.assignee}
                  onChange={(e) => setSelectedCase({ ...selectedCase, assignee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* 案件描述 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Icon type="case" size={18} /> 案件描述
              </h4>
              <textarea
                value={selectedCase.description}
                onChange={(e) =>
                  setSelectedCase({ ...selectedCase, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* 备注 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Icon type="bookmark" size={18} /> 办案备注
              </h4>
              <textarea
                value={selectedCase.notes}
                onChange={(e) => setSelectedCase({ ...selectedCase, notes: e.target.value })}
                placeholder="记录办案过程、重要事项等..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* 时间信息 */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                <Icon type="clock" size={16} /> 时间信息
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">创建时间:</span>
                  <span className="ml-2 font-medium">{formatDate(selectedCase.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">更新时间:</span>
                  <span className="ml-2 font-medium">{formatDate(selectedCase.updatedAt)}</span>
                </div>
                {selectedCase.deadline && (
                  <div>
                    <span className="text-gray-600">截止时间:</span>
                    <span className="ml-2 font-medium text-orange-600">
                      {formatDate(selectedCase.deadline)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
