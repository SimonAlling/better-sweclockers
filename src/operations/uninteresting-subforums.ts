import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default (uninterestingIDs: readonly number[]) => (e: {
    body: HTMLElement,
}) => {
    const rows = e.body.querySelectorAll<HTMLTableRowElement>("tr.forumThread");
    for (const row of rows) {
        const forumLink = row.querySelector<HTMLAnchorElement>("a.forum");
        if (forumLink === null) {
            return `Could not find forum link.`;
        }
        const match = forumLink.href.match(SITE.PATH.FORUM_CATEGORY);
        if (match === null) {
            return `Could not extract forum ID from this link: ${forumLink.outerHTML}`;
        }
        const id = parseInt(match[1]);
        if (uninterestingIDs.includes(id)) {
            row.classList.add(CONFIG.CLASS.uninteresting);
            row.title = T.general.uninteresting_subforum(forumLink.textContent as string);
        }
    }
};
