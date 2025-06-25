import dom from "js/libs/DOM";

const URL_QUERY_SELECTOR = ".js-url-query";

export const urlQuery = () => {
  dom(URL_QUERY_SELECTOR).each((input) => {
    initUrlQuery(input as HTMLInputElement);
  })
}

const initUrlQuery = (input: HTMLInputElement) => {
  const url = new URL(location.href);
  let paramsString = url.search.slice(1);

  input.value = paramsString;
}
