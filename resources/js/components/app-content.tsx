import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AppContentProps } from '@/types/ui';

export function AppContent({
    children,
    variant = 'default',
    className,
}: AppContentProps) {
    return (
        <div
            className={cn(
                'flex flex-1 flex-col',
                variant === 'sidebar' && 'flex-1',
                className,
            )}
        >
            {children}
        </div>
    );
}
