import * as SITE from "globals-site";
import * as T from "text";

export default (e: { followedThreadsLink: HTMLElement }) => {
    const link = e.followedThreadsLink as HTMLAnchorElement;
    link.textContent = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
    (link.parentElement as HTMLElement).classList.remove(SITE.CLASS.hasUnread);
}
