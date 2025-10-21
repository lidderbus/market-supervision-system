/**
 * 本地存储工具类
 */
export class Storage {
  /**
   * 设置存储项
   */
  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }

  /**
   * 获取存储项
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : (defaultValue ?? null);
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * 删除存储项
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  /**
   * 清空所有存储
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress',
  BOOKMARKED_LAWS: 'bookmarked_laws',
  CASE_NOTES: 'case_notes',
  COMPLETED_CASES: 'completed_cases',
  USER_SCORE: 'user_score',
  THEME_PREFERENCE: 'theme_preference',
  LAST_ACTIVE_TAB: 'last_active_tab',
  CASE_MANAGEMENT: 'case_management',
} as const;
