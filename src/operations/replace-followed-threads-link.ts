import { is } from "ts-type-guards";

import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { followedThreadsLinkTextOrSigninButton: HTMLElement }) => {
    const notLoggedIn = is(HTMLAnchorElement)(e.followedThreadsLinkTextOrSigninButton);
    if (notLoggedIn) return;
    const text = e.followedThreadsLinkTextOrSigninButton;
    const link = text.parentElement as HTMLAnchorElement;
    text.textContent = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
};
