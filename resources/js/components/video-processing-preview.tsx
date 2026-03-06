import { useVideoProcessing } from '@/hooks/use-video-processing';

const STEP_ICONS: Record<string, string> = {
    audio: 'graphic_eq',
    video: 'movie',
    merge: 'merge',
    subtitles: 'closed_caption',
};

function StepIndicator({ status, icon }: { status: string; icon: string }) {
    const base =
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500';

    if (status === 'completed') {
        return (
            <div
                className={`${base} bg-emerald-500/15 ring-1 ring-emerald-500/30`}
            >
                <span className="material-symbols-outlined text-xl text-emerald-400">
                    check
                </span>
            </div>
        );
    }

    if (status === 'processing') {
        return (
            <div
                className={`${base} animate-pulse bg-[#5555f6]/15 ring-1 ring-[#5555f6]/40`}
            >
                <span className="material-symbols-outlined text-xl text-[#5555f6]">
                    {icon}
                </span>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className={`${base} bg-red-500/15 ring-1 ring-red-500/30`}>
                <span className="material-symbols-outlined text-xl text-red-400">
                    close
                </span>
            </div>
        );
    }

    return (
        <div className={`${base} bg-slate-800/60 ring-1 ring-slate-700/40`}>
            <span className="material-symbols-outlined text-xl text-slate-600">
                {icon}
            </span>
        </div>
    );
}

function Connector({ done }: { done: boolean }) {
    return (
        <div className="flex justify-center py-1">
            <div
                className={`h-5 w-0.5 rounded-full transition-colors duration-500 ${done ? 'bg-emerald-500/40' : 'bg-slate-700/40'}`}
            />
        </div>
    );
}

export default function VideoProcessingPreview({
    videoId,
}: {
    videoId: number | null;
}) {
    const { steps, STEPS, STEP_LABELS, failed, completed, videoUrl } =
        useVideoProcessing(videoId);

    if (!videoId) {
        return (
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/40">
                    <span className="material-symbols-outlined text-3xl text-slate-600">
                        play_circle
                    </span>
                </div>
                <div>
                    <p className="text-sm text-slate-500">
                        Preview will appear here
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                        Generate a video to get started
                    </p>
                </div>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="absolute inset-0 flex flex-col">
                <div className="min-h-0 flex-1">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            controls
                            className="h-full w-full bg-black object-contain"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-900">
                            <span className="material-symbols-outlined text-4xl text-slate-600">
                                movie
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center gap-2 bg-emerald-500/10 py-3">
                    <span className="material-symbols-outlined text-lg text-emerald-400">
                        check_circle
                    </span>
                    <p className="text-sm font-semibold text-emerald-400">
                        Video ready!
                    </p>
                </div>
            </div>
        );
    }

    const completedCount = STEPS.filter((s) => steps[s] === 'completed').length;
    const progress = Math.round((completedCount / STEPS.length) * 100);

    return (
        <div className="w-full px-5">
            <div className="mb-8 text-center">
                <div className="relative mx-auto mb-4 h-16 w-16">
                    <svg
                        className="h-full w-full -rotate-90"
                        viewBox="0 0 64 64"
                    >
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-slate-800"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            strokeWidth="3"
                            stroke="url(#progress-gradient)"
                            strokeLinecap="round"
                            strokeDasharray={`${progress * 1.76} 176`}
                            className="transition-all duration-700"
                        />
                        <defs>
                            <linearGradient
                                id="progress-gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="#5555f6" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-300">
                            {progress}%
                        </span>
                    </div>
                </div>
                <p className="text-sm font-semibold text-slate-200">
                    {failed ? 'Processing failed' : 'Creating your video'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    This may take a few minutes
                </p>
            </div>

            <div className="space-y-0">
                {STEPS.map((step, i) => {
                    const status = steps[step];
                    return (
                        <div key={step}>
                            <div className="flex items-center gap-3">
                                <StepIndicator
                                    status={status}
                                    icon={STEP_ICONS[step]}
                                />
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`text-sm font-medium transition-colors duration-300 ${
                                            status === 'processing'
                                                ? 'text-slate-100'
                                                : status === 'completed'
                                                  ? 'text-emerald-400'
                                                  : status === 'failed'
                                                    ? 'text-red-400'
                                                    : 'text-slate-500'
                                        }`}
                                    >
                                        {STEP_LABELS[step]}
                                    </p>
                                    <p className="text-[11px] text-slate-600">
                                        {status === 'processing'
                                            ? 'In progress...'
                                            : status === 'completed'
                                              ? 'Done'
                                              : status === 'failed'
                                                ? 'Error occurred'
                                                : 'Waiting'}
                                    </p>
                                </div>
                            </div>
                            {i < STEPS.length - 1 && (
                                <Connector
                                    done={steps[STEPS[i + 1]] !== 'waiting'}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
