// This file cannot contain Webpack-resolved imports (e.g. "~src/foo").

import * as BB from "bbcode-tags";

import * as browser from "./browser";
import * as CONFIG from "./config";
import * as SITE from "./site";
import { InsertButtonDescription } from "./types";

function genitive(name: string): string {
    return ["s", "x", "z"].some(letter => name.endsWith(letter)) ? name : name + "s";
}

function darkThemeBy(author: string): string {
    return `${genitive(author)} mörka tema`;
}

const mention_everyone_label = `Nämn alla`;
const my_posts = `Mina inlägg`;
const down_for_maintenance = `Nere för underhåll`;
const draft_mode_toggle_label = `Utkast`;
const draft_mode_description = `Slipp posta ofärdiga inlägg av misstag`;

const OBVIOUS = `Som det låter`;

export const general = {
    seconds: `sekunder`,
    loading: `Laddar …`,
    dark_theme_toggle_tooltip: (author: string) => `${darkThemeBy(author)} på/av`,
    preferences_link: CONFIG.USERSCRIPT_NAME,
    signout_confirmation: `Är du säker på att du vill logga ut?`,
    draft_mode_toggle_label,
    draft_mode_toggle_tooltip: draft_mode_description,
    draft_mode_enabled_tooltip: `Kryssa ur "${draft_mode_toggle_label}" för att posta`,
    improved_url_button_url: `Adress (URL):`,
    improved_url_button_text: `Länktext:`,
    restore_draft_label: `Återställ`,
    restore_draft_tooltip: `Återställ autosparat utkast`,
    restore_draft_question: `Vill du återställa följande utkast?`,
    restore_draft_confirm: `Din nuvarande text kommer ersättas. Är du säker?`,
    nbsps_confirm: (n: number) => `${n} mellanslag kommer ersättas med hårda mellanslag. Är du säker?`,
    generic_lines_confirm: (n: number) => `${n} markerad${n > 1 ? "e rader" : " rad"} kommer formateras. Är du säker?`,
    quote_signature_label: `Citera med sign.`,
    quote_signature_tooltip: `Citera inlägget och dess signatur`,
    quote_signature_tooltip_no_signature: (author: string) => `${author} har ingen signatur`,
    mention_everyone_label,
    mention_everyone_tooltip: `Nämn alla tråddeltagare på den här sidan i ett nytt inlägg`,
    uninteresting_subforum: (subforumName: string) => `Du har markerat kategorin ${subforumName} som ointressant.`,
    pm_link_label: "&nbsp;PM",
    go_to_post: `Gå till inlägget`,
    link_to_top_tooltip: `Gå till toppen`,
    textarea_size_small: `Liten textruta`,
    textarea_size_large: `Stor textruta`,
    tooltip_h: `Rubrik`,
    tooltip_table: `Tabell`,
    down_for_maintenance,
    my_posts,
} as const;

