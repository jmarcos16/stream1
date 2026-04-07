export type Video = {
    id: number;
    title: string | null;
    script: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'draft';
    status_label: string;
    status_color: 'gray' | 'blue' | 'green' | 'red' | 'yellow';
    audio_path: string | null;
    audio_duration: number | null;
    video_path: string | undefined;
    raw_video_path: string | null;
    srt_path: string | null;
    subtitle_style: 'bottom' | 'center';
    encoder: 'cpu' | 'gpu';
    created_at: string;
    updated_at: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedResponse<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
};
