import dom from "js/libs/DOM";
import { addClass, inEvent, query, removeClass } from "js/utils";

const SEARCH_WRAP_SELECTOR = ".b-search-header";
const SEARCH_TRIGGER_SELECTOR = ".b-search-header__burger";
const SEARCH_INPUT_WRAP_SELECTOR = ".b-search-header__form-mobile";

const SEARCH_OPEN_CLASS = "b-search-header__burger--active";
const OPEN_CLASS = "b-search-header__form-mobile--active";


export const intiOpenSearch = () => {
  dom(SEARCH_WRAP_SELECTOR).each((wrap: HTMLElement) => {
    openSearch(wrap);
  })
}

const openSearch = (wrap: HTMLElement) => {
  const inputWrap = query(SEARCH_INPUT_WRAP_SELECTOR, wrap);
  const trigger = query(SEARCH_TRIGGER_SELECTOR, wrap);

  let isOpen = false;

  const openSearch = () => {
    addClass(inputWrap, OPEN_CLASS);
    addClass(trigger, SEARCH_OPEN_CLASS);
  }

  const closeSearch = () => {
    removeClass(inputWrap, OPEN_CLASS);
    removeClass(trigger, SEARCH_OPEN_CLASS);
  }

  const handleClick = (event) => {



    if(wrap.querySelector('.b-search-header__form-mobile--js_init') && location.pathname !== "/news/") return;


      isOpen ? closeSearch() : openSearch();
      isOpen = !isOpen;

  }

  trigger.addEventListener("click", (event) => {
    setTimeout(() => {
      handleClick(event);
    }, 100)
  });
}