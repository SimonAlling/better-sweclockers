import * as SITE from "globals-site";
import * as CONFIG from "globals-config";

export default (e: { textarea: HTMLElement }) => {
    const textarea = e.textarea as HTMLTextAreaElement;
    textarea.value = textarea.value.replace(SITE.REGEX_MOBILE_SITE_DISCLAIMER, "");
}
