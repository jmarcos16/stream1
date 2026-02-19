import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Film, Mic, Subtitles } from 'lucide-react';
import UploadMediaModal from '@/components/upload-media-modal';

export default function VideoCreator() {
    const [aiVoiceover, setAiVoiceover] = useState(true);
    const [autoSubtitles, setAutoSubtitles] = useState(true);
    const [script, setScript] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    return (
        <>
            <Head title="VidGen AI - Video Creator" />
            <div 
                className="flex flex-col min-h-screen bg-[#09090b] text-white antialiased"
                style={{
                    backgroundImage: 'radial-gradient(#27272a 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#27272a] px-6 py-3 shrink-0 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-6">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
                                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">VidGen AI</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <Avatar className="size-10">
                            <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuApW4AAMwr0mtyyei9kJd4hHJwZtCW3THoHe_1YJoP4tC6CxLJhFk--ub8GzEGvIc6OKsIsT7PxyTCDIBydvDyEFvF6xmUuwVwmapQE46yS1Uye7QeAVJQ6feWDXUvd3AiZmZGormsRgMb7HbHMYsqJF7PXykCekfRlv7K_FRp0NowQO_0Or-cSb5zorjEplzbuFlQ0nFirACKWXGbzAkFUI95yOJ9XDuGklW3Qg3w8wcJtHeL0tceirXJgIbeZCP_Z2_voX1tLv6g" alt="User profile" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                </header>
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
                            <Button 
                                className="w-full bg-white text-black hover:bg-white/90 shadow-sm font-semibold"
                            >
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
                                Upload your media and write a script to get started. Your generated video will appear here.
                            </p>
                        </div>
                    </section>
                </main>

                <UploadMediaModal 
                    open={uploadModalOpen}
                    onOpenChange={setUploadModalOpen}
                />
            </div>
        </>
    );
}
