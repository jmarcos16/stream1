export function DashboardFooter() {
    return (
        <footer className="px-6 lg:px-20 py-8 border-t border-slate-100 bg-white mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-slate-500 font-medium">
                <div className="flex items-center gap-4">
                    <p>© 2024 VidGen AI Studio</p>
                    <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                    <p>Cloud Engine v2.4.0</p>
                </div>
                <div className="flex gap-8">
                    <a className="hover:text-indigo-500 transition-colors" href="#">Privacy</a>
                    <a className="hover:text-indigo-500 transition-colors" href="#">Terms</a>
                    <a className="hover:text-indigo-500 transition-colors" href="#">System Status</a>
                    <a className="hover:text-indigo-500 transition-colors font-bold" href="#">Help Center</a>
                </div>
            </div>
        </footer>
    );
}
