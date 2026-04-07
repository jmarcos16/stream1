import echo from '@/echo';
import { useEffect, useState } from 'react';
import type { Video } from '@/types/video';

type StatusState = {
    status: Video['status'];
    status_label: Video['status_label'];
    status_color: Video['status_color'];
    video_path: Video['video_path'];
};

const STATUS_MAP: Record<string, StatusState> = {
    draft: {
        status: 'completed',
        status_label: 'Completed',
        status_color: 'green',
        video_path: undefined,
    },
    failed: {
        status: 'failed',
        status_label: 'Failed',
        status_color: 'red',
        video_path: undefined,
    },
};

export function useVideoStatus(video: Video): StatusState & { videoUrl: string | null } {
    const [state, setState] = useState<StatusState>({
        status: video.status,
        status_label: video.status_label,
        status_color: video.status_color,
        video_path: video.video_path,
    });

    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (video.status !== 'processing' && video.status !== 'pending') return;

        const channel = echo.channel(`video.${video.id}`);

        channel.listen(
            'VideoProcessingUpdated',
            (e: { step: string; status: string; videoUrl?: string }) => {
                if (e.step === 'draft' && e.status === 'completed') {
                    setState(STATUS_MAP.draft);
                    if (e.videoUrl) {
                        setVideoUrl(e.videoUrl);
                    }
                } else if (e.status === 'failed') {
                    setState(STATUS_MAP.failed);
                }
            },
        );

        return () => {
            echo.leave(`video.${video.id}`);
        };
    }, [video.id, video.status]);

    return { ...state, videoUrl };
}
