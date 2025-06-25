

import Swiper from "swiper";
import { SwiperOptions } from "swiper/types/swiper-options";

import dom from "js/libs/DOM";

import { Pagination } from "swiper/modules";

const SLIDER_SELECTOR = ".js-block-icons-slider";
const PAGINATION_SELECTOR = ".swiper-pagination";

const getOptions = (): SwiperOptions => {
    return {
      slidesPerView: 1,
      loop: true,
      pagination: {
          clickable: true,
          el: PAGINATION_SELECTOR,
      },
      allowTouchMove: true,
      spaceBetween: 16,
      modules: [Pagination],
      breakpoints: {
      1024: {
        slidesPerView: 3,
      },
      568: {
        slidesPerView: 2,
      },
    },
    };
};

export const initIconsBlockSwiper = () => {
    dom(SLIDER_SELECTOR).each(iconsBlockSwiper);
};

const iconsBlockSwiper = (wrap: HTMLElement) => {

    const swiper = new Swiper(wrap, getOptions());
};
