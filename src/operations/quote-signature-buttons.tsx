import classnames from "classnames";
import { h, render } from "preact";
import { isNull, only } from "ts-type-guards";
import { log } from "userscripter";

import * as CONFIG from "~src/config";
import { P, Preferences } from "~src/preferences";
import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";

const userMessage = Preferences.get(P.forum_threads._.quote_signature_message);

export default (e: { quickReplyForm: HTMLElement }) => {
    const csrf = session.getCsrfToken();
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    for (const post of only(HTMLElement)(Array.from(forumPosts))) {
        if (post.classList.contains(SITE.CLASS.forumPostByCurrentUser)) {
            // We don't want buttons on the reader's own posts, because they can overflow when the edit button is visible.
            continue;
        }
        const signature = post.querySelector("." + SITE.CLASS.forumPostSignature);
        const controls = post.querySelector("." + SITE.CLASS.forumPostControls);
        const authorLink = post.querySelector(SELECTOR.forumPostAuthorLink);
        let postID: string | null = null;
        try {
            postID = JSON.parse(post.dataset.post || "").postid;
        } catch (_) {
            log.warning(`Could not extract post ID for quote signature button. 'data-post' attribute had this value: ` + post.dataset.post);
        }
        if (controls instanceof HTMLElement && authorLink instanceof HTMLElement) {
            render(form({
                signature,
                postID,
                author: (authorLink.textContent || "").trim(),
                userMessage,
                replyURL: (e.quickReplyForm as HTMLFormElement).getAttribute("action") || "",
                csrf,
            }), controls);
        }
    }
};

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
        <form method="POST" action={props.replyURL} class={CONFIG.CLASS.quoteSignatureButton}>
            {isNull(props.signature) ? [] : [
                <input name={SITE.FORM.name.message} type="hidden" value={message} />,
                <input name={SITE.FORM.name.csrfToken} type="hidden" value={props.csrf} />,
                <input name={SITE.FORM.name.action} type="hidden" value={SITE.FORM.value.preview} />,
            ]}
            <button
                type="submit"
                class={classnames(SITE.CLASS.button, noSignature ? SITE.CLASS.disabled : null)}
                title={noSignature ? T.general.quote_signature_tooltip_no_signature(props.author) : T.general.quote_signature_tooltip}
                disabled={noSignature}
            >
                <span class={SITE.CLASS.label}>{T.general.quote_signature_label}</span>
            </button>
        </form>
    );
}

declare namespace session {
    function getCsrfToken(): string
}
