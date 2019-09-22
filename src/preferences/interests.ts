import * as T from "../text";
import {
    ListPreference,
} from "ts-preferences";

export default <const> {
    uninteresting_subforums: new ListPreference<number>({
        key: "interests_uninteresting_subforums",
        label: T.preferences.NO_LABEL,
        default: [],
    })
};
