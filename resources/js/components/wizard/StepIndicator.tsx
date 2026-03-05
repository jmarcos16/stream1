type Props = {
    currentStep: number;
};

export function StepIndicator({ currentStep }: Props) {
    return (
        <nav className="mb-8 flex hide-scrollbar gap-8 overflow-x-auto border-b border-slate-200">
            <div
                className={`flex items-center gap-2 border-b-2 pb-4 text-sm whitespace-nowrap ${currentStep === 1 ? 'border-indigo-500 font-bold text-indigo-500' : 'border-transparent font-medium text-slate-500'}`}
            >
                <span
                    className={`flex size-6 items-center justify-center rounded-full text-[10px] ${currentStep === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                    1
                </span>
                Media Assets
            </div>
            <div
                className={`flex items-center gap-2 border-b-2 pb-4 text-sm whitespace-nowrap ${currentStep === 2 ? 'border-indigo-500 font-bold text-indigo-500' : 'border-transparent font-medium text-slate-500'}`}
            >
                <span
                    className={`flex size-6 items-center justify-center rounded-full text-[10px] ${currentStep === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                    2
                </span>
                Video Script
            </div>
            <div
                className={`flex items-center gap-2 border-b-2 pb-4 text-sm whitespace-nowrap ${currentStep === 3 ? 'border-indigo-500 font-bold text-indigo-500' : 'border-transparent font-medium text-slate-500'}`}
            >
                <span
                    className={`flex size-6 items-center justify-center rounded-full text-[10px] ${currentStep === 3 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                    3
                </span>
                Generation Settings
            </div>
        </nav>
    );
}
