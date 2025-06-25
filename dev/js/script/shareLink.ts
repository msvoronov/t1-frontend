import dom from "js/libs/DOM"

const SHARE_LINK_SELECTOR = ".js-share-link";

const MASK_DATA_ATR = "data-mask";

export const shareLink = () => {
  dom(SHARE_LINK_SELECTOR).each((wrap) => {
    initShareLink(wrap as HTMLLinkElement);
  })
}

const initShareLink = (wrap: HTMLLinkElement) => {
  const mask = wrap.getAttribute(MASK_DATA_ATR);
  wrap.href = mask + location;
}