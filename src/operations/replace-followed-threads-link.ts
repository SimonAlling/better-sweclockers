import * as SITE from "globals-site";
import * as T from "text";
import { SUCCESS } from "lib/operation-manager";

export default (e: { followedThreadsLinkTextOrSigninSection: HTMLElement }) => {
    const notLoggedIn = e.followedThreadsLinkTextOrSigninSection.classList.contains(SITE.CLASS.signinSection);
    if (notLoggedIn) return SUCCESS;
    const text = e.followedThreadsLinkTextOrSigninSection;
    const link = text.parentElement as HTMLAnchorElement;
    text.textContent = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
}
