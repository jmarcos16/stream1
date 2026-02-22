import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Film, Mic, Subtitles } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import UploadMediaModal from '@/components/upload-media-modal';
import { ImageList } from '@/components/image-list';
import type { UploadedImage } from '@/types/upload';
import { process } from '@/actions/App/Http/Controllers/VideoGenerationController';

export default function VideoCreator() {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    const form = useForm({
        script: '',
        aiVoiceover: true,
        autoSubtitles: true,
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        form.submit('post', process.url());
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
                        <div className="border-b border-solid border-[#27272a] p-6">
                            <h1 className="text-base leading-normal font-medium text-white">
                                Video Project
                            </h1>
                            <p className="text-sm leading-normal font-normal text-[#92b7c9]">
                                Untitled_Project_01
                            </p>
                        </div>

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

                    <section className="flex flex-1 items-center justify-center overflow-y-auto p-10">
                        <div className="max-w-sm text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#11181c] ring-1 ring-white/10">
                                <Film className="h-14 w-14 text-white/50" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
                                Create your video
                            </h2>
                            <p className="text-[#92b7c9]">
                                Upload your media and write a script to get
                                started. Your generated video will appear here.
                            </p>
                        </div>
                    </section>
                </main>

                <UploadMediaModal
                    open={uploadModalOpen}
                    onOpenChange={setUploadModalOpen}
                    onUploadSuccess={(files) =>
                        setUploadedImages((prev) => [...prev, ...files])
                    }
                />
            </AppHeaderLayout>
        </>
    );
}
