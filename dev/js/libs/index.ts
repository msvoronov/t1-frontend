import { Context } from "js/libs/DOM/types";

import { horScroll } from "./horScroll";
import { initAccordions, initAreaAccordions } from "./accordion/accordion";
import { modal } from "./modals";

export const dynamicLibs = (context?: Context) => {4
    horScroll(context);
    initAccordions(context);
    initAreaAccordions(context);
    modal(context);
};

export const staticLibs = () => {
};
