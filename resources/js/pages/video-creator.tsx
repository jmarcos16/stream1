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
                    <aside className="w-96 flex flex-col border-r border-solid border-[#27272a] bg-[#09090b]">
                        <div className="p-6 border-b border-solid border-[#27272a]">
                            <h1 className="text-white text-base font-medium leading-normal">Video Project</h1>
                            <p className="text-[#92b7c9] text-sm font-normal leading-normal">Untitled_Project_01</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div>
                                <h3 className="text-sm font-medium text-[#92b7c9] mb-3 uppercase tracking-wider">
                                    1. Upload Media
                                </h3>
                                <Button
                                    onClick={() => setUploadModalOpen(true)}
                                    className="w-full bg-white text-black font-medium hover:bg-white/90"
                                >
                                    Upload Media
                                </Button>

                                <div className="mt-4">
                                    <ImageList
                                        items={uploadedImages}
                                        onRemove={(id) =>
                                            setUploadedImages(
                                                uploadedImages.filter((img) => img.id !== id),
                                            )
                                        }
                                        title="Uploaded Images"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-[#92b7c9] mb-3 uppercase tracking-wider">
                                    2. Enter Script
                                </h3>
                                <Textarea
                                    value={form.data.script}
                                    onChange={(e) => form.setData('script', e.target.value)}
                                    className="min-h-36 border-[#27272a] bg-[#18181b] text-white placeholder:text-zinc-500 focus-visible:ring-white"
                                    placeholder="Tell your story here. The AI will match your media to the script."
                                />
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-[#92b7c9] mb-3 uppercase tracking-wider">
                                    3. Settings
                                </h3>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-4 bg-transparent px-2 min-h-14 justify-between">
                                        <div className="flex items-center gap-4">
                                            <Mic className="h-5 w-5 text-white" />
                                            <p className="text-white text-base font-normal leading-normal flex-1 truncate">
                                                AI Voiceover
                                            </p>
                                        </div>
                                        <Switch
                                            checked={form.data.aiVoiceover}
                                            onCheckedChange={(checked) => form.setData('aiVoiceover', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 bg-transparent px-2 min-h-14 justify-between">
                                        <div className="flex items-center gap-4">
                                            <Subtitles className="h-5 w-5 text-white" />
                                            <p className="text-white text-base font-normal leading-normal flex-1 truncate">
                                                Auto-subtitles
                                            </p>
                                        </div>
                                        <Switch
                                            checked={form.data.autoSubtitles}
                                            onCheckedChange={(checked) => form.setData('autoSubtitles', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                            </div>

                            <div className="p-6 border-t border-solid border-[#27272a] space-y-3 shrink-0">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full bg-white text-black hover:bg-white/90 shadow-sm font-semibold"
                                >
                                    {form.processing ? 'Generating...' : 'Generate Video'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-[#92b7c9] hover:text-white hover:bg-white/10 font-medium"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </aside>

                    <section className="flex flex-1 items-center justify-center p-10 overflow-y-auto">
                        <div className="text-center max-w-sm">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#11181c] ring-1 ring-white/10">
                                <Film className="h-14 w-14 text-white/50" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                                Create your video
                            </h2>
                            <p className="text-[#92b7c9]">
                                Upload your media and write a script to get started. Your generated video will appear
                                here.
                            </p>
                        </div>
                    </section>
                </main>

                <UploadMediaModal
                    open={uploadModalOpen}
                    onOpenChange={setUploadModalOpen}
                    onUploadSuccess={(files) => setUploadedImages((prev) => [...prev, ...files])}
                />
            </AppHeaderLayout>
        </>
    );
}
