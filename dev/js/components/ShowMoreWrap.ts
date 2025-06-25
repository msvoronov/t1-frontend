import dom from "js/libs/DOM"
import { Component } from "./utils/Component";

const SHOW_MORE_WRAP_SELECTOR = ".js-show-more";
const TRIGGER_SELECTOR = ".js-trigger";
const RESIZABLE_WRAP_SELECTOR = ".js-resizable-wrap";
const CARD_SELECTOR = ".js-card";

const HIDDEN_CLASS = "hidden";

const VISABLE_COUNT_DATA_ATR = "data-visable-count";

const GAP = 24;

export const initShowMoreWrap = () => {
  dom(SHOW_MORE_WRAP_SELECTOR).each((wrap) => {
    new ShowMoreWrap(wrap);
  })
}

class ShowMoreWrap extends Component {

  trigger: HTMLElement;
  resizaleWrap: HTMLElement;

  inRowCount: number;

  visableCount: number;

  cards: Array<HTMLElement>;

  isOpen: boolean;

  gap: number;

  constructor(wrap: HTMLElement) {
    super(wrap);

    this.wrap = wrap;

    this.inRowCount = innerWidth > 1024 ? 3 : (innerWidth > 576 ? 2 : 1);

    this.isOpen = false;

    this.visableCount = Number(wrap.getAttribute(VISABLE_COUNT_DATA_ATR));

    this.trigger = this.query(TRIGGER_SELECTOR, this.wrap);
    this.resizaleWrap= this.query(RESIZABLE_WRAP_SELECTOR, this.wrap);

    this.cards = this.queryList(CARD_SELECTOR, this.wrap);

    this.gap = innerWidth >= 1024 ? 48 : 24;

    this.initComponent();

  }

  initComponent = () => {
    this.setHeight();
    this.initTrigger();
    this.initResize();
  }

  setHeight = () => {
    if(this.cards.length <= this.visableCount) {
      this.hideTrigger();
      return;
    }

    const visableHeight = this.getVisibleHeigth();
    this.resizaleWrap.style.height = `${visableHeight}px`
  }

  hideTrigger = () => {
    this.setClass(this.trigger, HIDDEN_CLASS);
  }

  getVisibleHeigth = () => {
    let result = 0;

    const rowsToShow = Math.ceil(this.visableCount / this.inRowCount);

    for(let i = 0; i < rowsToShow; i++) {

      const rowItemsHeight: number[] = [];

      for(let j = 0; j < this.inRowCount; j++) {
        if(!this.cards[i * this.inRowCount]) continue;

        rowItemsHeight.push(this.cards[i * this.inRowCount].getBoundingClientRect().height);
      }

      result += Math.max(...rowItemsHeight)
    }

    result += this.gap * (rowsToShow - 1);

    return result;
  }

  initTrigger = () => {
    this.trigger.addEventListener("click", this.handleClick);
  }

  handleClick = () => {
    this.resizaleWrap.style.height = `${this.resizaleWrap.scrollHeight}px`;
    this.isOpen = true
    this.hideTrigger();

    setTimeout(() => {
      this.resizaleWrap.removeAttribute("style");
    }, 600)
  }

  initResize = () => {
    window.addEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    if(this.isOpen) return;
    this.gap = innerWidth >= 1024 ? 48 : 24;
    this.inRowCount = innerWidth > 1024 ? 3 : (innerWidth > 576 ? 2 : 1);
    this.setHeight();
  }
}