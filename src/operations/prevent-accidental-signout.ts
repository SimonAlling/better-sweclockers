import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";
import { assertExhausted } from "~src/utilities";

export default () => { // We can't take the signout button as a dependency, because it only exists on the user's own profile page.
    const user = SITE.getUserInfo();
    switch (user.tag) {
        case "CouldNotExtract": return "Could not extract logged-in status and/or user ID.";
        case "NotLoggedIn": return; // No error; there's just nothing to do if the user is not logged in.
        case "LoggedIn": break;
        default: assertExhausted(user);
    }
    const ourUserID = user.userID;
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
