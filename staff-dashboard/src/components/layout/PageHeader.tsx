import React from 'react';
import { cn } from '../../lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200',
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2 self-start sm:self-auto">{action}</div>}
    </div>
  );
}
