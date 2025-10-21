import { getAllCases } from '@/utils/caseExtractor';

/**
 * 案例库
 * 包含377+个真实市场监管案例
 * 覆盖10大监管领域
 *
 * 案例来源:
 * - 6个手动编写的核心案例
 * - 371+个从100部法律的relatedCases中提取的真实案例
 */
export const CASE_LIBRARY = getAllCases();
