import dom from "js/libs/DOM";
import { addClass, query, queryList, removeClass } from "js/utils";

const INTRA_FORM_SELECTOR = ".js-intra-form";

const DATE_SELECT_SELECTOR = ".js-date-select"
const TRANSPORT_SELECT_SELECTOR = ".js-transport-select"

const DATE_RADIO_SELECTOR = ".js-date-radio"

const TRANSFER_VALUE = "need-transfer";
const DATA_VALUE = "Без-проживания";

const VALUES_TO_EXCLUDE = [
  "Без-проживания",
  "10-11 марта - 1 сутки",
  "11-12 марта - 1 сутки",
]

const ACTIVE_CLASS = "active";
const DISABLED_CLASS = "disabledOption";

export const initIntraForm = () => {
  dom(INTRA_FORM_SELECTOR).each((wrap) => {
    intraForm(wrap)
  })
}

const intraForm = (wrap: HTMLElement) => {
  const dateSelect = query<HTMLSelectElement>(DATE_SELECT_SELECTOR, wrap);
  const transportSelect = query<HTMLSelectElement>(TRANSPORT_SELECT_SELECTOR, wrap);

  const dateOptions = queryList('.option', dateSelect.parentElement);
  const transportOptions = queryList('.option', transportSelect.parentElement);

  const currentDate = query('.current', dateSelect.parentElement);
  const currentTransport = query('.current', transportSelect.parentElement);


  const handleTransferSelect = () => {


    
    dateOptions.forEach((option) => {
      removeClass(option, "selected");
      addClass(option, "disabledOption");
    })
    
    
    removeClass(dateOptions[3], "disabledOption");
    
    if(!dateSelect.value) return;
    
    addClass(dateOptions[3], "selected");
    dateSelect.value = "10-12 марта - 2 суток";
    currentDate.innerHTML = "10-12 марта - 2 суток";
  }

  const resetSelect = () => {
    dateOptions.forEach((option) => {
      removeClass(option, "disabledOption");
    })
    
  }

  const handleNoAccommodationSelect = () => {

    addClass(transportOptions[1], "disabledOption");
    
    if(transportSelect.value === "need-transfer") {
      transportSelect.value = "";
      currentTransport.innerHTML = "";

    }
    
  }

  const resetDate = () => {
    removeClass(transportOptions[1], "disabledOption");
  }

  transportSelect.addEventListener("input", () => {
    const selectValue = transportSelect.value;



    if(selectValue === TRANSFER_VALUE) {
      handleTransferSelect();
    } else {
      resetSelect();
    }
  });

  const isExluded = (value: string) => {
    return VALUES_TO_EXCLUDE.some(valueToExclude => {
      return valueToExclude === value;
    })
  }

  
  dateSelect.addEventListener("input", () => {
    const selectedValue = dateSelect.value;


    if(isExluded(selectedValue)) {
      handleNoAccommodationSelect();
    } else {
      resetDate();
    }
  })
}