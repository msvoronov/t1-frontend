import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { inEvent, toggleClass } from "js/utils";

const VIDEO_MODAL_SELECTOR = ".js-video-modal";
const VIDEO_MODAL_WRAP_SELECTOR = ".js-video-modal-wrap";
const VIDEO_CLOSE_SELECTOR = ".js-video-close";

const VIDEO_CONTAINER_SELECTOR = ".js-video-container";
const VIDEO_WRAP_SELECTOR = ".js-video-wrap";
const VIDEO_SELECTOR = ".js-video";
const VIDEO_BTN_SELECTOR = ".js-video-btn";
const VIDEO_TIMER_SELECTOR = ".js-timer";

const ACTIVE_CLASS = "active";
const STOPED_CLASS = "stoped";
const VIDEO_MODAL_CLASS = "js-video-modal";
const PLAYING_CLASS = "playing";
const SCROLL_DISABLE_CLASS = "scroll-disable";


export const initVideo = () => {
  dom(VIDEO_WRAP_SELECTOR).each((wrap) => {
    new Video(wrap);
  });
}

class Video extends Component {
  
  private videoContainer: HTMLElement;
  private video: HTMLVideoElement;
  private timer: HTMLElement;
  private btn: HTMLElement;
  private isVideoStoped: boolean;
  private isVideoPlaying: boolean;

  private modal: HTMLElement;
  private closeBtn: HTMLElement;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;


    this.video = this.query(VIDEO_SELECTOR, wrap);
    this.timer = this.query(VIDEO_TIMER_SELECTOR, wrap);
    this.btn = this.query(VIDEO_BTN_SELECTOR, wrap);

    this.modal = this.query(VIDEO_MODAL_WRAP_SELECTOR, document);
    this.videoContainer = this.query(VIDEO_CONTAINER_SELECTOR, wrap);
    this.closeBtn = this.query(VIDEO_CLOSE_SELECTOR, wrap);

    this.isVideoStoped = true;
    this.isVideoPlaying = false;

    this.initComponent();
  }

  private initComponent = () => {

    if(this.hasClass(this.wrap, VIDEO_MODAL_CLASS)) {
      this.initModal();
    }

    this.initVideoStart();
    this.initBtn();
    this.initTimer();
    this.setInitialTime();
  }

  private initModal = () => {
    this.videoContainer.addEventListener("click", this.handleWrapClick);

    this.initClose();
    
  }

  private handleWrapClick = (event: MouseEvent) => {
    event.stopPropagation();

    this.openModal();
    
  }

  private initClose = () => {
    this.initBtnClose();
    this.initAreaClose();
    
  }
  
  private initBtnClose = () => {
    this.closeBtn.addEventListener("click", this.handleClose);

  }

  private initAreaClose = () => {
    this.modal.addEventListener("click", this.handleModalClick);
  }

  private handleModalClick = (event: MouseEvent) => {
    event.preventDefault();

    if(inEvent(event, VIDEO_CONTAINER_SELECTOR)) {
      return;
    }

    this.handleClose(event);

  }

  private handleClose = (event: MouseEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.closeModal();
  }

  private openModal = () => {
    const root = document.getElementsByTagName( 'html' )[0];
    this.setClass(this.modal, ACTIVE_CLASS);

    this.modal.appendChild(this.videoContainer);

    this.setClass(root, SCROLL_DISABLE_CLASS);
  }
  
  private closeModal = () => {
    const root = document.getElementsByTagName( 'html' )[0];

    this.removeClass(this.modal, ACTIVE_CLASS);
  
    this.wrap.appendChild(this.videoContainer);

    this.pauseVideo()
    this.isVideoPlaying = false;
    this.removeClass(this.wrap, PLAYING_CLASS);

    this.removeClass(root, SCROLL_DISABLE_CLASS);
  }

  private setInitialTime = () => {

    this.video.addEventListener('canplaythrough', () => {
      
      const hours = Math.floor(this.video.duration / 3600);
      const minutes = Math.floor((this.video.duration % 3600) / 60);
      const seconds = Math.floor(this.video.duration % 60);

      if(!this.timer) return;

      this.timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      if(hours) {
        this.timer.innerHTML = `${hours}:${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

      }
    })

  }

  private initVideoStart = () => {
    this.btn.addEventListener("click", this.handleInitVideo);
  }

  private initBtn = () => {
    this.btn.addEventListener("click", this.togleVideo)
  }

  private togleVideo = () => {
    this.isVideoPlaying ? this.pauseVideo() : this.playVideo();
    this.isVideoPlaying = !this.isVideoPlaying;

    
    toggleClass(this.wrap, PLAYING_CLASS);
  }

  private handleInitVideo = () => {
    if(!this.isVideoStoped) return;

    this.isVideoStoped = true;
    this.playVideo();
    this.removeClass(this.wrap, STOPED_CLASS);
  }

  private playVideo = () => {
    this.video.play();
  }

  private pauseVideo = () => {
    this.video.pause();
  }

  private initTimer = () => {
    this.video.addEventListener("timeupdate", this.handleTimeUpdate);
  }

  private handleTimeUpdate = () => {
      const hours = Math.floor(this.video.currentTime / 3600);
      const minutes = Math.floor((this.video.currentTime % 3600) / 60);
      const seconds = Math.floor(this.video.currentTime % 60);

      if(!this.timer) return;


      this.timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      if(hours) {
        this.timer.innerHTML = `${hours}:${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

      }

    if(this.video.currentTime === this.video.duration) {
      this.video.currentTime = 0;
      this.isVideoPlaying = false;

      this.isVideoStoped = true;
      this.setClass(this.wrap, STOPED_CLASS);
      this.removeClass(this.wrap, PLAYING_CLASS);
    }
  }
}