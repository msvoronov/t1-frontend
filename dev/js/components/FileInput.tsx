// import { addInputError } from "js/form/validate";
import React from "../libs/React";
import dom from "js/libs/DOM";
import { Context } from "js/libs/DOM/types";
import { Component } from "./utils/Component";
import { addInputError } from "js/form/validate";


const FILE_FIELD_SELECTOR = ".js-c-file";
const FILE_INPUT_SELECTOR = "input[type=file]";
const FILE_LABEL_SELECTOR = ".js-c-file-label";
const FILE_LIST_SELECTOR = ".js-c-file-list";

const MAX_COUNT_ATR = "data-max-count";

const MULTIPLE_ATR = "multiple"

export const initFileInput = (context: Context) => {
    dom(FILE_FIELD_SELECTOR, context).each((wrap) => {
        new FileInput(wrap);
    })
}

class FileInput extends Component {
    private input: HTMLInputElement;
    private listWrap: HTMLElement;
    private label: HTMLLabelElement;

    private isMultiple: boolean;

    private inputFiles: Array<File>;

    private maxCount: number;

    constructor(wrap: HTMLElement) {
        super(wrap);

        this.wrap = wrap;

        this.input = this.query(FILE_INPUT_SELECTOR, this.wrap);
        this.listWrap = this.query(FILE_LIST_SELECTOR, this.wrap);
        this.label = this.query(FILE_LABEL_SELECTOR, this.wrap);

        this.isMultiple = this.input.hasAttribute(MULTIPLE_ATR);

        this.inputFiles = [];

        this.maxCount = Number(this.input.getAttribute(MAX_COUNT_ATR));

        this.initComponent();
    }

    private initComponent = () => {
        
        this.initInput()
    }

    private initInput = () => {
        this.input.addEventListener("change", this.handleInput)
    }

    private handleInput = (e: Event) => {

        if (!this.input.files.length) return;
        if (!this.isMultiple) {
            this.inputFiles = [];
        }

        Array.from(this.input.files).forEach((file) => {
            if (!this.validateFileFormat(file, this.input.dataset.accept)) {
                return addInputError(this.input, "fileExtensions", [
                    this.input.dataset.accept,
                ]);
            }
            if (!this.validateFileSize(file, +this.input.dataset.size)) {
                return addInputError(this.input, "fileSize", [this.input.dataset.size]);
            }
            if (!this.validateFileMinSize(file, +this.input.dataset.size)) {
                return addInputError(this.input, "fileInvalid");
            }
            if (!this.validateMaxFileCount()) {
                return addInputError(this.input, "fileCount", [this.input.dataset.maxCount]);
            }

            this.inputFiles.push(file);
        });
        this.renderFileList();

    }

    private renderFileList = () => {
        const dt = new DataTransfer();
        this.listWrap.innerHTML = "";
        this.inputFiles.forEach((file, index) => {
            dt.items.add(file);
            this.listWrap.appendChild(this.createListItem(file, index));
        });
        this.input.files = dt.files;
    }

    private createListItem  = (file: File, index: number) => {

        let regName = /.*\./gi;
        let regType = /\..*/gi;
        let fileName = file.name.match(regName)[0].replace(/\./, "");
        let fileType = file.name.match(regType)[0];

        return(
            <li class="b-file__item">
                <div className="b-file__item__name">
                    <span class="b-file__item__text" innerHTML={fileName}>{" "}</span>
                    <span class="b-file__item__type" innerHTML={fileType}>{" "}</span>
                </div>
                <div class="b-file__item__cross js-c-file-remove" onclick={() => this.deleteListItem(index)}></div>
            </li>
        )

    }

    private deleteListItem = (index: number) => {
        const dt = new DataTransfer();

        let newFiles: File[] = [];

        this.inputFiles.forEach((file, i) => {
            if (index === i) return;
            dt.items.add(file);
            newFiles.push(file);
        });

        this.input.files = dt.files;
        this.inputFiles = newFiles;
        this.renderFileList();
    }

    private validateFileFormat = (file: File, accept: string) => {
        if (!accept) return true;
        let isFormat = false;
    
        for (let format of accept.split(", ")) {
            if (file.name.match(format)) {
                isFormat = true;
            }
        }
    
        return isFormat;
    };

    private validateFileSize = (file: File, size = 10) => {
        const isMax = file.size > size * 1024 * 1024;
        return isMax === false;
    };
    private validateFileMinSize = (file: File, size = 10) => {
        const isMax = file.size === 0;
        return isMax === false;
    };

    private validateMaxFileCount = () => {
        return this.inputFiles.length < this.maxCount
    }

}