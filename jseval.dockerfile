
FROM node:15.14-buster

#
# playwright dependencies
#

RUN apt-get update && apt-get install -y --no-install-recommends \
    libwoff1 \
    libopus0 \
    libwebp6 \
    libwebpdemux2 \
    libenchant1c2a \
    libgudev-1.0-0 \
    libsecret-1-0 \
    libhyphen0 \
    libgdk-pixbuf2.0-0 \
    libegl1 \
    libnotify4 \
    libxslt1.1 \
    libevent-2.1-6 \
    libgles2 \
    libvpx5 \
    libxcomposite1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libepoxy0 \
    libgtk-3-0 \
    libharfbuzz-icu0

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgstreamer-gl1.0-0 \
    libgstreamer-plugins-bad1.0-0 \
    gstreamer1.0-plugins-good \
    gstreamer1.0-libav

RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    libxtst6

RUN apt-get update && apt-get install -y --no-install-recommends \
    libdbus-glib-1-2 \
    libxt6

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg

RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb

RUN mkdir -p /share
ENV PLAYWRIGHT_BROWSERS_PATH /share
WORKDIR $PLAYWRIGHT_BROWSERS_PATH

#
# install node packages
#

COPY package.json ./
RUN npm install
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD true

#
# run
#

COPY jseval.js ./
ENTRYPOINT [ "node", "./jseval.js" ]
