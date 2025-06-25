import dom from "js/libs/DOM";
import { Context } from "js/libs/DOM/types";
import { validateForm } from "js/form/validate";
import { Component } from "./utils/Component";
import { Ajax } from "./utils/Ajax";
import { ajax } from "js/libs/DOM/fn";

const SECTION_WRAP_SELECTOR = ".b-block-career-form"

const FORM_WRAP_SELECTOR = ".js-b-form";
const FORM_SELECTOR = ".js-b-form__form";

const RESPONSE_SUCCESS_SELECTOR = ".js-b-form-success";
const RESPONSE_ERROR_SELECTOR = ".js-b-form-error";
const RESPONSE_LOADER_SELECTOR = ".js-b-form-loader";
const RESPONSE_INPUTS_SELECTOR = ".js-b-form-inputs";
const BACK_SELECTOR = ".js-b-form-back";

const TEST_SUBMIT_BTN_SELECTOR = ".js-b-test-submit"

const BTN_SUBMIT = ".js-b-form-submit";

const ACTIVE_CLASS = "active";
const CAMP_FORM_METRICS_CLASS = "js-camp-form-metrics";

const FORM_ERROR_MSG = "Ошибка формы. Пользователь не может отправить форму, при всех валидных значениях";

export const initForm = (context?: Context) => {
    dom(FORM_WRAP_SELECTOR, context).each((wrap) => {
        new Form(wrap as HTMLFormElement)
    })
}

class Form extends Component {

    private isCamp: boolean;
    private submitAttemptCounts: number;
    private isFormSubmited: boolean;
    private form: HTMLFormElement;
    private inputs: HTMLElement;
    private successWrap: HTMLElement;
    private errorWrap: HTMLElement;
    private loader: HTMLElement;

    private backBtn: HTMLElement;

    private btnSubmit: HTMLInputElement;

    private testSubmit: HTMLElement;

    constructor(wrap: HTMLFormElement) {

        super(wrap);

        this.wrap = wrap;

        this.form = this.query(FORM_SELECTOR, this.wrap);

        this.inputs = this.query(RESPONSE_INPUTS_SELECTOR, this.wrap);
        this.successWrap = this.query(RESPONSE_SUCCESS_SELECTOR, this.wrap);
        this.errorWrap = this.query(RESPONSE_ERROR_SELECTOR, this.wrap);
        this.loader = this.query(RESPONSE_LOADER_SELECTOR, this.wrap);

        this.backBtn = this.query(BACK_SELECTOR, this.wrap);

        this.btnSubmit = this.query(BTN_SUBMIT, wrap);
        this.testSubmit = this.query(TEST_SUBMIT_BTN_SELECTOR, wrap);

        this.submitAttemptCounts = 0;
        this.isFormSubmited = false;

        this.isCamp = false;

        this.initComponent();
    }

    private initComponent = () => {
        this.initCampFormMetrics();
        this.initSubmit();
        this.initBackToForm();
    }

    private initCampFormMetrics = () => {
        if(!this.hasClass(this.wrap, CAMP_FORM_METRICS_CLASS)) return;
        this.isCamp = true;
    }

    private handleCampFormSubmit = () => {
        //@ts-ignore
        ym(76188397, 'reachGoal', 'sendcamp')
        
        //@ts-ignore
        _tmr.push(
            { type: 'reachGoal', id: 3404963, goal: 'send-camp'}
        );
        
    }

    private initBackToForm = () => {
        this.backBtn.addEventListener("click", this.handleBack)
    }

    private handleBack = () => {
        this.removeClass(this.errorWrap, ACTIVE_CLASS);
        this.setClass(this.inputs, ACTIVE_CLASS);
    }

    private initSubmit = () => {
        this.btnSubmit.addEventListener("click", this.handleSubmit)
        this.btnSubmit.addEventListener("click", this.handleClick)
        this.form.addEventListener("submit", this.handleSubmit);


        this.testSubmit?.addEventListener("click", async () => {
            const url = this.form.getAttribute("action");
            const { responseText } = await ajax({
                url,
                data: {status: 'error', message: FORM_ERROR_MSG, formName: location.pathname},
            });
        })
    }

    private handleClick = async () => {
        if(this.submitAttemptCounts > 5) {
            const url = this.form.getAttribute("action");
            const { responseText } = await ajax({
                url,
                data: {status: 'error', message: FORM_ERROR_MSG, formName: location.pathname},
            });
        }

        if(validateForm(this.form) && !this.isFormSubmited) {
            this.submitAttemptCounts++;
        }
    }
    
    private handleSubmit = async (e: Event) => {
        e.preventDefault();
        const sectionWrap = this.query(SECTION_WRAP_SELECTOR, document);
        
        if(!validateForm(this.form)) {
            const errorInput = this.query('.has-error', this.form);
            if(this.hasClass(this.form, ".js-scroll-submit")) {
                errorInput?.scrollIntoView()
            }

            return
        }

        this.submitAttemptCounts++;

        const url = this.form.getAttribute("action");
        
        const data = new FormData(this.form as HTMLFormElement);
        
        const ajaxForm = Ajax.init(url, data);
        
        this.removeClass(this.inputs, ACTIVE_CLASS);
        this.setClass(this.loader, ACTIVE_CLASS);

        
        sectionWrap?.scrollIntoView({behavior: 'smooth'});
        
        try {
            const res = await ajaxForm.request();
            this.isFormSubmited = true;
            this.removeClass(this.loader, ACTIVE_CLASS);
            this.setClass(this.successWrap, ACTIVE_CLASS);
            if(this.isCamp) {
                this.handleCampFormSubmit();
            }
        } catch(err) {

            const { responseText } = await ajax({
                url,
                data: {status: 'error', message: err, formName: location.pathname},
            });
            this.removeClass(this.loader, ACTIVE_CLASS);
            this.setClass(this.errorWrap, ACTIVE_CLASS);

        } finally {
            this.submitAttemptCounts = 0;
        }
    }

}