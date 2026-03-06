import fs from "node:fs";
import path from "node:path";

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const videoPath = args.find((a) => a.startsWith("--video="))?.split("=")[1];
const wordsPath = args.find((a) => a.startsWith("--words="))?.split("=")[1];
const outputPath = args.find((a) => a.startsWith("--output="))?.split("=")[1];
const durationStr = args.find((a) => a.startsWith("--duration="))?.split("=")[1];
const chromePath = args.find((a) => a.startsWith("--chrome="))?.split("=")[1];
const subtitleStyle = args.find((a) => a.startsWith("--style="))?.split("=")[1] || "bottom";

if (!videoPath || !wordsPath || !outputPath || !durationStr) {
    console.error("Usage: --video=<path> --words=<json> --output=<path> --duration=<seconds> [--style=<bottom|center>] [--chrome=<path>]");
    process.exit(1);
}

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;
const duration = parseFloat(durationStr);
const durationInFrames = Math.ceil(duration * FPS);

const words = JSON.parse(fs.readFileSync(wordsPath, "utf-8"));

const absoluteVideoPath = path.resolve(videoPath);
const videoDir = path.dirname(absoluteVideoPath);
const videoFileName = path.basename(absoluteVideoPath);

const fontSource = path.resolve(import.meta.dirname, "..", "public", "Montserrat-Black.ttf");
const fontDest = path.join(videoDir, "Montserrat-Black.ttf");

if (!fs.existsSync(fontDest)) {
    fs.copyFileSync(fontSource, fontDest);
}

const entryPoint = path.resolve(import.meta.dirname, "src/index.ts");

const bundled = await bundle({ entryPoint, publicDir: videoDir });

const inputProps = {
    videoSrc: videoFileName,
    words,
    durationInFrames,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    style: subtitleStyle,
};

const composition = await selectComposition({
    serveUrl: bundled,
    id: "SubtitleOverlay",
    inputProps,
    ...(chromePath ? { chromiumExecutable: chromePath } : {}),
});

composition.durationInFrames = durationInFrames;
composition.fps = FPS;
composition.width = WIDTH;
composition.height = HEIGHT;

await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    concurrency: 1,
    offthreadVideoCacheSizeInBytes: 512 * 1024 * 1024,
    ...(chromePath ? { chromiumExecutable: chromePath } : {}),
});

console.log(`Rendered to ${outputPath}`);
