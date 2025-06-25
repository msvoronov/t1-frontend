import { Component } from "js/components/utils/Component";
import dom from "js/libs/DOM";

const TAB_SELECTOR = ".js-tabs";
const TAB_TRIGGER_SELECTOR = ".js-tab-trigger";
const TAB_ITEM_SELECTOR = ".js-tab-item";

const CONTAINER_SELECTOR = ".js-tabs__container";

const INITIAL_TAB_DATA_ATR = "data-initial";

const ACTIVE_CLASS = "active-tab";
const TAB_ALWAYS_OPEN_CLASS = "js-tabs-always-open";

export const initSimpleTabs = () => {
    dom(TAB_SELECTOR).each((wrap: HTMLElement) => {
        new Tabs(wrap);
    });
};

class Tabs extends Component {
    private tabWrap: HTMLElement;
    private tabTriggersList: Array<HTMLElement>;
    private tabItemsList: Array<HTMLElement>;

    private targetWrap: HTMLElement;

    private isAlwaysOpen: boolean;

    constructor(wrap: HTMLElement) {


        super(wrap);

        this.tabWrap = wrap;

        this.targetWrap = this.query(CONTAINER_SELECTOR, this.tabWrap)

        this.tabTriggersList = this.queryList(
            TAB_TRIGGER_SELECTOR,
            this.tabWrap
        );

        this.isAlwaysOpen = this.hasClass(this.wrap, TAB_ALWAYS_OPEN_CLASS);

        this.tabItemsList = this.queryList(TAB_ITEM_SELECTOR, this.tabWrap);


        this.initComponent();
    }

    private initComponent = () => {
        this.initSwitchTabs();
        this.initOpenedTabs();
        this.initResize();
    };

    private initOpenedTabs = () => {
        if (!this.isAlwaysOpen) {
            return
        }

        let initialIndex = this.wrap.getAttribute(INITIAL_TAB_DATA_ATR);

        this.setActiveTabs(initialIndex);
        const activeSlide = this.tabItemsList[initialIndex];
        this.updateContainerHeight(activeSlide);
    }

    private initResize = () => {
        window.addEventListener("resize", () => {
            let activeTab = this.getActiveTabItem()
            this.updateContainerHeight(activeTab)
        });
    }

    private initSwitchTabs = () => {
        this.tabTriggersList.forEach((trigger: HTMLElement) => {
            trigger.addEventListener("click", this.handleSwitch);
        });
    };

    private handleSwitch = (e: Event) => {
        const target = e.currentTarget as HTMLElement;

        if (this.isTabActive(target) && !this.isAlwaysOpen) {
            this.closeAllTabs();
            this.updateContainerHeight();
            return
        }


        let index = this.getIndex(target);

        const activeSlide = this.tabItemsList[index];

        this.updateContainerHeight(activeSlide);
        this.closeAllTabs();
        this.setActiveTabs(index);
    };

    private isTabActive = (target: HTMLElement) =>
        target.classList.contains(ACTIVE_CLASS) ? true : false;

    private setActiveTabs = (index) => {
        this.setActiveTrigger(index);
        this.setActiveItem(index);
    };

    private setActiveTrigger = (index: number) => {
        this.tabTriggersList[index]?.classList.add(ACTIVE_CLASS);
    };

    private setActiveItem = async (index: number) => {
        await this.delay(() => {
            this.tabItemsList[index]?.classList.add(ACTIVE_CLASS);
        });
    };

    private closeAllTabs = () => {
        this.closeAllTriggers();
        this.closeAllitems();
    };

    private closeAllTriggers = () => {
        this.tabTriggersList.forEach((trigger: HTMLElement) => {
            trigger.classList.remove(ACTIVE_CLASS);
        });
    };

    private closeAllitems = async () => {
        this.tabItemsList.forEach((item: HTMLElement) => {
            item.classList.remove(ACTIVE_CLASS);
        });
    };

    private getIndex = (el: HTMLElement) => {
        return el.dataset.index;
    };

    private updateContainerHeight = async (
        activeSlide?: HTMLElement,
        focus = true
    ) => {

        if (!activeSlide) {
            await this.delay(() => {
                this.targetWrap.removeAttribute("style");
            });
            return
        }

        const { height } = activeSlide.getBoundingClientRect();

        await this.delay(() => {
            this.targetWrap.style.height = `${height}px`;
        });
    };

    private getActiveTabItem = () => {
        return this.tabItemsList.find((item) => {
            return this.hasClass(item, ACTIVE_CLASS);
        })
    }
}
