import * as SITE from "./globals-site";
import * as CONFIG from "./globals-config";
import { assertUnreachable } from "./utilities";
import { InsertButtonDescription } from "./types";
import { Action } from "./actions";
import { SearchEngine } from "./search-engines";
import * as DarkTheme from "./dark-theme";
import * as BB from "bbcode-tags";

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
const editing_tools_name = `Utökade formateringsverktyg`;

const OBVIOUS = `Som det låter`;

export const general = <const> {
    seconds: `sekunder`,
    loading: `Laddar …`,
    dark_theme_toggle_tooltip_on: darkThemeBy,
    dark_theme_toggle_tooltip_off: "Standardutseendet",
    signout_confirmation: `Är du säker på att du vill logga ut?`,
    restore_draft_label: `Återställ`,
    restore_draft_tooltip: `Återställ autosparat utkast`,
    restore_draft_question: `Vill du återställa följande utkast?`,
    restore_draft_confirm: `Din nuvarande text kommer ersättas. Är du säker?`,
    // Copied from SweClockers:
    signout_error: `Ett fel har uppstått och utloggningen misslyckades. Var god ladda om sidan och försök igen. Rensa cookies i din webbläsare för att logga ut manuellt.`,
    quote_signature_label: `Citera sign.`,
    quote_signature_tooltip: `Citera endast signatur`,
    quote_signature_tooltip_no_signature: `Signatur saknas`,
    link_to_top: `Till toppen`,
    textarea_size_small: `Liten textruta`,
    textarea_size_large: `Stor textruta`,
    web_search_button_tooltip: (engine: SearchEngine) => `Sök med ${engine}`,
    tooltip_h: `Rubrik`,
    tooltip_table: `Tabell`,
    down_for_maintenance,
    my_posts,
};

export const preferences = <const> {
    NO_LABEL: ``,
    title: `Inställningar för Better SweClockers`,
    back_to_sweclockers: `Tillbaka till ${SITE.NAME}`,
    save_notice: `Inställningarna sparas automatiskt, men endast lokalt på den här enheten.`,
    failed_to_fetch_categories: `Kunde inte hämta forumkategorier.`,
    in_quick_reply_form: `i formuläret <em>Snabbsvar</em>`,
    in_quick_reply_form_description: `Längst ner i trådar`,

    general: {
        label: `Allmänt`,
        lock_heights: `Lås höjden på reklam etc`,
        lock_heights_description: `Förhindrar att sidans innehåll hoppar när t ex reklam laddas in`,
        compact_layout: `Kompakt layout`,
        compact_layout_description: `Mindre luft för att minimera scrollande`,
        adaptive_width: `LemonIllusions adaptiva layout`,
        adaptive_width_description: `Anpassa bredden på huvudinnehållet (t ex artiklar) efter fönstrets bredd`,
        improved_corrections: `Bättre rättelsegränssnitt`,
        improved_corrections_description: `Gör det enklare att skicka in rättelser`,
        insert_preferences_shortcut: `Genväg till inställningar för ${CONFIG.USERSCRIPT_NAME}`,
        insert_preferences_shortcut_description: `Visa en länk till ${CONFIG.USERSCRIPT_NAME} inställningsmeny högst upp`,
        replace_followed_threads_link: `Ersätt länken <em>Följda trådar</em> med <em>${my_posts}</em>`,
        replace_followed_threads_link_description: OBVIOUS,
        thread_status_tooltips: `Tooltips på trådstatusikoner`,
        thread_status_tooltips_description: `Hovra med musen för att se vad de olika ikonerna betyder i forumets översiktsvyer`,
        insert_web_search_button: `Webbsökknapp`,
        insert_web_search_button_description: `När ${SITE.NAME} inbyggda sökfunktion inte hittar det du söker`,
        search_engine: {
            label: `Sökmotor`,
            description: `Vilken sökmotor som ska användas för webbsökknappen samt för söklänksknappen i ${editing_tools_name}`,
        },
    },

    forum_threads: {
        label: `Forumtrådar`,
        improved_pagination_buttons: `Bättre bläddringsknappar`,
        improved_pagination_buttons_description: `Större knappar som är lättare att klicka på`,
        insert_link_to_top: `Länk till toppen längst ner`,
        insert_link_to_top_description: OBVIOUS,
        highlight_own_posts: `Framhäv egna inlägg`,
        highlight_own_posts_description: `Markera egna inlägg med en orange kant så att de sticker ut`,
        insert_pm_links: `PM-knappar`,
        insert_pm_links_description: `Skicka PM till en användare direkt från deras inlägg`,
        fix_mobile_links: `Omvandla <kbd>${SITE.HOSTNAME_MOBILE}</kbd>-länkar till vanliga`,
        fix_mobile_links_description: `Slipp hamna på mobilsajten bara för att någon klistrat in en sådan länk`,
        quote_signature_buttons: `<em>Citera signatur</em>-knappar`,
        quote_signature_buttons_description: `Citera en användares signatur direkt från deras inlägg`,
        quote_signature_message: `Meddelande vid citering av signatur`,
        quote_signature_message_description: `Fylls i automatiskt när du citerar en signatur`,
        quote_signature_message_default: `Nu består trådens värde även när du byter signatur.`,
    },

    edit_mode: {
        label: `Redigeringsläge`,
        autosave_draft: `Spara utkast automatiskt`,
        autosave_draft_description: `Skydda dina inlägg mot blåskärmar, strömavbrott och andra missöden`,
        textarea_size_save: `Kom ihåg textrutans storlek`,
        textarea_size_save_description: `Behåll samma storlek på textrutan mellan sidladdningar`,
        textarea_size_toggle: `Knappar för att växla storlek på textrutan`,
        textarea_size_toggle_description: `Toggla textrutans storlek precis ovanför den`,
        textarea_size_small: `mellan`,
        textarea_size_large: `och`,
        textarea_size_unit: `px`,
        monospace_font: `<span style="font-family: monospace">Monospace</span>-font i textrutan`,
        monospace_font_description: `Underlättar formatering av kod och dylikt`,
        keyboard_shortcuts: `Kortkommandon för att skicka (<kbd>Ctrl</kbd> + <kbd>S</kbd>) och förhandsgranska (<kbd>Ctrl</kbd> + <kbd>P</kbd>)`,
        keyboard_shortcuts_description: `Skicka och förhandsgranska med tangentbordet`,
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
        label: editing_tools_name,
        enable: `Aktivera utökade formateringsverktyg`,
        enable_description: `En hel samling extra formateringsverktyg för att underlätta inläggsskrivandet`,
        position: {
            label: `Placering`,
            description: OBVIOUS,
            above: `Ovanför textfältet`,
            below: `Under textfältet`,
        },
        special_characters: `Verktyg för specialtecken`,
        code: `Kodrelaterade verktyg`,
        math: `Matematikrelaterade verktyg`,
        whitespace: `Whitespaceverktyg`,
        embed: `Verktyg för länkar, bilder och sökresultat`,
        doge: `very doge buttons`,
        doge_description: `            wow`,
        color_palette: `Färgpaletten`,
        color_palette_description: `Ändra textfärg snabbt och enkelt`,
    },

    dark_theme: {
        label: `Mörkt tema`,
        source: {
            label: `Tema`,
            description: `Vilket mörkt tema föredrar du?`,
            option: darkThemeBy,
        },
        show_toggle: `Visa knapp för manuell växling`,
        show_toggle_description: `Toggla manuellt det mörka temat med en knapp högst upp på sidan`,
        auto: `Automatisk aktivering`,
        auto_description: `Aktivera det mörka temat automatiskt under nattens timmar`,
        between: `mellan`,
        and: `och`,
        interval: `Uppdateringsintervall`,
        interval_description: `Hur ofta ${CONFIG.USERSCRIPT_NAME} ska kolla vad klockan är`,
        use_backup: `Använd Allings server`,
        use_backup_description: `Workaround om ditt valda mörka tema inte är tillgängligt "live"`,
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
        custom_css_enable: `Infoga egen CSS:`,
        custom_css_enable_description: `Anpassa layout och utseende precis som du vill`,
        custom_css_warning: `Klistra aldrig in kod som du inte litar på!`,
    },

    keyboard: `Kortkommandon`,

    interests: {
        label: `Intressen`,
    },
};

