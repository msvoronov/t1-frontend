import dom from "js/libs/DOM";
import { addClass, query, removeClass } from "js/utils";

const POLICY_FORM_SELECTOR = ".js-policy-form";
const SUBMIT_BTN_SELECTOR = ".js-b-form-submit";

const AIM_INPUT_SELECTOR = "[name=\"aim\"]";
const COMPANY_INPUT_SELECTOR = "[name=\"company\"]";

const FORM_ALERT_MSG_WRAP_SELECTOR = ".js-policy-alert";

const ACTIVE_CLASS = 'active';
const DISABLED_CLASS = 'disabled';

const ERROR_MSG = 'Данная <a href="#aim">цель</a> распространения твоих персональных данных предусмотрена только для «Автономной некоммерческой организации дополнительного профессионального образования «Т1 Цифровая Академия», пожалуйста, выбери цель распространения и компанию, как написано в твоем гайде';

export const initPolicyForm = () => {
  dom(POLICY_FORM_SELECTOR).each((form: HTMLFormElement) => {
    policyForm(form);
  })
}

const policyForm = (form: HTMLFormElement) => {

  
  const aimInput = query(AIM_INPUT_SELECTOR, form);
  const companyInput = query(COMPANY_INPUT_SELECTOR, form);

  const errorWrap = query(FORM_ALERT_MSG_WRAP_SELECTOR, form);

  const btn = query(SUBMIT_BTN_SELECTOR, form);

  const handleSubmit = () => {
    const errorInput = query('.has-error', form);

    setTimeout(() => {
      errorInput?.scrollIntoView()
    }, 100)

  }

  const initValidate = () => {
    aimInput.addEventListener("input", validateCompany);
    companyInput.addEventListener("input", validateCompany);
    btn.addEventListener("click", validateCompany);
  }

  const validateCompany = () => {
    if(!aimInput.hasAttribute('data-company-allowed')) {
      removeError();
      return
    };

    if(!companyInput.hasAttribute('data-index')) {
      removeError();
      return
    };


    
    const selectedCompanyID = companyInput.getAttribute('data-index');
    const selectedAimIDs = aimInput.getAttribute('data-company-allowed');
    

    if(selectedCompanyID === selectedAimIDs) {
      removeError();
    } else {
      showError();
    }
  }

  const showError = () => {
    addClass(errorWrap, ACTIVE_CLASS);
    addClass(btn, DISABLED_CLASS);
    errorWrap.innerHTML = ERROR_MSG;

    
  }

  const removeError = () => {
    removeClass(errorWrap, ACTIVE_CLASS);
    removeClass(btn, DISABLED_CLASS);
    errorWrap.innerHTML = '';

  }

  initValidate();
  btn.addEventListener("click", handleSubmit);
}