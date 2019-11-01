import { ListPreference } from "ts-preferences";

import * as T from "src/text";

export default {
    uninteresting_subforums: new ListPreference<number>({
        key: "interests_uninteresting_subforums",
        label: T.preferences.NO_LABEL,
        default: [],
    }),
} as const;
