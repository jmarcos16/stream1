import { router } from '@inertiajs/react';
import axios from 'axios';
import { ImagePlus, Loader2, Plus } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { draft as draftRoute } from '@/routes/video';
import { store as uploadMedia, destroy as deleteMedia } from '@/routes/temp-media';
import MediaThumbnails from '@/components/media-thumbnails';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type UploadedImage = {
    path: string;
    url: string;
    name: string;
    uploading?: boolean;
};

type FormErrors = {
    title?: string;
    script?: string;
    images?: string;
};

export default function CreateVideoModal() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [script, setScript] = useState('');
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imagesRef = useRef<UploadedImage[]>([]);
    imagesRef.current = images;

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (!fileArray.length) return;

        const startIndex = imagesRef.current.length;
        const placeholders: UploadedImage[] = fileArray.map((f) => ({
            path: '',
            url: '',
            name: f.name,
            uploading: true,
        }));

        setImages((prev) => [...prev, ...placeholders]);

        for (let i = 0; i < fileArray.length; i++) {
            const formData = new FormData();
            formData.append('file', fileArray[i]);

            try {
                const { data } = await axios.post(uploadMedia().url, formData);
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
                setImages((prev) => prev.filter((_, idx) => idx !== startIndex + i));
            }
        }
    }, []);

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

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    };

    function validate(): boolean {
        const newErrors: FormErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required.';
        if (!script.trim()) newErrors.script = 'Script is required.';
        const validImages = images.filter((img) => !img.uploading);
        if (validImages.length === 0) newErrors.images = 'At least one image is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;

        const validPaths = images.filter((img) => !img.uploading).map((img) => img.path);

        setSubmitting(true);

        router.post(
            draftRoute().url,
            { title, script, images: validPaths },
            {
                onSuccess: () => {
                    setOpen(false);
                    resetForm();
                    router.reload();
                },
                onError: (errs) => {
                    setErrors(errs as FormErrors);
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            },
        );
    }

    function resetForm() {
        setTitle('');
        setScript('');
        setImages([]);
        setErrors({});
    }

    function handleOpenChange(value: boolean) {
        if (!value) resetForm();
        setOpen(value);
    }

    const hasUploading = images.some((img) => img.uploading);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Create Video
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg border-slate-800 bg-slate-950 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-white">Create Video</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5 py-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="cv-title" className="text-sm text-slate-300">
                            Title
                        </Label>
                        <Input
                            id="cv-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My awesome video"
                            className="border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-600"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-400">{errors.title}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="cv-script" className="text-sm text-slate-300">
                            Script
                        </Label>
                        <Textarea
                            id="cv-script"
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="Write the script that will be converted to audio..."
                            rows={5}
                            className="resize-none border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-600"
                        />
                        {errors.script && (
                            <p className="text-xs text-red-400">{errors.script}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm text-slate-300">Images</Label>

                        {images.length > 0 && (
                            <MediaThumbnails
                                images={images}
                                onRemove={removeImage}
                                onReorder={reorderImages}
                            />
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files && handleFiles(e.target.files)}
                        />

                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 py-8 transition-colors hover:border-slate-500 hover:bg-slate-900"
                        >
                            <ImagePlus className="h-7 w-7 text-slate-500" />
                            <p className="text-sm text-slate-500">
                                Drop images here or{' '}
                                <span className="text-blue-400 underline">browse</span>
                            </p>
                        </div>

                        {errors.images && (
                            <p className="text-xs text-red-400">{errors.images}</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => handleOpenChange(false)}
                        className="text-slate-400 hover:text-slate-200"
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || hasUploading}
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {submitting ? 'Creating...' : 'Create Video'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
