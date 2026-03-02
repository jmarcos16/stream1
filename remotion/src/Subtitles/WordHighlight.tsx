import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import type { WordTimestamp } from "./types";

const WORDS_PER_GROUP = 8;
const MAX_WORDS_PER_LINE = 4;

function WordGroup({
    words,
    groupStart,
    groupEnd,
}: {
    words: WordTimestamp[];
    groupStart: number;
    groupEnd: number;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    const entryFrame = Math.floor(groupStart * fps);
    const progress = spring({
        frame: frame - entryFrame,
        fps,
        config: { damping: 20, stiffness: 120 },
    });

    const exitStart = Math.floor(groupEnd * fps) - 6;
    const exitEnd = Math.floor(groupEnd * fps);
    const opacity = interpolate(frame, [exitStart, exitEnd], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const translateY = interpolate(progress, [0, 1], [30, 0]);

    const lines: WordTimestamp[][] = [];
    for (let i = 0; i < words.length; i += MAX_WORDS_PER_LINE) {
        lines.push(words.slice(i, i + MAX_WORDS_PER_LINE));
    }

    const containerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        opacity,
        transform: `translateY(${translateY}px)`,
    };

    const bgStyle: CSSProperties = {
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        borderRadius: "16px",
        padding: "16px 28px",
        backdropFilter: "blur(8px)",
    };

    return (
        <div style={containerStyle}>
            <div style={bgStyle}>
                {lines.map((line, lineIdx) => {
                    const lineStyle: CSSProperties = {
                        display: "flex",
                        flexWrap: "nowrap",
                        justifyContent: "center",
                        alignItems: "baseline",
                        gap: "10px",
                        lineHeight: 1.3,
                    };

                    return (
                        <div key={lineIdx} style={lineStyle}>
                            {line.map((w, i) => {
                                const isActive =
                                    currentTime >= w.start && currentTime < w.end;
                                const isPast = currentTime >= w.end;

                                const activeScale = spring({
                                    frame: isActive
                                        ? frame - Math.floor(w.start * fps)
                                        : 0,
                                    fps,
                                    config: { damping: 12, stiffness: 200 },
                                });

                                const scale = isActive
                                    ? interpolate(activeScale, [0, 1], [1, 1.1])
                                    : 1;

                                let color = "#FFFFFF";
                                if (isActive) {
                                    color = "#38BDF8";
                                } else if (isPast) {
                                    color = "#94A3B8";
                                }

                                const wordStyle: CSSProperties = {
                                    fontSize: "52px",
                                    fontWeight: isActive ? 900 : 700,
                                    fontFamily:
                                        "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
                                    color,
                                    textShadow: isActive
                                        ? "0 0 16px rgba(56,189,248,0.4)"
                                        : "none",
                                    transform: `scale(${scale})`,
                                    display: "inline-block",
                                    textTransform: "uppercase",
                                };

                                return (
                                    <span key={`${w.word}-${i}`} style={wordStyle}>
                                        {w.word}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function WordHighlight({ words }: { words: WordTimestamp[] }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    const groups: { words: WordTimestamp[]; start: number; end: number }[] = [];
    for (let i = 0; i < words.length; i += WORDS_PER_GROUP) {
        const group = words.slice(i, i + WORDS_PER_GROUP);
        groups.push({
            words: group,
            start: group[0].start,
            end: group[group.length - 1].end,
        });
    }

    const activeGroup = groups.find(
        (g) => currentTime >= g.start && currentTime < g.end + 0.3,
    );

    if (!activeGroup) {
        return null;
    }

    const overlayStyle: CSSProperties = {
        position: "absolute",
        bottom: "12%",
        left: "6%",
        right: "6%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    };

    return (
        <div style={overlayStyle}>
            <WordGroup
                words={activeGroup.words}
                groupStart={activeGroup.start}
                groupEnd={activeGroup.end}
            />
        </div>
    );
}
