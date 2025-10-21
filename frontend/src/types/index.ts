// 法律详情类型
export interface LawDetail {
  fullName: string;
  icon: string;
  issuer: string;
  effectiveDate: string;
  lastRevision: string;
  summary: string;
  keyProvisions: string[];
  penalties: string;
  practicalPoints: string[];
  relatedCases?: string[]; // 可选字段,部分法律可能没有相关案例
}

// 法律领域类型
export interface LawDomain {
  id: number;
  name: string;
  color: string;
  icon: string;
  laws: string[];
  keyPoints: string;
  cases: number;
}

// 案例类型
export interface Case {
  id: number;
  title: string;
  domain: number;
  difficulty: '简单' | '中等' | '困难';
  facts: string;
  keywords: string[];
  laws: string[];
  penalty: string;
  reasoning: string;
}

// 搜索结果类型
export interface SearchResult {
  type: 'law' | 'case' | 'domain';
  id?: number | string;
  name?: string;
  title?: string;
  fullName?: string;
  icon?: string;
  color?: string;
  preview: string;
  difficulty?: string;
}

// 用户进度类型
export interface UserProgress {
  userId: string;
  completedCases: number[];
  bookmarkedLaws: string[];
  notes: Record<string, string>;
  score: number;
  lastActive: string;
}

// 案件管理类型
export interface CaseManagement {
  id: string;
  caseNumber: string;
  title: string;
  domain: number;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  description: string;
  attachments: string[];
  relatedLaws: string[];
  notes: string;
}

// Tab类型
export type TabType = 'dashboard' | 'analysis' | 'knowledge' | 'simulator' | 'calculator' | 'caseManagement' | 'analytics';
