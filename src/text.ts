import * as SITE from "./globals-site";
import * as CONFIG from "./globals-config";
import { assertUnreachable } from "./utilities";
import { InsertButtonDescription } from "./types";
import { Action } from "./actions";
import { SearchEngine } from "./search-engines";
import * as DarkTheme from "./dark-theme";

export function action(a: Action): string {
    switch (a) {
        case Action.PREVIEW: return `Förhandsgranska`;
        case Action.SUBMIT: return `Skicka`;
    }
    return assertUnreachable(a);
}

function genitive(name: string): string {
    return ["s", "x", "z"].some(letter => name.endsWith(letter)) ? name : name + "s";
}

function darkThemeBy(author: DarkTheme.Source): string {
    return `${genitive(author)} mörka tema`;
}

const my_posts = `Mina inlägg`;
const down_for_maintenance = `Nere för underhåll`;

export const general = {
    seconds: `sekunder`,
    loading: `Laddar …`,
    dark_theme_toggle_tooltip_on: darkThemeBy,
    dark_theme_toggle_tooltip_off: "Standardutseendet",
    signout_confirmation: `Är du säker på att du vill logga ut?`,
    // Copied from SweClockers:
    signout_error: `Ett fel har uppstått och utloggningen misslyckades. Var god ladda om sidan och försök igen. Rensa cookies i din webbläsare för att logga ut manuellt.`,
    quote_signature_label: `Citera sign.`,
    quote_signature_tooltip: `Citera endast signatur`,
    link_to_top: `Till toppen`,
    textarea_size_small: `Liten textruta`,
    textarea_size_large: `Stor textruta`,
    web_search_button_tooltip: (engine: SearchEngine) => `Sök med ${engine}`,
    tooltip_h: `Rubrik`,
    down_for_maintenance,
    my_posts,
};

export const preferences = {
    NO_LABEL: ``,
    title: `Inställningar för Better SweClockers`,
    back_to_sweclockers: `Tillbaka till ${SITE.NAME}`,
    save_notice: `Inställningarna sparas automatiskt, men endast lokalt på den här enheten.`,
    failed_to_fetch_categories: `Kunde inte hämta forumkategorier.`,

    general: {
        label: `Allmänt`,
        lock_heights: `Lås höjden på reklam etc`,
        compact_layout: `Kompakt layout`,
        adaptive_width: `LemonIllusions adaptiva layout`,
        improved_corrections: `Bättre rättelsegränssnitt`,
        insert_preferences_shortcut: `Genväg till inställningar för ${CONFIG.USERSCRIPT_NAME}`,
        replace_followed_threads_link: `Ersätt länken <em>Följda trådar</em> med <em>${my_posts}</em>`,
        insert_web_search_button: `Webbsökknapp`,
        search_engine: {
            label: `Sökmotor`,
        },
    },

    forum_threads: {
        label: `Forumtrådar`,
        improved_pagination_buttons: `Bättre bläddringsknappar`,
        insert_link_to_top: `Länk till toppen längst ner`,
        highlight_own_posts: `Framhäv egna inlägg`,
        insert_pm_links: `PM-knappar`,
        fix_mobile_links: `Omvandla <kbd>${SITE.HOSTNAME_MOBILE}</kbd>-länkar till vanliga`,
        quote_signature_buttons: `<em>Citera signatur</em>-knappar`,
        quote_signature_message: `Meddelande vid citering av signatur`,
        quote_signature_message_default: `Nu består trådens värde även när du byter signatur.`,
    },

    edit_mode: {
        label: `Redigeringsläge`,
        textarea_size_save: `Kom ihåg textrutans storlek`,
        textarea_size_toggle: `Knappar för att växla storlek på textrutan`,
        textarea_size_small: `mellan`,
        textarea_size_large: `och`,
        textarea_size_unit: `px`,
        monospace_font: `<span style="font-family: monospace">Monospace</span>-font i textrutan`,
        keyboard_shortcuts: `Kortkommandon för att skicka (<kbd>Ctrl</kbd> + <kbd>S</kbd>) och förhandsgranska (<kbd>Ctrl</kbd> + <kbd>P</kbd>)`,
        insert_heading_toolbar_button: `Knapp för att formatera som rubrik`,
        remember_caret_position: `Kom ihåg markörens position vid förhandsgranskning`,
        remove_mobile_site_disclaimer: `Ta bort <small><em>${SITE.MOBILE_SITE_DISCLAIMER.sentFrom} ${SITE.MOBILE_SITE_DISCLAIMER.mobileSiteDomain}</em></small>`,
    },

    editing_tools: {
        label: `Utökade formateringsverktyg`,
        enable: `Aktivera utökade formateringsverktyg`,
        in_quick_reply_form: `i formuläret <em>Snabbsvar</em>`,
        position: {
            label: `Placering`,
            above: `Ovanför textfältet`,
            below: `Under textfältet`,
        },
        special_characters: `Verktyg för specialtecken`,
        code: `Kodrelaterade verktyg`,
        math: `Matematikrelaterade verktyg`,
        embed: `Verktyg för länkar, bilder och sökresultat`,
        doge: `very doge buttons`,
        doge_description: `            wow`,
        color_palette: `Färgpaletten`,
    },

    dark_theme: {
        label: `Mörkt tema`,
        source: {
            label: `Tema`,
            option: darkThemeBy,
        },
        show_toggle: `Visa knapp för manuell växling`,
        auto: `Automatisk aktivering`,
        between: `mellan`,
        and: `och`,
        interval: `Uppdateringsintervall`,
        use_backup: `Använd Allings server`,
    },

    customize_content: {
        label: `Anpassa innehåll`,
        news_ticker: `Senaste nytt (under loggan)`,
        carousel: `Bildspelsvyn högst upp`,
        social_media: `Knappar för sociala medier`,
        anniversary: `SweClockers 20 år`,
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
        prevent_accidental_unload: `Fråga vid navigering från redigeringsläge`,
        improved_image_controls: `Bättre zoom- och länkikoner i bilder`,
        disable_scroll_restoration: `Förhindra webbläsaren från att komma ihåg scrollning`,
        down_for_maintenance: `${down_for_maintenance} varje natt mellan 4:30 och 5:10`,
        proofread_articles: {
            label: `Markera möjliga fel i artiklar`,
            always: `Alltid`,
            corrections: `I rättelsegränssnittet`,
            never: `Aldrig`,
        },
        proofread_forum_posts: `Markera möjliga fel i foruminlägg (i redigeringsläge)`,
        custom_css_enable: `Infoga egen CSS:`,
        custom_css_warning: `Klistra aldrig in kod som du inte litar på!`,
    },

    keyboard: `Kortkommandon`,

    interests: {
        label: `Intressen`,
    },
};

