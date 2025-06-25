import Swiper from "swiper";
import { SwiperOptions } from "swiper/types/swiper-options";
import { Pagination } from 'swiper/modules';
import dom from "js/libs/DOM";
import { query, queryList } from "js/utils";

const SLIDER_SELECTOR = ".js-block-pluses-slider";
const PAGINATION_SELECTOR = ".swiper-pagination";

const getOptions = (): SwiperOptions => {
    return {
        modules: [Pagination],
        freeMode: true,
        loop: true,
        spaceBetween: 16,
        slidesPerView: 1,
        pagination: {
          clickable: true,
          el: PAGINATION_SELECTOR,
        },
        breakpoints: {
        568: {
          slidesPerView: 2,
        },

      },
    };
};

export const initBlockPlusesSlider = () => {
    dom(SLIDER_SELECTOR).each(blockPlusesSlider);
};

const blockPlusesSlider = (wrap: HTMLElement) => {
  const swiper = new Swiper(wrap, getOptions());

  
};
