import { router } from '@inertiajs/react';
import { Download, FileText, Film, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import VideoStatusBadge from '@/components/video-status-badge';
import { useVideoStatus } from '@/hooks/use-video-status';
import type { Video } from '@/types/video';

type VideoListItemProps = {
    video: Video;
};

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
}

export default function VideoListItem({ video }: VideoListItemProps) {
    const liveStatus = useVideoStatus(video);

    function handleDelete() {
        if (confirm('Tem certeza que deseja deletar este vídeo?')) {
            router.delete(`/videos/${video.id}`, {
                preserveScroll: true,
            });
        }
    }

    return (
        <div className="group flex items-center gap-4 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 transition-colors hover:border-slate-700/60 hover:bg-slate-900/60">
            <div className="flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800/60">
                {(liveStatus.video_path ?? video.video_path) && liveStatus.status === 'completed' ? (
                    <video
                        src={`/storage/${liveStatus.video_path ?? video.video_path}`}
                        className="h-full w-full object-cover"
                        muted
                        preload="metadata"
                    />
                ) : liveStatus.videoUrl && liveStatus.status === 'completed' ? (
                    <video
                        src={liveStatus.videoUrl}
                        className="h-full w-full object-cover"
                        muted
                        preload="metadata"
                    />
                ) : (
                    <Film className="h-8 w-8 text-slate-600" />
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-3">
                    <h3 className="truncate text-sm font-semibold text-white">
                        {video.title ?? 'Untitled Video'}
                    </h3>
                    <VideoStatusBadge
                        status={liveStatus.status}
                        label={liveStatus.status_label}
                        color={liveStatus.status_color}
                    />
                </div>

                <p className="truncate text-xs text-slate-500">
                    {video.script ?? 'No script'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="capitalize">{video.encoder}</span>
                    <span className="text-slate-700">&middot;</span>
                    <span className="capitalize">{video.subtitle_style}</span>
                    <span className="text-slate-700">&middot;</span>
                    <span>{formatDate(video.created_at)}</span>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-slate-500 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 border-slate-800 bg-slate-900">
                    {video.status === 'completed' && video.video_path && (
                        <DropdownMenuItem asChild>
                            <a href={`/videos/${video.id}/download`} className="cursor-pointer">
                                <Download className="mr-2 h-4 w-4" />
                                Download Video
                            </a>
                        </DropdownMenuItem>
                    )}
                    {video.srt_path && (
                        <DropdownMenuItem asChild>
                            <a href={`/videos/${video.id}/download-subtitle`} className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                Download Subtitle
                            </a>
                        </DropdownMenuItem>
                    )}
                    {(video.video_path || video.srt_path) && <DropdownMenuSeparator className="bg-slate-800" />}
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-400 focus:text-red-400"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
