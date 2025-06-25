import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { stackSelectOptions } from "./consts";
import { addClass } from "js/utils";
import NiceSelect from "nice-select2/dist/js/nice-select2";

const DOUBLE_SELECT_SELECTOR = ".js-double-select";
const MAIN_SELECT_SELECTOR = ".js-main-select";
const SECONDARY_SELECT_SELECTOR = ".js-secondary-select";
const SECONDARY_SELECT_WRAP_SELECTOR = ".js-secondary-select-wrap";

const ACTIVE_CLASS = "active";

export const initDoubleSelect = () => {
    
    let wrap = document.querySelector(DOUBLE_SELECT_SELECTOR);

    if(!wrap) {
        return
    }
    setTimeout(() => {
        new DoubleSelect(wrap as HTMLElement);
    }, 2000)
}

class DoubleSelect extends Component {

    private mainSelect: HTMLSelectElement;
    private secondarySelectWrap: HTMLSelectElement;
    private secondarySelect: HTMLSelectElement;
    private secondaryNiceSelect: NiceSelect;

    constructor(wrap: HTMLElement) {
        super(wrap);
        this.wrap = wrap;

        
        this.mainSelect = this.query(MAIN_SELECT_SELECTOR, this.wrap);
        this.secondarySelect = this.query<HTMLSelectElement>(SECONDARY_SELECT_SELECTOR, this.wrap);
        this.secondarySelectWrap = this.query<HTMLSelectElement>(SECONDARY_SELECT_WRAP_SELECTOR, this.wrap);

        this.secondaryNiceSelect = new NiceSelect(this.secondarySelect, {placeholder: "Выберите технологию"});
        
        this.initComponent();
    }

    private initComponent = () => {
        this.mainSelect.addEventListener("change", this.handleSelect);
    }

    private handleSelect = (event: InputEvent) => {
        const target = event.target as HTMLSelectElement

        this.updateSecondSelect(target.value);
    }

    private updateSecondSelect = (selectedCategory: string) => {
        let selectedStack = stackSelectOptions[selectedCategory];
        
        if(!selectedStack) {
            this.removeClass(this.secondarySelectWrap, ACTIVE_CLASS)
            return
        }

        this.setClass(this.secondarySelectWrap, ACTIVE_CLASS)

        this.clearSelect()
        this.appendOptions(selectedStack);

        this.secondaryNiceSelect.update();

        addClass(this.secondarySelect, ACTIVE_CLASS);

    }

    private clearSelect = () => {
        const options = this.queryList("option", this.secondarySelect);

        options.forEach((option) => {
            option.remove()
        })
    }

    private appendOptions = (selectedStack: Array<any>) => {
        const defaultOption = '<option selected default value="">Уточните специализацию</option>'
        this.secondarySelect.insertAdjacentHTML("beforeend", defaultOption);
        
        selectedStack.forEach((item) => {
            let option = `<option value="${item.value}">${item.label}</option>`
            this.secondarySelect.insertAdjacentHTML("beforeend", option);
        })
    }
}