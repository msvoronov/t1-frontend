import dom from "js/libs/DOM"
import { Component } from "./utils/Component";

const MOBILE_SUBMENU_SELECTOR = ".js-mobile-submenu";
const MOBILE_SUBMENU_TRIGGER_SELECTOR = ".js-submenu-trigger";
const MOBILE_SUBMENU_SUBMENU_WRAP_SELECTOR = ".js-submenu-wrap";
const MOBILE_MENU_BTN_SELECTOR = ".js-mobile-menu-btn";

const ACTIVE_CLASS = "active";

const burgerBtn = document.querySelector('.b-menu-header-mobile__burger');
const headerMobileBody = document.querySelector('.b-menu-header-mobile__body');

let isFirst = true

if(burgerBtn) {



burgerBtn.addEventListener("click", () => {
  if(location.pathname === '/news/') {

    if(innerWidth >= 960) return;

    if(isFirst) {
      isFirst = false;

      setTimeout(() => {
        burgerBtn.classList.add("b-menu-header-mobile__burger--active");
        headerMobileBody.classList.add("b-menu-header-mobile__body--active")
      }, 100)
    }

    if(burgerBtn.classList.contains("b-menu-header-mobile__burger--active")) {
      burgerBtn.classList.remove("b-menu-header-mobile__burger--active");
      headerMobileBody.classList.remove("b-menu-header-mobile__body--active")
    } else {
      burgerBtn.classList.add("b-menu-header-mobile__burger--active");
      headerMobileBody.classList.add("b-menu-header-mobile__body--active")
    }
  }


  if(location.pathname === '/solutions/' ||
    location.pathname === '/vendors/' ||
    location.pathname === '/events/' ||
    location.pathname === '/projects/'
  ) {

    if(innerWidth >= 960) return;
    
    if(burgerBtn.classList.contains("b-menu-header-mobile__burger--active")) {
      burgerBtn.classList.remove("b-menu-header-mobile__burger--active");
      headerMobileBody.classList.remove("b-menu-header-mobile__body--active")
    } else {
      burgerBtn.classList.add("b-menu-header-mobile__burger--active");
      headerMobileBody.classList.add("b-menu-header-mobile__body--active")
    }
  }
})
}

export const initMobileSubmenu = () => {
  dom(MOBILE_SUBMENU_SELECTOR).each((wrap) => {
    new MobileSubmenu(wrap);
  })
}

class MobileSubmenu extends Component {
  
  triggers: Array<HTMLElement>;
  submenuWrap: HTMLElement;

  burgerMenuBtn: HTMLElement;
  isOpen: boolean;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;

    this.triggers = this.queryList(MOBILE_SUBMENU_TRIGGER_SELECTOR, wrap);
    this.submenuWrap = this.query(MOBILE_SUBMENU_SUBMENU_WRAP_SELECTOR, wrap);
    this.burgerMenuBtn = this.query(MOBILE_MENU_BTN_SELECTOR, document);

    this.isOpen = false;

    this.initComponent();
  }

  initComponent = () => {
    this.initTrigger()
    this.initCloseMenu();
  }

  initCloseMenu = () => {
    this.burgerMenuBtn.addEventListener("click", () => {this.handleCloseMenu()});
  }

  handleCloseMenu = () => {
    if(this.isOpen) {
      this.closeSubmenu();
    }
  }

  initTrigger = () => {
    this.triggers.forEach((trigger) => {

      trigger.addEventListener("click", this.handleClick)
    })
  }

  handleClick = () => {
    this.isOpen ? this.closeSubmenu() : this.openSubenu();
  }

  openSubenu = () => {
    this.setClass(this.submenuWrap, ACTIVE_CLASS);
    this.isOpen = true;
  }
  
  closeSubmenu = () => {
    this.removeClass(this.submenuWrap, ACTIVE_CLASS);
    this.isOpen = false;
  }
}