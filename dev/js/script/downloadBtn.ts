import dom from "js/libs/DOM";
import { ajax } from "js/libs/DOM/fn";
import { Context } from "js/libs/DOM/types";

const FILE_NAME_SELECTOR = ".js-file-name"

export const downloadBtn = () => {
    dom(".js-download").each((el) => {
        initDowloadBtn(el);
    })
}

const initDowloadBtn = (el: HTMLElement) => {
    el.addEventListener("click", () => {
        handlClick(el);
    })
}

const handlClick = async (el: HTMLElement) => {


    let url = el.getAttribute(
        "data-ajax-url"
    );

    let btn = el;
    let filePath;
    btn?.classList.add("loading");

    // const ajax = Ajax.init(url);

    let req = await ajax({ url })

    onSuccess(req.response, url);

}

const onSuccess = (data, url: string) => {


    let type = data.type;
    let blob = new Blob([data], { type });

    let a = document.createElement("a");
    let newUrl = window.URL.createObjectURL(blob);
    a.href = newUrl;
    let fileType = url.split("/")[url.split("/").length - 1];
    let m = fileType ? fileType.match(/\.([^.]+)$/)[1] : "xlsx";

    const name = a.href.split('/');
    const pathName = name[name.length -1];
    a.download = `${pathName}.${m}`;
    document.body.append(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}