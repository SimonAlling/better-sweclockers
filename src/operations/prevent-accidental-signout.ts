import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { signoutButtonOrSigninSection: HTMLElement }) => {
    const notLoggedIn = e.signoutButtonOrSigninSection.classList.contains(SITE.CLASS.signinSection);
    if (notLoggedIn) return;
    const signoutButton = e.signoutButtonOrSigninSection;
    signoutButton.addEventListener("click", event => {
        if (!confirm(T.general.signout_confirmation)) {
            event.stopPropagation();
        }
    }, true); // Default listener doesn't use capture, so this listener is given precedence.
};
