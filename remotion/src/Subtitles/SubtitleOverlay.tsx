import { useEffect } from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

import { loadFont } from "../load-font";
import type { SubtitleOverlayProps } from "./types";
import { WordHighlight } from "./WordHighlight";

export function SubtitleOverlay({ videoSrc, words }: SubtitleOverlayProps) {
    useEffect(() => {
        loadFont();
    }, []);

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
