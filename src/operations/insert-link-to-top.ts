import * as SITE from "globals-site";
import * as T from "text";

export default (e: { goToLastPageButton: HTMLElement }) => {
    const linkToTop = e.goToLastPageButton.cloneNode(true) as HTMLAnchorElement;
    linkToTop.href = `javascript:window.scrollTo(0, 0)`;
    linkToTop.title = T.general.link_to_top_tooltip;
    linkToTop.style.transform = "rotate(-90deg)";
    e.goToLastPageButton.insertAdjacentElement("afterend", linkToTop);
}
