import dom from "js/libs/DOM";

import IMask from "imask";
import { validateInput } from "./validate";
import { hasClass } from "js/libs/DOM/fn";
import { addClass, inEvent, query, queryList, removeClass, toggleClass } from "js/utils";

let IS_MASK_INITED = false;
let IS_BY_MASK_INITED = false;

const OPEN_CLASS = "open";
const SELECTED_CLASS = "selected";

const countriesCIS = [
    "ru",
    "by",
    "kz",
    "uz",
    "kg",
    "tj",
    "am",
    "az",
    "md",
    "ge"
];

const phoneMasks = {
    "ru": "+7(000)000-00-00",
    "by": "+375(00)000-00-00",
    "kz": "+7(000)000-00-00",
    "uz": "+998(00)000-00-00",
    "kg": "+996(00)000-00-00",
    "tj": "+992(00)000-00-00",
    "am": "+374(00)000-00-00",
    "az": "+994(00)000-00-00",
    "md": "+373(00)000-00-00",
    "ge": "+995(00)000-00-00"
};

export const inputMaskTel = (context?: HTMLElement) => {
    dom(".js-inn-mask", context).each((input: HTMLInputElement) => {
        initINNMask(input);
    });

    dom(".js-phone-mask", context).each((input: HTMLInputElement) => {
        initInputMaskTel(input);
    });

    dom(".js-telegram-mask", context).each((input: HTMLInputElement) => {
        initTelegramMask(input);
    })

    dom(".js-kpp-mask", context).each((input: HTMLInputElement) => {
        initKPPMask(input);
    });
};

const initINNMask = (input: HTMLInputElement) => {
    const instance = IMask(input, {
        mask: [
            { mask: '0000000000' }, // Для 10 цифр
            { mask: '000000000000' }, // Для 12 цифр
        ],
    });
    //Если нужно будет отображение маски постоянное
    //lazy: false,

    input.addEventListener(
        "focus",
        function () {
            // instance.updateOptions({ lazy: false });
            validateInput(input);
        },
        true
    );
}

const initInputMaskTel = (input: HTMLInputElement) => {

    const instance = IMask(input, {
        mask: "+{7}(000)000-00-00",
    });


    const countrySelect = query(".js-flag-select", document);

    if(countrySelect) {
        initCountrySelect(input, instance, countrySelect);
        return
    }
    

    // if(hasClass(input, "js-ini-tel")) {
    //     initItiSelect(input);

    //     return
    // }


    input.addEventListener("input", () => {
        const value = input.value.replace(/\D/g, '');

        if((value == '73' ||value == '3' || value == '37'|| value == '375')) {

            if(value == '375') {
                IS_BY_MASK_INITED = true;
            } else {
                IS_BY_MASK_INITED = false;
            }
            instance.updateOptions({mask: "+000(00)000-00-00"})

            input.setAttribute('data-tel-length', '12');
        } else if(!IS_BY_MASK_INITED) {
            instance.updateOptions({mask: "+{7}(000)000-00-00"})
            input.setAttribute('data-tel-length', '11');
            const length = input.value.length; 
            
            input.focus();
            input.setSelectionRange(length, length);
            IS_BY_MASK_INITED = false;
        }

        
    })

    

    // const updateMask = new CustomEvent('updateMask');

    // input.addEventListener("updateMask", () => {
    //     const mask = input.getAttribute("data-mask");
    //     if(instance.mask === input.getAttribute("data-mask")) return;

    //     input.value = '';

    //     const newLength = mask.replace(/\D/g, '').length;
    //     input.setAttribute("data-tel-length", `${newLength}`);
    //     instance.updateOptions({ mask });
    // })

    // input.addEventListener(
    //     "focus",
    //     function () {
    //         instance.updateOptions({ lazy: false });
    //         validateInput(input);
    //     },
    //     true
    // );

    // let requiredLength = getRequiredTelLength(instance.mask);

    // // Для валидации длины номера в модуле validation.ts
    // if (input.hasAttribute("data-required")) {
    //     input.setAttribute("data-tel-length", requiredLength + "");
    // }
};

const initTelegramMask = (input: HTMLInputElement) => {
    input.addEventListener("focus",
        () => {
            if(input.value.split('@')[1]?.length) return;
            input.value = '@';
        },
        true
        );
        
        input.addEventListener("input", (event: InputEvent) => {
            if(!input.value) {
                input.value = '@';
            }
    })
}

const initKPPMask = (input: HTMLInputElement) => {
    const instance = IMask(input, {
        mask: Number,
        scale: 0 // 0 знаков после запятой - откючаем возможность ввести символ запятой
    });

    input.addEventListener(
        "focus",
        function () {
            validateInput(input);
        },
        true
    );
}

/**
 * Возвращает необходимую для валидности длину телефона на основе маски
 * Длина равняется кол-ву цифр в маске
 */
const getRequiredTelLength = (mask: string) => {
    return mask.replace(/[^\d]/g, "").length;
};


const initCountrySelect = (input: HTMLInputElement, instance: IMask.InputMask<{mask: string;}>, countrySelect: HTMLElement) => {

    const dropdown = query(".js-flag-dropdown", countrySelect);
    const options = queryList(".js-country-option", countrySelect);
    const trigger = query(".js-country-trigger", countrySelect);
    const currentFlag = query(".js-country-flag", countrySelect);
    

    let isOpen = false;

    const close = () => {
        isOpen = false;
        removeClass(countrySelect, OPEN_CLASS);
    }
    const open = () => {
        isOpen = true;
        addClass(countrySelect, OPEN_CLASS);
    }

    countrySelect.addEventListener("click", (event) => {
        // event.stopImmediatePropagation();
    })
    
    trigger.addEventListener("click", () => {
        isOpen ? close() : open();
    })

    const clearOptions = () => {
        options.forEach((option) => {
            removeClass(option, SELECTED_CLASS)
        })
    }

    options.forEach((option) => {
        option.addEventListener("click", () => {
            clearOptions();

            const code = option.getAttribute("data-value");
            const flag = query(".country-select__option__flag", option);
            currentFlag.innerHTML = flag.innerHTML;
            instance.updateOptions({mask: phoneMasks[code], lazy: false});

            addClass(option, SELECTED_CLASS);
            
            isOpen ? close() : open();
        })
    })

    const handleAreaClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        if(inEvent(event, ".country-select__trigger")) {
            return;
        }

        if(!inEvent(event, ".js-flag-dropdown")) {
            close();
        }
    }
    window.addEventListener('click', handleAreaClick)
}