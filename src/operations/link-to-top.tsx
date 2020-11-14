import { h, render } from "preact";

import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { parent: HTMLElement }) => {
    render((
        <a href="javascript:window.scrollTo(0, 0)" title={T.general.link_to_top_tooltip}>
            <svg class={SITE.CLASS.icon} style="transform: rotate(-90deg);">
                <use xlinkHref="#icon_double_arrow_right" />
            </svg>
        </a>
    ), e.parent);
};
