import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-icms-academic-blue',
  trend,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-5 border border-icms-border shadow-sm hover:shadow-md transition-all',
        onClick && 'cursor-pointer hover:border-icms-academic-blue/40',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-bold text-icms-navy font-heading">{value}</div>
        </div>
        <div className={cn('p-3 rounded-xl border border-black/5 shrink-0', iconBg, iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold text-[11px]',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

