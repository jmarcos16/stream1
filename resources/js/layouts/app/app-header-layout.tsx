import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps } from '@/types';
import { Fragment } from 'react/jsx-runtime';

export default function AppHeaderLayout({
    children,
}: AppLayoutProps) {
    return (
        <Fragment>
            <AppShell>
                <AppHeader />
                <AppContent>{children}</AppContent>
            </AppShell>
            <Toaster />
        </Fragment>
    );
}
