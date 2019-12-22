import { h, render } from "preact";
import { isNumber, only } from "ts-type-guards";

import { FAILURE } from ".userscripter/lib/operation-manager";

import * as CONFIG from "~src/globals-config";
import * as SITE from "~src/globals-site";
import ICON from "~src/icons/pm.svg";

export default () => {
    const forumPosts = document.getElementsByClassName(SITE.CLASS.forumPost);
    only(HTMLElement)(Array.from(forumPosts)).forEach(post => {
        try {
            const userID = JSON.parse(post.dataset.post || "").userid;
            const profileDetails = post.querySelector("." + SITE.CLASS.forumPostProfileDetails);
            if (!isNumber(userID) || profileDetails === null) {
                return FAILURE;
            }
            render((
                <a
                    dangerouslySetInnerHTML={{__html: ICON + "PM"}}
                    href={SITE.PATH.newPrivateMessage(userID)}
                    class={[ SITE.CLASS.button, CONFIG.CLASS.iconButton, CONFIG.CLASS.pmButton ].join(" ")}
                ></a>
            ), profileDetails);
        } catch (err) {
            return FAILURE;
        }
    });
}