export const preferences = {
    _: {
        NO_LABEL: ``,
        shortcut_label: `BSC`,
        title: `Inställningar för Better SweClockers`,
        back_to_sweclockers: `Tillbaka till ${SITE.NAME}`,
        save_notice: `Inställningarna sparas automatiskt, men endast lokalt på den här enheten.`,
        failed_to_fetch_categories: `Kunde inte hämta forumkategorier.`,
        in_quick_reply_form: `i formuläret <em>Snabbsvar</em>`,
        in_quick_reply_form_description: `Längst ner i trådar`,
    },

    general: {
        label: `Allmänt`,
        lock_heights: `Lås höjden på reklam etc`,
        lock_heights_description: `Förhindrar att sidans innehåll hoppar när t ex reklam laddas in`,
        improved_corrections: `Bättre rättelsegränssnitt`,
        improved_corrections_description: `Gör det enklare att skicka in rättelser`,
        insert_preferences_shortcut: `Genväg till inställningar för ${CONFIG.USERSCRIPT_NAME}`,
        insert_preferences_shortcut_description: `Visa en länk till ${CONFIG.USERSCRIPT_NAME} inställningsmeny högst upp`,
        replace_followed_threads_link: `Ersätt länken <em>Följda trådar</em> med <em>${my_posts}</em>`,
        replace_followed_threads_link_description: OBVIOUS,
        remember_location_in_market: `Kom ihåg min plats i marknaden`,
        remember_location_in_market_description: `Slipp fylla i län och stad varje gång du skapar en annons`,
    },

    forum_threads: {
        label: `Forumtrådar`,
        improved_pagination_buttons: `Bättre bläddringsknappar`,
        improved_pagination_buttons_description: `Större knappar som är lättare att klicka på`,
        insert_link_to_top: `Länk till toppen längst ner`,
        insert_link_to_top_description: OBVIOUS,
        highlight_own_posts: `Framhäv egna inlägg extra tydligt`,
        highlight_own_posts_description: `Gör den orangea kanten på egna inlägg tjockare`,
        insert_pm_links: `PM-knappar`,
        insert_pm_links_description: `Skicka PM till en användare direkt från deras inlägg`,
        mention_everyone_button: `<em>${mention_everyone_label}</em>-knapp`,
        mention_everyone_button_description: `Nämn alla tråddeltagare på den aktuella sidan (framförallt användbart i annonskommentarer)`,
        quote_signature_buttons: `<em>Citera med signatur</em>-knappar`,
        quote_signature_buttons_description: `Citera ett inlägg inklusive dess signatur`,
        quote_signature_message: `Meddelande vid citering med signatur`,
        quote_signature_message_description: `Fylls i automatiskt när du citerar med signatur`,
        quote_signature_message_default: `Nu består trådens värde även när du byter signatur.`,
    },

    edit_mode: {
        label: `Redigeringsläge`,
        autosave_draft: `Spara utkast automatiskt`,
        autosave_draft_description: `Skydda dina inlägg mot blåskärmar, strömavbrott och andra missöden`,
        draft_mode_toggle: `Kryssrutan <em>${draft_mode_toggle_label}</em>`,
        draft_mode_toggle_description: draft_mode_description,
        textarea_size_save: `Kom ihåg textrutans storlek`,
        textarea_size_save_description: `Behåll samma storlek på textrutan mellan sidladdningar`,
        textarea_size_toggle: `Knappar för att växla storlek på textrutan`,
        textarea_size_toggle_description: `Toggla textrutans storlek precis ovanför den`,
        textarea_size_small: `mellan`,
        textarea_size_large: `och`,
        textarea_size_unit: `px`,
        monospace_font: `<span style="font-family: monospace">Monospace</span>-font i textrutan`,
        monospace_font_description: `Underlättar formatering av kod och dylikt`,
        keyboard_shortcuts: `Kortkommandon för att skicka (<kbd>Ctrl</kbd> + <kbd>S</kbd>), förhandsgranska (<kbd>Ctrl</kbd> + <kbd>P</kbd>) och länka (<kbd>Ctrl</kbd> + <kbd>K</kbd>)`,
        keyboard_shortcuts_description: `Skicka, förhandsgranska och länka med tangentbordet`,
        insert_tab: `Tab-tangenten infogar`,
        insert_tab_description: `Använd Tab-tangenten i textrutan`,
        insert_tab_spaces: (n: number) => `${n} blanksteg`,
        insert_tab_tab: `tabbtecken`,
        improved_builtin_editing_tools: `Förbättrade inbyggda redigeringsverktyg`,
        improved_builtin_editing_tools_description: `Mer intuitiv funktionalitet och ångra-stöd (i webbläsare som stöder det)`,
        insert_heading_toolbar_button: `Knapp för att formatera som rubrik`,
        insert_heading_toolbar_button_description: `Knappen infogar BB-taggen ${BB.start(SITE.TAG.h)}`,
        insert_table_toolbar_button: `Knapp för att infoga tabell`,
        insert_table_toolbar_button_description: `Knappen infogar en komplett tabell`,
        remember_caret_position: `Kom ihåg markörens position vid förhandsgranskning`,
        remember_caret_position_description: `Fortsätt skriva precis där du var när du förhandsgranskat ett inlägg`,
        remove_mobile_site_disclaimer: `Ta bort <small><em>${SITE.MOBILE_SITE_DISCLAIMER.sentFrom} ${SITE.MOBILE_SITE_DISCLAIMER.mobileSiteDomain}</em></small>`,
        remove_mobile_site_disclaimer_description: `Ta automatiskt bort ${SITE.MOBILE_SITE_DISCLAIMER.mobileSiteDomain}-disclaimern från citat`,
    },

    editing_tools: {
        label: `Utökade formateringsverktyg`,
        enable: `Aktivera utökade formateringsverktyg`,
        enable_description: `En hel samling extra formateringsverktyg för att underlätta inläggsskrivandet`,
        position: {
            label: `Placering`,
            description: OBVIOUS,
            above: `Ovanför textfältet`,
            below: `Under textfältet`,
        },
        special_characters: `Verktyg för specialtecken`,
        meta: `Verktyg för tillagd och borttagen text`,
        code: `Kodrelaterade verktyg`,
        math: `Matematikrelaterade verktyg`,
        whitespace: `Whitespaceverktyg`,
        definitions: `Verktyg för definitioner`,
        embed: `Verktyg för länkar, bilder och sökresultat`,
        search_engine: {
            label: `Sökmotor`,
            description: `Vilken sökmotor som ska användas för länkar till sökresultat`,
        },
        doge: `very doge buttons`,
        doge_description: `            wow`,
        color_palette: `Färgpaletten`,
        color_palette_description: `Ändra textfärg snabbt och enkelt`,
        smileys: `Smileys`,
    },

    dark_theme: {
        label: (author: string, infoUrl: string) => `${darkThemeBy(author)} (<a target="_blank" href="${infoUrl}">forumtråd</a>)`,
        show_toggle: `Manuell aktivering`,
        show_toggle_description: `Toggla manuellt det mörka temat med en ikon högst upp på sidan`,
        auto: `Automatisk aktivering`,
        auto_description: `Aktivera det mörka temat automatiskt under nattens timmar`,
        between: `mellan`,
        and: `och`,
        interval: `Uppdateringsintervall`,
        interval_description: `Hur ofta ${CONFIG.USERSCRIPT_NAME} ska kolla vad klockan är`,
    },

    customize_content: {
        label: `Anpassa innehåll`,
        carousel: `Bildspelsvyn högst upp`,
        social_media: `Knappar för sociala medier`,
        guides: `Guider`,
        popular_galleries: `Bubblare i Galleriet`,
        new_in_forum_side: `Nytt i forumet (till höger)`,
        new_in_market: `Senaste privatannonserna`,
        new_in_test_lab: `Nytt i testlabbet`,
        in_the_store: `Just nu i butiken`,
        popular_at_prisjakt: `Populärast på Prisjakt`,
        new_tech_jobs: `Nya teknikjobb`,
        external_news: `Externa nyheter`,
        more_articles: `Fler artiklar (under varje artikel)`,
        latest_news: `Senaste nyheterna (längst ner)`,
        new_in_forum_main: `Nytt i forumet (längst ner)`,
        footer: `Sidfot`,
    },

    advanced: {
        label: `Avancerat`,
        prevent_accidental_signout: `Fråga vid utloggning`,
        prevent_accidental_signout_description: `Undvik att logga ut av misstag`,
        prevent_accidental_unload: `Fråga vid navigering från redigeringsläge`,
        prevent_accidental_unload_description: `Värdefullt om du råkar klicka på fel länk mitt i ett inlägg`,
        improved_image_controls: `Bättre zoom- och länkikoner i bilder`,
        improved_image_controls_description: `Visa ikoner framför bilder endast när du hovrar över dem`,
        disable_scroll_restoration: `Förhindra webbläsaren från att komma ihåg scrollning`,
        disable_scroll_restoration_description: `Kan vara praktiskt för tangentbordssurfare`,
        down_for_maintenance: `${down_for_maintenance} varje natt mellan 4:30 och 5:10`,
        down_for_maintenance_description: `Never forget!`,
        proofread_articles: {
            label: `Markera möjliga fel i artiklar`,
            description: `Exempelvis hårda mellanslag och tankstreck`,
            always: `Alltid`,
            corrections: `I rättelsegränssnittet`,
            never: `Aldrig`,
        },
        proofread_forum_posts: `Markera möjliga fel i foruminlägg (i redigeringsläge)`,
        proofread_forum_posts_description: `Samma som ovan, fast i forumet`,
        undo_support: (browser.supportsUndo, { // Make sure the labels match the actual support check (referenced here to facilitate a `git grep` search).
            label: `När ett verktyg infogar text`,
            description: `Om din webbläsare inte låter dig ångra åtgärder utförda med redigeringsverktygen kan ${CONFIG.USERSCRIPT_NAME} skydda markerad text mot oavsiktlig radering om du råkar trycka på fel knapp`,
            replace_selected: `Ersätt markerad text – rekommenderas i alla webbläsare med fullgott ångra-stöd`,
            keep_selected: `Behåll markerad text – rekommenderas i <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1220696">Firefox/Gecko</a> samt på Android`, // Make sure the text matches the actual support check.
        }),
        developer_mode: `Utvecklarläge`,
        developer_mode_description: `Visa fel och varningar längst ner på skärmen`,
        custom_css_enable: `Infoga egen CSS:`,
        custom_css_enable_description: `Anpassa layout och utseende precis som du vill`,
        custom_css_warning: `Klistra aldrig in kod som du inte litar på!`,
    },

    keyboard: `Kortkommandon`,

    interests: {
        label: `Intressen`,
    },
} as const;

