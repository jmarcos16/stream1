import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Film, Mic, Subtitles, X } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import UploadMediaModal from '@/components/upload-media-modal';
import type { UploadedImage } from '@/types';

export default function VideoCreator() {
    const [aiVoiceover, setAiVoiceover] = useState(true);
    const [autoSubtitles, setAutoSubtitles] = useState(true);
    const [script, setScript] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

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

                                {uploadedImages.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs text-[#92b7c9] uppercase tracking-wider font-bold mb-3">
                                            Uploaded Images ({uploadedImages.length})
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {uploadedImages.map((image) => (
                                                <div key={image.id} className="relative group">
                                                    <img
                                                        src={image.url}
                                                        alt={image.name}
                                                        className="w-full h-20 object-cover rounded-lg border border-[#27272a]"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setUploadedImages(
                                                                uploadedImages.filter(
                                                                    (img) => img.id !== image.id,
                                                                ),
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-[#92b7c9] mb-3 uppercase tracking-wider">
                                    2. Enter Script
                                </h3>
                                <Textarea
                                    value={script}
                                    onChange={(e) => setScript(e.target.value)}
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
                                            checked={aiVoiceover}
                                            onCheckedChange={setAiVoiceover}
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
                                            checked={autoSubtitles}
                                            onCheckedChange={setAutoSubtitles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-solid border-[#27272a] space-y-3 shrink-0">
                            <Button className="w-full bg-white text-black hover:bg-white/90 shadow-sm font-semibold">
                                Generate Video
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-[#92b7c9] hover:text-white hover:bg-white/10 font-medium"
                                onClick={() => {
                                    setScript('');
                                    setAiVoiceover(true);
                                    setAutoSubtitles(true);
                                }}
                            >
                                Reset
                            </Button>
                        </div>
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
