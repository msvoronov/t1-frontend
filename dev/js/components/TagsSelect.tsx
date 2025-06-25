import dom from "js/libs/DOM";
import React from "js/libs/React";
import { Component } from "./utils/Component";
import { inEvent } from "js/utils";
import { validateInput } from "js/form/validate";

const TAGS_SELECT_SELECTOR = ".js-c-tags-select";
const DROP_DOWN_TRIGGER = ".js-c-dropdown-trigger";
const TAGS_WRAP_SELECTOR = ".js-tags-wrap";
const REMOVE_TAG_BTN_SELECTOR = ".js-remove-tag";
const TAG_CHECKBOX_SELECTOR = ".js-tag-checkbox";

const TAG_SELECT_ITEM_NAME = ".js-c-short-name";

const INPUT_WRAP_OTHER_SELECTOR = ".js-direction-other";

const INPUT_SELECTOR = ".js-direction-input";

const VALUE_DATA_ATR = "data-value"
const OPEN_CLASS = "open";
const HAS_VALUE_CLASS = "has-value";
const ACTIVE_CLASS = "active";

export const initTagsSelect = () => {
  
  dom(TAGS_SELECT_SELECTOR).each((wrap) => {
    
    new TagsSelector(wrap);
  })
}

class TagsSelector extends Component {

  
  private isOpen: boolean
  
  private input: HTMLInputElement;
  private selected: Array<string>;
  private dropdownTrigger: HTMLElement;
  private itemCheckboxes: Array<HTMLInputElement>;
  private tagsWrap: HTMLElement;
  private tags: Array<HTMLElement>;

  private inputOther: HTMLElement

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;

    this.isOpen = false;

    this.dropdownTrigger = this.query(DROP_DOWN_TRIGGER, this.wrap);
    this.itemCheckboxes = this.queryList(TAG_CHECKBOX_SELECTOR, this.wrap);

    this.tagsWrap = this.query(TAGS_WRAP_SELECTOR, this.wrap)
    this.tags = [];

    this.inputOther = this.query(INPUT_WRAP_OTHER_SELECTOR, document);

    this.input = this.query(INPUT_SELECTOR, this.wrap);
    this.selected = [];

    

    this.initComponent()
  }

  initComponent = () => {
    this.initOpenDropdown();
    
    this.initSelect();
  }
  
  initOpenDropdown = () => {
    window.addEventListener("click", this.handleAreaClick)
    this.dropdownTrigger.addEventListener("click", this.handleDropdownClick)
  }
  
  handleAreaClick = (event: MouseEvent) => {
    if(!inEvent(event, TAGS_SELECT_SELECTOR) && this.isOpen) {
      this.isOpen = !this.isOpen;
      this.closeSelect();
    }
  }
  
  handleDropdownClick = (event: MouseEvent) => {
    if(inEvent(event, REMOVE_TAG_BTN_SELECTOR)) return
    
    this.isOpen = !this.isOpen;
    this.isOpen ?  this.openSelect() : this.closeSelect();
  }

  openSelect = () => {
    this.setClass(this.wrap, OPEN_CLASS);
  }

  closeSelect = () => {
    this.removeClass(this.wrap, OPEN_CLASS);
  }

  initSelect = () => {
    
    this.itemCheckboxes.forEach((item) => {
      item.addEventListener("input", this.handleSelect);
    })
  }

  handleSelect = (event: InputEvent) => {
    
    const target = event.target as HTMLInputElement;

    const value = (target.parentElement.querySelector(TAG_SELECT_ITEM_NAME) as HTMLElement).innerText;
    
    if(!target.checked) {
      this.deleteListItem(value);      
      validateInput(this.input);
      return
    }
    
    if(value === "Другое") {
      this.showInputOther();
    }
    
    this.tagsWrap.appendChild(this.getTagElement(value));
    this.selected.push(value);
    
    this.input.value = this.selected.join(",").trim();
    
    
    this.setHasValue();
    validateInput(this.input);
    
  }

  showInputOther = () => {
    this.setClass(this.inputOther, ACTIVE_CLASS);
  }

  hideInputOther = () => {
    let input = this.query<HTMLInputElement>(".js-b-input__field", this.inputOther);
    input.value = '';
    this.removeClass(this.inputOther, ACTIVE_CLASS);
  }

  getTagElement = (value: string) => {
    const tag = (
      <div className="tags-select__tag-item" data-value={value}>
        {value}
        <div className="tags-select__tag-item__cross js-remove-tag" onclick={() => this.deleteListItem(value)}>
        </div>
      </div>
    )

    const newTag = document.createElement("div");
    this.setClass(newTag, "tags-select__tag-item");
    newTag.setAttribute("data-value", value);
    
    const cross = document.createElement("div");
    this.setClass(cross, "tags-select__tag-item__cross");
    this.setClass(cross, "js-remove-tag");
    cross.addEventListener("click", () => {this.deleteListItem(value);})

    newTag.innerText = value;
    newTag.appendChild(cross);


    this.tags.push(newTag);

    

    return newTag;
  }


  deleteListItem = (value: string) => {

    this.tags = this.tags.filter((item) => {
      if(item.getAttribute(VALUE_DATA_ATR) === value) {
        item.remove();
        return false
      }
      return true
    })

    this.itemCheckboxes.forEach((item) => {
      if(item.name === value) {
        item.checked = false;
      }
    })

    let index = this.selected.indexOf(value);
    if (index !== -1) {
      this.selected.splice(index, 1);
    }

    this.input.value = this.selected.join(",");

    this.hideInputOther();

    this.removeHasValue()
  }

  setHasValue = () => {
    
    if(this.tags.length) {
      this.setClass(this.wrap, HAS_VALUE_CLASS);
    }
  }
  removeHasValue = () => {
    if(!this.tags.length) {
      this.removeClass(this.wrap, HAS_VALUE_CLASS);
    }
  }
}