import dom from "./DOM";

export const horScroll = (context) => {
    window.addEventListener("load", () => {
        dom(".js-hor-slider", context).each((slider: HTMLElement) => {
            initSlider(slider);
        });
    });
};

const initSlider = (slider) => {
    setTimeout(() => {
        initSticky(slider);
        initScrollHeight(slider);
        initTranslate(slider);
    }, 400);
};

const initScrollHeight = (slider) => {
    let slides = slider.querySelectorAll(".js-slide-item") as Array<
        HTMLElement
    >;
    let col = slider.querySelector(".js-slider-col") as HTMLElement;

    if (!slides || !slides.length || !col) {
        return;
    }

    setColHeight(slides, col);

    let timer = null;

    window.addEventListener("resize", (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setColHeight(slides, col);
        }, 20);
    });
};

const setColHeight = (slides: Array<HTMLElement>, col: HTMLElement) => {
    let fullWidth = 0;

    slides.forEach((el: HTMLElement) => {
        fullWidth += Number(el.getBoundingClientRect().width);
    });

    setStyle(col, `height: ${fullWidth}px;`);
};

const initTranslate = (slider: HTMLElement) => {
    let outher = slider.querySelector(".js-slider-outher") as HTMLElement;
    let lastSlide = slider.querySelector(".js-last-slide") as HTMLElement;
    let sliderCol = slider.querySelector(".js-slider-col") as HTMLElement;
    let sliderSticky = slider.querySelector(".js-slider-sticky") as HTMLElement;

    if (!outher || !lastSlide || !sliderCol || !sliderSticky) {
        return;
    }

    setTranslate(outher, lastSlide, sliderCol, sliderSticky);

    window.addEventListener("scroll", (e) => {
        setTranslate(outher, lastSlide, sliderCol, sliderSticky);
    });

    let resizeTimer = null;

    window.addEventListener("resize", (e) => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            setTranslate(outher, lastSlide, sliderCol, sliderSticky);
        }, 20);
    });
};

const setTranslate = (
    outher: HTMLElement,
    lastSlide: HTMLElement,
    sliderCol: HTMLElement,
    sliderSticky: HTMLElement
) => {
    let currentScroll = Number(sliderCol.getBoundingClientRect().top);
    let maxTranslate = setMaxtranslate(
        outher.offsetWidth,
        lastSlide.offsetWidth
    );
    let maxScroll = Number(sliderCol.offsetHeight - sliderSticky.offsetHeight);

    // экран выше области прокрутки
    if (currentScroll > 0) {
        setTransform(outher, `translateX(${0}px)`);
        return;
    }

    // экран ниже области прокрутки
    if (Math.abs(currentScroll) > maxScroll) {
        setTransform(outher, `translateX(-${maxTranslate}px)`);
        return;
    }

    let translate = Math.round((currentScroll * maxTranslate) / maxScroll);

    setTransform(outher, `translateX(${translate}px)`);
};

const setMaxtranslate = (outherWidth: number, lastSlideWidth: number) => {
    if (lastSlideWidth / window.innerWidth > 0.8) {
        return Number(outherWidth - lastSlideWidth / 2);
    } else if (
        window.innerWidth < lastSlideWidth &&
        window.innerWidth / (lastSlideWidth / 2) > 0.5
    ) {
        return Number(outherWidth - lastSlideWidth / 3);
    } else {
        return Number(outherWidth - lastSlideWidth);
    }
};

const initSticky = (slider: HTMLElement) => {
    let sticky = slider.querySelector(".js-slider-sticky") as HTMLElement;
    let sliderCol = slider.querySelector(".js-slider-col") as HTMLElement;

    if (!sticky || !sliderCol) {
        return;
    }

    maybeSticky(sticky, sliderCol, false);

    let resizeTimer = null;

    window.addEventListener("scroll", (e) => {
        maybeSticky(sticky, sliderCol, true);
    });

    window.addEventListener("resize", (e) => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            maybeSticky(sticky, sliderCol, true);
        }, 20);
    });
};

const maybeSticky = (
    sticky: HTMLElement,
    sliderCol: HTMLElement,
    force: boolean = false
) => {
    let timer = 0;
    force === false ? (timer = 400) : (timer = 0);

    setTimeout(() => {
        let scroll = sliderCol.getBoundingClientRect().top;
        let absScroll = Math.abs(scroll);
        let maxScroll = sliderCol.offsetHeight - sticky.offsetHeight;

        // экран ниже области прокрутки
        if (absScroll > maxScroll) {
            if (force) {
                sticky.classList.remove("is-sticked");
                setStyle(
                    sticky,
                    `position: static; width: auto; margin-top: auto;`
                );
            } else if (sticky.classList.contains("is-sticked")) {
                sticky.classList.remove("is-sticked");
                setStyle(
                    sticky,
                    `position: static; width: auto; margin-top: auto;`
                );
            }
            return;
        }

        if (force) {
            if (!sticky.classList.contains("is-sticked")) {
                sticky.classList.add("is-sticked");
            }
            setStickyStyle(sticky);
        } else {
            if (!sticky.classList.contains("is-sticked")) {
                sticky.classList.add("is-sticked");
                setStickyStyle(sticky);
            }
        }

        // экран выше области прокрутки
        if (scroll > 0) {
            if (force) {
                sticky.classList.remove("is-sticked");
                setStyle(sticky, null);
            } else if (sticky.classList.contains("is-sticked")) {
                sticky.classList.remove("is-sticked");
                setStyle(sticky, null);
            }
            return;
        }
    }, timer);
};

const setStickyStyle = (item: HTMLElement) => {
    item.style.position = `static`;
    setStyle(
        item,
        `
    position: fixed; 
    top: 0px; 
    left: ${Math.round(item.getBoundingClientRect().left)}px; 
    width: ${Math.round(item.offsetWidth)}px;
    `
    );
};

const setTransform = (item: HTMLElement, transform: string) => {
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
            item.style.transform = transform;
        });
    } else {
        item.style.transform = transform;
    }
};

const setStyle = (item: HTMLElement, style: string) => {
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
            if (!style) {
                item.removeAttribute("style");
            } else {
                item.style.cssText = style;
            }
        });
    } else {
        if (!style) {
            item.removeAttribute("style");
        } else {
            item.style.cssText = style;
        }
    }
};
