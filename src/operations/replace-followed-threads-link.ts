import * as SITE from "globals-site";
import * as T from "text";

export default (e: { followedThreadsLinkText: HTMLElement }) => {
    const text = e.followedThreadsLinkText;
    const link = text.parentElement as HTMLAnchorElement;
    text.textContent = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
}
