import { compose } from "@typed/compose";
import { environment, errors, log, userscripter } from "userscripter";

import * as CONFIG from "~src/config";
import OPERATIONS from "~src/operations";
import * as DarkTheme from "~src/operations/dark-theme";
import * as Developer from "~src/operations/developer-mode";
import { P, Preferences } from "~src/preferences";
import * as SITE from "~src/site";
import STYLESHEETS from "~src/stylesheets";
import U from "~src/userscript";

const describeFailure = errors.failureDescriber({
    siteName: SITE.NAME,
    extensionName: U.name,
    location: document.location,
});

DarkTheme.manage(); // In an effort to avoid a bright flash on page load (issue #62), we do this as early as possible.

log.setLogger(
    Preferences.get(P.advanced._.developer_mode)
        ? Developer.logger(console, document.documentElement.appendChild(document.createElement("div")))
        : console
);

userscripter.run({
    id: U.id,
    name: U.name,
    initialAction: () => log.log(`${U.name} ${U.version}`),
    stylesheets: STYLESHEETS,
    operationsPlan: {
        operations: OPERATIONS,
        interval: CONFIG.OPERATIONS_INTERVAL,
        tryUntil: environment.DOMCONTENTLOADED,
        extraTries: CONFIG.OPERATIONS_EXTRA_TRIES,
        handleFailures: failures => failures.forEach(compose(log.error, describeFailure)),
    },
});
