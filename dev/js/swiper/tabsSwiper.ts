import Swiper from "swiper";
import { SwiperOptions } from "swiper/types/swiper-options";

import dom from "js/libs/DOM";
import { query, queryList } from "js/utils";

const SLIDER_SELECTOR = ".js-tabs-swiper";

const getOptions = (): SwiperOptions => {
    return {
        freeMode: true,
        spaceBetween: 5,

        slidesPerView: "auto",
        resistance: true,
        resistanceRatio: 0.5,
    };
};

export const initTagsSwiper = () => {
    dom(SLIDER_SELECTOR).each(tagsSwiper);
};

const tagsSwiper = (wrap: HTMLElement) => {
    const slides = queryList(".swiper-slide", wrap);
    const tabs = queryList(".swiper-slide .js-c-tag__item--mob", wrap);
    const activaTab =
        query(".b-menu-gray__elem--active", wrap) ||
        tabs[0] ||
        null;

    const swiper = new Swiper(wrap, getOptions());

    swiper.on('slideChange', function () {
    });
};
