import type { ReactNode } from 'react';

export type AppLayoutProps = {
    children: ReactNode;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};

export type AppShellProps = {
    children: ReactNode;
    variant?: 'default' | 'sidebar';
    className?: string;
};

export type AppContentProps = {
    children: ReactNode;
    variant?: 'default' | 'sidebar';
    className?: string;
};
