import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { router } from '@inertiajs/react';
import { Upload, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageList } from '@/components/image-list';
import type { UploadedFile, UploadMediaModalProps } from '@/types';

export default function UploadMediaModal({
    open,
    onOpenChange,
    onUploadSuccess,
}: UploadMediaModalProps) {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        return () => {
            uploadedFiles.forEach((file) => {
                URL.revokeObjectURL(file.preview);
            });
        };
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        },
    });

    const removeFile = (id: string) => {
        const fileToRemove = uploadedFiles.find((file) => file.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
    };

    const handleUpload = () => {
        setIsUploading(true);

        const formData = new FormData();
        uploadedFiles.forEach((file) => {
            formData.append('files[]', file.file);
        });

        router.post('/media/upload', formData, {
            onSuccess: (page: any) => {
                const uploadedFilesData = page.props.uploadedFiles || [];
                if (onUploadSuccess) {
                    onUploadSuccess(uploadedFilesData);
                }
                setUploadedFiles([]);
                onOpenChange(false);
                toast.success('Media uploaded successfully');
            },
            onError: (errors: Record<string, string>) => {
                const errorMessage =
                    Object.values(errors).join(', ') || 'Upload failed';
                toast.error(errorMessage);
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden border-[#27272a] bg-[#18181b] p-0">
                <DialogHeader className="gap-4 border-b border-[#27272a] px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/10 p-2">
                            <Upload className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white">
                                Upload Images
                            </DialogTitle>
                            <p className="mt-1 text-xs font-normal text-[#92b7c9]">
                                Add images to your project
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
                    {/* Drag & Drop Zone */}
                    <div
                        {...getRootProps()}
                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
                            isDragActive
                                ? 'border-white bg-white/10'
                                : 'border-[#27272a] bg-[#18181b]/50 hover:border-white/30 hover:bg-white/5'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="mb-4 rounded-full bg-[#27272a]/50 p-4 transition-transform group-hover:scale-110">
                            <CloudUpload className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-center">
                            <p className="text-base font-semibold text-white">
                                {isDragActive
                                    ? 'Drop images here'
                                    : 'Drag and drop images here'}
                            </p>
                            <p className="mt-1 text-sm text-[#92b7c9]">
                                or{' '}
                                <span className="font-medium text-white hover:underline">
                                    browse files
                                </span>{' '}
                                from your computer
                            </p>
                        </div>
                        <p className="mt-4 text-[11px] font-bold tracking-wider text-[#92b7c9] uppercase">
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

                <div className="flex justify-end gap-3 border-t border-[#27272a] px-6 py-4">
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
                        className="bg-white font-semibold text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
