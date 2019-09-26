import * as CONFIG from "globals-config";
import * as SITE from "globals-site";
import * as T from "text";
import { unlines } from "lines-unlines";

/*
SweClockers uses a system where icon class names (such as "icon-41") are essentially bitmasks.
For each item in this array, the number is the bitmask for that specific status.
For example, "icon-41" means locked, unread and following (because 41 = 1 + 8 + 32).
*/
const STATUSES = <const> [
    // The order here decides the order in the tooltips.
    [  1, T.thread_status.locked ],
    [  2, T.thread_status.sticky ],
    // 4 is nothing; probably meant "moved" in the past
    [  8, T.thread_status.unread ],
    [ 64, T.thread_status.hot ],
    [ 16, T.thread_status.participated ],
    [ 32, T.thread_status.following ],
];

const DEFAULT_STATUS = T.thread_status.default; // when none of the other statuses match

type PowerOfTwo = 1 | 2 | 4 | 8 | 16 | 32 | 64 // 0 intentionally left out

/*
The generated CSS contains rules with selectors that never match, because some status combinations (e.g. locked + sticky) are not actually used.
However, this makes the code simpler, and it also means that we have ourselves covered should SweClockers introduce new combinations.
At the time of writing this, there were 28 combinations in use and we generated 64 rules.
*/
export default function(): string {
    const powersUsedBySweClockers: ReadonlyArray<PowerOfTwo> = STATUSES.map(([ p, _ ]) => p);
    const iconBitmasks = powersUsedBySweClockers.reduce(extend, [ 0 ]);
    return unlines(iconBitmasks.map(styleRule));
}

function styleRule(bitmask: number): string {
    return `.${SITE.CLASS.threadStatus}.${SITE.CLASS.threadStatusIcon(bitmask)}::after { content: '${tooltip(bitmask)}' }`;
}

function tooltip(bitmask: number): string {
    return statuses(bitmask).join(T.thread_status.separator);
}

function statuses(bitmask: number): ReadonlyArray<string> {
    const matchingStatuses = (
        STATUSES
        .filter(([ statusBitmask, _ ]) => statusBitmask & bitmask)
        .map(([ _, description ]) => description)
    );
    return matchingStatuses.length > 0 ? matchingStatuses : [ DEFAULT_STATUS ];
}

// extend([ 0, 1 ]     , 8) === [ 0, 1, 8, 9 ]
// extend([ 0, 10, 20 ], 4) === [ 0, 10, 20, 4, 14, 24 ]
function extend(xs: ReadonlyArray<number>, n: PowerOfTwo): ReadonlyArray<number> {
    return xs.concat(xs.map(x => x + n));
}
