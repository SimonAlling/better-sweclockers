import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { h, render } from "preact";
import { only, isNumber } from "ts-type-guards";
import { FAILURE } from "lib/operation-manager";

const ICON = require("src/icons/pm.svg");

export default (e: { footer: HTMLElement }) => {
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
