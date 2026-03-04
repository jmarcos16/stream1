import { Search, Bell, Settings } from 'lucide-react';

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between border-b border-slate-200 px-6 lg:px-20 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                    <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                        <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                </div>
                <h1 className="text-slate-900 text-xl font-bold tracking-tight">VidGen AI</h1>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
                <div className="hidden md:flex relative w-full max-w-xs" data-purpose="search-container">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                    <input className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" placeholder="Search projects..." type="text"/>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg transition-colors">
                        <Bell className="size-5" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg transition-colors">
                        <Settings className="size-5" />
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>
                    <div className="flex items-center gap-3 pl-1">
                        <div className="size-9 rounded-full bg-slate-200 bg-cover bg-center border border-slate-200 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6CqxTSivMbY4BkGrE6c3ZPQ68KTzd0FldIFfoFnLkfsgsrdALlFH_2LsGtwzOl3qhuLamHuKYOO8voQ-QFgQxOcZ1dEg6nNTc61CvRizC-p4pWujKvZD0p0ZMifw_vZ7wG7sZrioX_Zu4n1SONkuvL2QC1iVA2KL2qhCLLbS32fI660-1H0VX_Zmn-vnmJ1ZcUK1MDP_iG3xsc2dFujFZ1YYUaqr5ZNxuvTf4tTOqPO24y-KSXmHB5DOO4XX1ssJUTPJNu1jSUSs")' }}></div>
                    </div>
                </div>
            </div>
        </header>
    );
}
