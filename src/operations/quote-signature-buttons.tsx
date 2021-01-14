import * as BB from "bbcode-tags";
import classnames from "classnames";
import { Fragment, h, JSX } from "preact";
import { isNull, isString, only } from "ts-type-guards";
import { log } from "userscripter";

import * as CONFIG from "~src/config";
import { insertAtTheEnd, renderIn } from "~src/operations/logic/render";
import { P, Preferences } from "~src/preferences";
import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";

const userMessage = Preferences.get(P.forum_threads._.quote_signature_message);

export default () => {
    const csrf = session.getCsrfToken();
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    for (const post of only(HTMLElement)(Array.from(forumPosts))) {
        if (post.classList.contains(SITE.CLASS.forumPostByCurrentUser)) {
            // We don't want buttons on the reader's own posts, because they can overflow when the edit button is visible.
            continue;
        }
        const signature = post.querySelector("." + SITE.CLASS.forumPostSignature);
        const controls = post.querySelector("." + SITE.CLASS.forumPostControls);
        const authorName = post.querySelector(SELECTOR.forumPostAuthorLink)?.textContent?.trim();
        const quoteURL = post.querySelector<HTMLAnchorElement>(SELECTOR.quoteButton)?.href;
        if (controls === null) return couldNotExtractFromPost("controls", post.id);
        if (!isString(authorName)) return couldNotExtractFromPost("author name", post.id);
        if (!isString(quoteURL)) return couldNotExtractFromPost("quote URL", post.id);
        renderIn(controls, insertAtTheEnd, button({
            signature,
            authorName,
            userMessage,
            quoteURL,
            csrf,
        }));
    }
};

function button(props: {
    signature: Element | null,
    authorName: string,
    userMessage: string,
    quoteURL: string,
    csrf: string,
}): JSX.Element {
    const noSignature = isNull(props.signature);
    return (
        <button
            class={classnames(CONFIG.CLASS.quoteSignatureButton, SITE.CLASS.button, noSignature ? SITE.CLASS.disabled : null)}
            title={noSignature ? T.general.quote_signature_tooltip_no_signature(props.authorName) : T.general.quote_signature_tooltip}
            disabled={noSignature}
            onClick={() => {
                fetch(props.quoteURL, { credentials: "same-origin" }) // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
                    .then(response => response.text())
                    .then(responseContent => {
                        const responseDocument = new DOMParser().parseFromString(responseContent, "text/html");
                        const quoteTextarea = responseDocument.querySelector("textarea");
                        if (quoteTextarea === null) {
                            throw couldNotExtract("textarea from fetch response");
                        }
                        const form = document.createElement("form");
                        form.hidden = true;
                        form.method = "POST";
                        form.action = props.quoteURL;
                        renderIn(form, insertAtTheEnd, (
                            <>
                                <input name={SITE.FORM.name.csrfToken} type="hidden" value={props.csrf} />
                                <input name={SITE.FORM.name.action} type="hidden" value={SITE.FORM.value.preview} />
                                <textarea name={SITE.FORM.name.message} hidden>
                                    {withSignatureAndUserMessage({
                                        rawQuote: quoteTextarea.textContent || "",
                                        rawSignature: props.signature?.textContent || "",
                                        userMessage: props.userMessage,
                                    })}
                                </textarea>
                            </>
                        ));
                        document.documentElement.appendChild(form); // Otherwise: "Form submission canceled because the form is not connected"
                        form.submit();
                    })
                    .catch(log.error);
            }}
        >
            <span class={SITE.CLASS.label}>{T.general.quote_signature_label}</span>
        </button>
    );
}

function withSignatureAndUserMessage(x: {
    rawQuote: string
    rawSignature: string
    userMessage: string
}): string {
    const SIGNATURE_FONT_SIZE = "smaller";
    const textToInsert = [
        `\n`,
        `________________________`,
        `\n`,
        BB.start(SITE.TAG.size, SIGNATURE_FONT_SIZE),
        x.rawSignature.trim(),
        BB.end(SITE.TAG.size),
    ].join("");
    return x.rawQuote.replace(/\n*(?=\[\/quote\]\s*$)/, textToInsert) + x.userMessage;
}

function couldNotExtract(what: string): string {
    return `Could not extract ${what}.`;
}

function couldNotExtractFromPost(what: string, htmlId: string): string {
    return couldNotExtract(`${what} from post with id="${htmlId}"`);
}

declare namespace session {
    function getCsrfToken(): string
}