export const editing_tools = {
    label_size: `<big>A</big><small>A</small>`,
    tooltip_size: `Textstorlek`,
    tooltip_color: `Textfärg`,
    tooltip_font: `Typsnitt`,
    label_mark: `<mark>mark</mark>`,
    tooltip_mark: `Markerad/framhävd text`,
    tooltip_quote: `Citat`,
    tooltip_spoiler: `Spoilers`,
    tooltip_expander: `Långa textstycken`,
    tooltip_noparse: `Inaktivera BB-kod i en viss del av texten`,
    tooltip_pre: `Visa indrag och mellanrum som de är`,
    tooltip_cmd: `Inlinekod`,
    tooltip_code: `Kodstycke`,
    label_math: `<big><i>x</i></big>`,
    tooltip_math: `Matematiska formler och uttryck`,
    label_sub: `<span>⬚</span><sub><i>x</i></sub>`,
    tooltip_sub: `Nedsänkt text`,
    label_sup: `<span>⬚</span><sup><i>x</i></sup>`,
    tooltip_sup: `Upphöjd text`,
    tooltip_url: `Klickbar länk`,
    tooltip_img: `Bädda in bilder`,
    tooltip_search_link: `Länka till en sökning på markerad text`,
    label_shibe: `shibe`,
    tooltip_shibe: `wow`,
    label_doge: `doge`,
    tooltip_doge: `pls click`,
    tooltip_split_quote: `Splitta ett citat mitt i`,
    label_edit: `Edit`,
    tooltip_edit: `Infoga en redigeringsnotis`,
};

export const special_characters: ReadonlyArray<InsertButtonDescription> = [
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
    { insert: "\xA0", label: "NBSP", tooltip: "Hårt blanksteg (tillåter ej radbrytning)" },
    { insert: "\u202F", label: "NNBSP", tooltip: "Smalt hårt blanksteg (tillåter ej radbrytning, används som enhets- och tusentalsseparator)" },
    { insert: "²", tooltip: "Upphöjd tvåa" },
    { insert: "′", tooltip: "Primtecken (fot; minuter)" },
    { insert: "″", tooltip: "Dubbelprimtecken (tum; sekunder)" },
    { insert: "✓", tooltip: "Bock" },
    { insert: "→", tooltip: "Högerpil" },
];
