import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, truncateText, highlightKeyword } from '../format';

describe('format 工具函数', () => {
  describe('formatDate', () => {
    it('应正确格式化日期为 YYYY-MM-DD', () => {
      const date = new Date('2025-10-24T12:00:00');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-10-24');
    });

    it('应正确格式化日期时间', () => {
      const date = new Date('2025-10-24T08:30:45');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-10-24 08:30:45');
    });

    it('应正确处理字符串日期', () => {
      expect(formatDate('2025-10-24', 'YYYY-MM-DD')).toBe('2025-10-24');
    });

    it('应正确添加前导零', () => {
      const date = new Date('2025-01-05T03:05:08');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-01-05 03:05:08');
    });
  });

  describe('formatRelativeTime', () => {
    const now = new Date();

    it('60秒内应返回 "刚刚"', () => {
      const past = new Date(now.getTime() - 30 * 1000); // 30秒前
      expect(formatRelativeTime(past)).toBe('刚刚');
    });

    it('1小时内应返回分钟数', () => {
      const past = new Date(now.getTime() - 15 * 60 * 1000); // 15分钟前
      expect(formatRelativeTime(past)).toBe('15分钟前');
    });

    it('24小时内应返回小时数', () => {
      const past = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5小时前
      expect(formatRelativeTime(past)).toBe('5小时前');
    });

    it('30天内应返回天数', () => {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7天前
      expect(formatRelativeTime(past)).toBe('7天前');
    });

    it('1年内应返回月数', () => {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90天前
      expect(formatRelativeTime(past)).toBe('3个月前');
    });

    it('超过1年应返回年数', () => {
      const past = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000); // 400天前
      expect(formatRelativeTime(past)).toBe('1年前');
    });
  });

  describe('truncateText', () => {
    it('短文本应返回原文本', () => {
      expect(truncateText('短文本', 10)).toBe('短文本');
    });

    it('长文本应截断并添加后缀', () => {
      expect(truncateText('这是一段很长的文本内容', 5, '...')).toBe('这是...'); // 5 - 3 = 2 个字符
    });

    it('应支持自定义后缀', () => {
      expect(truncateText('Hello World', 8, '>>>')).toBe('Hello>>>');
    });

    it('空字符串应返回空字符串', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('文本长度等于 maxLength 应返回原文本', () => {
      expect(truncateText('12345', 5)).toBe('12345');
    });
  });

  describe('highlightKeyword', () => {
    it('应正确高亮关键词', () => {
      const result = highlightKeyword('食品安全法', '食品');
      expect(result).toBe('<mark class="bg-yellow-200">食品</mark>安全法');
    });

    it('应支持大小写不敏感', () => {
      const result = highlightKeyword('Food Safety Law', 'food');
      expect(result).toContain('<mark class="bg-yellow-200">Food</mark>');
    });

    it('空关键词应返回原文本', () => {
      expect(highlightKeyword('测试文本', '')).toBe('测试文本');
    });

    it('应高亮所有匹配项', () => {
      const result = highlightKeyword('食品安全与食品监管', '食品');
      const matches = result.match(/<mark/g);
      expect(matches).toHaveLength(2);
    });

    it('关键词不存在应返回原文本', () => {
      expect(highlightKeyword('测试文本', '不存在')).toBe('测试文本');
    });
  });
});
