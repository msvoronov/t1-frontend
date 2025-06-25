import {
    callCustomEvent,
    deleteFromMapStorage,
    dispatchEvents,
    getFromMapStorage,
    setToMapStorage,
} from "js/utils";
import Async from "../utils/Debounce";
import { hasClass } from "js/libs/DOM/fn";

const DROPDOWN_TRIGGER_SELECTOR = ".dropdown-trigger";
const DROPDOWN_LIST_SELECTOR = ".dropdown-list";
const DROPDOWN_LIST_ITEM_SELECTOR = ".dropdown-list-item";

const HEIGHT_DROPDOWN_CLASS = "height-dropdown";
const DROPDOWN_HOVER = "dropdown-hover";
const SUBMENU_DROPDOWN_CLASS = "submenu-dropdown";
const ACTIVE_CLASS = "active";
const DISABLED_CLASS = "disabled";
const SELECTED_CLASS = "selected";

const NAV_LIST_SELECTOR = ".nav__list";

const INSTANCES = new Map();

export const dropdown = (el: HTMLElement) => {
    const existedInstance = getDropdownInstance(el);

    if (existedInstance) {
        return existedInstance;
    }

    return new Dropdown(el).initial();
};

export const getDropdownInstance = (el: HTMLElement): Dropdown => {
    return getFromMapStorage(INSTANCES, el);
};

interface DropdownCallbacks {
    before?: (instance: Dropdown) => void;
    after?: (instance: Dropdown) => void;
}

export class Dropdown {
    el: HTMLElement;
    trigger: HTMLElement;
    list: HTMLElement;
    isHeightAnim: Boolean;
    listItems: any;
    navWrap: HTMLElement;
    breakpoint: number;

    constructor(el: HTMLElement) {
        this.el = el as HTMLElement;
        this.trigger = el.querySelector(DROPDOWN_TRIGGER_SELECTOR);
        this.list = el.querySelector(DROPDOWN_LIST_SELECTOR);
        this.listItems = el.querySelectorAll(DROPDOWN_LIST_ITEM_SELECTOR);
        this.isHeightAnim = el.classList.contains(HEIGHT_DROPDOWN_CLASS);
        this.navWrap = this.el.closest(NAV_LIST_SELECTOR);
        this.breakpoint = Number(this.el.dataset.breakpoint);
    }
    
    initial() {
        this.init();
        this.addToggleBreakpointListener();

        return this;
    }

    init() {
        if (this.trigger?.classList.contains(DROPDOWN_HOVER)) {
            this.el.addEventListener("mouseenter", this.onTriggerClick);
            this.el.addEventListener("mouseleave", this.closeMouseLeave);
        } else {
            this.trigger?.addEventListener("click", this.onTriggerClick);
        }

        document.addEventListener("click", this.clickOnDocument);
        window.addEventListener("scroll", this.scrollDocument);

        this.listItems.forEach((item) => {
            item.addEventListener("click", this.closeOnClick);
        });

        setToMapStorage(INSTANCES, this.el, this);

        return this;
    }

    destroy() {
        if (this.isActive()) {
            this.close(true);
        }

        this.trigger.removeEventListener("click", this.onTriggerClick);
        this.el.removeEventListener("mouseenter", this.onTriggerClick);
        this.el.removeEventListener("mouseleave", this.closeMouseLeave);
        document.removeEventListener("click", this.clickOnDocument);
        window.removeEventListener("scroll", this.scrollDocument);

        deleteFromMapStorage(INSTANCES, this.el);
    }

    open(silent = false, callbacks: DropdownCallbacks = {}) {
        if (this.isDisabled()) return;

        callCustomEvent(callbacks, "before", this);

        this.el.classList.add(ACTIVE_CLASS);

        if (!this.el.classList.contains(SUBMENU_DROPDOWN_CLASS)) {
            this.navWrap?.classList.add(SELECTED_CLASS);
        }

        if (this.isHeightAnim) {
            this.list.style.height = `${this.list.scrollHeight}px`;
        }

        callCustomEvent(callbacks, "after", this);
        this.dispatch(this.el, "after-open", silent);
    }

    close(silent = false, callbacks: DropdownCallbacks = {}) {
        if (this.isDisabled()) return;

        callCustomEvent(callbacks, "before", this);

        this.el.classList.remove(ACTIVE_CLASS);

        if (!this.el.classList.contains(SUBMENU_DROPDOWN_CLASS)) {
            this.navWrap?.classList.remove(SELECTED_CLASS);
        }

        if (this.isHeightAnim) {
            this.list.style.height = `0px`;
        }

        callCustomEvent(callbacks, "after", this);
        this.dispatch(this.el, "after-close", silent);
    }

    toggle(silent = false, callbacks: DropdownCallbacks = {}) {
        if (this.isActive()) {
            this.close(silent, callbacks);
        } else {
            this.open(silent, callbacks);
        }
    }

    disable() {
        if (this.isDisabled()) return;

        if (this.isActive()) {
            this.close(true);
        }

        this.el.classList.add(DISABLED_CLASS);
    }

    undisable() {
        if (!this.isDisabled()) return;

        this.el.classList.remove(DISABLED_CLASS);
    }

    isActive() {
        return this.el.classList.contains(ACTIVE_CLASS);
    }

    isDisabled() {
        return this.el.classList.contains(DISABLED_CLASS);
    }

    private toggleByBreakpoint = () => {
        const existedInstance = getDropdownInstance(this.el);

        if (window.innerWidth < this.breakpoint && existedInstance) {
            this.destroy();
        } else if (window.innerWidth >= this.breakpoint && !existedInstance) {
            this.init();
        }
    };

    private addToggleBreakpointListener = () => {
        if (!this.breakpoint) return;
        this.toggleByBreakpoint();

        window.addEventListener(
            "resize",
            Async.debounce(this.toggleByBreakpoint, 100)
        );
    };

    private onTriggerClick = (e: MouseEvent) => {
        this.toggle();
    };

    private clickOnDocument = (e: Event) => {
        if (this.isDisabled()) return;

        const target = e.target as HTMLElement;
        const isEl = target === this.el || this.el.contains(target);

        if (!isEl && this.isActive()) {
            this.close();
        }
    };
    private scrollDocument = (e: Event) => {
        if (this.isDisabled()) return;
        if (hasClass(this.el, "footer-nav__item")) return;

        const target = e.target as HTMLElement;
        const isEl = target === this.el || this.el.contains(target);

        if (!isEl && this.isActive()) {
            this.close();
        }
    };

    private closeOnClick = (e: Event) => {
        if (this.isDisabled()) return;

        if (this.isActive()) {
            this.close();
        }
    };

    private dispatch(el: HTMLElement, ev: string, silent: boolean) {
        if (silent) return;
        dispatchEvents(el, ev, { detail: this });
    }

    private closeMouseLeave = (e: Event) => {
        this.close();
    };
}
