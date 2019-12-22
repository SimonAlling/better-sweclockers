import { DependentOperation, OperationManager } from ".userscripter/lib/operation-manager";
import { compose, formattedList } from ".userscripter/lib/utilities";

import * as CONFIG from "~src/globals-config";
import * as SITE from "~src/globals-site";
import OPERATIONS from "~src/operations";
import { log, logError } from "~src/userscripter/logging";

function dependentOperationError<K extends string>(operation: DependentOperation<K>): string {
    const plural = Object.keys(operation.selectors).length > 1;
    return `Could not ${operation.description}.

${plural ? "One or more of these selectors" : "This selector"} didn't match anything:

${formattedList(Object.values(operation.selectors))}

This problem might be caused by ${SITE.NAME} changing its content/structure, in which case ${CONFIG.USERSCRIPT_NAME} needs to be updated. Otherwise it's probably a bug in ${CONFIG.USERSCRIPT_NAME}.

If you file a bug report, please include this message.`;
}

const operationManager = OperationManager(
    OPERATIONS,
    CONFIG.INTERVAL_OPERATIONS,            // time between each try
    compose(logError, dependentOperationError), // what to do with dependent operations that fail
    () => log("Operations done!"),         // what to do when all operations have been performed
);

export function startOperations(): void  {
    operationManager.start();
}

export function stopOperations(delay: number): void {
    setTimeout(operationManager.stop, delay);
}
