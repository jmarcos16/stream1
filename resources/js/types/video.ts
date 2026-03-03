export type Video = {
    id: number;
    title: string | null;
    script: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    status_label: string;
    audio_path: string | null;
    audio_duration: number | null;
    video_path: string | null;
    raw_video_path: string | null;
    srt_path: string | null;
    created_at: string;
    updated_at: string;
}
