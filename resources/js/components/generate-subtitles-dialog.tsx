import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Captions, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type GenerateSubtitlesDialogProps = {
    videoId: number;
    open: boolean;
    onClose: () => void;
};

type SubtitleStyle = 'bottom' | 'center';

const STYLE_OPTIONS: { value: SubtitleStyle; label: string; description: string }[] = [
    { value: 'bottom', label: 'Bottom', description: 'Subtitles at the bottom of the frame' },
    { value: 'center', label: 'Center', description: 'Subtitles at the center of the frame' },
];

function StylePreview({ style, selected }: { style: SubtitleStyle; selected: boolean }) {
    return (
        <div
            className={`flex h-16 w-12 flex-col justify-${style === 'bottom' ? 'end' : 'center'} rounded-lg border p-1.5 transition-colors ${
                selected ? 'border-indigo-500/40 bg-slate-950' : 'border-slate-700 bg-slate-950/60'
            }`}
        >
            <div
                className={`h-1.5 w-full rounded-sm transition-colors ${selected ? 'bg-indigo-400' : 'bg-slate-600'}`}
            />
        </div>
    );
}

export default function GenerateSubtitlesDialog({ videoId, open, onClose }: GenerateSubtitlesDialogProps) {
    const [selectedStyle, setSelectedStyle] = useState<SubtitleStyle>('bottom');
    const [submitting, setSubmitting] = useState(false);

    function handleSubmit() {
        setSubmitting(true);
        router.post(
            `/videos/${videoId}/generate-subtitles`,
            { subtitle_style: selectedStyle },
            {
                onFinish: () => setSubmitting(false),
                onSuccess: () => onClose(),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-white">Generate Subtitles</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Choose where the subtitles will appear in the video. The video will be re-rendered.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-1 grid grid-cols-2 gap-3">
                    {STYLE_OPTIONS.map(({ value, label, description }) => {
                        const isSelected = selectedStyle === value;

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setSelectedStyle(value)}
                                className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 text-left transition-colors ${
                                    isSelected
                                        ? 'border-indigo-500/60 bg-indigo-500/10 text-white'
                                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800/60'
                                }`}
                            >
                                <StylePreview style={value} selected={isSelected} />
                                <div>
                                    <p className="text-center text-sm font-medium">{label}</p>
                                    <p className="mt-0.5 text-center text-xs text-slate-500">{description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-1 flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                        {submitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Captions className="mr-2 h-4 w-4" />
                        )}
                        Generate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
