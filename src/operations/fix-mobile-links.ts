import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { FAILURE, SUCCESS } from "lib/operation-manager";

export default () => {
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    return Array.from(forumPosts).every(post => {
        const message = post.querySelector("." + SITE.CLASS.forumPostMessage);
        if (message === null) return FAILURE;
        // We ignore links whose textContent is literally m.sweclockers.com, to
        // avoid modifying the auto-generated notice in posts sent from the
        // mobile site. In other cases, such links are probably actually
        // intended to point to the mobile site anyway.
        Array.from(message.getElementsByTagName("a"))
        .filter(a => a.textContent !== SITE.HOSTNAME_MOBILE)
        .forEach(a => {
            a.href = a.href.replace(SITE.REGEX_MOBILE_LINK, "$1" + SITE.HOSTNAME);
        });
        return SUCCESS;
    });
}
