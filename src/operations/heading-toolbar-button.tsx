import { render } from "preact";

import * as SITE from "~src/site";
import * as T from "~src/text";

import { toolbarButton } from "./logic/editing-tools";
import { wrap_tag } from "./logic/textarea";

export default (e: {
    textarea: HTMLElement,
    strikeButton: HTMLElement,
}) => {
    render(headingToolbarButton(e.textarea as HTMLTextAreaElement), e.strikeButton.parentElement as HTMLElement);
}

const headingToolbarButton = toolbarButton({
    action: wrap_tag({ tag: SITE.TAG.h, parameterized: false, block: false }),
    class: SITE.CLASS.toolbarHeadingButton,
    tooltip: T.general.tooltip_h,
    style: "background: none;", // to override gray background for .header
});
