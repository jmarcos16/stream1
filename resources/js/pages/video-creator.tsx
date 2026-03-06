import { Head, useForm, usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import { generate } from '@/routes/video';
import { store as uploadMedia } from '@/routes/temp-media';
import { destroy as deleteMedia } from '@/routes/temp-media';
import MediaThumbnails from '@/components/media-thumbnails';
import VideoProcessingPreview from '@/components/video-processing-preview';
import axios from 'axios';

type UploadedImage = {
    path: string;
    url: string;
    name: string;
    uploading?: boolean;
};

export default function VideoCreator() {
    const { processingVideoId } = usePage<{ processingVideoId?: number }>()
        .props;
    const [images, setImages] = useState<UploadedImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeVideoId, setActiveVideoId] = useState<number | null>(
        processingVideoId ?? null,
    );

    const form = useForm({
        title: '',
        script: '',
        aiVoiceover: true,
        autoSubtitles: true,
        images: [] as string[],
        subtitle_style: 'bottom' as 'bottom' | 'center',
    });

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files).filter((f) =>
                f.type.startsWith('image/'),
            );
            if (!fileArray.length) return;

            const placeholders: UploadedImage[] = fileArray.map((f) => ({
                path: '',
                url: '',
                name: f.name,
                uploading: true,
            }));
            setImages((prev) => [...prev, ...placeholders]);
            const startIndex = images.length;

            for (let i = 0; i < fileArray.length; i++) {
                const formData = new FormData();
                formData.append('file', fileArray[i]);

                try {
                    const { data } = await axios.post(
                        uploadMedia().url,
                        formData,
                    );
                    setImages((prev) => {
                        const updated = [...prev];
                        updated[startIndex + i] = {
                            path: data.path,
                            url: data.url,
                            name: data.name,
                        };
                        return updated;
                    });
                } catch {
                    setImages((prev) =>
                        prev.filter((_, idx) => idx !== startIndex + i),
                    );
                }
            }
        },
        [images.length],
    );

    const removeImage = async (index: number) => {
        const image = images[index];
        const filename = image.path.split('/').pop();
        if (filename) {
            axios.delete(deleteMedia(filename).url);
        }
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const reorderImages = (from: number, to: number) => {
        setImages((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            return updated;
        });
    };

    const handleDropZone = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove(
            'border-[#5555f6]/50',
            'bg-slate-900/60',
        );
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    };

    const handleSubmit = () => {
        const validPaths = images
            .filter((img) => !img.uploading)
            .map((img) => img.path);
        form.transform((data) => ({ ...data, images: validPaths }));
        form.post(generate().url, {
            onSuccess: (page) => {
                const url = new URL(page.url, window.location.origin);
                const id = url.searchParams.get('processingVideoId');
                if (id) setActiveVideoId(Number(id));
            },
        });
    };

    return (
        <>
            <Head title="ShortsGen - Video Creator" />
            <style>{`
                @keyframes rotate-border {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -400; }
                }
            `}</style>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100 antialiased">
                <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800/60 bg-slate-900/40 px-8 backdrop-blur-xl">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl text-[#5555f6]">
                                movie_filter
                            </span>
                            <span className="text-lg font-bold tracking-tight">
                                Shorts
                                <span className="text-[#5555f6]">Gen</span>
                            </span>
                        </div>
                        <div className="hidden items-center gap-6 md:flex">
                            <a
                                className="text-sm font-medium text-slate-100"
                                href="#"
                            >
                                Editor
                            </a>
                            <a
                                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                                href="#"
                            >
                                Projects
                            </a>
                            <a
                                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                                href="#"
                            >
                                Assets
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 transition-colors hover:text-white">
                            <span className="material-symbols-outlined">
                                notifications
                            </span>
                        </button>
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                            <div className="h-full w-full bg-gradient-to-br from-[#5555f6] to-[#ec4899]" />
                        </div>
                    </div>
                </nav>

                <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <input
                                type="text"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                className={`w-full border-none bg-transparent text-2xl font-bold outline-none placeholder:text-slate-600 ${form.errors.title ? 'text-red-400' : ''}`}
                                placeholder="Untitled Project"
                            />
                            {form.errors.title && (
                                <p className="mt-1 text-xs text-red-400">
                                    {form.errors.title}
                                </p>
                            )}
                            <p className="text-sm text-slate-500">
                                Transform your ideas into vertical magic
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2 text-sm font-medium transition-colors hover:bg-slate-800">
                                Save Draft
                            </button>
                            <div className="relative">
                                <svg
                                    className="absolute inset-0 h-full w-full"
                                    style={{ overflow: 'visible' }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="gradient-btn"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#5555f6"
                                            />
                                            <stop
                                                offset="50%"
                                                stopColor="#ec4899"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#5555f6"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <rect
                                        x="1"
                                        y="1"
                                        width="calc(100% - 2px)"
                                        height="calc(100% - 2px)"
                                        rx="12"
                                        ry="12"
                                        fill="none"
                                        stroke="url(#gradient-btn)"
                                        strokeWidth="2"
                                        strokeDasharray="100 300"
                                        style={{
                                            animation:
                                                'rotate-border 3s linear infinite',
                                        }}
                                    />
                                </svg>
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        form.processing ||
                                        images.some((i) => i.uploading) ||
                                        !images.length
                                    }
                                    className="relative flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#5555f6] to-[#ec4899] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#5555f6]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        bolt
                                    </span>
                                    {form.processing
                                        ? 'Generating...'
                                        : 'Generate Video'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-12 rounded-[2rem] border border-slate-800/40 bg-slate-900/40 p-8 backdrop-blur-xl lg:flex-row">
                        <div className="flex flex-1 flex-col gap-10">
                            {/* Media Assets */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl text-slate-400">
                                        image
                                    </span>
                                    <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                                        Media Assets
                                    </h3>
                                    {images.length > 0 && (
                                        <span className="ml-auto text-xs text-slate-500">
                                            {images.length}/10 • Drag to reorder
                                        </span>
                                    )}
                                </div>
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add(
                                            'border-[#5555f6]/50',
                                            'bg-slate-900/60',
                                        );
                                    }}
                                    onDragLeave={(e) =>
                                        e.currentTarget.classList.remove(
                                            'border-[#5555f6]/50',
                                            'bg-slate-900/60',
                                        )
                                    }
                                    onDrop={handleDropZone}
                                    className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 p-10 transition-all hover:border-[#5555f6]/50 hover:bg-slate-900/60"
                                >
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 transition-colors group-hover:bg-[#5555f6]/10">
                                        <span className="material-symbols-outlined text-slate-400 transition-colors group-hover:text-[#5555f6]">
                                            add
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Drop images here or browse
                                    </p>
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Up to 10 images • 9:16 recommended
                                    </p>
                                </div>
                                {images.length > 0 && (
                                    <MediaThumbnails
                                        images={images}
                                        onRemove={removeImage}
                                        onReorder={reorderImages}
                                    />
                                )}
                            </section>

                            {/* Script */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl text-slate-400">
                                        description
                                    </span>
                                    <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                                        Script
                                    </h3>
                                </div>
                                <textarea
                                    value={form.data.script}
                                    onChange={(e) =>
                                        form.setData('script', e.target.value)
                                    }
                                    className={`h-32 w-full resize-none rounded-2xl border bg-slate-900/60 p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:ring-2 focus:ring-[#5555f6]/50 focus:outline-none ${form.errors.script ? 'border-red-400' : 'border-slate-800'}`}
                                    placeholder="Write your script or let AI generate one..."
                                />
                                {form.errors.script && (
                                    <p className="text-xs text-red-400">
                                        {form.errors.script}
                                    </p>
                                )}
                                <button className="flex items-center gap-1 text-sm text-[#5555f6] transition-colors hover:text-[#ec4899]">
                                    <span className="material-symbols-outlined text-base">
                                        auto_awesome
                                    </span>
                                    Generate with AI
                                </button>
                            </section>

                            {/* Subtitle Style */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl text-slate-400">
                                        subtitles
                                    </span>
                                    <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                                        Subtitle Style
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            form.setData(
                                                'subtitle_style',
                                                'bottom',
                                            )
                                        }
                                        className={`rounded-xl border bg-slate-900/60 p-4 text-sm font-medium transition-all ${
                                            form.data.subtitle_style ===
                                            'bottom'
                                                ? 'border-[#5555f6] text-white'
                                                : 'border-slate-800 text-slate-300 hover:border-[#5555f6]/50'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined">
                                                vertical_align_bottom
                                            </span>
                                            <span>Bottom</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            form.setData(
                                                'subtitle_style',
                                                'center',
                                            )
                                        }
                                        className={`rounded-xl border bg-slate-900/60 p-4 text-sm font-medium transition-all ${
                                            form.data.subtitle_style ===
                                            'center'
                                                ? 'border-[#5555f6] text-white'
                                                : 'border-slate-800 text-slate-300 hover:border-[#5555f6]/50'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined">
                                                vertical_align_center
                                            </span>
                                            <span>Center</span>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            {/* Style */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl text-slate-400">
                                        palette
                                    </span>
                                    <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                                        Style
                                    </h3>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Minimal', 'Bold', 'Cinematic'].map(
                                        (style) => (
                                            <button
                                                key={style}
                                                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm font-medium text-slate-300 transition-all hover:border-[#5555f6] hover:text-white"
                                            >
                                                {style}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Preview */}
                        <div className="flex flex-col gap-4 lg:w-80">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl text-slate-400">
                                    visibility
                                </span>
                                <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                                    Preview
                                </h3>
                            </div>
                            <div className="relative">
                                <svg
                                    className="absolute inset-0 h-full w-full"
                                    style={{ overflow: 'visible' }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="gradient-preview"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#5555f6"
                                            />
                                            <stop
                                                offset="50%"
                                                stopColor="#ec4899"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#5555f6"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <rect
                                        x="2"
                                        y="2"
                                        width="calc(100% - 4px)"
                                        height="calc(100% - 4px)"
                                        rx="24"
                                        ry="24"
                                        fill="none"
                                        stroke="url(#gradient-preview)"
                                        strokeWidth="2"
                                        strokeDasharray="150 350"
                                        style={{
                                            animation:
                                                'rotate-border 4s linear infinite',
                                        }}
                                    />
                                </svg>
                                <div className="relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-[0_0_40px_-10px_rgba(85,85,246,0.2)]">
                                    <VideoProcessingPreview
                                        videoId={activeVideoId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
