import dom from "js/libs/DOM";
import { query } from "js/utils";

const DATE_INPUT_SELECTOR = ".js-olympic-date";
const POLICY_SELECTOR = ".js-olympic-policy";

const AGE = 14;

const MAX_AGE_DATA_ATR = 'data-max-age'
const MIN_AGE_DATA_ATR = 'data-min-age'

const UNDER_FOURTEEN_HREF = "/assets/docs/blank.pdf";
const OVER_FOURTEEN_HREF= "https://t1.ru/documents/personal_data_politics/";

export const initOlympicPolicy = () => {
  dom(DATE_INPUT_SELECTOR).each((input: HTMLInputElement) => {
    olympicPolicy(input)
  })
}

const olympicPolicy = (input: HTMLInputElement) => {

  const policyLink = query<HTMLLinkElement>(POLICY_SELECTOR, document);

  const maxAge = Number(input.getAttribute(MAX_AGE_DATA_ATR));
  const minAge = Number(input.getAttribute(MIN_AGE_DATA_ATR));

  function generateDateRange() {
    const currentYear = new Date().getFullYear();

    const minYear = currentYear - maxAge;
    const maxYear = currentYear - minAge;
    
    const minDate = new Date(`${minYear}-01-01`);
    const maxDate = new Date(`${maxYear}-12-31`);

    input.setAttribute('max', maxDate.toISOString().slice(0, 10))
    input.setAttribute('min', minDate.toISOString().slice(0, 10))

    return {
    minDate: minDate.toISOString().split('T')[0],
    maxDate: maxDate.toISOString().split('T')[0]
  };
}


  const getIsUnderAge = (value: string) => {
    const [year, month, day] = value.split('-');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    let age = currentYear - parseInt(year);
    if (parseInt(month) > currentMonth || (parseInt(month) === currentMonth && parseInt(day) > currentDay)) {
      age--;
    }

    return age < AGE;
  }

  const handleDateInput = ({target}: InputEvent) => {
    const value = (target as HTMLInputElement).value;

    const isUnderAge = getIsUnderAge(value);

    policyLink.href = isUnderAge ? UNDER_FOURTEEN_HREF : OVER_FOURTEEN_HREF;
  }

  generateDateRange();
  input.addEventListener('input', handleDateInput);
}