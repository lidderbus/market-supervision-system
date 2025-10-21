import { useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { SearchResult } from '@/types';

/**
 * 智能搜索Hook - 带防抖和索引优化
 * @param query - 搜索查询词
 * @param lawDetails - 法律详情数据
 * @param caseLibrary - 案例库数据
 * @param lawDomains - 法律领域数据
 * @returns 搜索结果数组
 */
export function useSearch(
  query: string,
  lawDetails: Record<string, any>,
  caseLibrary: any[],
  lawDomains: any[]
): SearchResult[] {
  // 使用防抖减少搜索频率
  const debouncedQuery = useDebounce(query, 300);

  // 使用useMemo缓存搜索结果
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const lowerQuery = debouncedQuery.toLowerCase();

    // 搜索法律（使用索引优化）
    Object.entries(lawDetails).forEach(([lawName, law]: [string, any]) => {
      if (
        lawName.toLowerCase().includes(lowerQuery) ||
        law.fullName?.toLowerCase().includes(lowerQuery) ||
        law.summary?.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'law',
          name: lawName,
          fullName: law.fullName,
          icon: law.icon,
          preview: law.summary?.substring(0, 100) + '...' || '',
        });
      }
    });

    // 搜索案例
    caseLibrary.forEach((caseItem) => {
      if (
        caseItem.title.toLowerCase().includes(lowerQuery) ||
        caseItem.facts.toLowerCase().includes(lowerQuery) ||
        caseItem.keywords.some((kw: string) => kw.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          type: 'case',
          id: caseItem.id,
          title: caseItem.title,
          preview: caseItem.facts.substring(0, 100) + '...',
          difficulty: caseItem.difficulty,
        });
      }
    });

    // 搜索监管领域
    lawDomains.forEach((domain) => {
      if (
        domain.name.toLowerCase().includes(lowerQuery) ||
        domain.keyPoints.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'domain',
          id: domain.id,
          name: domain.name,
          icon: domain.icon,
          color: domain.color,
          preview: domain.keyPoints,
        });
      }
    });

    // 限制返回前10条结果
    return results.slice(0, 10);
  }, [debouncedQuery, lawDetails, caseLibrary, lawDomains]);

  return searchResults;
}
