import dom from "js/libs/DOM";
import { dropdown } from "./tools";
import { Context } from "js/libs/DOM/types";

export const initDropdown = (context?: Context) => {
    dom(".js-dropdown", context).each((el: HTMLElement) => {
        dropdown(el);
    });
};
