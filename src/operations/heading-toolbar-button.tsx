import { insertAtTheEnd, renderIn } from "~src/operations/logic/render";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { toolbarButton } from "./logic/editing-tools";
import { wrap_tag } from "./logic/textarea";

export default (undoSupport: boolean) => (e: {
    textarea: HTMLTextAreaElement,
    strikeButton: HTMLElement, // Need not be more specific because we're only interested in its parent.
}) => {
    const parent = e.strikeButton.parentElement as Element;
    renderIn(parent, insertAtTheEnd, (
        headingToolbarButton(e.textarea, undoSupport)
    ));
};

const headingToolbarButton = toolbarButton({
    action: wrap_tag({ tag: SITE.TAG.h, parameterized: false, block: false }),
    class: SITE.CLASS.toolbarHeadingButton,
    tooltip: T.general.tooltip_h,
    style: "background: none;", // to override gray background for .header
});
