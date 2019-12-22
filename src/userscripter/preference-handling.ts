import {
    AllowedTypes,
    Preference,
    PreferenceManager,
    RequestSummary,
    Response,
    Status,
} from "ts-preferences";

import * as CONFIG from "~src/globals-config";
import P from "~src/preferences";
import { logError, logWarning } from "~src/userscripter/logging";

export const Preferences = new PreferenceManager(P, CONFIG.USERSCRIPT_ID + "-preference-", responseHandler);

export function isFalse(x: boolean): boolean {
    return x === false;
}

type Listener<T extends AllowedTypes> = (p: Preference<T>) => void

const changeListeners: Set<Listener<any>> = new Set();

export function subscribe(listener: Listener<any>): void {
    changeListeners.add(listener);
}

export function unsubscribe(listener: Listener<any>): void {
    changeListeners.delete(listener);
}

function responseHandler<T extends AllowedTypes>(summary: RequestSummary<T>, preferences: PreferenceManager): Response<T> {
    const response = summary.response;
    if (summary.action === "set") {
        changeListeners.forEach(f => f(summary.preference))
    }
    switch (response.status) {
        case Status.OK:
            return response;

        case Status.INVALID_VALUE:
            if (summary.action === "get") {
                // response.saved is defined if and only if action is "get" and status is INVALID_VALUE:
                logWarning(`The value found in localStorage for preference '${summary.preference.key}' (${JSON.stringify(response.saved)}) was invalid. Replacing it with ${JSON.stringify(response.value)}.`);
                preferences.set(summary.preference, response.value);
            }
            if (summary.action === "set") {
                logWarning(`Could not set value ${JSON.stringify(response.value)} for preference '${summary.preference.key}' because it was invalid.`);
            }
            return response;

        case Status.TYPE_ERROR:
            if (summary.action === "get") {
                logWarning(`The value found in localStorage for preference '${summary.preference.key}' was not a ${typeof summary.preference.default}. Replacing it with ${JSON.stringify(response.value)}.`);
                preferences.set(summary.preference, response.value);
            }
            return response;

        case Status.JSON_ERROR:
            if (summary.action === "get") {
                logWarning(`The value found in localStorage for preference '${summary.preference.key}' could not be parsed. Replacing it with ${JSON.stringify(response.value)}.`);
                preferences.set(summary.preference, response.value);
            }
            return response;

        case Status.STORAGE_ERROR:
            switch (summary.action) {
                case "get":
                    logError(`Could not read preference '${summary.preference.key}' because localStorage could not be accessed. Using value ${JSON.stringify(summary.preference.default)}.`);
                    return response;
                case "set":
                    logError(`Could not save value ${JSON.stringify(summary.response.value)} for preference '${summary.preference.key}' because localStorage could not be accessed.`);
                    return response;
            }
            return assertUnreachable(summary.action);
    }
    return assertUnreachable(response.status);
}

function assertUnreachable(x: never): never {
    throw new Error("assertUnreachable: " + x);
}
