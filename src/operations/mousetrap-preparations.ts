import * as CONFIG from "~src/config";

export default () => {
    for (const tagName of CONFIG.FOCUSABLE_ELEMENTS) {
        for (const element of document.querySelectorAll(tagName)) {
            element.classList.add(CONFIG.CLASS.mousetrap);
        }
    }
};
