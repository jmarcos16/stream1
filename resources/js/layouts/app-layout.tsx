import React from 'react';
import { Film, FolderOpen, Images, Bell } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const navItems = [
        { label: 'Editor', href: '#', icon: Film },
        { label: 'Projects', href: '#', icon: FolderOpen },
        { label: 'Assets', href: '#', icon: Images },
    ];

    return (
        <div className="flex h-screen w-screen bg-slate-950">
            {/* Sidebar */}
            <aside className="h-screen w-64 shrink-0 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-xl">
                {/* Logo */}
                <div className="flex items-center gap-2 border-b border-slate-800/60 px-6 py-6">
                    <Film className="h-6 w-6 text-blue-500" />
                    <h1 className="text-xl font-bold text-white">ShortsGen</h1>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 px-4 py-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex h-screen flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-900/40 px-8 backdrop-blur-xl">
                    <div></div>
                    
                    {/* Right side: Notification button + User avatar */}
                    <div className="flex items-center gap-4">
                        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600"></div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
