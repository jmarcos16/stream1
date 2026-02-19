import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UploadedImage } from '@/types/upload';
import type { UploadedFile } from '@/types/upload';

interface ImageListProps {
    items: (UploadedImage | UploadedFile)[];
    onRemove: (id: string) => void;
    title?: string;
}

function isUploadedFile(item: UploadedImage | UploadedFile): item is UploadedFile {
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

export function ImageList({ items, onRemove, title = 'Files' }: ImageListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-tight mb-3">
                {title} ({items.length})
            </h3>
            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-[#27272a] bg-[#18181b]/50 hover:bg-[#27272a]/50 transition-colors"
                    >
                        <img
                            src={getImageUrl(item)}
                            alt={getFileName(item)}
                            className="h-12 w-12 rounded object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 ml-3">
                            <p className="text-white text-sm truncate">{getFileName(item)}</p>
                            <p className="text-[#92b7c9] text-xs">
                                {(getFileSize(item) / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(item.id)}
                            className="text-[#92b7c9] hover:text-white hover:bg-white/10 ml-2 shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
