import Swiper from "swiper";
import { SwiperOptions } from "swiper/types/swiper-options";

import dom from "js/libs/DOM";
import { query, queryList } from "js/utils";
import { EffectFade, Pagination } from "swiper/modules";

const SLIDER_SELECTOR = ".js-computing-systems-slider";
const PAGINATION_SELECTOR = ".swiper-pagination";

const getOptions = (): SwiperOptions => {
    return {
      slidesPerView: 1,
      loop: false,
      effect: 'fade',
      fadeEffect: {
          crossFade: true
      },  
      pagination: {
          clickable: true,
          el: PAGINATION_SELECTOR,
      },
      allowTouchMove: false,
      modules: [Pagination, EffectFade],
    };
};

export const initComputingSystemsSwiper = () => {
    dom(SLIDER_SELECTOR).each(computingSystemsSwiper);
};

const computingSystemsSwiper = (wrap: HTMLElement) => {

    const swiper = new Swiper(wrap, getOptions());
};
