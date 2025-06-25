import { intiAnualScript } from "./annual";
import { clipboardLink } from "./clipboard"
import { initCountrySelect } from "./countrySelect";
import { downloadBtn } from "./downloadBtn";
import { initOlympicPolicy } from "./olympicDate";
import { pastEventsLoadInit } from "./pastEventsLoadInit";
import { initPolicyForm } from "./policyForm";
import { initResizeInput } from "./resizeInput";
import { intiOpenSearch } from "./search";
import { initSecondName } from "./secondName";
import { shareLink } from "./shareLink";
import { initSimpleTabs } from "./tabs";
import { urlQuery } from "./urlQuery";
import { initVideoBanner } from "./videoBanner";

export const staticScripts = () => {
  clipboardLink();
  shareLink();
  urlQuery();
  pastEventsLoadInit();
  initCountrySelect();

  downloadBtn();
  intiAnualScript();
  initOlympicPolicy();
  initSecondName();
  initResizeInput();
  initVideoBanner();

  initSimpleTabs();
  
  document.addEventListener('DOMContentLoaded', () => {
    intiOpenSearch();
  });
  initPolicyForm();
}