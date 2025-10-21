import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Badge组件 - 用于显示标签、难度等级等
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * 难度徽章 - 专门用于显示案例难度
 */
export const DifficultyBadge: React.FC<{ difficulty: '简单' | '中等' | '困难' }> = ({
  difficulty
}) => {
  const difficultyConfig = {
    简单: { variant: 'success' as const, icon: '●' },
    中等: { variant: 'warning' as const, icon: '●●' },
    困难: { variant: 'danger' as const, icon: '●●●' }
  };

  const config = difficultyConfig[difficulty];

  return (
    <Badge variant={config.variant} size="sm">
      {config.icon} {difficulty}
    </Badge>
  );
};

export default Badge;
