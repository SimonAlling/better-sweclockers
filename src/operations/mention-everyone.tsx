import unique from "array-uniq";
import { h, render } from "preact";

import { FAILURE } from ".userscripter/lib/operation-manager";

import * as CONFIG from "src/globals-config";
import * as SITE from "src/globals-site";
import { mention } from "src/operations/edit-mode";
import  SELECTOR from "src/selectors";
import * as T from "src/text";

export default (e: {
    forumPostContainer: HTMLElement,
    quickReplyForm: HTMLElement,
    replyButton: HTMLElement,
}) => {
    const button = mentionEveryoneButton({
        message: usersToMention(e.forumPostContainer).map(mention).join(" "),
        replyURL: (e.quickReplyForm as HTMLFormElement).getAttribute("action") || "",
        csrf: session.getCsrfToken(),
    });
    if (document.querySelector(`${SELECTOR.forumPost} ${SELECTOR.forumPostAuthorLink}`) === null) {
        // Broken thread participant detection.
        return FAILURE;
    }
    const placeholder = document.createElement("form");
    e.replyButton.insertAdjacentElement("beforebegin", placeholder);
    render(button, e.replyButton.parentElement as HTMLElement, placeholder);
}

function usersToMention(forumPostContainer: HTMLElement): string[] {
    const postBySomeoneElse = SELECTOR.forumPost + `:not(.${SITE.CLASS.forumPostByCurrentUser})`;
    const selector = `${postBySomeoneElse} ${SELECTOR.forumPostAuthorLink}`;
    const nameLinks = Array.from(forumPostContainer.querySelectorAll(selector));
    return unique(nameLinks.map(e => e.textContent as string));
}

function mentionEveryoneButton(props: {
    message: string,
    replyURL: string,
    csrf: string,
}): JSX.Element {
    return (
        <form method="POST" action={props.replyURL} class={CONFIG.CLASS.mentionEveryoneButton}>
            <input name="message" type="hidden" value={props.message} />
            <input name="csrf" type="hidden" value={props.csrf} />
            <input name="action" type="hidden" value="doPreview" />
            <button
                type="submit"
                class={SITE.CLASS.button}
                title={T.general.mention_everyone_tooltip}
            >
                {T.general.mention_everyone_label}
            </button>
        </form>
    );
}

declare namespace session {
    function getCsrfToken(): string
}
