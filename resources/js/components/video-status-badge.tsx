import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Video } from '@/types/video';

type VideoStatusBadgeProps = {
    status: Video['status'];
    label: Video['status_label'];
    color: Video['status_color'];
};

const colorMap: Record<string, string> = {
    gray: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function VideoStatusBadge({ label, color }: VideoStatusBadgeProps) {
    return (
        <Badge className={cn('text-xs font-medium', colorMap[color] ?? colorMap.gray)}>
            {label}
        </Badge>
    );
}
