FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY remotion/ remotion/
COPY public/Montserrat-Black.ttf public/Montserrat-Black.ttf

ENTRYPOINT ["npx", "tsx", "remotion/render-subtitles.mts"]
