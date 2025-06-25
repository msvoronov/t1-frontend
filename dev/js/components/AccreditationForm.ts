import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { initInputText } from "./InputText";
import { validateForm, validateInput } from "js/form/validate";
import { addClass } from "js/utils";
import { Ajax } from "./utils/Ajax";
import { ajax } from "js/libs/DOM/fn";

const MAX_PROJECTS = 5;

const ACCREDITATION_FORM_WRAP_SELECTOR = ".js-accreditation-form";
const ACCREDITATION_FORM_NEW_WRAP_CLASS = "block-accreditation-form__new";
const ACCREDITATION_FORM_SELECTOR = ".js-accreditation-form__form";

const ACCREDITATION_PAGES_WRAP_SELECTOR = ".js-accreditation-pages-wrap";
const ACCREDITATION_PAGE_SELECTOR = ".js-accreditation-page";
const ACCREDITATION_BTN_BACK_SELECTOR = ".js-accreditation-back";
const ACCREDITATION_BTN_NEXT_SELECTOR = ".js-accreditation-next";

const FILE_INPUT_SELECTOR = ".js-c-file";

const PROJECT_LIST_SELECTOR = ".js-accreditation-project-list";
const PROJECT_ITEM_SELECTOR = ".js-accreditation-project-item";
const PROJECT_INDEX_SELECTOR = ".js-accreditation-project-index";
const PROJECT_TITLE_SELECTOR = ".js-accreditation-project-title";
const PROJECT_ADD_SELECTOR = ".js-project-add";

const SUBMIT_BTN_SELECTOR = ".js-submit";

const ORGANIZATION_INPUT_SELECTOR = ".js-organization-input";
const ORGANIZATION_WRAP_SELECTOR = ".js-organization-wrap";

const RESPONSE_SUCCESS_SELECTOR = ".js-b-form-success";
const RESPONSE_ERROR_SELECTOR = ".js-b-form-error";
const RESPONSE_LOADER_SELECTOR = ".js-b-form-loader";

const INPUT_FIELD_SELCTOR = ".js-b-input__field";

const BACK_SELECTOR = ".js-b-form-back";

const ACTIVE_CLASS = "active";
const HIDDEN_CLASS = "hidden";
const EXCLUDE_CLASS = "exclude";

export const initAccreditationForm = () => {
  dom(ACCREDITATION_FORM_WRAP_SELECTOR).each((wrap: HTMLElement) => {
    new AccreditationForm(wrap);
  })
}


class AccreditationForm extends Component {
  private pages: Array<HTMLElement>;
  private pagesWrap: HTMLElement;
  private btnNext: HTMLElement;
  private btnBack: HTMLElement;

  private submitBtn: HTMLButtonElement;

  private currentPage: number;

  private form: HTMLFormElement;

  private fileInput: HTMLInputElement;

  private projectList: HTMLElement;
  private projectItem: HTMLElement;
  private projectAdd: HTMLElement;

  private successWrap: HTMLElement;
  private errorWrap: HTMLElement;
  private loader: HTMLElement;

  private retryForm: HTMLElement;

  private organizationInput: HTMLInputElement;
  private organizationWrap: HTMLElement

  constructor(wrap: HTMLElement) {
    super(wrap);

    this.wrap = wrap;

    this.pagesWrap = this.query(ACCREDITATION_PAGES_WRAP_SELECTOR, this.wrap);
    this.pages = this.queryList(ACCREDITATION_PAGE_SELECTOR, this.wrap);

    this.btnNext = this.query(ACCREDITATION_BTN_NEXT_SELECTOR, this.wrap);
    this.btnBack = this.query(ACCREDITATION_BTN_BACK_SELECTOR, this.wrap);

    this.submitBtn = this.query(SUBMIT_BTN_SELECTOR, this.wrap);

    this.fileInput = this.query(FILE_INPUT_SELECTOR, this.wrap);

    this.projectList = this.query(PROJECT_LIST_SELECTOR, this.wrap);
    this.projectItem = this.query(PROJECT_ITEM_SELECTOR, this.wrap);
    this.projectAdd = this.query(PROJECT_ADD_SELECTOR, this.wrap);

    this.organizationInput = this.query(ORGANIZATION_INPUT_SELECTOR);
    this.organizationWrap = this.query(ORGANIZATION_WRAP_SELECTOR);

    this.retryForm = this.query(BACK_SELECTOR, this.wrap);

    this.currentPage = 0;

    this.successWrap = this.query(RESPONSE_SUCCESS_SELECTOR, this.wrap);
    this.errorWrap = this.query(RESPONSE_ERROR_SELECTOR, this.wrap);
    this.loader = this.query(RESPONSE_LOADER_SELECTOR, this.wrap);

    this.form = this.query(ACCREDITATION_FORM_SELECTOR, this.wrap)

    this.initComponent();
  }

