import "swiper/css/bundle";

import { Context } from "js/libs/DOM/types";
import { initImgSwiper } from "./imgSwiper";
import { initCultureSwiper } from "./cultureSlider";
import { initBlueSlider } from "./BlueSlider";
import { initNavSwiper } from "./initTagsSwiper";
import { initTagsSwiper } from "./tabsSwiper";
import { initComputingSystemsSwiper } from "./computingSystemsSwiper";
import { initIconsBlockSwiper } from "./iconBlockSlider";
import { initTeamSwiper } from "./teamSwiper";
import { initBlockPlusesSlider } from "./blockPlusesSlider";


export const dynamicSwiper = (context?: Context) => {
    initImgSwiper();
    initCultureSwiper();
    initBlueSlider();
    initNavSwiper();
    initTagsSwiper();
    initComputingSystemsSwiper();
    initIconsBlockSwiper();
    initTeamSwiper();
    initBlockPlusesSlider();
};

export const staticSwiper = () => {
};
