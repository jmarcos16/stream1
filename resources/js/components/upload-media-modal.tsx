import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { router } from '@inertiajs/react';
import { Upload, CloudUpload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageList } from '@/components/image-list';
import type { UploadedFile, UploadMediaModalProps } from '@/types';

export default function UploadMediaModal({ open, onOpenChange, onUploadSuccess }: UploadMediaModalProps) {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        return () => {
            uploadedFiles.forEach(file => {
                URL.revokeObjectURL(file.preview);
            });
        };
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        },
    });

    const removeFile = (id: string) => {
        const fileToRemove = uploadedFiles.find(file => file.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
    };

    const handleUpload = () => {
        setIsUploading(true);

        const formData = new FormData();
        uploadedFiles.forEach(file => {
            formData.append('files[]', file.file);
        });

        router.post('/media/upload', formData, {
            onSuccess: (page: any) => {
                console.log('Upload successful:', page);
                const uploadedFilesData = page.props.uploadedFiles || [];
                if (onUploadSuccess) {
                    onUploadSuccess(uploadedFilesData);
                }
                setUploadedFiles([]);
                onOpenChange(false);
            },
            onError: (errors: Record<string, string>) => {
                const errorMessage = Object.values(errors).join(', ') || 'Upload failed';
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#18181b] border-[#27272a] max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="border-b border-[#27272a] px-6 py-4 text-left gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Upload className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white text-lg font-bold">
                                Upload Images
                            </DialogTitle>
                            <p className="text-[#92b7c9] text-xs font-normal mt-1">
                                Add images to your project
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                        {...getRootProps()}
                        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all cursor-pointer ${
                            isDragActive
                                ? 'border-white bg-white/10'
                                : 'border-[#27272a] bg-[#18181b]/50 hover:border-white/30 hover:bg-white/5'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="mb-4 rounded-full bg-[#27272a]/50 p-4 group-hover:scale-110 transition-transform">
                            <CloudUpload className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-center">
                            <p className="text-white text-base font-semibold">
                                {isDragActive ? 'Drop images here' : 'Drag and drop images here'}
                            </p>
                            <p className="text-[#92b7c9] text-sm mt-1">
                                or{' '}
                                <span className="text-white font-medium hover:underline">
                                    browse files
                                </span>
                                {' '}from your computer
                            </p>
                        </div>
                        <p className="mt-4 text-[11px] uppercase tracking-wider text-[#92b7c9] font-bold">
                            Supports JPG, PNG, GIF, WEBP (Max 500MB)
                        </p>
                    </div>

                    {/* Selected Files List */}
                    <ImageList
                        items={uploadedFiles}
                        onRemove={removeFile}
                        title="Selected Files"
                    />
                </div>

                <div className="border-t border-[#27272a] px-6 py-4 flex gap-3 justify-end">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={uploadedFiles.length === 0 || isUploading}
                        onClick={handleUpload}
                        className="bg-white text-black hover:bg-white/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
