import { fitText } from "@remotion/layout-utils";
import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import { MontserratBlack } from "../load-font";
import type { WordTimestamp } from "./types";

const WORDS_PER_GROUP = 3;
const DESIRED_FONT_SIZE = 100;
const HIGHLIGHT_COLOR = "#FFFF00";
const TEXT_COLOR = "#FFFFFF";

function WordGroup({ words }: { words: WordTimestamp[] }) {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();
    const currentTime = frame / fps;

    const text = words.map((w) => w.word).join(" ");

    const fittedFont = fitText({
        fontFamily: MontserratBlack,
        text: text.toUpperCase(),
        withinWidth: width * 0.9,
    });

    const actualFontSize = Math.min(fittedFont.fontSize, DESIRED_FONT_SIZE);

    const containerStyle: CSSProperties = {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: `${actualFontSize * 0.2}px`,
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 1.2,
        maxWidth: "90%",
    };

    return (
        <div style={containerStyle}>
            {words.map((w, i) => {
                const isActive = currentTime >= w.start && currentTime < w.end;

                const wordStyle: CSSProperties = {
                    fontSize: `${actualFontSize}px`,
                    fontFamily: MontserratBlack,
                    fontWeight: 900,
                    color: isActive ? HIGHLIGHT_COLOR : TEXT_COLOR,
                    textTransform: "uppercase",
                    textShadow:
                        "3px 3px 0px rgba(0, 0, 0, 1), -3px -3px 0px rgba(0, 0, 0, 1), 3px -3px 0px rgba(0, 0, 0, 1), -3px 3px 0px rgba(0, 0, 0, 1)",
                    WebkitTextStroke: "2px black",
                    paintOrder: "stroke fill",
                    letterSpacing: "0.02em",
                    display: "inline-block",
                };

                return (
                    <span key={`${w.word}-${i}`} style={wordStyle}>
                        {w.word.toUpperCase()}
                    </span>
                );
            })}
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
        (g) => currentTime >= g.start && currentTime < g.end + 0.1,
    );

    if (!activeGroup) {
        return null;
    }

    const overlayStyle: CSSProperties = {
        position: "absolute",
        bottom: "20%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    };

    return (
        <div style={overlayStyle}>
            <WordGroup words={activeGroup.words} />
        </div>
    );
}
