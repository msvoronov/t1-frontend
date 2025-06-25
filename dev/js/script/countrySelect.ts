import { validateInput } from "js/form/validate";

import IMask from "imask";
import dom from "js/libs/DOM";
import { query } from "js/utils";

const COUNTRY_SELECT_SELECTOR = ".js-country-select";
const COUNTRY_SELECT_INPUT_SELECTOR = ".js-b-input__field";
const PHONE_INPUT_SELECTOR = '.js-country-phone';

const MASKS = {
  "Россия": "+{7}(000)000-00-00",
  "Беларусь": "+{375}(00)000-00-00",
  "Казахстан": "+{7}(0)000-00-00",
  "Азербайджан": "+{994}(00)000-00-00",
  "Армения": "+{374}(00)000-00-00",
  "Кыргызстан": "+{996}(0)000-00-00",
  "Молдова": "+{373}(02)000-00-00",
  "Таджикистан": "+{992}(02)000-00-00",
  "Туркменистан": "+{993}(0)000-00-00",
  "Узбекистан": "+{998}(0)000-00-00",
  "Другое": '+000000000000'
}


export const initCountrySelect = () => {
  dom(COUNTRY_SELECT_SELECTOR).each((wrap: HTMLElement) => {
    ountrySelect(wrap);
  })
}

const ountrySelect = (wrap: HTMLElement) => {
  const countryInput = query<HTMLInputElement>(COUNTRY_SELECT_INPUT_SELECTOR, wrap);

  const phoneInput = query<HTMLInputElement>(PHONE_INPUT_SELECTOR, document);


  const initPhoneMask = (): any => {
    const instance = IMask(phoneInput, {
        mask: "+{7}(000)000-00-00",
    });
   

    phoneInput.addEventListener(
        "focus",
        function () {
            instance.updateOptions({ lazy: false });
            validateInput(phoneInput);
        },
        true
    );

    let requiredLength = getRequiredTelLength(instance.mask);

    //Для валидации длины номера в модуле validation.ts
    if (phoneInput.hasAttribute("data-required")) {
        phoneInput.setAttribute("data-tel-length", requiredLength + "");
    }


    return instance
  }


  const maskInput = initPhoneMask();

  const handleCountryChange = () => {
    const value = countryInput.value;

    maskInput.updateOptions({ mask: MASKS[value] });

    let requiredLength = getRequiredTelLength(maskInput.mask);

    //Для валидации длины номера в модуле validation.ts
    if (phoneInput.hasAttribute("data-required")) {
        phoneInput.setAttribute("data-tel-length", requiredLength + "");
    }
  }


  countryInput.addEventListener("input", handleCountryChange);
}

const getRequiredTelLength = (mask: string) => {
    return mask.replace(/[^\d]/g, "").length;
};
