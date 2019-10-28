import { h, render } from "preact";
import { isNull, only } from "ts-type-guards";

import { isHTMLElement } from ".userscripter/lib/html";

import * as CONFIG from "src/globals-config";
import * as SITE from "src/globals-site";
import P from "src/preferences";
import SELECTOR from "src/selectors";
import * as T from "src/text";
import { logWarning } from "src/userscripter/logging";
import { Preferences } from "src/userscripter/preference-handling";

const userMessage = Preferences.get(P.forum_threads._.quote_signature_message);

export default (e: { quickReplyForm: HTMLElement }) => {
    const csrf = session.getCsrfToken();
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    only(HTMLElement)(Array.from(forumPosts)).forEach(post => {
        if (post.classList.contains(SITE.CLASS.forumPostByCurrentUser)) {
            // We don't want buttons on the reader's own posts, because they can overflow when the edit button is visible.
            return;
        }
        const signature = post.querySelector("." + SITE.CLASS.forumPostSignature);
        const controls = post.querySelector("." + SITE.CLASS.forumPostControls);
        const authorLink = post.querySelector(SELECTOR.forumPostAuthorLink);
        let postID: string | null = null;
        try {
            postID = JSON.parse(post.dataset.post || "").postid;
        } catch (_) {
            logWarning(`Could not extract post ID for quote signature button. 'data-post' attribute had this value: ` + post.dataset.post);
        }
        if (isHTMLElement(controls) && isHTMLElement(authorLink)) {
            render(form({
                signature,
                postID,
                author: authorLink.textContent || "",
                userMessage,
                replyURL: (e.quickReplyForm as HTMLFormElement).getAttribute("action") || "",
                csrf,
            }), controls);
        }
    });
}

function form(props: {
    signature: Element | null,
    postID: string | null,
    author: string,
    userMessage: string,
    replyURL: string,
    csrf: string,
}): JSX.Element {
    const message = isNull(props.signature) ? undefined : [
        `[quote` + (isNull(props.postID) ? "" : ` postid="${props.postID}"`) + ` name="${props.author}"]`,
        (props.signature.textContent || "").trim(),
        `[/quote]`,
        props.userMessage,
    ].join("\n");
    const noSignature = isNull(props.signature);
    return (
        <form method="POST" action={props.replyURL} class={[ SITE.CLASS.forumPostBtnGroup, CONFIG.CLASS.quoteSignatureButton ].join(" ")}>
            {isNull(props.signature) ? [] : [
                <input name="message" type="hidden" value={message} />,
                <input name="csrf" type="hidden" value={props.csrf} />,
                <input name="action" type="hidden" value="doPreview" />,
            ]}
            <button
                type="submit"
                class={SITE.CLASS.button}
                title={noSignature ? T.general.quote_signature_tooltip_no_signature : T.general.quote_signature_tooltip}
                disabled={noSignature}
            >
                <span class={SITE.CLASS.icon}></span>
                <span class={SITE.CLASS.label}>{T.general.quote_signature_label}</span>
            </button>
        </form>
    );
}

declare namespace session {
    function getCsrfToken(): string
}
