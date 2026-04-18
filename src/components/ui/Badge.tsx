import React from 'react';
import { clsx } from 'clsx';

type Color = 'green' | 'yellow' | 'red' | 'blue' | 'zinc' | 'purple' | 'orange';

interface BadgeProps {
  color?: Color;
  children: React.ReactNode;
  className?: string;
}

const colors: Record<Color, string> = {
  green: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  yellow: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  red: 'bg-red-900/60 text-red-300 border-red-700',
  blue: 'bg-blue-900/60 text-blue-300 border-blue-700',
  zinc: 'bg-zinc-800 text-zinc-400 border-zinc-600',
  purple: 'bg-purple-900/60 text-purple-300 border-purple-700',
  orange: 'bg-orange-900/60 text-orange-300 border-orange-700',
};

export function Badge({ color = 'zinc', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', colors[color], className)}>
      {children}
    </span>
  );
}