  private initComponent = () => {
    
    if(this.hasClass(this.wrap, ACCREDITATION_FORM_NEW_WRAP_CLASS)) {
      this.initFileInput();
      this.initOrganization();
      this.initAddProject();
      return;
    }

    this.initResize();
    this.initPagination();
    this.initFileInput();
    this.initAddProject();
    this.initValidation();
    this.initOrganization();
    this.initSubmit();
    this.initBackToForm();
  };

  private initBackToForm = () => {
      this.retryForm.addEventListener("click", this.handleBack)
    }

    private handleBack = () => {
      this.removeClass(this.errorWrap, ACTIVE_CLASS);
      this.setClass(this.form, ACTIVE_CLASS);
    }

  private initOrganization = () => {
    this.organizationInput.addEventListener("input", this.handleOrganizationInput)
  }

  private handleOrganizationInput = () => {
    if(this.organizationInput.checked) {
      this.setClass(this.organizationWrap, ACTIVE_CLASS);
    } else {
      this.removeClass(this.organizationWrap, ACTIVE_CLASS);
    }

    if(this.hasClass(this.wrap, ACCREDITATION_FORM_NEW_WRAP_CLASS)) return

    this.resizeWrap();
  }

  private initValidation = () => {

  }

  private isPageValid = () => {
    const inputs = this.queryList<HTMLInputElement>(INPUT_FIELD_SELCTOR, this.pages[this.currentPage]);

    let isValid = true;

    for (let i = 0; i < inputs.length; i++) {
      if (!validateInput(inputs[i])) {
        isValid =  false;
      }
    }
  
    return isValid;
  }

  private initFileInput = () => {
    this.fileInput.addEventListener("input", () => {
      if(this.hasClass(this.wrap, ACCREDITATION_FORM_NEW_WRAP_CLASS)) return
      setTimeout(this.resizeWrap);
    });
  };

  private initResize = () => {
    this.resizeWrap();
  };

  private initPagination = () => {
    this.btnNext.addEventListener("click", this.setNextPage);
    this.btnBack.addEventListener("click", this.setPrevPage);
  };

  private setNextPage = () => {

    
    if (this.currentPage === this.pages.length - 1) return;

    
    if(!this.isPageValid()) return

    this.currentPage++;

    this.updatePaginationButtons()

    this.changePages();
  };

  private setPrevPage = () => {

    if (this.currentPage === 0) return;

    this.currentPage--;

    this.updatePaginationButtons()

    this.changePages();
  };

  private updatePaginationButtons = () => {

    if (this.currentPage === this.pages.length - 1) {
      this.removeClass(this.submitBtn, HIDDEN_CLASS);
      addClass(this.btnNext, HIDDEN_CLASS);
    } else {
      addClass(this.submitBtn, HIDDEN_CLASS);
      this.removeClass(this.btnNext, HIDDEN_CLASS);
    }


    if(this.currentPage === 0) {
      addClass(this.btnBack, HIDDEN_CLASS);
    }else {
      this.removeClass(this.btnBack, HIDDEN_CLASS);
    }
  }

  private changePages = () => {
    this.pages.forEach((page) => {
      this.removeClass(page, ACTIVE_CLASS);
    });

    this.setClass(this.pages[this.currentPage], ACTIVE_CLASS);

    this.resizeWrap();
  };

  private resizeWrap = () => {
    if(this.wrap.classList.contains(ACCREDITATION_FORM_NEW_WRAP_CLASS)) return
    const currentPageHeight =
      this.pages[this.currentPage]?.getBoundingClientRect().height;
    
    
    this.pagesWrap.style.height = `${currentPageHeight}px`;
  };

  private initAddProject = () => {
    this.projectAdd.addEventListener("click", this.addProject);
  }

