import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "selectors";
import * as T from "text";
import { h, render } from "preact";
import { only, isNull } from "ts-type-guards";
import { isHTMLElement } from "lib/html";
import { logWarning } from "userscripter/logging";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";

const userMessage = Preferences.get(P.forum_threads._.quote_signature_message);

export default (e: { quickReplyForm: HTMLElement }) => {
    const csrf = session.getCsrfToken();
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    only(HTMLElement)(Array.from(forumPosts)).forEach(post => {
        const signature = post.querySelector("." + SITE.CLASS.forumPostSignature);
        const controls = post.querySelector("." + SITE.CLASS.forumPostControls);
        if (post.classList.contains(SITE.CLASS.isReader)) {
            return; // (user's own post)
        }
        const authorLink = post.querySelector(SELECTOR.forumPostAuthorLink);
        let postID: string | null = null;
        try {
            postID = JSON.parse(post.dataset.post || "").postid;
        } catch (err) {
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
                title={T.general.quote_signature_tooltip}
                disabled={isNull(props.signature)}
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
