import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { signoutButtonOrSigninSection: HTMLElement }) => {
    const notLoggedIn = e.signoutButtonOrSigninSection.classList.contains(SITE.CLASS.signinSection);
    if (notLoggedIn) return;
    const signoutButton = e.signoutButtonOrSigninSection;
    const parent = signoutButton.parentElement as HTMLElement;
    const safeSignoutForm = signoutButton.cloneNode(true);
    signoutButton.remove();
    safeSignoutForm.addEventListener("click", function() {
        if (confirm(T.general.signout_confirmation)) {
            const request = new Taiga.Xhr.JsonRpc.Request();
            request.setUrl(SITE.PATH.SIGNOUT);
            request.setMethod("signout");
            request.onError(errorHandler);
            request.onSuccess(() => window.location.reload());
            request.send();
        }
    });
    parent.appendChild(safeSignoutForm);
};

function errorHandler() {
    const dialog = new Common.Windows.MessageDialog();
    dialog.addClass(SITE.CLASS.errorDialog);
    dialog.setMessage(T.general.signout_error);
    dialog.setModal(true);
    dialog.openWindow();
    dialog.centerOnScreen();
}

declare namespace Common {
    namespace Windows {
        class MessageDialog { // eslint-disable-line @typescript-eslint/no-unused-vars
            public addClass(x: string): void
            public setMessage(x: string): void
            public setModal(x: boolean): void
            public openWindow(): void
            public centerOnScreen(): void
        }
    }
}

declare namespace Taiga {
    namespace Xhr {
        namespace JsonRpc {
            class Request { // eslint-disable-line @typescript-eslint/no-unused-vars
                public setUrl(x: string): void
                public setMethod(x: string): void
                public setParams(x: { csrf: string }): void
                public onError(f: () => void): void
                public onSuccess(f: () => void): void
                public send(): void
            }
        }
    }
}
