import dom from "js/libs/DOM";
import { Context } from "js/libs/DOM/types";
import { Component } from "./utils/Component";
import { Ajax } from "./utils/Ajax";


const BLOG_LIST_SELECTOR = ".js-b-blog-list";
const BLOG_WRAP_SELECTOR = ".js-b-blog-wrap";
const BLOG_TRIGGER_SELECTOR = ".js-b-blog-trigger";

const AJAX_DATA_ATR = "data-ajax"; 

const LOADING_CLASS = "loading";

export const initBlogList = (context: Context) => {
    dom(BLOG_LIST_SELECTOR).each((wrap) => {
        new BlogList(wrap);
    })
}

class BlogList extends Component {

    private listWrap: HTMLElement;
    private trigger: HTMLElement;

    constructor(wrap: HTMLElement) {
        super(wrap);

        this.wrap = wrap;

        this.listWrap = this.query(BLOG_WRAP_SELECTOR, this.wrap);
        this.trigger = this.query(BLOG_TRIGGER_SELECTOR, this.wrap);

        this.initComponent();
    }

    private initComponent = () => {
        this.initLoadMore();
    }

    private initLoadMore = () => {
        this.trigger.addEventListener("click", this.handleTrigger);
    }

    private appendHtml = (html: string) => {
        this.listWrap.insertAdjacentHTML("beforeend", html);
    }

    private handleTrigger = async () => {

        const url = this.trigger.getAttribute(AJAX_DATA_ATR);
        
        const ajax = Ajax.init(url);

        this.setClass(this.wrap, LOADING_CLASS);

        //TO DO: Передалать на запрос
        
        try {
            const res = await ajax.request();
            if (typeof res !== "string" || !res) {
                throw "";
            }
            this.appendHtml(res);
            
            
        } catch(err) {
            
        } finally {
            this.removeClass(this.wrap, LOADING_CLASS);
        }
    }

    
}
