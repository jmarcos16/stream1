import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AppShellProps } from '@/types/ui';

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
    return (
        <div
            className={cn(
                'flex flex-col min-h-screen bg-[#09090b] text-white antialiased',
                variant === 'sidebar' && 'flex-row',
                className,
            )}
            style={{
                backgroundImage: 'radial-gradient(#27272a 0.5px, transparent 0.5px)',
                backgroundSize: '24px 24px',
            }}
        >
            {children}
        </div>
    );
}