export const editing_tools = {
    size_label: `<big>A</big><small>A</small>`,
    size_tooltip: `Textstorlek`,
    color_tooltip: `Textfärg`,
    font_tooltip: `Typsnitt`,
    mark_label: `<mark>mark</mark>`,
    mark_tooltip: `Markerad/framhävd text`,
    abbr_label: SITE.TAG.abbr,
    abbr_tooltip: `Förkortning`,
    quote_tooltip: `Forumcitat`,
    bq_label: `bq`,
    bq_tooltip: `Allmänt blockcitat`,
    spoiler_tooltip: `Spoilers`,
    expander_tooltip: `Långa textstycken`,
    noparse_tooltip: `Inaktivera BB-kod i en viss del av texten`,
    pre_tooltip: `Visa indrag och mellanrum som de är`,
    cmd_tooltip: `Inlinekod`,
    code_tooltip: `Kodstycke`,
    math_label: `<big><i>x</i></big>`,
    math_tooltip: `Matematiska formler och uttryck`,
    sub_label: `<span>⬚</span><sub><i>x</i></sub>`,
    sub_tooltip: `Nedsänkt text`,
    sup_label: `<span>⬚</span><sup><i>x</i></sup>`,
    sup_tooltip: `Upphöjd text`,
    nbsps_label: `␣`,
    nbsps_tooltip: `Ersätt alla mellanslag med hårda mellanslag i markerad text`,
    url_tooltip: `Klickbar länk`,
    img_tooltip: `Bädda in bilder`,
    search_link_tooltip: `Länka till en sökning på markerad text`,
    shibe_label: `shibe`,
    shibe_tooltip: `wow`,
    doge_label: `doge`,
    doge_tooltip: `pls click`,
    split_quote_tooltip: `Splitta ett citat mitt i`,
    edit_label: `Edit`,
    edit_tooltip: `Infoga en redigeringsnotis`,
    ins_label: `<ins class="${SITE.CLASS.bbIns}">${SITE.TAG.ins}</ins>`,
    ins_tooltip: `Tillagd text`,
    del_label: `<del class="${SITE.CLASS.bbDel}">${SITE.TAG.del}</del>`,
    del_tooltip: `Borttagen text`,
    dl_label: SITE.TAG.dl,
    dl_tooltip: `Definitionslista`,
    dt_label: SITE.TAG.dt,
    dt_tooltip: `Term att definiera/beskriva (måste ligga inuti en ${BB.start(SITE.TAG.dl)})`,
    dd_label: SITE.TAG.dd,
    dd_tooltip: `Termens definition/beskrivning (måste ligga inuti en ${BB.start(SITE.TAG.dl)} och efter en ${BB.start(SITE.TAG.dt)})`,
} as const;

