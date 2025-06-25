import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { inEvent } from "js/utils";
import { Context } from "js/libs/DOM/types";
import { val } from "js/libs/DOM/fn";
import { validateInput } from "js/form/validate";

const CUSTOM_SELECT_SELECTOR = ".js-custom-select";
const CUSTOM_SELECT_VALUE_SELECTOR = ".js-custom-select-value";
const CUSTOM_SELECT_INPUT_SELECTOR = ".js-b-input__field";
const CUSTOM_SELECT_ITEM_SELECTOR = ".js-custom-select-item";
const CUSTOM_SELECT_INNER_SELECTOR = ".js-custom-select-inner";

const VALUE_DATA_ATR = 'data-value';

const HAS_VALUE_CLASS = "has-value";
const OPEN_CLASS = "open";
const SELECTED_CLASS = "selected";

export const initCustomSelect = (context: Context) => {
  dom(CUSTOM_SELECT_SELECTOR, context).each((wrap: HTMLElement) => {
    new CustomSelect(wrap);
  })
}

class CustomSelect extends Component {
  items: Array<HTMLElement>;
  input: HTMLInputElement;
  valueWrap: HTMLElement;

  isOpen: boolean;

  constructor(wrap: HTMLElement) {

    super(wrap);
    this.wrap = wrap;

    this.isOpen = false;

    this.input = this.query(CUSTOM_SELECT_INPUT_SELECTOR, this.wrap);
    this.valueWrap = this.query(CUSTOM_SELECT_VALUE_SELECTOR, this.wrap);
    this.items = this.queryList(CUSTOM_SELECT_ITEM_SELECTOR, this.wrap);

    this.initComponent();
  }

  initComponent = () => {
    this.initOpen();
    this.setInitialValue();
    this.initSelect();
  }

  setInitialValue = () => {
    this.items.forEach((item: HTMLElement) => {
      if(this.hasClass(item, SELECTED_CLASS)) {

        if(!item.hasAttribute(VALUE_DATA_ATR)) {
          this.setHtmlValue(item);
          return
        }

        this.setValue(item)
      }
    })
  }

  initSelect = () => {
    this.items.forEach((item) => {
      item.addEventListener("click", this.hanleItemClick) 
    })
  }

  hanleItemClick = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    this.removeSelected();
    this.setAttributes(target);


    this.input.dispatchEvent(new Event('input'));
    if(!target.hasAttribute(VALUE_DATA_ATR)) {
      this.setHtmlValue(target);
      validateInput(this.input);
      return
    }

    this.setValue(target)
    validateInput(this.input);


  }

  setAttributes = (item: HTMLElement) => {

    const targetAttributes = this.input.attributes;
    for (let i = targetAttributes.length - 1; i >= 0; i--) {
        const attr = targetAttributes[i];
        if (attr.name.startsWith('data-')) {
            this.input.removeAttribute(attr.name);
        }
    }

    const attributes = item.attributes;

    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];

      if (attr.name.startsWith('data-')) {
          // Копируем атрибут в целевой элемент
          this.input.setAttribute(attr.name, attr.value);
      }
    }
  }

  setHtmlValue = (target: HTMLElement) => {
      const value = target.innerHTML;
      this.setClass(this.wrap, HAS_VALUE_CLASS);

      if(this.valueWrap) {
        this.valueWrap.innerHTML = value;
      }
      this.input.value = target.innerText;
      this.setSelected(target)
  }
  setValue = (target: HTMLElement) =>{
    const value = target.getAttribute(VALUE_DATA_ATR);

    this.setClass(this.wrap, HAS_VALUE_CLASS);
     if(this.valueWrap) {
        this.valueWrap.innerHTML = value;
      }
    this.input.value = value;
    this.setSelected(target)
  }

  initOpen = () => {
    this.wrap.addEventListener('click', this.handleSelectClick);
    window.addEventListener('click', this.handleAreaClick)
  }

  setSelected = (item: HTMLElement) => {
    this.setClass(item, SELECTED_CLASS);
  }

  removeSelected = () => {
    this.items.forEach((item: HTMLElement) => {
      this.removeClass(item, SELECTED_CLASS);
    })
  }

  handleAreaClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if(!inEvent(event, CUSTOM_SELECT_SELECTOR)) {
      this.closeSelect();
      this.isOpen = false;
    }
  }

  handleSelectClick = (event: MouseEvent) => {
    event.preventDefault();
    this.isOpen ? this.closeSelect() : this.openSelect();
    this.isOpen = !this.isOpen;
  }

  closeSelect = () => {
    this.removeClass(this.wrap, OPEN_CLASS);
  }

  openSelect = () => {
    this.setClass(this.wrap, OPEN_CLASS);
  }
}