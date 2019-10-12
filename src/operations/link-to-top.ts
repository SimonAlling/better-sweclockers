import * as CONFIG from "globals-config";
import * as SITE from "globals-site";
import * as T from "text";

export default (e: { parent: HTMLElement }) => {
    const linkToTop = document.createElement("a");
    linkToTop.href = `javascript:window.scrollTo(0, 0)`;
    linkToTop.textContent = T.general.link_to_top;
    linkToTop.classList.add(CONFIG.CLASS.linkToTop);
    e.parent.style.marginLeft = "0";
    e.parent.insertAdjacentElement("afterbegin", linkToTop);
}
