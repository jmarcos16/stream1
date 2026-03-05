import { Upload, ImagePlus, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { v2 } from '@/routes/video-creator';
import { upload } from '@/actions/App/Http/Controllers/MediaUploadController';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Video } from '@/types/video';

type Props = {
    video: Video;
    onNext: () => void;
};

type UploadedFile = {
    id: string;
    name: string;
    url: string;
    size: number;
};

export function MediaAssetsStep({ video, onNext }: Props) {
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files[]', file));

        router.post(upload.url({ video: video.id }), formData, {
            onSuccess: (page) => {
                const uploaded = page.props.uploadedFiles as UploadedFile[];
                setUploadedFiles(prev => [...prev, ...uploaded]);
                setUploading(false);
            },
            onError: () => setUploading(false),
        });
    };

    const removeFile = (id: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="flex min-h-125 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                            <Upload className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Media Assets
                            </h3>
                            <p className="text-sm text-slate-500">
                                Upload your visual content to get started
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                        Max 500MB • JPG, PNG, MP4
                    </span>
                </div>

                {uploadedFiles.length > 0 && (
                    <div className="mb-6 grid grid-cols-4 gap-4">
                        {uploadedFiles.map(file => (
                            <div key={file.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="group relative h-80 cursor-pointer">
                    <input
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                        multiple
                        type="file"
                        accept="image/*"
                    />
                    <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 text-center transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5">
                        {uploading ? (
                            <>
                                <Loader2 className="mb-6 h-10 w-10 animate-spin text-indigo-500" />
                                <p className="text-base font-semibold text-slate-700">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50 shadow-sm transition-colors group-hover:bg-white">
                                    <ImagePlus className="h-10 w-10 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                                <p className="text-base font-semibold text-slate-700">
                                    Drag and drop images or videos here
                                </p>
                                <p className="mt-2 max-w-sm text-sm text-slate-400">
                                    Bring your own media or select from our stock library in the next step
                                </p>
                                <button className="mt-8 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                                    Browse Files
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6">
                <Link
                    href={v2()}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold transition-colors ${uploading ? 'pointer-events-none text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ChevronLeft className="h-5 w-5" />
                    Cancel
                </Link>
                <button
                    onClick={onNext}
                    disabled={uploading}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Video Script
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
