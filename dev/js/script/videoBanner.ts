import dom from "js/libs/DOM"
import { query } from "js/utils";

const VIDEO_BANNER_SELECTOR = ".js-banner-video";

export const initVideoBanner = () => {
  dom(VIDEO_BANNER_SELECTOR).each((wrap) => {
    videoBanner(wrap);
  })
}

const videoBanner = (wrap: HTMLElement) => {
  const video = query('video', wrap) as HTMLVideoElement;


  setTimeout(() => {
    video.dispatchEvent(new Event('click'));
  }, 1000)
}