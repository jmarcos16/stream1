export function DashboardFooter() {
    return (
        <footer className="mt-auto border-t border-slate-100 bg-white px-6 py-8 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-[13px] font-medium text-slate-500 md:flex-row">
                <div className="flex items-center gap-4">
                    <p>© 2024 VidGen AI Studio</p>
                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                    <p>Cloud Engine v2.4.0</p>
                </div>
                <div className="flex gap-8">
                    <a
                        className="transition-colors hover:text-indigo-500"
                        href="#"
                    >
                        Privacy
                    </a>
                    <a
                        className="transition-colors hover:text-indigo-500"
                        href="#"
                    >
                        Terms
                    </a>
                    <a
                        className="transition-colors hover:text-indigo-500"
                        href="#"
                    >
                        System Status
                    </a>
                    <a
                        className="font-bold transition-colors hover:text-indigo-500"
                        href="#"
                    >
                        Help Center
                    </a>
                </div>
            </div>
        </footer>
    );
}
