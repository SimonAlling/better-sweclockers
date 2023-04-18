import { h } from "preact";

import { insertAtTheEnd, renderIn } from "~src/operations/logic/render";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { parent: HTMLElement }) => {
    renderIn(e.parent, insertAtTheEnd, (
        <a href="javascript:window.scrollTo(0, 0)" title={T.general.link_to_top_tooltip}>
            <svg class={SITE.CLASS.icon} style="transform: rotate(-90deg);">
                <use xlinkHref="/gfx/iconmap.svg?v=20221125#icon_double_arrow_right" />
            </svg>
        </a>
    ));
};
