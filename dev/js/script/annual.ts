import dom from "js/libs/DOM";
import { addClass, query, queryList, removeClass } from "js/utils";

const ANNUAL_SELECTOR = ".js-annual";
const INPUT_SELECTOR = ".js-b-input__field";
const CARD_SELECTOR = ".js-annual-card";

const HIDDEN_CLASS = "hidden";

const YEAR_DATA_ATR = "data-year";

export const intiAnualScript = () => {
  dom(ANNUAL_SELECTOR).each((wrap: HTMLElement) => {
    anualScript(wrap)
  })
}

const anualScript = (wrap: HTMLElement) => {
  const input = query<HTMLSelectElement>(INPUT_SELECTOR, wrap);
  const cards = queryList(CARD_SELECTOR, wrap)

  const handleSelect = () => {
    const value = input.value;

    hideCards();

    showCards(value);
    

  }

  const hideCards = () => {
    cards.forEach((card) => {
      addClass(card, HIDDEN_CLASS);
    })
  }

  const showCards = (value: string) => {
    cards.forEach((card) => {
      if(card.getAttribute(YEAR_DATA_ATR) === value) {
        removeClass(card, HIDDEN_CLASS);
      }
    })
  }

  input.addEventListener("change", handleSelect);

  handleSelect();
}