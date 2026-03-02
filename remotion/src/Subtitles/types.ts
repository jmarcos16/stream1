export type WordTimestamp = {
    word: string;
    start: number;
    end: number;
};

export type SubtitleOverlayProps = {
    videoSrc: string;
    words: WordTimestamp[];
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
};