export const editing_tools = <const> {
    label_size: `<big>A</big><small>A</small>`,
    tooltip_size: `Textstorlek`,
    tooltip_color: `Textfärg`,
    tooltip_font: `Typsnitt`,
    label_mark: `<mark>mark</mark>`,
    tooltip_mark: `Markerad/framhävd text`,
    tooltip_quote: `Forumcitat`,
    label_bq: `bq`,
    tooltip_bq: `Allmänt blockcitat`,
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
    label_nbsps: `␣`,
    tooltip_nbsps: `Ersätt alla mellanslag med hårda mellanslag i markerad text`,
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
    { insert: CONFIG.NBSP, label: "NBSP", tooltip: "Hårt blanksteg (tillåter ej radbrytning)" },
    { insert: "\u202F", label: "NNBSP", tooltip: "Smalt hårt blanksteg (tillåter ej radbrytning, används som enhets- och tusentalsseparator)" },
    { insert: "²", tooltip: "Upphöjd tvåa" },
    { insert: "′", tooltip: "Primtecken (fot; minuter)" },
    { insert: "″", tooltip: "Dubbelprimtecken (tum; sekunder)" },
    { insert: "✓", tooltip: "Bock" },
    { insert: "→", tooltip: "Högerpil" },
];

export const thread_status = <const> {
    // https://www.sweclockers.com/forum/trad/1367915-faq-tradikoner-och-deras-betydelser
    // NOTE! Apostrophes must be (double-)escaped because these strings are used as CSS `content` values. For example:
    // editors_choice: `Editor\\'s choice`,
    unread: `Olästa inlägg`, // Öppet kuvert
    default: `Gå till tråden`, // Stängt kuvert
    hot: `50+ inlägg`, // Orange kuvert
    participated: `Du har deltagit`, // Sigill (punkt)
    following: `Du följer tråden`, // Stjärna
    locked: `Låst`, // Hänglås
    sticky: `Klistrad`, // Knappnål
    separator: "  •  ",
};
