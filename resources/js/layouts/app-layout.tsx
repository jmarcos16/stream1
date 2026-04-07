import React from 'react';
import { Link } from '@inertiajs/react';
import { Film, Bell } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex h-screen w-screen flex-col bg-slate-950">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-900/40 px-8 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Film className="h-6 w-6 text-blue-500" />
                        <h1 className="text-xl font-bold text-white">ShortsGen</h1>
                    </Link>
                    <nav className="flex items-center gap-1">
                        <Link
                            href="/videos"
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
                        >
                            Videos
                        </Link>
                        <Link
                            href="/video-creator"
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
                        >
                            Create
                        </Link>
                    </nav>
                </div>

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
    );
}
