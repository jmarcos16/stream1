import { useCallback, useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Captions, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GenerateSubtitlesDialog from '@/components/generate-subtitles-dialog';
import AppLayout from '@/layouts/app-layout';
import { STEP_LABELS, STEPS, useVideoProcessing } from '@/hooks/use-video-processing';
import type { SubtitleSegment, Video } from '@/types/video';

type VideoShowProps = {
    video: Video;
    subtitles: SubtitleSegment[];
};

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function VideoShow({ video, subtitles }: VideoShowProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(video.audio_duration ?? 0);
    const [activeSegment, setActiveSegment] = useState<SubtitleSegment | null>(null);
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

    const isProcessing = video.status === 'processing';
    const canGenerateSubtitles = !isProcessing && video.raw_video_path && video.audio_path;

    const { steps, completed: processingComplete } = useVideoProcessing(isProcessing ? video.id : null);

    useEffect(() => {
        if (processingComplete) {
            router.reload();
        }
    }, [processingComplete]);

    const videoUrl = video.video_url ?? (video.video_path ? `/storage/${video.video_path}` : null);

    const handleTimeUpdate = useCallback(() => {
        const el = videoRef.current;

        if (!el) {
            return;
        }

        const time = el.currentTime;
        setCurrentTime(time);

        const active = subtitles.find((s) => time >= s.start && time < s.end) ?? null;
        setActiveSegment(active);
    }, [subtitles]);

    const handleLoadedMetadata = useCallback(() => {
        const el = videoRef.current;

        if (!el) {
            return;
        }

        setDuration(el.duration);
    }, []);

    const togglePlayPause = useCallback(() => {
        const el = videoRef.current;

        if (!el) {
            return;
        }

        if (el.paused) {
            el.play();
        } else {
            el.pause();
        }
    }, []);

    const seekTo = useCallback((time: number) => {
        const el = videoRef.current;

        if (!el) {
            return;
        }

        el.currentTime = time;

        if (el.paused) {
            el.play();
        }
    }, []);

    const handleTimelineClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = timelineRef.current?.getBoundingClientRect();

            if (!rect || duration === 0) {
                return;
            }

            const ratio = (e.clientX - rect.left) / rect.width;
            seekTo(Math.max(0, Math.min(duration, ratio * duration)));
        },
        [duration, seekTo],
    );

    useEffect(() => {
        const el = videoRef.current;

        if (!el) {
            return;
        }

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('ended', onEnded);

        return () => {
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
            el.removeEventListener('ended', onEnded);
        };
    }, []);

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AppLayout>
            <Head title={video.title ?? 'Timeline'} />

            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link href="/videos">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-semibold text-white">{video.title ?? 'Untitled Video'}</h1>

                    {canGenerateSubtitles && (
                        <div className="ml-auto">
                            <Button
                                onClick={() => setGenerateDialogOpen(true)}
                                variant="outline"
                                size="sm"
                                className="border-slate-700 bg-slate-800/60 text-slate-300 hover:border-indigo-500/60 hover:bg-indigo-500/10 hover:text-white"
                            >
                                <Captions className="mr-2 h-4 w-4" />
                                Generate Subtitles
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-6 rounded-xl border border-slate-800/60 bg-slate-900/40 px-6 py-10">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-slate-200">Generating subtitles...</p>
                                <p className="mt-1 text-xs text-slate-500">This may take a few minutes</p>
                            </div>

                            <div className="w-full max-w-xs space-y-2">
                                {STEPS.map((step) => {
                                    const status = steps[step];
                                    return (
                                        <div key={step} className="flex items-center gap-3">
                                            <div
                                                className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                                                    status === 'completed'
                                                        ? 'bg-emerald-400'
                                                        : status === 'processing'
                                                          ? 'animate-pulse bg-indigo-400'
                                                          : status === 'failed'
                                                            ? 'bg-red-400'
                                                            : 'bg-slate-700'
                                                }`}
                                            />
                                            <span
                                                className={`text-sm transition-colors ${
                                                    status === 'processing'
                                                        ? 'text-white'
                                                        : status === 'completed'
                                                          ? 'text-emerald-400'
                                                          : status === 'failed'
                                                            ? 'text-red-400'
                                                            : 'text-slate-600'
                                                }`}
                                            >
                                                {STEP_LABELS[step]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <>
                    <div className="overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/40">
                        {videoUrl ? (
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="aspect-[9/16] max-h-[70vh] w-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                            />
                        ) : (
                            <div className="flex aspect-[9/16] max-h-[70vh] w-full items-center justify-center text-slate-500">
                                Video not available
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={togglePlayPause}
                            disabled={!videoUrl}
                            className="h-9 w-9 shrink-0 text-slate-300 hover:text-white"
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="w-20 text-right font-mono text-xs text-slate-400">
                            {formatTime(currentTime)}
                        </span>
                        <span className="text-xs text-slate-600">/</span>
                        <span className="font-mono text-xs text-slate-500">{formatTime(duration)}</span>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Timeline</p>

                        <div
                            ref={timelineRef}
                            role="slider"
                            aria-label="Video timeline"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={currentTime}
                            tabIndex={0}
                            className="relative h-12 w-full cursor-pointer rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden"
                            onClick={handleTimelineClick}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowRight') {
                                    seekTo(Math.min(duration, currentTime + 5));
                                } else if (e.key === 'ArrowLeft') {
                                    seekTo(Math.max(0, currentTime - 5));
                                }
                            }}
                        >
                            {/* Subtitle segment blocks */}
                            {duration > 0 &&
                                subtitles.map((segment) => {
                                    const left = (segment.start / duration) * 100;
                                    const width = ((segment.end - segment.start) / duration) * 100;
                                    const isActive = activeSegment?.index === segment.index;

                                    return (
                                        <button
                                            key={segment.index}
                                            type="button"
                                            title={segment.text}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                seekTo(segment.start);
                                            }}
                                            className="absolute top-1.5 h-9 rounded-sm border border-indigo-500/30 bg-indigo-500/20 transition-colors hover:bg-indigo-500/40"
                                            style={{
                                                left: `${left}%`,
                                                width: `max(${width}%, 2px)`,
                                                backgroundColor: isActive ? 'rgb(99 102 241 / 0.5)' : undefined,
                                                borderColor: isActive ? 'rgb(99 102 241 / 0.8)' : undefined,
                                            }}
                                        />
                                    );
                                })}

                            {/* Progress indicator */}
                            {duration > 0 && (
                                <div
                                    className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                                    style={{ left: `${progressPercent}%` }}
                                />
                            )}
                        </div>

                        {/* Active subtitle text */}
                        <div className="flex min-h-[2rem] items-center justify-center rounded-lg border border-slate-800/40 bg-slate-900/30 px-4 py-2">
                            {activeSegment ? (
                                <p className="text-center text-sm text-white">{activeSegment.text}</p>
                            ) : (
                                <p className="text-center text-xs text-slate-600">
                                    {subtitles.length === 0 ? 'No subtitles available' : 'Play the video to see subtitles'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Subtitle segments list */}
                    {subtitles.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Segments</p>
                            <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
                                {subtitles.map((segment) => {
                                    const isActive = activeSegment?.index === segment.index;

                                    return (
                                        <button
                                            key={segment.index}
                                            type="button"
                                            onClick={() => seekTo(segment.start)}
                                            className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-800/60 ${isActive ? 'bg-indigo-500/10 border border-indigo-500/20' : ''}`}
                                        >
                                            <span className="mt-0.5 shrink-0 font-mono text-xs text-slate-600">
                                                {formatTime(segment.start)}
                                            </span>
                                            <span className={`text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                {segment.text}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                        </>
                    )}
                </div>

                <GenerateSubtitlesDialog
                    videoId={video.id}
                    open={generateDialogOpen}
                    onClose={() => setGenerateDialogOpen(false)}
                />
            </div>
        </AppLayout>
    );
}
