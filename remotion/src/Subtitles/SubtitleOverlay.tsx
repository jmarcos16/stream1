import type { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

import type { SubtitleOverlayProps } from "./types";
import { WordHighlight } from "./WordHighlight";

export function SubtitleOverlay({ videoSrc, words }: SubtitleOverlayProps) {
    const containerStyle: CSSProperties = {
        backgroundColor: "black",
    };

    const src = staticFile(videoSrc);

    return (
        <AbsoluteFill style={containerStyle}>
            <OffthreadVideo src={src} />
            <WordHighlight words={words} />
        </AbsoluteFill>
    );
}