export const special_characters: readonly InsertButtonDescription[] = [
    { insert: "\u2011", tooltip: "Hårt bindestreck (tillåter ej radbrytning)" },
    { insert: "–", tooltip: "Kort tankstreck (talstreck; intervall)" },
    { insert: "—", tooltip: "Långt tankstreck" },
    { insert: "…", tooltip: "Uteslutningstecken (Ellipsis)" },
    { insert: "≈", tooltip: "Ungefär lika med" },
    { insert: "−", tooltip: "Minustecken" },
    { insert: "×", tooltip: "Multiplikationstecken" },
    { insert: "·", tooltip: "Halvhög punkt (multiplikationstecken)" },
    { insert: "°", tooltip: "Gradtecken" },
    { insert: "\u202F°C", tooltip: "Grader celsius (inkl. hårt blanksteg)" },
    { insert: CONFIG.NBSP, label: "NBSP", tooltip: "Hårt blanksteg (tillåter ej radbrytning)" },
    { insert: "\u202F", label: "NNBSP", tooltip: "Smalt hårt blanksteg (tillåter ej radbrytning, används som enhets- och tusentalsseparator)" },
    { insert: "²", tooltip: "Upphöjd tvåa" },
    { insert: "′", tooltip: "Primtecken (fot; minuter)" },
    { insert: "″", tooltip: "Dubbelprimtecken (tum; sekunder)" },
    { insert: "✓", tooltip: "Bock" },
    { insert: "→", tooltip: "Högerpil" },
    { insert: "™", tooltip: "Varumärke (trademark)" },
];

export const developer_mode = {
    nothing_logged: `Nothing has been logged.`,
    tooltip: {
        error: (n: number) => `${n} fel`,
        warning: (n: number) => `${n} varning${n === 1 ? "" : "ar"}`,
    },
} as const;
