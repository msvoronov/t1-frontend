import dom from "js/libs/DOM";
import { addClass, query, removeClass } from "js/utils";

const RESIZE_WRAP_SELECTOR = ".js-resize-input";
const RESIZE_LABEL_SELECTOR = ".js-resize-label";

const padding = 32;

export const initResizeInput = () => {
  dom(RESIZE_WRAP_SELECTOR).each((wrap: HTMLElement) => {
    resizeInput(wrap)
  })
} 

const resizeInput = (wrap: HTMLElement) => {

  const label = query(RESIZE_LABEL_SELECTOR, wrap);

  const input = label.parentElement;


  function countLinesInElement(element) {
        // Получаем высоту элемента
    const elementHeight = element.clientHeight;

    // Получаем стиль шрифта
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);

    // Учитываем масштаб элемента, если он есть
    const transform = computedStyle.transform;
    let scale = 1; // По умолчанию масштаб равен 1

    if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
            const values = matrix[1].split(',').map(parseFloat);
            scale = values[0]; // Значение по X, которое используется для масштаба
        }
    }

    // Рассчитываем количество строк
    const numberOfLines = Math.floor(elementHeight / (lineHeight * scale));

    return numberOfLines;
}

  const resize = () => {
    const linesCount = countLinesInElement(label);

    if(linesCount === 2 && input.classList.contains('has-value')) return
    const labelHeight = label.getBoundingClientRect().height;
    wrap.style.height = `${labelHeight + padding}px`



    linesCount === 2 ? addClass(label, 'double-line') : removeClass(label, 'double-line')

  }


  
  window.addEventListener('resize', resize)


  resize();
}