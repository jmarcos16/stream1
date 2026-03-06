import type { TikTokPage } from "@remotion/captions";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { Page } from "./Page";

export function SubtitlePage({ page, style = 'bottom' }: { page: TikTokPage; style?: 'bottom' | 'center' }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const enter = spring({
        frame,
        fps,
        config: { damping: 200 },
        durationInFrames: 5,
    });

    const positionStyle = style === 'center' 
        ? { justifyContent: 'center', alignItems: 'center', height: 200 }
        : { justifyContent: 'center', alignItems: 'center', top: undefined, bottom: 350, height: 150 };

    return (
        <AbsoluteFill style={positionStyle}>
            <Page enterProgress={enter} page={page} style={style} />
        </AbsoluteFill>
    );
}
