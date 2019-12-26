import { h, render } from "preact";
import { isNumber, only } from "ts-type-guards";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import ICON from "~src/icons/pm.svg";

export default () => {
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    for (const post of only(HTMLElement)(Array.from(forumPosts))) {
        try {
            const userID = JSON.parse(post.dataset.post || "").userid;
            const profileDetails = post.querySelector("." + SITE.CLASS.forumPostProfileDetails);
            if (!isNumber(userID)) return `Could not extract user ID from post with id="${post.id}".`;
            if (profileDetails === null) return `Could not extract profile details from post with id="${post.id}".`;
            render((
                <a
                    dangerouslySetInnerHTML={{__html: ICON + "PM"}}
                    href={SITE.PATH.newPrivateMessage(userID)}
                    class={[ SITE.CLASS.button, CONFIG.CLASS.iconButton, CONFIG.CLASS.pmButton ].join(" ")}
                ></a>
            ), profileDetails);
        } catch (err) {
            return err;
        }
    }
}
