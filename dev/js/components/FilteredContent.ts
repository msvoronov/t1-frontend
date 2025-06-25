import dom from "js/libs/DOM";
import { Component } from "./utils/Component";

const FILTERED_CONTENT_SELEECTOR = ".js-filtered-content";
const FILTER_INPUT_SELECTOR = ".js-filter-input";
const FILTER_CARD_SELECTOR = ".js-filter-card";

const TYPE_DATA_ATR = "data-type";

const ACTIVE_CLASS = "active"

export const initFilteredContent = () => {
  dom(FILTERED_CONTENT_SELEECTOR).each(wrap => {
    new FilteredContent(wrap);
  })
}

class FilteredContent extends Component {
  private cards: Array<HTMLElement>; 
  private inputs: Array<HTMLInputElement>;

  private filters: Array<string>;

  private filtered: Array<HTMLElement>;

  constructor (wrap: HTMLElement) {
    super(wrap);

    this.wrap = wrap;

    this.cards = this.queryList(FILTER_CARD_SELECTOR, this.wrap);
    this.inputs = this.queryList(FILTER_INPUT_SELECTOR, this.wrap);

    this.filters = [];

    this.initComponent();
  }

  private initComponent = () => {
    this.initInputs()
  }

  private initInputs = () => {
    this.inputs.forEach((input) => {
      input.addEventListener("input", this.handleInput);
    })
  }

  private handleInput = () => {
    this.updateFilters();

    if(!this.filters.length) {
      this.showAllCards();
      return
    }

    this.updateFiltered();
    this.updateCards();
  }

  private updateFilters = () => {
    this.filters = this.inputs
      .filter(input => input.checked)
      .map(input => input.value);
  }

  private updateFiltered = () => {
    this.filtered = this.cards.filter(card => {
      const cardType = card.getAttribute('data-type');
      return this.filters.includes(cardType);
    });
  }

  private updateCards = () => {
    this.filtered.forEach(card => {
      this.setClass(card, ACTIVE_CLASS);
    });
    
    this.cards.forEach(card => {
      if (!this.filtered.includes(card)) {
        this.removeClass(card, ACTIVE_CLASS);
      }
    })
  }

  private showAllCards = () => {
    this.cards.forEach(card => {
        this.setClass(card, ACTIVE_CLASS);
    })
  }
}