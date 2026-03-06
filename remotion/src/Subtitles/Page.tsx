import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import type { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { MontserratBlack } from "../load-font";

const DESIRED_FONT_SIZE = 120;
const HIGHLIGHT_COLOR = "#39E508";

export function Page({
    enterProgress,
    page,
    style = 'bottom',
}: {
    enterProgress: number;
    page: TikTokPage;
    style?: 'bottom' | 'center';
}) {
    const frame = useCurrentFrame();
    const { width, fps } = useVideoConfig();
    const timeInMs = (frame / fps) * 1000;

    const fittedText = fitText({
        fontFamily: MontserratBlack,
        text: page.text,
        withinWidth: width * 0.9,
        textTransform: "uppercase",
    });

    const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

    // Para o estilo center, dividir em duas linhas
    if (style === 'center') {
        const words = page.tokens.map(t => t.text.trim());
        const midPoint = Math.ceil(words.length / 2);
        const firstLine = page.tokens.slice(0, midPoint);
        const secondLine = page.tokens.slice(midPoint);

        return (
            <div
                style={{
                    fontSize,
                    fontFamily: MontserratBlack,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: fontSize * 0.2,
                    transform: makeTransform([
                        scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
                        translateY(interpolate(enterProgress, [0, 1], [50, 0])),
                    ]),
                    opacity: enterProgress,
                }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: fontSize * 0.15 }}>
                    {firstLine.map((t, i) => {
                        const active =
                            t.fromMs - page.startMs <= timeInMs &&
                            t.toMs - page.startMs > timeInMs;

                        const wordStyle: CSSProperties = {
                            display: "inline-block",
                            color: active ? HIGHLIGHT_COLOR : "#FFFFFF",
                            WebkitTextStroke: "4px black",
                            paintOrder: "stroke fill",
                            textShadow:
                                "4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000",
                            transition: "color 0.05s",
                        };

                        return (
                            <span key={`${t.text}-${i}`} style={wordStyle}>
                                {t.text.trim()}
                            </span>
                        );
                    })}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: fontSize * 0.15 }}>
                    {secondLine.map((t, i) => {
                        const active =
                            t.fromMs - page.startMs <= timeInMs &&
                            t.toMs - page.startMs > timeInMs;

                        const wordStyle: CSSProperties = {
                            display: "inline-block",
                            color: active ? HIGHLIGHT_COLOR : "#FFFFFF",
                            WebkitTextStroke: "4px black",
                            paintOrder: "stroke fill",
                            textShadow:
                                "4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000",
                            transition: "color 0.05s",
                        };

                        return (
                            <span key={`${t.text}-${i}`} style={wordStyle}>
                                {t.text.trim()}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Estilo original (bottom)
    return (
        <div
            style={{
                fontSize,
                fontFamily: MontserratBlack,
                fontWeight: 900,
                textTransform: "uppercase",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: fontSize * 0.15,
                whiteSpace: "pre",
                transform: makeTransform([
                    scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
                    translateY(interpolate(enterProgress, [0, 1], [50, 0])),
                ]),
                opacity: enterProgress,
            }}
        >
            {page.tokens.map((t, i) => {
                const active =
                    t.fromMs - page.startMs <= timeInMs &&
                    t.toMs - page.startMs > timeInMs;

                const wordStyle: CSSProperties = {
                    display: "inline-block",
                    color: active ? HIGHLIGHT_COLOR : "#FFFFFF",
                    WebkitTextStroke: "4px black",
                    paintOrder: "stroke fill",
                    textShadow:
                        "4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000",
                    transition: "color 0.05s",
                };

                return (
                    <span key={`${t.text}-${i}`} style={wordStyle}>
                        {t.text.trim()}
                    </span>
                );
            })}
        </div>
    );
}
