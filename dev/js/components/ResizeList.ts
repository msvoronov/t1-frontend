import dom from "js/libs/DOM";
import { Component } from "./utils/Component";

const RESIZE_LIST_SELECTOR = ".js-b-resize-list";
const RESIZE_WRAP_SELECTOR = ".js-b-resize-wrap";
const ITEM_SELECTOR = ".js-b-list-item";
const TRIGGER_SELECTOR = ".js-b-trigger";

const MAX_DATA_ATR = "data-max";



export const initResizeList = () => {
    dom(RESIZE_LIST_SELECTOR).each((wrap: HTMLElement) => {
        new ResizeList(wrap);
    })
}

class ResizeList extends Component {

    private listWrap: HTMLElement;
    private trigger: HTMLElement;

    private isOpen: boolean;

    private maxItems: number;


    private items: Array<HTMLElement>;

    constructor(wrap: HTMLElement) {
        super(wrap);

        this.wrap = wrap;

        this.listWrap = this.query(RESIZE_WRAP_SELECTOR, this.wrap);
        this.trigger = this.query(TRIGGER_SELECTOR, this.wrap);

        this.items = this.queryList(ITEM_SELECTOR, this.listWrap);

        this.isOpen = false;

        this.maxItems = Number(this.wrap.getAttribute(MAX_DATA_ATR));


        this.initComponent();
    }

    private initComponent = () => {
        this.updateHeight();
        this.initToggle();
        this.initResize();
    }
    
    private initToggle = () => {
        this.trigger.addEventListener("click", this.handleToggle);
    }

    private handleToggle = () => {
        this.isOpen = !this.isOpen;
        this.trigger.style.display = "none";
        this.updateHeight();
    }

    private updateHeight = () => {
        const gap = 0;
        // const gap = innerWidth >= 1024 ? 48 : 24;
        let length = this.isOpen ? this.items.length : this.maxItems;
        let height = 0;

        for(let i=0; i < length; i++) {
            this.getRect(this.items[i])
            height += this.getRect(this.items[i]).height
        }

        height += gap * (length - 1);

        this.listWrap.style.height = `${height}px`;
    }

    private initResize = () => {
        window.addEventListener("resize", this.updateHeight);
    }
}