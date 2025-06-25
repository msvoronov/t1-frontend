import dom from "js/libs/DOM"
import { addClass, removeClass } from "js/utils";

const CLIPBOARD_SELECTOR = ".js-clipboard-link";

const MSG_TEXT = "Сохранено в буфер обмена";

const MSG_CLASS = "clipboard-msg";
const CLICKED_CLASS = "clicked";


export const clipboardLink = () => {
  dom(CLIPBOARD_SELECTOR).each((wrap) => {
    initClipboardLink(wrap);
  })
}

const initClipboardLink = (wrap: HTMLElement) => {

  const createClipboardmsgModal = (): HTMLElement => {
    
    const msg = document.createElement('div');
    msg.innerHTML = MSG_TEXT;
    addClass(msg, MSG_CLASS);

    return msg
  }

  const handleCopy = () => {
    addClass(wrap, CLICKED_CLASS);
    
    const msg = createClipboardmsgModal();
    document.body.appendChild(msg);
    
    msg.addEventListener('animationend', () => {
      document.body.removeChild(msg);
      removeClass(wrap, CLICKED_CLASS);
    }, {once: true});
  }

  const handleClick = () => {
    if(navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(handleCopy)
    }
  }

  wrap.addEventListener("click", handleClick);
}