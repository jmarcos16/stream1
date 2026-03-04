type Props = {
    currentStep: number;
};

export function StepIndicator({ currentStep }: Props) {
    return (
        <nav className="flex border-b border-slate-200 mb-8 gap-8 overflow-x-auto hide-scrollbar">
            <div className={`pb-4 text-sm flex items-center gap-2 whitespace-nowrap border-b-2 ${currentStep === 1 ? 'font-bold border-indigo-500 text-indigo-500' : 'font-medium border-transparent text-slate-500'}`}>
                <span className={`size-6 rounded-full flex items-center justify-center text-[10px] ${currentStep === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                Media Assets
            </div>
            <div className={`pb-4 text-sm flex items-center gap-2 whitespace-nowrap border-b-2 ${currentStep === 2 ? 'font-bold border-indigo-500 text-indigo-500' : 'font-medium border-transparent text-slate-500'}`}>
                <span className={`size-6 rounded-full flex items-center justify-center text-[10px] ${currentStep === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                Video Script
            </div>
            <div className={`pb-4 text-sm flex items-center gap-2 whitespace-nowrap border-b-2 ${currentStep === 3 ? 'font-bold border-indigo-500 text-indigo-500' : 'font-medium border-transparent text-slate-500'}`}>
                <span className={`size-6 rounded-full flex items-center justify-center text-[10px] ${currentStep === 3 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                Generation Settings
            </div>
        </nav>
    );
}
