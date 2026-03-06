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

    if (style === 'center') {
        return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Page enterProgress={enter} page={page} style={style} />
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: undefined, bottom: 350, height: 150 }}>
            <Page enterProgress={enter} page={page} style={style} />
        </AbsoluteFill>
    );
}
