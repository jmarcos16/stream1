import { continueRender, delayRender, staticFile } from "remotion";

export const MontserratBlack = "MontserratBlack";

let loaded = false;

export const loadFont = async (): Promise<void> => {
    if (loaded) {
        return Promise.resolve();
    }

    const waitForFont = delayRender();
    loaded = true;

    const font = new FontFace(
        MontserratBlack,
        `url('${staticFile("Montserrat-Black.ttf")}') format('truetype')`,
    );

    await font.load();
    document.fonts.add(font);
    continueRender(waitForFont);
};
