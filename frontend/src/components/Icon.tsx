import React from 'react';

interface IconProps {
  type: string;
  className?: string;
  size?: number;
}

/**
 * Icon组件 - 统一的图标系统
 * 支持常用的市场监管相关图标
 */
export const Icon: React.FC<IconProps> = ({ type, className = '', size = 24 }) => {
  const icons: Record<string, string> = {
    // 基础图标
    search: '🔍',
    filter: '🔽',
    close: '✕',
    menu: '☰',
    back: '←',
    forward: '→',
    refresh: '↻',

    // 功能图标
    bookmark: '🔖',
    bookmarkFilled: '📌',
    share: '📤',
    download: '📥',
    upload: '📤',
    copy: '📋',
    edit: '✏️',
    delete: '🗑️',
    save: '💾',
    print: '🖨️',

    // 状态图标
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    pending: '⏳',

    // 业务图标
    law: '📕',
    case: '📂',
    domain: '🏛️',
    user: '👤',
    admin: '👑',
    department: '🏢',

    // 监管领域图标
    food: '🍎',
    equipment: '🏗️',
    business: '🏢',
    price: '💰',
    intellectual: '🔐',
    advertising: '📱',
    consumer: '🛡️',
    quality: '✅',
    standard: '📏',

    // 操作图标
    add: '➕',
    plus: '➕',
    subtract: '➖',
    settings: '⚙️',
    help: '❓',
    notification: '🔔',
    star: '⭐',
    starFilled: '⭐',
    archive: '📦',

    // 箭头图标
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→',

    // 文件类型
    pdf: '📄',
    excel: '📊',
    word: '📝',
    image: '🖼️',

    // 其他
    chart: '📈',
    calendar: '📅',
    clock: '🕐',
    location: '📍',
    phone: '📞',
    email: '✉️',
    link: '🔗'
  };

  const iconChar = icons[type] || '❓';

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={type}
    >
      {iconChar}
    </span>
  );
};

export default Icon;
