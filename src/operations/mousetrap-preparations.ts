import * as SITE from "globals-site";
import * as CONFIG from "globals-config";

export default () => {
    CONFIG.FOCUSABLE_ELEMENTS.forEach(tagName => {
        document.querySelectorAll(tagName).forEach(element => {
            element.classList.add(CONFIG.CLASS.mousetrap);
        });
    });
}
