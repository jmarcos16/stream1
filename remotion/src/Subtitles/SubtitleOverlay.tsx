import { createTikTokStyleCaptions } from "@remotion/captions";
import { useEffect, useMemo } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";

import { loadFont } from "../load-font";
import { SubtitlePage } from "./SubtitlePage";
import type { SubtitleOverlayProps } from "./types";
import { wordsToCaptions } from "./words-to-captions";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

export function SubtitleOverlay({ videoSrc, words, style = 'bottom' }: SubtitleOverlayProps) {
    const { fps } = useVideoConfig();

    useEffect(() => {
        loadFont();
    }, []);

    const captions = useMemo(() => wordsToCaptions(words), [words]);

    const { pages } = useMemo(
        () =>
            createTikTokStyleCaptions({
                captions,
                combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
            }),
        [captions],
    );

    const src = staticFile(videoSrc);

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <OffthreadVideo src={src} />
            {pages.map((page, index) => {
                const nextPage = pages[index + 1] ?? null;
                const startFrame = (page.startMs / 1000) * fps;
                const endFrame = Math.min(
                    nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
                    startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
                );
                const durationInFrames = Math.max(1, Math.round(endFrame - startFrame));

                return (
                    <Sequence key={index} from={Math.round(startFrame)} durationInFrames={durationInFrames}>
                        <SubtitlePage page={page} style={style} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
}
