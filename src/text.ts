import * as SITE from "globals-site";
import { InsertButtonDescription } from "./types";

export const general = {
    dark_theme_toggle_tooltip_on: "Blargmodes mörka tema",
    dark_theme_toggle_tooltip_off: "Standardutseendet",
};

export const preferences = {
    NO_LABEL: ``,
    title: `Inställningar för Better SweClockers`,
    back_to_sweclockers: `Tillbaka till ${SITE.NAME}`,
    save_notice: `Inställningarna sparas automatiskt, men endast lokalt på den här enheten.`,

    general: {
        label: `Allmänt`,
        lock_heights: `Lås höjden på reklam etc`,
        compact_layout: `Kompakt layout`,
        hide_image_controls: `Dölj zoom- och länkikoner i bilder`,
        search_engine: {
            label: `Sökmotor`,
            google: `Google`,
            duckduckgo: `DuckDuckGo`,
        },
    },

    editing_tools: {
        label: `Utökade formateringsverktyg`,
        enable: `Aktivera utökade formateringsverktyg`,
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
    },

    dark_theme: {
        label: `Blargmodes mörka tema`,
        show_toggle: `Visa knapp för manuell växling`,
        auto: `Automatisk aktivering`,
        between: `mellan`,
        and: `och`,
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
    tooltip_spoiler: `Spoilers, mycket långa textstycken etc`,
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
