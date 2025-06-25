import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { dynamicComponents } from ".";

const FORM_COPY_SELECTOR = ".js-form-copy";
const FORM_COPY_ROW_SELECTOR = ".js-form-row";
const FORM_COPY_ADD_SELECTOR = ".js-form-copy-add";
const FORM_COPY_COUNT_SELECTOR = ".js-form-copy-count";
const FORM_COPY_WRAP_SELECTOR = ".js-form-copy-wrap";

const MAX_COUNT_TO_ADD = 15;


export const initFormCopy = () => {
  dom(FORM_COPY_SELECTOR).each((wrap: HTMLElement) => {
    new FormCopy(wrap);
  })
}

class FormCopy extends Component {
  rowToCopy: HTMLElement;
  rows: Array<HTMLElement>;
  button: HTMLElement;
  countWrap: HTMLElement;
  rowsWrap: HTMLElement;

  currentCount: number;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap

    this.button = this.query(FORM_COPY_ADD_SELECTOR, wrap);
    this.rowsWrap = this.query(FORM_COPY_WRAP_SELECTOR, wrap);
    this.rowToCopy = this.queryList(FORM_COPY_ROW_SELECTOR, wrap)[0];
    this.rows = this.queryList(FORM_COPY_ROW_SELECTOR, wrap);

    this.countWrap = this.query(FORM_COPY_COUNT_SELECTOR, wrap);

    this.currentCount = MAX_COUNT_TO_ADD;

    this.countWrap.innerHTML = `(${this.currentCount})`;
    this.initComponent();
  }

  initComponent = () => {
    this.initAdd();
  }

  initAdd = () => {
    this.button.addEventListener('click', this.addRow)
  }
  addRow = () => {

    if(MAX_COUNT_TO_ADD - this.rows.length === 0) return;

    const clonedElement = this.rowToCopy.cloneNode(true);
    

    this.rows = this.queryList(FORM_COPY_ROW_SELECTOR, this.wrap);

    const clonedInputs = this.queryList<HTMLInputElement>('input', clonedElement as HTMLElement);

    const rowLength = this.rows.length

    clonedInputs[0].name = `conditions-${rowLength}`;
    clonedInputs[1].name = `catalog-${rowLength}`;

    clonedInputs.forEach((input) => {
      input.value = ''
    })

    this.rowsWrap.append(clonedElement);
    dynamicComponents(clonedElement as HTMLElement);

    this.updateCount();
  }

  updateCount = () => {
    this.currentCount = MAX_COUNT_TO_ADD - this.rows.length;
    this.countWrap.innerHTML = `(${this.currentCount})`
  }
}