import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "text";

export default (e: { signoutButton: HTMLElement }) => {
    const signoutButton = e.signoutButton;
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
}

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
        class MessageDialog {
            addClass(x: string): void
            setMessage(x: string): void
            setModal(x: boolean): void
            openWindow(): void
            centerOnScreen(): void
        }
    }
}

declare namespace Taiga {
    namespace Xhr {
        namespace JsonRpc {
            class Request {
                setUrl(x: string): void
                setMethod(x: string): void
                setParams(x: { csrf: string }): void
                onError(f: () => void): void
                onSuccess(f: () => void): void
                send(): void
            }
        }
    }
}
