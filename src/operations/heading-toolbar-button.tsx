import { insertAtTheEnd, renderIn } from "~src/operations/logic/render";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { toolbarButton } from "./logic/editing-tools";
import { wrap_tag } from "./logic/textarea";

export default (undoSupport: boolean) => (e: {
    textarea: HTMLElement,
    strikeButton: HTMLElement,
}) => {
    const parent = e.strikeButton.parentElement as Element;
    renderIn(parent, insertAtTheEnd, (
        headingToolbarButton(e.textarea as HTMLTextAreaElement, undoSupport)
    ));
};

const headingToolbarButton = toolbarButton({
    action: wrap_tag({ tag: SITE.TAG.h, parameterized: false, block: false }),
    class: SITE.CLASS.toolbarHeadingButton,
    tooltip: T.general.tooltip_h,
    style: "background: none;", // to override gray background for .header
});
