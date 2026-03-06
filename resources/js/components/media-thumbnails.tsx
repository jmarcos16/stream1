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

export default function MediaThumbnails({ images, onRemove, onReorder }: Props) {
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
                        onDragOver={e => { e.preventDefault(); setDragOverIndex(i); }}
                        onDrop={() => handleDrop(i)}
                        onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                        className={`group/thumb relative w-16 h-24 rounded-lg border shrink-0 overflow-hidden transition-all ${
                            dragOverIndex === i ? 'border-[#5555f6] scale-105' : 'border-slate-800'
                        } ${dragIndex === i ? 'opacity-40' : ''} ${!image.uploading ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                        {image.uploading ? (
                            <div className="w-full h-full bg-slate-900/60 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500 animate-spin text-sm">progress_activity</span>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => setPreviewIndex(i)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/40 transition-colors" />
                                <button
                                    onClick={e => { e.stopPropagation(); onRemove(i); }}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center hover:bg-red-500/90 transition-all"
                                >
                                    <span className="material-symbols-outlined text-white text-xs font-bold">close</span>
                                </button>
                            </>
                        )}
                        <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-white drop-shadow">{i + 1}</span>
                    </div>
                ))}
            </div>

            <Dialog open={previewIndex !== null} onOpenChange={() => setPreviewIndex(null)}>
                <DialogContent className="bg-slate-900 border-slate-800 p-2 max-w-lg">
                    {previewImage && (
                        <div className="space-y-2">
                            <img src={previewImage.url} alt={previewImage.name} className="w-full rounded-lg" />
                            <div className="flex items-center justify-between px-2 pb-1">
                                <p className="text-xs text-slate-400 truncate">{previewImage.name}</p>
                                <button
                                    onClick={() => { onRemove(previewIndex!); setPreviewIndex(null); }}
                                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
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
