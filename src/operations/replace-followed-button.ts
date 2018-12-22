import * as SITE from "globals-site";
import * as T from "text";

export default (e: { followedButtonLink: HTMLElement }) => {
    const link = e.followedButtonLink as HTMLLinkElement;
    link.innerHTML = T.general.my_posts;
    link.href = SITE.PATH.MY_POSTS;
    link.classList.remove("hasUnread");
}
