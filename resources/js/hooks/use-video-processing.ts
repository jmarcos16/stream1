import echo from '@/echo';
import { useEffect, useState } from 'react';

export const STEPS = ['audio', 'video', 'merge', 'subtitles'] as const;
export type Step = (typeof STEPS)[number];
export type Status = 'waiting' | 'processing' | 'completed' | 'failed';

export const STEP_LABELS: Record<Step, string> = {
    audio: 'Generating audio',
    video: 'Building video',
    merge: 'Merging audio & video',
    subtitles: 'Adding subtitles',
};

interface ProcessingState {
    currentStep: Step | null;
    steps: Record<Step, Status>;
    failed: boolean;
    completed: boolean;
    videoUrl: string | null;
}

export function useVideoProcessing(videoId: number | null) {
    const [state, setState] = useState<ProcessingState>({
        currentStep: null,
        steps: {
            audio: 'waiting',
            video: 'waiting',
            merge: 'waiting',
            subtitles: 'waiting',
        },
        failed: false,
        completed: false,
        videoUrl: null,
    });

    useEffect(() => {
        if (!videoId) return;

        setState({
            currentStep: 'audio',
            steps: {
                audio: 'waiting',
                video: 'waiting',
                merge: 'waiting',
                subtitles: 'waiting',
            },
            failed: false,
            completed: false,
            videoUrl: null,
        });

        const channel = echo.channel(`video.${videoId}`);

        channel.listen(
            'VideoProcessingUpdated',
            (e: { step: string; status: string; videoUrl?: string }) => {
                setState((prev) => {
                    const steps = { ...prev.steps };
                    const step = e.step as Step;

                    if (step in steps) {
                        steps[step] = e.status as Status;
                    }

                    const currentStep =
                        STEPS.find((s) => steps[s] !== 'completed') ?? null;
                    const failed = e.status === 'failed';
                    const completed =
                        !failed && STEPS.every((s) => steps[s] === 'completed');

                    return {
                        steps,
                        currentStep,
                        failed,
                        completed,
                        videoUrl: e.videoUrl ?? prev.videoUrl,
                    };
                });
            },
        );

        return () => {
            echo.leave(`video.${videoId}`);
        };
    }, [videoId]);

    return { ...state, STEP_LABELS, STEPS };
}
