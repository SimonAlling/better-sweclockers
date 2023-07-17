import { is } from "ts-type-guards";

import * as SITE from "~src/site";
import * as T from "~src/text";
import { assertExhausted } from "~src/utilities";

export default (e: { followedThreadsLinkTextOrSigninButton: HTMLElement }) => {
    const user = SITE.getUserInfo();
    switch (user.tag) {
        case "CouldNotExtract": return "Could not extract logged-in status and/or user ID.";
        case "NotLoggedIn": return; // No error; there's just nothing to do if the user is not logged in.
        case "LoggedIn": break;
        default: assertExhausted(user);
    }
    const text = e.followedThreadsLinkTextOrSigninButton;
    const link = text.parentElement;
    if (!is(HTMLAnchorElement)(link)) {
        return `Expected a link, but found an element with tagname ${JSON.stringify(link?.tagName)}.`;
    }
    text.textContent = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
    link.classList.remove(SITE.CLASS.colorOrange);
};
