import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage, STORAGE_KEYS } from '../storage';

describe('Storage 工具类', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('set', () => {
    it('应正确存储字符串值', () => {
      Storage.set('test_key', 'test_value');
      expect(localStorage.getItem('test_key')).toBe('"test_value"');
    });

    it('应正确序列化对象', () => {
      const obj = { name: 'test', count: 42 };
      Storage.set('test_obj', obj);

      const stored = localStorage.getItem('test_obj');
      expect(stored).toBe(JSON.stringify(obj));
    });

    it('应正确序列化数组', () => {
      const arr = [1, 2, 3];
      Storage.set('test_arr', arr);

      const stored = localStorage.getItem('test_arr');
      expect(stored).toBe(JSON.stringify(arr));
    });

    it('应正确处理 null', () => {
      Storage.set('test_null', null);
      expect(localStorage.getItem('test_null')).toBe('null');
    });

    it('应捕获 JSON.stringify 错误', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 创建循环引用对象
      const circular: any = { a: 1 };
      circular.self = circular;

      Storage.set('circular', circular);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('get', () => {
    it('应正确读取存储的值', () => {
      localStorage.setItem('test', JSON.stringify({ value: 123 }));

      const result = Storage.get('test');
      expect(result).toEqual({ value: 123 });
    });

    it('应正确读取字符串', () => {
      localStorage.setItem('test_str', JSON.stringify('hello'));

      const result = Storage.get<string>('test_str');
      expect(result).toBe('hello');
    });

    it('键不存在时应返回 defaultValue', () => {
      const result = Storage.get('non_existent', 'default');
      expect(result).toBe('default');
    });

    it('键不存在且无 defaultValue 应返回 null', () => {
      const result = Storage.get('non_existent');
      expect(result).toBeNull();
    });

    it('JSON 解析错误应返回 defaultValue', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('invalid', 'invalid json');

      const result = Storage.get('invalid', 'fallback');
      expect(result).toBe('fallback');

      consoleSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('应正确删除指定键', () => {
      localStorage.setItem('to_remove', '"value"');

      Storage.remove('to_remove');

      expect(localStorage.getItem('to_remove')).toBeNull();
    });

    it('删除不存在的键不应报错', () => {
      expect(() => Storage.remove('non_existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('应清空所有存储', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      Storage.clear();

      expect(localStorage.length).toBe(0);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('应包含所有预定义的键', () => {
      expect(STORAGE_KEYS).toHaveProperty('USER_PROGRESS');
      expect(STORAGE_KEYS).toHaveProperty('BOOKMARKED_LAWS');
      expect(STORAGE_KEYS).toHaveProperty('CASE_NOTES');
      expect(STORAGE_KEYS).toHaveProperty('COMPLETED_CASES');
      expect(STORAGE_KEYS).toHaveProperty('USER_SCORE');
      expect(STORAGE_KEYS).toHaveProperty('THEME_PREFERENCE');
      expect(STORAGE_KEYS).toHaveProperty('LAST_ACTIVE_TAB');
      expect(STORAGE_KEYS).toHaveProperty('CASE_MANAGEMENT');
    });

    it('STORAGE_KEYS 应是只读的', () => {
      expect(Object.isFrozen(STORAGE_KEYS)).toBe(false); // as const 不会冻结对象
      expect(STORAGE_KEYS.USER_PROGRESS).toBe('user_progress');
    });
  });
});
