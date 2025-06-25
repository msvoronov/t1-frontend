import dom from "js/libs/DOM";
import React from "js/libs/React";
import { Component } from "./utils/Component";
import { inEvent } from "js/utils";
import { validateInput } from "js/form/validate";

const SEARCH_DELAY = 1000;

const SEARCH_SELECT_SELECTOR = ".js-c-search-select";

const UNIVERSITY_INPUT_SELECTOR = ".js-c-university-input";

const DROPDOWN_TRIGGER_SELECTOR = ".js-c-dropdown-trigger";
const LABEL_SELECTOR = ".js-c-label";

const SEARCH_INPUT_SELECTOR = ".js-c-search-input";

const LIST_SELECTOR = ".js-c-list";
const UNIVERSITY_ITEM_SELECTOR = ".js-c-university-item";

const SHORT_NAME_SELECTOR = ".js-c-short-name";
const FULL_NAME_SELECTOR = ".js-c-full-name";

const INPUT_OTHER_SELECTOR = ".js-c-search-input-other";

const VALUE_DATA_ATR = "data-value";
const INDEX_DATA_ATR = "data-index";

const UNIVERSITY_ITEM_CLASS = "js-c-university-item";
const OPEN_CLASS = "open";
const LOADING_CLASS = "loading";
const ACTIVE_CLASS = "active";

type TUniversityItem = {
  id: string;
  value: string;
  fullName: string;
  shortName: string;
}

export const initSearchSelect = () => {
  dom(SEARCH_SELECT_SELECTOR).each(wrap => {
      new SearchSelect(wrap);
  })
}

class SearchSelect extends Component {

  private isOpen: boolean

  private label: HTMLElement;
  private dropdownTrigger: HTMLElement;

  private input: HTMLInputElement;
  private searchInput: HTMLInputElement;

  private listWrap: HTMLElement;
  private listItems: Array<HTMLElement>;
  
  private data: Array<TUniversityItem>;
  private dataToDisplay: Array<TUniversityItem>;

  private timerID: NodeJS.Timeout;

  private inputOther: HTMLElement;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;

    this.isOpen = false;
    this.input = this.query(UNIVERSITY_INPUT_SELECTOR, this.wrap);
    
    this.label = this.query(LABEL_SELECTOR, this.wrap);
    this.dropdownTrigger = this.query(DROPDOWN_TRIGGER_SELECTOR, this.wrap);

    this.searchInput = this.query(SEARCH_INPUT_SELECTOR, this.wrap);
    this.listWrap = this.query(LIST_SELECTOR, this.wrap);

    this.listItems = this.queryList(UNIVERSITY_ITEM_SELECTOR, this.listWrap);
    this.data = this.listItems.map(this.getUniversityItemData);

    this.inputOther = this.query(INPUT_OTHER_SELECTOR, document)

    this.initComponent();
  }

  initComponent = () => {
    this.initOpenDropdown();
    this.initSelect();
    this.initSearch();
  }

  initOpenDropdown = () => {
    window.addEventListener("click", this.handleAreaClick)
    this.dropdownTrigger.addEventListener("click", this.handleDropdownClick)
  }

  handleAreaClick = (event: MouseEvent) => {
    if(!inEvent(event, SEARCH_SELECT_SELECTOR) && this.isOpen) {
      this.isOpen = !this.isOpen;
      this.closeSelect();
    }
  }

  handleDropdownClick = () => {
    this.isOpen = !this.isOpen;
    this.isOpen ?  this.openSelect() : this.closeSelect();
  }

  initSelect = () => {
    this.listWrap.addEventListener("click", this.handleListClick)
  }

  handleListClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if(!this.hasClass(target, UNIVERSITY_ITEM_CLASS)) return;
    
    let value = target.getAttribute(VALUE_DATA_ATR);
    
    if (value === "Другое") {
      value = "Другое";
      this.showInputOther();
    } else {
      this.hideInputOther();
    }
    
    
    this.input.value = value;
    this.label.innerHTML = value;
    
    this.closeSelect();
    this.isOpen = !this.isOpen;

    this.dispatchEvent("input", this.input);
    
    validateInput(this.input);
  }

  showInputOther = () => {
    this.setClass(this.inputOther, ACTIVE_CLASS);
  }

  hideInputOther = () => {
    this.removeClass(this.inputOther, ACTIVE_CLASS);
  }

  initSearch = () => {
    this.searchInput.addEventListener("input", this.hangleSearch)
  }

  hangleSearch = (event: InputEvent) => {

    const target = event.currentTarget as HTMLInputElement;

    if(this.timerID) {
      clearTimeout(this.timerID);
    }

    this.timerID = setTimeout(() => {
      this.setClass(this.wrap, LOADING_CLASS);
      
      this.search(target.value);

      this.removeClass(this.wrap, LOADING_CLASS);
      clearTimeout(this.timerID);
    }, SEARCH_DELAY)
  }

  search = (searchValue: string) => {
    const searchResult = [...this.data].filter((item) => {
      return new RegExp(searchValue,'i').test(item.value)
    })

    const elements = this.getHtmlTextItem(searchResult);
    
    this.renderListItems(elements)

  }

  getHtmlTextItem = (searchResult: Array<TUniversityItem>) => {


    if(!searchResult.length) {
      const errorElement = <div className="search-select__error-msg">Ничего не найдено</div>
      return [errorElement]
    }


    const elements = searchResult.map(({id, value, shortName, fullName}: TUniversityItem) => {
      return(
        <li className="search-select__list__item js-c-university-item" data-index={id}
          data-value={value}>
          <span className="search-select__list__item__short-name js-c-short-name">{shortName}</span>
          <span className="search-select__list__item__full-name js-c-full-name">{fullName}</span>
        </li>
      )
    })

    return elements;
  }

  renderListItems = (items: Array<Element>) => {
    this.listWrap.innerHTML = '';
    items.forEach((item) => {
      this.listWrap.appendChild(item)
    })
  }

  openSelect = () => {
    this.setClass(this.wrap, OPEN_CLASS);
  }

  closeSelect = () => {
    this.removeClass(this.wrap, OPEN_CLASS);
  }

  getUniversityItemData = (item: HTMLElement): TUniversityItem => {
    const id = item.getAttribute(INDEX_DATA_ATR);
    const value = item.getAttribute(VALUE_DATA_ATR);
    const shortName = this.query(SHORT_NAME_SELECTOR, item).innerHTML;
    const fullName = this.query(FULL_NAME_SELECTOR, item)?.innerHTML;
    return {
      id,
      value,
      shortName,
      fullName,
    }
  }

}