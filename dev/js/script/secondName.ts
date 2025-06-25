import { validateInput } from "js/form/validate";
import dom from "js/libs/DOM";
import { query } from "js/utils";

const SECOND_NAME_SELECTOR = ".js-second-name";
const SECOND_NAME_INPUT_SELECTOR = ".js-second-name-input";
const SECOND_NAME_CHECKBOX_SELECTOR = ".js-second-name-checkbox";

const REQUIRED_DATA_ATR = "data-required";

export const initSecondName = () => {
  dom(SECOND_NAME_SELECTOR).each((wrap: HTMLElement) => {
    secondName(wrap);
  })
}

const secondName = (wrap: HTMLElement) => {
  const textInput = query<HTMLInputElement>(SECOND_NAME_INPUT_SELECTOR, wrap);
  const checkbox = query<HTMLInputElement>(SECOND_NAME_CHECKBOX_SELECTOR, wrap);

  const handleInput = () => {
    checkbox.checked ? removeSecondName() : setSecondName() ;
    validateInput(textInput);
  }
  
  const setSecondName = () => {
    textInput.disabled = false;
    textInput.value = '';
    textInput.parentElement.style.pointerEvents = 'all';
    textInput.setAttribute(REQUIRED_DATA_ATR, '');
  }

  const removeSecondName = () => {
    textInput.disabled = true;
    textInput.value = '-';
    textInput.parentElement.style.pointerEvents = 'none';
    textInput.dispatchEvent(new Event("input"))
    textInput.removeAttribute(REQUIRED_DATA_ATR);
  }

  checkbox.addEventListener("input", handleInput);
}