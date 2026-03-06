import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type Image = {
    path: string;
    url: string;
    name: string;
    uploading?: boolean;
};

type Props = {
    images: Image[];
    onRemove: (index: number) => void;
    onReorder: (from: number, to: number) => void;
};

export default function MediaThumbnails({
    images,
    onRemove,
    onReorder,
}: Props) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const handleDrop = (toIndex: number) => {
        if (dragIndex !== null && dragIndex !== toIndex) {
            onReorder(dragIndex, toIndex);
        }
        setDragIndex(null);
        setDragOverIndex(null);
    };

    const previewImage = previewIndex !== null ? images[previewIndex] : null;

    return (
        <>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, i) => (
                    <div
                        key={image.path || i}
                        draggable={!image.uploading}
                        onDragStart={() => setDragIndex(i)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverIndex(i);
                        }}
                        onDrop={() => handleDrop(i)}
                        onDragEnd={() => {
                            setDragIndex(null);
                            setDragOverIndex(null);
                        }}
                        className={`group/thumb relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border transition-all ${
                            dragOverIndex === i
                                ? 'scale-105 border-[#5555f6]'
                                : 'border-slate-800'
                        } ${dragIndex === i ? 'opacity-40' : ''} ${!image.uploading ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                        {image.uploading ? (
                            <div className="flex h-full w-full items-center justify-center bg-slate-900/60">
                                <span className="material-symbols-outlined animate-spin text-sm text-slate-500">
                                    progress_activity
                                </span>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="h-full w-full cursor-pointer object-cover"
                                    onClick={() => setPreviewIndex(i)}
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors group-hover/thumb:bg-black/40" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(i);
                                    }}
                                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 opacity-0 transition-all group-hover/thumb:opacity-100 hover:bg-red-500/90"
                                >
                                    <span className="material-symbols-outlined text-xs font-bold text-white">
                                        close
                                    </span>
                                </button>
                            </>
                        )}
                        <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-white drop-shadow">
                            {i + 1}
                        </span>
                    </div>
                ))}
            </div>

            <Dialog
                open={previewIndex !== null}
                onOpenChange={() => setPreviewIndex(null)}
            >
                <DialogContent className="max-w-lg border-slate-800 bg-slate-900 p-2">
                    {previewImage && (
                        <div className="space-y-2">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="w-full rounded-lg"
                            />
                            <div className="flex items-center justify-between px-2 pb-1">
                                <p className="truncate text-xs text-slate-400">
                                    {previewImage.name}
                                </p>
                                <button
                                    onClick={() => {
                                        onRemove(previewIndex!);
                                        setPreviewIndex(null);
                                    }}
                                    className="flex items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-300"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        delete
                                    </span>
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
