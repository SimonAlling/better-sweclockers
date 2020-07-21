import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { followedThreadsLinkTextOrSigninSection: HTMLElement }) => {
    const notLoggedIn = e.followedThreadsLinkTextOrSigninSection.classList.contains(SITE.CLASS.signinSection);
    if (notLoggedIn) return;
    const text = e.followedThreadsLinkTextOrSigninSection;
    const link = text.parentElement as HTMLAnchorElement;
    text.textContent = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
};
