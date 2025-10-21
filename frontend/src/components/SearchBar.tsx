import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import type { SearchResult } from '@/types';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  results?: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

/**
 * SearchBar组件 - 智能搜索框
 * 支持实时搜索、结果预览、键盘导航
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索法律、案例、领域...',
  onSearch,
  results = [],
  onResultClick,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 处理搜索
  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    onSearch(value);
    setShowResults(value.length > 0);
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setShowResults(false);
    setQuery('');
  };

  // 点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获取结果图标
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'law':
        return '📕';
      case 'case':
        return '📂';
      case 'domain':
        return '🏛️';
      default:
        return '📄';
    }
  };

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Icon type="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
              onSearch('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon type="close" size={20} />
          </button>
        )}
      </div>

      {/* 搜索结果下拉 */}
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2">
              找到 {results.length} 个结果
            </div>
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id || index}`}
                onClick={() => handleResultClick(result)}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">{getResultIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {highlightText(result.title || result.name || result.fullName || '', query)}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {highlightText(result.preview, query)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {result.type === 'law' && '法律法规'}
                        {result.type === 'case' && '案例'}
                        {result.type === 'domain' && '监管领域'}
                      </span>
                      {result.difficulty && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {result.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {showResults && query && results.length === 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 text-center"
        >
          <Icon type="search" className="text-gray-300" size={48} />
          <p className="text-gray-500 mt-2">未找到匹配的结果</p>
          <p className="text-sm text-gray-400 mt-1">试试其他关键词</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
