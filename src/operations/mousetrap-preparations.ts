import * as CONFIG from "~src/config";

export default () => {
    CONFIG.FOCUSABLE_ELEMENTS.forEach(tagName => {
        document.querySelectorAll(tagName).forEach(element => {
            element.classList.add(CONFIG.CLASS.mousetrap);
        });
    });
}
