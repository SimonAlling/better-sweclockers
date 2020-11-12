import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default () => { // We can't take the signout button as a dependency, because it only exists on the user's own profile page.
    const ourUserID = SITE.getUserID();
    if (ourUserID === undefined) {
        return `Could not extract current user's ID.`;
    }
    const isNotLoggedIn = ourUserID === SITE.USER_ID_NOT_LOGGED_IN;
    if (isNotLoggedIn) {
        return;
    }
    const isOwnProfilePage = SITE.PATH.PROFILE(ourUserID).test(document.location.pathname);
    if (!isOwnProfilePage) {
        return;
    }
    const signoutButton = document.querySelector(SELECTOR.signoutButton);
    if (signoutButton === null) {
        return `Could not find signout button (${SELECTOR.signoutButton}).`;
    }
    signoutButton.addEventListener("click", event => {
        if (!confirm(T.general.signout_confirmation)) {
            event.preventDefault();
        }
    });
};
