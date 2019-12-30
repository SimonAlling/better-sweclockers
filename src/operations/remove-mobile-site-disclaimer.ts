import * as BB from "bbcode-tags";

import * as SITE from "~src/site";

const END_TAG_QUOTE = BB.end(SITE.TAG.quote);
const sentFrom = SITE.MOBILE_SITE_DISCLAIMER.sentFrom;
const mobileSiteDomain = SITE.MOBILE_SITE_DISCLAIMER.mobileSiteDomain;
const disclaimer = [
    ``,
    `[size="smaller"]${sentFrom} [url="//${mobileSiteDomain}"]${mobileSiteDomain}[/url][/size]`,
    END_TAG_QUOTE,
].join("\n");

export default (e: { textarea: HTMLElement }) => {
    const textarea = e.textarea as HTMLTextAreaElement;
    textarea.value = textarea.value.replace(disclaimer, END_TAG_QUOTE);
}
