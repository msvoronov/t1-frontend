import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { SwiperOptions } from "swiper/types/swiper-options";
import React from "js/libs/React";

import dom from "js/libs/DOM";
import { addClass, query, removeClass } from "js/utils";

const PAGINATION_MARGIN_TOP = 24;

const SLIDER_SELECTOR = ".js-culture-slider";
const CUSTOM_PAGINATION = ".js-custom-pagination";

const IMG_SELECTOR = ".b-block-culture-slider__item__img";

const PREV_ARROW_SELECTOR = ".swiper-button-prev"
const NEXT_ARROW_SELECTOR = ".swiper-button-next"

// let IS_PAG_INITED = false;

const getOptions = (): SwiperOptions => {
  return {
    modules: [Navigation],
    lazyPreloadPrevNext: 2,
    slidesPerView: 1,
    loop: true,
    spaceBetween: 10,
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: NEXT_ARROW_SELECTOR,
      prevEl: PREV_ARROW_SELECTOR,
    },

    breakpoints: {
      540: {
        slidesPerView: 3,
      },
    },
  };
};

export const initCultureSwiper = () => {
  dom(SLIDER_SELECTOR).each(cultureSwiper);
};

const cultureSwiper = (wrap: HTMLElement) => {
  const options = getOptions();

  const prevArrow = query(PREV_ARROW_SELECTOR, wrap);
  const nextArrow = query(NEXT_ARROW_SELECTOR, wrap);

  let swiper = new Swiper(wrap, options);

  const pagination = query(CUSTOM_PAGINATION, wrap.parentElement);
  let bullets = [];

  swiper.on("slideChange", (swiper) => {
    handleSlide(swiper.realIndex);
    handleResize();
  });

  const renderPagination = () => {
    const swiperLength = swiper.slides.length;
    let elements = [];

    for (let i = 0; i < swiperLength; i++) {
      elements.push(
        <div
          data-index={i}
          className={`custom-pagination-bullet${
            i === swiper.realIndex ? " active" : ""
          }`}
          onClick={() => {
            handleChange(i);
          }}
        ></div>
      );
    }

    pagination.innerHTML = "";

    bullets = [];

    elements.forEach((element) => {
      bullets.push(element);
      pagination.appendChild(element);
    });
  };

  const handleChange = (index: number) => {
    clearBullets();
    swiper.slideToLoop(index);
    resizeNavigationArrows();
  };

  const handleSlide = (index: number) => {
    clearBullets();

    bullets?.forEach((item: Element) => {
      parseInt(item.getAttribute("data-index")) == index &&
        addClass(item, "active");
    });
  };

  const clearBullets = () => {
    if (!bullets.length) return;

    bullets.forEach((item) => {
      removeClass(item, "active");
    });
  };

  const resizePaginationPosition = () => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    let maxHeigth: number;
    if (innerWidth >= 540) {
      maxHeigth = getMaxHeight(
        swiper.slides[swiper.activeIndex].getBoundingClientRect().height,
        swiper.slides[swiper.activeIndex + 1].getBoundingClientRect().height,
        swiper.slides[swiper.activeIndex + 2].getBoundingClientRect().height
      );
    }

    if (innerWidth < 540) {
      maxHeigth = currentSlide.getBoundingClientRect().height;
    }

    pagination.style.top = `${maxHeigth + PAGINATION_MARGIN_TOP}px`;
  };

  const resizeNavigationArrows = () => {
    if (!prevArrow || !nextArrow) return;

      const imgSize = wrap
        .querySelector(IMG_SELECTOR)
        .getBoundingClientRect().height;

    prevArrow.style.height = `${imgSize}px`
    nextArrow.style.height = `${imgSize}px`
  }

  const getMaxHeight = (...args: Array<number>) => {
    return Math.max(...args);
  };

  if (options.pagination && pagination ) {
    // IS_PAG_INITED = true;
    renderPagination();
  }

  const handleResize = () => {
    // resizePaginationPosition();
    resizeNavigationArrows();
  }

  handleResize();

  window.addEventListener("resize", handleResize);
};
