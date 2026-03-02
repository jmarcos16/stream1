import { Composition } from "remotion";

import { SubtitleOverlay } from "./Subtitles/SubtitleOverlay";
import type { WordTimestamp } from "./Subtitles/types";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

const defaultWords: WordTimestamp[] = [
    { word: "Hello", start: 0, end: 0.5 },
    { word: "world", start: 0.5, end: 1.0 },
];

export function RemotionRoot() {
    return (
        <Composition
            id="SubtitleOverlay"
            component={SubtitleOverlay}
            durationInFrames={FPS * 10}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{
                videoSrc: "",
                words: defaultWords,
                durationInFrames: FPS * 10,
                fps: FPS,
                width: WIDTH,
                height: HEIGHT,
            }}
        />
    );
}
