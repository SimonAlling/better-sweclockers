import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { signoutButtonOrSigninButton: HTMLElement }) => {
    const signoutButtonOrSigninButton = e.signoutButtonOrSigninButton as HTMLAnchorElement;
    const notLoggedIn = signoutButtonOrSigninButton.getAttribute("href") !== SITE.PATH.SIGNOUT; // .href is the entire URL (https://...).
    if (notLoggedIn) return;
    const signoutButton = signoutButtonOrSigninButton;
    signoutButton.addEventListener("click", event => {
        if (!confirm(T.general.signout_confirmation)) {
            event.preventDefault();
        }
    });
};
