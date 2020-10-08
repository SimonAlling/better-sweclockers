import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: {
    iconOrSigninButton: HTMLElement,
    labelOrSigninButton: HTMLElement,
    signoutButtonOrSigninButton: HTMLElement,
}) => {
    const signoutButtonOrSigninButton = e.signoutButtonOrSigninButton as HTMLAnchorElement;
    const notLoggedIn = signoutButtonOrSigninButton.getAttribute("href") !== SITE.PATH.SIGNOUT; // .href is the entire URL (https://...).
    if (notLoggedIn) return;
    const link = signoutButtonOrSigninButton;
    const icon = e.iconOrSigninButton;
    const label = e.labelOrSigninButton;
    link.classList.remove("m-m-r"); // the class that makes the link red on hover
    link.style.marginRight = "24px"; // ad-hoc solution to make it take up the same width as the signout link
    link.href = CONFIG.PATH.PREFERENCES.link(SITE.PATH.SETTINGS.link);
    link.target = "_blank";
    link.title = T.preferences.title;
    icon.innerHTML = SITE.ICONS.settings;
    label.textContent = T.preferences.shortcut_label;
};
