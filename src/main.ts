import * as StylesheetManager from "lib/stylesheet-manager";
import * as CONFIG from "globals-config";
import STYLESHEET_MODULES from "styles";
import "./polyfills"; // It is side-effecty.
import { log, logWarning } from "userscripter/logging";
import { hasAlreadyRun } from "userscripter/misc";
import { startOperations, stopOperations } from "userscripter/operation-handling";


// Actions that can and should be performed before the DOM is loaded, such as inserting CSS:
function beforeLoad(): void {
    log("Performing pre-load actions ...");
    document.addEventListener("DOMContentLoaded", afterLoad);
    StylesheetManager.insert(STYLESHEET_MODULES, CONFIG.ID_STYLE_ELEMENT);
    log("CSS inserted.");
    startOperations();
    log("Operations (DOM manipulation etc) started.");
}

// Actions that require that the entire DOM be accessible:
function afterLoad(): void {
    log("DOMContentLoaded! Performing post-load actions ...");
    stopOperations(CONFIG.TIMEOUT_OPERATIONS);
}

// Make sure the userscript does not run more than once (e.g. if it is added twice or if the browser uses a cached page when navigating back and forward):
if (!hasAlreadyRun()) {
    log(`${CONFIG.USERSCRIPT_NAME} ${CONFIG.USERSCRIPT_VERSION_STRING}`);
    beforeLoad();
} else {
    logWarning(`It appears as though ${CONFIG.USERSCRIPT_NAME} has already run (because a <style> element with id="${CONFIG.ID_STYLE_ELEMENT}" was found). Stopping.`);
}
