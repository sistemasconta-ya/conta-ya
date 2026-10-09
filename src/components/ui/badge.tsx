import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'info'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variantStyles = {
        default: 'bg-slate-100 text-slate-800 border-slate-200',
        success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        warning: 'bg-amber-50 text-amber-800 border-amber-200',
        destructive: 'bg-rose-50 text-rose-800 border-rose-200',
        outline: 'border-slate-300 text-slate-700 bg-transparent',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                variantStyles[variant],
                className
            )}
            {...props}
        />
    )
}
