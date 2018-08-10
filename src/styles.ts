import { StylesheetModule } from "lib/stylesheet-manager";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { isOnBSCPreferencesPage } from "./environment";

const ALWAYS: boolean = true;

/*
******** README ********

CSS modules to be inserted conditionally are declared in this file.

In practice, "conditionally" could mean e.g. that a certain preference is set. ALWAYS can also be used as a condition.

Every item must be an object with the following structure:
{
    condition : a boolean indicating whether this module should be inserted
    css       : the CSS code to insert
}
*/

const STYLESHEET_MODULES: ReadonlyArray<StylesheetModule> = [
    {
        condition: ALWAYS,
        css: require("styles/stylesheet"),
    },
    {
        condition: ALWAYS,
        css: require("styles/dark-theme-toggle"),
    },
    {
        condition: ALWAYS,
        css: require("styles/doge"),
    },
    {
        condition: isOnBSCPreferencesPage(),
        css: require("styles/preferences"),
    },
    {
        condition: Preferences.get(P.general._.lock_heights),
        css: require("styles/lock-heights"),
    },
    {
        condition: Preferences.get(P.general._.compact_layout),
        css: require("styles/compact-layout"),
    },
    {
        condition: Preferences.get(P.general._.highlight_own_posts),
        css: require("styles/highlight-own-posts"),
    },
    {
        condition: Preferences.get(P.general._.hide_image_controls),
        css: require("styles/hide-image-controls"),
    },
    {
        condition: Preferences.get(P.editing_tools._.enable),
        css: require("styles/editing-tools"),
    },
];

export default STYLESHEET_MODULES;
