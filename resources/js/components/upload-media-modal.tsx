import { useState } from 'react';
import { Upload, X, CloudUpload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UploadMediaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UploadMediaModal({ open, onOpenChange }: UploadMediaModalProps) {
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string }>>([]);

    const removeFile = (id: string) => {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
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
                                Upload Media
                            </DialogTitle>
                            <p className="text-[#92b7c9] text-xs font-normal mt-1">
                                Add images or videos to your project
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    {/* Drag & Drop Zone */}
                    <div className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#27272a] bg-[#18181b]/50 px-6 py-10 transition-all hover:border-white/30 hover:bg-white/5 cursor-pointer">
                        <div className="mb-4 rounded-full bg-[#27272a]/50 p-4 group-hover:scale-110 transition-transform">
                            <CloudUpload className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-center">
                            <p className="text-white text-base font-semibold">
                                Drag and drop video or images here
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
                            Supports MP4, MOV, JPG, PNG (Max 500MB)
                        </p>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                        <div>
                            <h3 className="text-white text-sm font-bold uppercase tracking-tight mb-3">
                                Uploaded Files ({uploadedFiles.length})
                            </h3>
                            <div className="space-y-2">
                                {uploadedFiles.map(file => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-[#27272a] bg-[#18181b]/50 hover:bg-[#27272a]/50 transition-colors"
                                    >
                                        <p className="text-white text-sm truncate">{file.name}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(file.id)}
                                            className="text-[#92b7c9] hover:text-white hover:bg-white/10"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                        disabled={uploadedFiles.length === 0}
                        className="bg-white text-black hover:bg-white/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
