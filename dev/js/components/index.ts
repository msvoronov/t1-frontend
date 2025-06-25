import { Context } from "js/libs/DOM/types";
import { initDoubleSelect } from "./DoubleSelect";
import { initFileInput } from "./FileInput";
import { initInputText } from "./InputText";
import { initForm } from "./Form";
import { initResizeList } from "./ResizeList";
import { initBlogList } from "./BlogList";
import { initSearchSelect } from "./SearchSelect";
import { initTagsSelect } from "./TagsSelect";
import { initShowMoreWrap } from "./ShowMoreWrap";
import { initDropdown } from "./dropdown/dropdown";
import { initMobileSubmenu } from "./MobileSubmenu";
import { initVideo } from "./Video";
import { initAccreditationForm } from "./AccreditationForm";
import { initFilteredContent } from "./FilteredContent";
import { initReportsStatements } from "./ReportsStatements";
import { initCustomSelect } from "./CustomSelect";
import { initFormCopy } from "./FormCopy";

export const dynamicComponents = (context?: Context) => {
    initFileInput(context);
    initInputText(context);
    initForm(context);
    initBlogList(context);
    initDropdown(context);
    initDoubleSelect();
    initCustomSelect(context);
};

export const staticComponents = () => {
    initResizeList();
    initSearchSelect();
    initTagsSelect();
    initShowMoreWrap();
    initMobileSubmenu();
    initVideo();
    initAccreditationForm();
    initFilteredContent();
    initReportsStatements();
    initFormCopy();
};
