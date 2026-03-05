import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import UploadMediaModal from '@/components/upload-media-modal';
import { ImageList } from '@/components/image-list';
import VideoProjectHeader from '@/components/video-project-header';
import VideoList from '@/components/video-list';
import type { UploadedImage } from '@/types/upload';
import type { Video } from '@/types/video';
import { process } from '@/routes/video/generate';

type Props = {
    videos: Video[];
};

export default function VideoCreator({ videos }: Props) {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    const form = useForm({
        title: 'Untitled_Project_01',
        script: '',
        aiVoiceover: true,
        autoSubtitles: true,
        images: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(process.url(), {
            ...form.data,
            images: uploadedImages.map((img) => img.path),
        });
    };

    const handleReset = () => {
        form.reset();
        setUploadedImages([]);
    };

    return (
        <>
            <Head title="VidGen AI - Video Creator" />
            <AppHeaderLayout>
                <main className="flex flex-1">
                    <aside className="flex w-96 flex-col border-r border-solid border-[#27272a] bg-[#09090b]">
                        <VideoProjectHeader
                            title={form.data.title}
                            onTitleChange={(title) =>
                                form.setData('title', title)
                            }
                        />

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-1 flex-col"
                        >
                            <div className="flex-1 space-y-8 overflow-y-auto p-6">
                                <div>
                                    <h3 className="mb-3 text-sm font-medium tracking-wider text-[#92b7c9] uppercase">
                                        1. Upload Media
                                    </h3>
                                    <Button
                                        onClick={() => setUploadModalOpen(true)}
                                        className="w-full bg-white font-medium text-black hover:bg-white/90"
                                    >
                                        Upload Media
                                    </Button>

                                    <div className="mt-4">
                                        <ImageList
                                            items={uploadedImages}
                                            onRemove={(id) =>
                                                setUploadedImages(
                                                    uploadedImages.filter(
                                                        (img) => img.id !== id,
                                                    ),
                                                )
                                            }
                                            title="Uploaded Images"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 text-sm font-medium tracking-wider text-[#92b7c9] uppercase">
                                        2. Enter Script
                                    </h3>
                                    <Textarea
                                        value={form.data.script}
                                        onChange={(e) =>
                                            form.setData(
                                                'script',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-36 border-[#27272a] bg-[#18181b] text-white placeholder:text-zinc-500 focus-visible:ring-white"
                                        placeholder="Tell your story here. The AI will match your media to the script."
                                    />
                                </div>
                            </div>

                            <div className="shrink-0 space-y-3 border-t border-solid border-[#27272a] p-6">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full bg-white font-semibold text-black shadow-sm hover:bg-white/90"
                                >
                                    {form.processing
                                        ? 'Generating...'
                                        : 'Generate Video'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full font-medium text-[#92b7c9] hover:bg-white/10 hover:text-white"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </aside>

                    <VideoList videos={videos} />

                    <UploadMediaModal
                        open={uploadModalOpen}
                        onOpenChange={setUploadModalOpen}
                        onUploadSuccess={(files) =>
                            setUploadedImages((prev) => [...prev, ...files])
                        }
                    />
                </main>
            </AppHeaderLayout>
        </>
    );
}
