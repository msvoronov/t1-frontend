import Swiper from "swiper";
import { Pagination, EffectFade } from 'swiper/modules';

import dom from "js/libs/DOM";
import { Component } from "js/components/utils/Component";

const SLIDER_SELECTOR = ".js-block-blue-slider";
const TABS_SELECTOR = ".js-b-tabs-switch__tab";
const MOB_TABS_SELECTOR = ".js-b-tabs-switch__mob-tab";
const TAB_BG_SELECTOR = ".js-b-tabs-switch__tab-bg";

const PAGINATION_SELECTOR = ".swiper-pagination";

const ACTIVE_CLASS = "active";

const PAGINATION_MARGIN_TOP = 12;

const INITIAL_TAB = 0;

const swiperOptions = {
    id: 'blue',
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
}

export const initBlueSlider = () => {
    dom(SLIDER_SELECTOR).each((wrap) => {
        new BlueSlider(wrap);
    });
}

class BlueSlider extends Component {

    private tabs: Array<HTMLElement>;
    private mobTabs: Array<HTMLElement>;
    private bgTab: HTMLElement;

    private swiper: Swiper;
    private pagination: HTMLElement;

    constructor(wrap: HTMLElement) 
    {
        super(wrap);
    
        this.wrap = wrap;


        this.tabs = this.queryList(TABS_SELECTOR, wrap.parentElement);
        this.mobTabs = this.queryList(MOB_TABS_SELECTOR, wrap.parentElement);
        this.bgTab = this.query(TAB_BG_SELECTOR, wrap.parentElement);

        this.swiper = new Swiper(wrap, swiperOptions);
        this.pagination = this.query(PAGINATION_SELECTOR, wrap);

        this.initComponent();
    }

    private initComponent = () => {
        this.initMobTabs();
        this.initUpdateTabsOnSlide();
        this.initSlideOnTab();
        this.updateBgWrapSize();
        this.initUpdatePaginationSize();


        window.addEventListener("load", this.updatePaginationSize)
    }

    private initMobTabs = () => {
        this.mobTabs.forEach((tab, index) => {
            tab.addEventListener("click", () => {
                this.swiper.slideTo(index)
                this.updateBgWrapSize();
            })
        })
    }

    private initSlideOnTab = () => {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener("click", () => {
                this.swiper.slideTo(index)
                this.updateBgWrapSize();
            })
        })
    }

    private initUpdateTabsOnSlide = () => {
        this.swiper.on("slideChangeTransitionStart", this.updateBgWrapSize);
    }

    private updateBgWrapSize = () => {
        if (!this.bgTab) return;
        
        let activeTab = this.tabs[this.swiper.activeIndex];
        let activeMobTab = this.mobTabs[this.swiper.activeIndex];

        this.tabs.forEach((item) => {
            this.removeClass(item, ACTIVE_CLASS);
        })
        this.mobTabs.forEach((item) => {
            this.removeClass(item, ACTIVE_CLASS);
        })

        this.setClass(activeTab, ACTIVE_CLASS);
        this.setClass(activeMobTab, ACTIVE_CLASS);

        const { width } = activeTab.getBoundingClientRect();
    
        this.bgTab.style.left = `${activeTab.offsetLeft}px`;
        this.bgTab.style.width = `${width}px`;
    };

    private initUpdatePaginationSize = () => {
        
        this.swiper.on("slideChange", this.updatePaginationSize);
        
        window.addEventListener("resize", this.updatePaginationSize);
        this.updatePaginationSize();
    }

    private updatePaginationSize = () => {
        const currentSlide = this.swiper.slides[this.swiper.activeIndex];
        const currentSlideHeight = currentSlide.getBoundingClientRect().height;
    
        this.pagination.style.top = `${currentSlideHeight}px`;
    }

}
