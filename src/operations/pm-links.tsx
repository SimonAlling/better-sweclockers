import * as BB from "bbcode-tags";
import { h, render } from "preact";
import { isNumber, isString, only } from "ts-type-guards";
import { log } from "userscripter";

import * as CONFIG from "~src/config";
import ICON from "~src/icons/pm.svg";
import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";
import { r } from "~src/utilities";

export default () => {
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    const ourUserID = SITE.getUserID();
    if (!isNumber(ourUserID)) {
        return couldNotExtract("current user's ID");
    }
    const threadTitle = document.querySelector(SELECTOR.threadTitle)?.textContent;
    if (!isString(threadTitle)) {
        return couldNotExtract("thread title");
    }
    for (const post of only(HTMLElement)(Array.from(forumPosts))) {
        try {
            const parsedJSON = JSON.parse(post.dataset.post || "");
            const userID = parsedJSON.userid;
            const postID = parsedJSON.postid;
            const profileDetails = post.querySelector("." + SITE.CLASS.forumPostProfileDetails);
            const quoteButton = post.querySelector<HTMLAnchorElement>(SELECTOR.quoteButton);
            const authorName = post.querySelector(SELECTOR.forumPostAuthorLink)?.textContent;
            if (!isNumber(userID)) return couldNotExtractFromPost("user ID", post.id);
            if (!isNumber(postID)) return couldNotExtractFromPost("post ID", post.id);
            if (!isString(authorName)) return couldNotExtractFromPost("author name", post.id);
            if (profileDetails === null) return couldNotExtractFromPost("profile details", post.id);
            if (quoteButton === null) return couldNotExtractFromPost("quote button", post.id);
            const form = render((
                <form hidden method="post" action={SITE.PATH.newPrivateMessage(ourUserID)}>
                    <input name={SITE.FORM.name.recipients} value={authorName} />
                    <input name={SITE.FORM.name.title} value={threadTitle} />
                    <input name={SITE.FORM.name.csrfToken} value={session.getCsrfToken()} />
                    <input name={SITE.FORM.name.action} value="doPreview" />
                </form>
            ), profileDetails) as HTMLFormElement;
            render((
                <button
                    dangerouslySetInnerHTML={{__html: ICON + T.general.pm_link_label}}
                    onClick={() => {
                        fetch(quoteButton.href, { credentials: "same-origin" }) // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
                        .then(response => response.text())
                        .then(responseContent => {
                            const responseDocument = new DOMParser().parseFromString(responseContent, "text/html");
                            const quoteTextarea = responseDocument.querySelector("textarea");
                            if (quoteTextarea === null) {
                                throw couldNotExtract("textarea from fetch response");
                            }
                            const pmTextarea = document.createElement("textarea");
                            pmTextarea.name = SITE.FORM.name.message;
                            pmTextarea.textContent = withLinksInsteadOfPostIDs(quoteTextarea.textContent || "");
                            form.appendChild(pmTextarea);
                            form.submit();
                        })
                        .catch(log.error);
                    }}
                    class={[ SITE.CLASS.button, CONFIG.CLASS.iconButton, CONFIG.CLASS.pmButton ].join(" ")}
                ></button>
            ), profileDetails);
        } catch (err) {
            return err;
        }
    }
}

/*
The generated quote BBCode, when used in a PM, creates a link to a PM, but we want to link to a forum post.
So we need to transform

    [quote postid="123456" ...]
    Message
    [/quote]

into

    [quote ...]
    Message

    [url="/forum/post/123456"]Gå till inlägget[/url]
    [/quote]

Note that the input may contain multiple quotes.
*/
const REGEX_GENERATED_QUOTE = new RegExp([
    // NB: The capture groups here are used below to assemble the adjusted BBCode.
    r`^(\[${SITE.TAG.quote}) postid="(\d+)"( userid="\d+" name="[^"]+"\])$`, // start tag
    r`([\s\S]*?)`, // message ("?" to stop at [/quote])
    r`^(\[/${SITE.TAG.quote}\])$`, // end tag
].join(""), "gm"); // "s" didn't work for me to match newlines using ".".

function withLinksInsteadOfPostIDs(raw: string): string {
    return raw.replace(REGEX_GENERATED_QUOTE, [
        "$1$3", // start tag
        "$4", // message
        "\n" + linkToForumPost("$2") + "\n",
        "$5", // end tag
    ].join(""));
}

function linkToForumPost(id: string): string {
    return [
        BB.start(SITE.TAG.url, SITE.PATH.forumPost(id)),
        BB.start(SITE.TAG.b),
        T.general.go_to_post,
        BB.end(SITE.TAG.b),
        BB.end(SITE.TAG.url),
    ].join("");
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
