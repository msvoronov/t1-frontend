import NiceSelect from "nice-select2/dist/js/nice-select2";
import dom from "../libs/DOM";
import { addClass, query, queryList, removeClass } from "js/utils";

const NICE_SELECT_WRAP_SELECTOR = ".js-nice-select-wrap";
const NICE_SELECT_SELECTOR = ".js-nice-select";


const CITY_SELECT_CLASS = "js-city-select";
const OTHER_INPUT_CLASS = "js-other-select";

const VALUE_DATA_ATR = "data-value";

const OTHER_SELECT_SELECTOR = ".js-city-other";

const OTHER_INPUT_SELECTOR = ".js-other-input";

const ACTIVE_CLASS = "active";

export const initNiceSelect = () => {
    dom(NICE_SELECT_WRAP_SELECTOR).each((wrap) => {
        niceSelect(wrap);
    })
}

const niceSelect = (wrap: HTMLElement) => {

    const select = wrap.querySelector<HTMLSelectElement>(NICE_SELECT_SELECTOR);
    const options = {
        placeholder: "Выберите направление",
        defaultSelected: ''
    }

    const mask = "+{7}(000)000-00-00"

    let instanсe = new NiceSelect(select, options);


    if(wrap.classList.contains(CITY_SELECT_CLASS)) {

        initCitySelect(wrap);
    }

    if(wrap.classList.contains(OTHER_INPUT_CLASS)) {

        initOtherInput(wrap, select);
    }
}

const initOtherInput = (wrap: HTMLElement, select: HTMLSelectElement) => {

    const otherSelectID = wrap.getAttribute("data-target");

    const otherSelect = query(`#${otherSelectID}`, document);
    
    const optionElements = queryList(".option", wrap);

    const trigger = wrap.getAttribute("data-trigger");


    const handleClick = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLOptionElement;

        select.dispatchEvent(new Event("input"));
         target.getAttribute("data-value") === trigger ||target.getAttribute("data-value") === "Другое" || target.getAttribute("data-value") === "Окончил(а)" || target.getAttribute("data-value") === "Другой" ? showOtherSelect(otherSelect) : hideOtherSelect(otherSelect);
    }

    optionElements.forEach((option) => {
        option.addEventListener("click", handleClick);
    })
}

const initCitySelect = (wrap: HTMLElement) => {
    const otherSelect = query(OTHER_SELECT_SELECTOR, document);

    const oldOptionElements = queryList("option", wrap);
    const optionElements = queryList(".option", wrap);

    сopyAttributes(oldOptionElements, optionElements);

    optionElements.forEach((option) => {
        option.addEventListener("click", () => {

            if(option.hasAttribute("data-mask")) {
                setMask(option.getAttribute("data-mask"));
            }

            if(option.getAttribute("data-value") === "Другой") {
                showOtherSelect(otherSelect);
                return
            }
            
            hideOtherSelect(otherSelect)
        })
    })
    
}

const setMask = (mask: string) => {
    const telInput = query(".js-phone-mask", document);
    telInput.setAttribute("data-mask", mask);

    telInput.dispatchEvent(new Event("updateMask"));
}

const сopyAttributes = (options: Array<HTMLElement>, newOptions:Array<HTMLElement>) => {

    options.forEach((sourceElement, index) => {
        const targetElement = newOptions[index];
        if (targetElement) {
            // Получаем все атрибуты у исходного элемента
            const attributes = sourceElement.attributes;
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                // Копируем атрибут в целевой элемент
                targetElement.setAttribute(attr.name, attr.value);
            }
        }
    });

}

const showOtherSelect = (wrap: HTMLElement) => {
    addClass(wrap, ACTIVE_CLASS);
}
const hideOtherSelect = (wrap: HTMLElement) => {
    const inputs = queryList<HTMLInputElement>('input', wrap);

    inputs.forEach((input) => {
        clearInput(input);
    })
    removeClass(wrap, ACTIVE_CLASS);
}

const clearInput = (input: HTMLInputElement) => {
    if(input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
        return
    }

    input.value = '';
    removeClass(input, "has-value");
    removeClass(input.parentElement, "has-value");
    input.parentElement.removeAttribute("data-focused");
}