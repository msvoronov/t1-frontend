import Swiper from "swiper";
import { SwiperOptions } from "swiper/types/swiper-options";

import dom from "js/libs/DOM";
import { query, queryList } from "js/utils";

const SLIDER_SELECTOR = ".js-nav-swiper";

const getOptions = (): SwiperOptions => {
    return {
        freeMode: true,
        spaceBetween: 5,

        slidesPerView: "auto",
        resistance: true,
        resistanceRatio: 0.5,
    };
};

export const initNavSwiper = () => {
    dom(SLIDER_SELECTOR).each(navSwiper);
};

const navSwiper = (wrap: HTMLElement) => {
    const slides = queryList(".swiper-slide", wrap);
    const tabs = queryList(".swiper-slide .js-c-tag__item--mob", wrap);
    const activaTab =
        query(".b-menu-gray__elem--active", wrap) ||
        tabs[0] ||
        null;

    const swiper = new Swiper(wrap, getOptions());
    
    const handleTabClick = (event: Event) => {
        const tab = event.currentTarget as HTMLElement;

        swipeToActive(tab);
    };

    const swipeToActive = (tab: HTMLElement) => {
        if(!tab) return;

        const slide = tab.closest<HTMLElement>(".swiper-slide");

        if (!slide) {
            return;
        }

        const index = slides.findIndex((el) => el === slide);


        swiper.slideTo(index);
    };

    tabs.forEach((el) => {
        el.addEventListener("click", handleTabClick);
    });

    swipeToActive(activaTab);
    
    swiper.on('slideChangeTransitionEnd', function (swiper) {
        swiper.slideTo(swiper.activeIndex);
    });
};
