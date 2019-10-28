import * as SITE from "src/globals-site";

export default (e: { textarea: HTMLElement }) => {
    const textarea = e.textarea as HTMLTextAreaElement;
    textarea.value = textarea.value.replace(SITE.REGEX_MOBILE_SITE_DISCLAIMER, "");
}
