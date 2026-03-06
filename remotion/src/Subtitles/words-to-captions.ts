import type { Caption } from "@remotion/captions";

import type { WordTimestamp } from "./types";

/**
 * Convert our words.json format (from OpenAI Whisper) to Remotion Caption[].
 * Adds a leading space before each word (except the first) as required by @remotion/captions.
 */
export function wordsToCaptions(words: WordTimestamp[]): Caption[] {
    return words.map((w, i) => ({
        text: i === 0 ? w.word : ` ${w.word}`,
        startMs: Math.round(w.start * 1000),
        endMs: Math.round(w.end * 1000),
        timestampMs: Math.round(((w.start + w.end) / 2) * 1000),
        confidence: null,
    }));
}