  private addProject = () => {
    const count = this.queryList(PROJECT_ITEM_SELECTOR, this.wrap).length;

    if(count >= MAX_PROJECTS) return;

    if(count >= 1) {
      this.query(PROJECT_TITLE_SELECTOR, this.projectItem).classList.remove(HIDDEN_CLASS);
    }

    const projectEl = this.getProjectWrapElement(count + 1) as HTMLElement;

    initInputText(projectEl);
    this.initRemoveEl(projectEl);


    this.projectList.insertAdjacentElement("beforeend", projectEl);

    this.countProjects();
    if(this.hasClass(this.wrap, ACCREDITATION_FORM_NEW_WRAP_CLASS)) return
    this.resizeWrap();
  }

  private getProjectWrapElement = (index: number) => {
    let div = document.createElement('div');
    const htmlString =
      `<div class="block-accreditation-form__project-wrap js-accreditation-project-item">
        <div class="block-accreditation-form__project__title js-accreditation-project-title">
          Проект
          <span class="block-accreditation-form__project__title__index js-accreditation-project-index">
            ${index}
          </span>
        </div>
        <div class="block-accreditation-form__project__remove js-remove-project">
        </div>
        
        <div class="block-accreditation-form__row">
          <label class="b-career-form__field js-b-input">
            <span class="b-career-form__field__label">
              Название проекта
            </span>
            <input
              type="text"
              name='project-name${index}'
              class="b-career-form__field__input js-b-input__field"
            />
            <span class="alert-input-text"></span>
          </label>

          <label class="b-career-form__field js-b-input">
            <span class="b-career-form__field__label">Заказчик</span>
            <input
              type="text"
              name='client-${index}'
              class="b-career-form__field__input js-b-input__field"
            />
            <span class="alert-input-text"></span>
          </label>
        </div>

        <div class="block-accreditation-form__row">
          <label class="b-career-form__field js-b-input">
            <span class="b-career-form__field__label">
              Год и срок реализации
            </span>
            <input
              type="text"
              name='year-${index}'
              class="b-career-form__field__input js-b-input__field"
            />
            <span class="alert-input-text"></span>
          </label>

          <label class="b-career-form__field js-b-input">
            <span class="b-career-form__field__label">Объём</span>
            <input
              type="text"
              name='volume-${index}'
              class="b-career-form__field__input js-b-input__field"
            />
            <span class="alert-input-text"></span>
          </label>
        </div>
      </div>`

    div.innerHTML = htmlString.trim();

    return div.firstChild;
  };

  private initRemoveEl = (el: HTMLElement) => {
    const removeBtn = this.query(".js-remove-project", el);

    removeBtn.addEventListener("click", () => {
      el.remove();
      this.countProjects();
      if(this.hasClass(this.wrap, ACCREDITATION_FORM_NEW_WRAP_CLASS)) return
      this.resizeWrap();
    }, {once: true})
  }

  private countProjects = () => {
    const projectIndexWraps = this.queryList(PROJECT_INDEX_SELECTOR, this.projectList);

    if(projectIndexWraps.length === 1) {
      this.query(PROJECT_TITLE_SELECTOR, this.projectItem).classList.add(HIDDEN_CLASS);
      return
    }

    projectIndexWraps.forEach((wrap, index) => {
      wrap.innerHTML = `${index + 1}`;
    })
  }

  
  private initSubmit = () => {
    this.submitBtn.addEventListener("click", this.handleSubmit);
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if(!validateForm(this.form)) {
        return
    }

    const url = this.form.getAttribute("action");
    
    const data = new FormData(this.form as HTMLFormElement);
    
    const ajaxForm = Ajax.init(url, data);
    
    this.removeClass(this.form, ACTIVE_CLASS);
    this.setClass(this.loader, ACTIVE_CLASS);

    try {
      const res = await ajaxForm.request();
      this.removeClass(this.loader, ACTIVE_CLASS);
      this.setClass(this.successWrap, ACTIVE_CLASS);

    } catch(err) {

      const { responseText } = await ajax({
          url,
          data: {status: 'error', message: err, formName: location.pathname},
      });
      this.removeClass(this.loader, ACTIVE_CLASS);
      this.setClass(this.errorWrap, ACTIVE_CLASS);

    } finally {
    }
  }
}