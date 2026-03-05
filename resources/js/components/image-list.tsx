import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UploadedImage } from '@/types/upload';
import type { UploadedFile } from '@/types/upload';

type ImageListProps = {
    items: (UploadedImage | UploadedFile)[];
    onRemove: (id: string) => void;
    title?: string;
};

function isUploadedFile(
    item: UploadedImage | UploadedFile,
): item is UploadedFile {
    return 'file' in item;
}

function getImageUrl(item: UploadedImage | UploadedFile): string {
    return isUploadedFile(item) ? item.preview : item.url;
}

function getFileName(item: UploadedImage | UploadedFile): string {
    return isUploadedFile(item) ? item.file.name : item.name;
}

function getFileSize(item: UploadedImage | UploadedFile): number {
    return isUploadedFile(item) ? item.file.size : item.size;
}

export function ImageList({
    items,
    onRemove,
    title = 'Files',
}: ImageListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="mb-3 text-sm font-bold tracking-tight text-white uppercase">
                {title} ({items.length})
            </h3>
            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-[#27272a] bg-[#18181b]/50 p-3 transition-colors hover:bg-[#27272a]/50"
                    >
                        <img
                            src={getImageUrl(item)}
                            alt={getFileName(item)}
                            className="h-12 w-12 shrink-0 rounded object-cover"
                        />
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="truncate text-sm text-white">
                                {getFileName(item)}
                            </p>
                            <p className="text-xs text-[#92b7c9]">
                                {(getFileSize(item) / 1024 / 1024).toFixed(2)}{' '}
                                MB
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(item.id)}
                            className="ml-2 shrink-0 text-[#92b7c9] hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
