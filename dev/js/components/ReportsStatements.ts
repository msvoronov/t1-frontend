import dom from "js/libs/DOM";
import { Component } from "./utils/Component";

const STATEMENTS_SELECTOR = ".js-reports-statements";
const SELECT_SELECTOR = ".js-nice-select";
const CATEGORY_INPUT_SELECTOR = ".js-category-input";

const CONTENT_WRAP_SELECTOR = ".js-content-wrap";
const PAGE_SELECTOR = ".js-page-wrap";

const ACTIVE_CLASS = "active";

const YEAR_DATA_ATR = "data-year"
const CATEGORY_DATA_ATR = "data-category";

export const initReportsStatements = () => {
  dom(STATEMENTS_SELECTOR).each((wrap) => {
    new ReportsStatements(wrap);
  })
}

class ReportsStatements extends Component {

  private contentWrap: HTMLElement;
  private pages: Array<HTMLElement>;
  private categoryInputs: Array<HTMLInputElement>;
  private select: HTMLSelectElement;

  private filters: Array<string>;

  private activePage: HTMLElement;

  private selectedYear: string;
  private selectedCategory: string;
  
  constructor(wrap: HTMLElement) {
    super(wrap);

    this.wrap = wrap;

    this.select = this.query(SELECT_SELECTOR, this.wrap);
    this.categoryInputs = this.queryList(CATEGORY_INPUT_SELECTOR, this.wrap);

    this.contentWrap = this.query(CONTENT_WRAP_SELECTOR, this.wrap);
    this.pages = this.queryList(PAGE_SELECTOR, this.contentWrap);

    this.filters = ['2024', 'msfo'];

    this.activePage = this.pages.find((page: HTMLElement) => {
      return this.hasClass(page, ACTIVE_CLASS);
    });

    this.selectedYear = '2024';
    this.selectedCategory = 'msfo';

    this.initComponent();

  }

  private initComponent = () => {

    this.initCategoryInput();
    this.initYearInput();
    this.initResize();

    this.resize();
    // this.updateCategory();
  }

  private updateCategory = () => {
    const currentYearPages = this.pages.filter((page) => {
      return page.getAttribute(YEAR_DATA_ATR) === this.selectedYear;
    })

    const allCategories = currentYearPages.map(elem => elem.getAttribute(CATEGORY_DATA_ATR));

    const uniqueCategories = [...new Set(allCategories)];

    this.categoryInputs.forEach((categoryInput) => {
      const category = categoryInput.value;
      categoryInput.parentElement.style.display = 'block';
      if (!uniqueCategories.includes(category)) {
        categoryInput.parentElement.style.display = 'none';
      }
    })

    const length = this.categoryInputs.length;

    for(let i = 0; i < length; i++) {
      if(this.categoryInputs[i].parentElement.style.display === 'block') {
        this.categoryInputs[i].checked = true;
        this.categoryInputs[i].dispatchEvent(new Event('input'));
        break
      }
    }

  }
  
  private initCategoryInput = () => {

    this.categoryInputs.forEach((input) => {
      input.addEventListener("input", this.handleInput)
    });
  }

  private handleInput = (event: InputEvent) => {
    const value = (event.target as HTMLInputElement).value
    
    this.filters[1] = value;

    this.selectedCategory = value;
    this.updatePages();
  }

  private initYearInput = () => {
    this.select.addEventListener("change", this.handleSelect);
  }

  private handleSelect = () => {
    this.filters[0] = this.select.value;
    this.selectedYear = this.select.value
    
    this.updatePages();
    // this.updateCategory();
  }

  private updatePages = () => {
    this.hidePage(this.activePage);

    this.activePage = this.getActivePage();

    this.showPage(this.activePage);

    this.resize();

  }

  private getActivePage = () => {
    return this.pages.filter(card => {
      const cardYear = card.getAttribute(YEAR_DATA_ATR);
      const cardCategory = card.getAttribute(CATEGORY_DATA_ATR);
      return this.filters.includes(cardYear) && this.filters.includes(cardCategory);
    })[0];
  }

  private showPage = (page: HTMLElement) => {
    if(!page) {

    }
    this.setClass(page, ACTIVE_CLASS);
  }
  private hidePage = (page: HTMLElement) => {
    this.removeClass(page, ACTIVE_CLASS);
  }

  private initResize = () => {

    window.addEventListener('resize', this.resize);

  }

  private resize = () => {
    const curPageHeight = this.activePage?.getBoundingClientRect().height;

    this.contentWrap.style.height = `${curPageHeight}px`;
  }
}