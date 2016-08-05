// ==UserScript==
// @name            Better SweClockers
// @namespace       http://alling.se
//
//                  *** Don't forget to update version below as well! ***
// @version         2.2
//                  *** Don't forget to update version below as well! ***
//
// @match           http://*.sweclockers.com/*
// @match           https://*.sweclockers.com/*
// @exclude         *cdn.sweclockers.com/*
// @description     Provides extra functionality to the SweClockers website and increases usability enormously by locking the height of the ads.
// @run-at          document-start
// ==/UserScript==

//*****************************************//
// Copyright 2013, 2014, 2015 Simon Alling //
// Released under a modified version of    //
// GNU GPLv3, as described in `COPYING`.   //
//*****************************************//

/*jshint multistr: true */

// Wrapper IIFE start:
var Better_SweClockers = (function() {
"use strict";

// Needed for update check. Remember to update!
var version = "2.2";

// "Constants"
var ABOVE_STANDARD_CONTROL_PANEL = 0;
var ABOVE_TA = 1;
var BELOW_TA = 2;
var HIGHLIGHT = "HIGHLIGHT";

// Character escape sequences (for reference)
// \u2011 = no-break hyphen
// \xA0   = no-break space (NBSP)
// \u202F = narrow no-break space (NNBSP)

var favoriteLinksRawDefault = "\
### Better SweClockers\n\
   Inställningar för Better SweClockers === /better-sweclockers\n\
   Better SweClockers-tråden === /forum/10-programmering-och-digitalt-skapande/1288777-better-sweclockers\n\
   Dokumentation === /forum/10-programmering-och-digitalt-skapande/1288777-better-sweclockers#post14497818\n\
/###\n\
Redigera signatur === /profil/installningar/signatur";

var quoteSignatureTipDefault = "Så, nu kvarstår trådens värde även när du byter signatur, så att andra lättare kan lösa samma problem i framtiden. Posta alltid specs i klartext i trådstarten, om de är relevanta. :)";

var defaultColors = [
    "#D00",     // dark red
    "#C15200",  // SweClockers orange
    "#EE8500",  // orange
    "#EC0",     // yellow
    "#20A000",  // green
    "#789922",  // >greentext
    "#106400",  // dark green
    "#0BC",     // turquoise
    "#24F",     // light blue
    "#1525D0",  // dark blue
    "#9000B5",  // purple
    "black",
    "gray",
    "white",
    "red",
    "yellow",
    "lime",
    "green",
    "aqua",
    "blue",
    "magenta"
];

var BSC = {
    version: version,
    pseudoConsole: false, // true for a pseudo-console; useful on platforms that don't have a native console. Should be false in production.
    oldestRecommendedSettings: "2.0", // Oldest version whose settings are known not to conflict with the current version.

    logoURL: "https://i.imgur.com/oZHfIXh.png",
    documentationURL: "/forum/10-programmering-och-digitalt-skapande/1288777-better-sweclockers/#post14497818",
    settingsURL: "/better-sweclockers",
    settingsURLFavoriteLinks: "/better-sweclockers#Favoritlänkar",
    defaultStylesheetURL: "/css/combine.min.css",
    BBCodeReferenceURL: "/forum/trad/1367916",
    darkThemeURL: "http://blargmode.se/files/swec_dark_theme/style.css",
    smileyURLs: {
        doge: "http://i.imgur.com/2IGEruO.png"
    },
    greenTextColor: "#789922",

    shibeTextLineMaxLength: 100, // max line length of shibe text
    bannerHeightTop:  121, // default height of top ad banner
    bannerHeightSide: 360, // default height of side ad banners
    bannerHeightMid:  384, // default height of page ad modules
    favoriteLinksHeight: 32,

    myName: "", // user's username
    CSS: "", // will contain all BSC CSS
    styleElement: document.createElement("style"), // main style element for BSC CSS
    darkThemeStyleElement: document.createElement("style"), // for toggling Blargmode's dark theme
    TA: null, // main textarea in advanced edit mode
    TAIsFocused: false, // will be set on focus() and blur()
    darkThemeRefreshInterval: 5000, // milliseconds
    DOMTimer: null,
    DOMOperations: [],
    DOMTimerInterval: 30, // milliseconds
    forumPosts: null,
    finishHasRun: false,
    intentionalUnload: false, // will be set to true if AEM is unloaded by form submission
    exceptions: [], // will be filled with non-fatal exceptions and displayed when BSC finishes
    warnings: [], // will be filled with warnings and displayed when BSC finishes
    console: document.createElement("pre"), // pseudo-console for platforms without a native console
    consoleContainer: document.createElement("div"),

    defaultSettings: {
        "ACP_insertionPoint":                   BELOW_TA,
        "ACP_quickLinks":                       true,
        "ACP_colorPalette":                     true,
        "ACP_dogeButtons":                      true,
        "ACP_smileys":                          true,
        "ACP_specialChars":                     true,
        "ACP_usefulLinks":                      true,
        "addAEMUnloadConfirmation":             true,
        "addPMLinks":                           true,
        "advancedControlPanel":                 true,
        "autofocusPMSubject":                   true,
        "autofocusTA":                          true,
        "betterPaginationButtons":              true,
        "colors":                               defaultColors,
        "darkThemeActive":                      false,
        "darkThemeAllowAutoActivation":         true,
        "darkThemeAllowAutoDeactivation":       true,
        "darkThemeByBlargmode":                 true,
        "darkThemeByBlargmodeTimeOn":           "",
        "darkThemeByBlargmodeTimeOff":          "",
        "darkThemeCache":                       false, // false to fetch from server, true to use BSC.darkThemeCached (which may not be the latest version)
        "darkThemeWasLastSetByUser":            null, // true for user, false for timer
        "dogeInQuoteFix":                       true,
        "DOMOperationsDuringPageLoad":          true,
        "enableFilter":                         true,
        "enableFavoriteLinks":                  true,
        "favoriteLinks":                        null,
        "favoriteLinksRaw":                     favoriteLinksRawDefault,
        "fixAdHeight":                          true,
        "fixArticleImageHeight":                false,
        "hideThumbnailCarousel":                false,
        "highlightUnreadPMs":                   true,
        "highlightOwnPosts":                    true,
        "hideFacebookButtons":                  false,
        "largerTextareaHeight":                 720,
        "openImagesInNewTab":                   false,
        "preventAccidentalSignout":             true,
        "removeLastNewline":                    true,
        "removeMobileSiteDisclaimer":           true,
        "removePageLinkAnchors":                false,
        "searchWithGoogle":                     true,
        "searchWithDuckDuckGo":                 false,
        "quoteSignatureButtons":                false,
        "quoteSignatureTip":                    quoteSignatureTipDefault,
        "textareaHeight":                       360,
        "uninterestingForums":                  {},
        "version":                              version // the version that saved the settings
    },

    content: {
        // Text labels etc
        activateDarkTheme: "Blargmodes mörka tema",
        deactivateDarkTheme: "Standardutseendet",
        largerTextarea: "Större textfält",
        openInNewTab: "Öppna i ny flik",
        smallerTextarea: "Mindre textfält"
    },

    settings: {},

    state: {
        "firstTimeUsingBSC": true
    },

    setState: function(st, value) {
        if (isNonEmptyString(st) && value !== undefined) {
            this.state[st] = value;
            saveState();
            log("State "+st+" was set to "+value+".");
        }
    },

    getState: function(st) {
        if (isNonEmptyString(st)) {
            return this.state[st];
        }
    },

    addDOMOperation: function(condition, operation) {
        this.DOMOperations.push([condition, operation]);
    },

    runDOMOperation: function(index) {
        // Also REMOVES the operation so it won't run again
        // [0] to get the first "tuple" of the (1-sized) array returned by splice()
        // [1] to get the second element in that "tuple" (the function to run)
        (this.DOMOperations.splice(index, 1)[0][1])();
    },

    addCSS: function(CSS) {
        BSC.CSS += "\n" + CSS;
        updateStyleElement();
    },

    usefulLinks: [
        ["SweClockers",
            ["Better\xA0SweClockers", "/forum/trad/1288777-better-sweclockers"],
            ["Better\xA0SweClockers' dokumentation", "/forum/trad/1288777-better-sweclockers#post14497818"],
            ["Blargmodes mörka tema", "/forum/trad/1089561-ett-morkt-tema-till-sweclockers"],
            ["Dagens fynd", "/forum/trad/999559-dagens-fynd-bara-tips-ingen-diskussion-las-forsta-inlagget-forst"],
            ["Marknadsreferenser", "/forum/trad/1079311-sweclockers-marknadsreferenser-las-forsta-inlagget-innan-du-postar"],
            ["SweClockers BB-kod", "/forum/trad/1367916-faq-sweclockers-bb-kod"]
        ],
        ["Mjukvara",
            ["Core Temp", "http://www.alcpu.com/CoreTemp"],
            ["CPU-Z", "http://www.cpuid.com/softwares/cpu-z/versions-history.html"],
            ["Driver Sweeper", "http://www.guru3d.com/content_page/guru3d_driver_sweeper.html"],
            ["GPU-Z", "http://www.techpowerup.com/gpuz"],
            ["HWMonitor", "http://www.cpuid.com/softwares/hwmonitor.html"],
            ["IntelBurnTest", "http://www.techspot.com/downloads/4965-intelburntest.html"],
            ["MSI Afterburner", "http://event.msi.com/vga/afterburner/download.htm"],
            ["Real Temp", "http://www.techpowerup.com/realtemp"]
        ],
        ["Hårdvara",
            ["Cooler Master Hyper 212 Evo", "http://www.prisjakt.nu/produkt.php?p=1008748"],
            ["SSD, 120–128\xA0GB", "http://www.prisjakt.nu/kategori.php?k=893#rparams=l=s213290230"],
            ["SSD, 240–256\xA0GB", "http://www.prisjakt.nu/kategori.php?k=893#rparams=l=s213290494"],
            ["SSD, 480+\xA0GB", "http://www.prisjakt.nu/kategori.php?l=893#rparams=l=s213290625"],
            ["Intel\xA0Core\xA0i5\u20114690K", "http://www.prisjakt.nu/produkt.php?p=2677308"],
            ["Intel\xA0Core\xA0i7\u20114790K", "http://www.prisjakt.nu/produkt.php?p=2671514"],
            ["Z97-moderkort", "http://www.prisjakt.nu/kategori.php?k=1320#rparams=l=s184057808"],
            ["Asus ROG Swift PG278Q", "http://www.prisjakt.nu/produkt.php?p=2714866"],
            ["QNIX QX2710/X-STAR DP2710", "/forum/trad/1208485-qnix-x-star-qx-dp2710-27-2560x1440-samsung-pls-panel-310-a/"],
            ["Originaltråden om Koreaskärmar", "/forum/trad/1095329-intressant-skarm-achieva-shimian-qh270-400-ips-2560x1440-korean-monitor/"]
        ],
        ["Webbtjänster",
            ["Imgur", "http://imgur.com"],
            ["Prisjakt", "http://www.prisjakt.nu/kategori.php?k=328"]
        ],
        ["Recensioner: Processorer",
            ["Sandy Bridge", "/recension/13224-intel-sandy-bridge-core-i7-2600k-core-i5-2500k"],
            ["Sandy Bridge-E", "/recension/14699-intel-core-i7-3930k-och-3960x-sandy-bridge-e"],
            ["Ivy Bridge", "/recension/15291-intel-core-i7-3770k-och-core-i5-3570k"],
            ["Ivy Bridge-E", "/recension/17493-intel-core-i7-4960x-ivy-bridge-e"],
            ["Haswell", "/recension/17016-intel-core-i7-4770k-och-i5-4670k-haswell"],
            ["Haswell-E", "/recension/19191-intel-core-i7-5960x-i7-5930k-och-i7-5820k-familjen-haswell-e"],
            ["Devil's Canyon (4790K)", "/recension/18924-intel-core-i7-4790k-devils-canyon"],
            ["Devil's Canyon (4690K & G3258)", "/recension/18964-intel-core-i5-4690k-och-pentium-g3258-anniversary-edition"],
            ["Zambezi", "/recension/14579-amd-fx-8150-och-fx-8120-bulldozer"],
            ["Vishera", "/recension/15973-amd-fx-8350-vishera"]
        ],
        ["Recensioner: Grafikkort",
            ["GeForce GTX 690", "/recension/15381-geforce-gtx-690-varldens-snabbaste-grafikkort/6"],
            ["GeForce GTX 780 Ti", "/recension/17844-nvidia-geforce-gtx-780-ti/16"],
            ["GeForce GTX 980 & 970", "/recension/19332-nvidia-geforce-gtx-980-och-gtx-970/19"],
            ["GeForce GTX Titan", "/recension/16541-nvidia-geforce-gtx-titan/8"],
            ["GeForce GTX Titan Z", "/recension/18944-nvidia-geforce-gtx-titan-z/17"],
            ["GeForce GTX Titan X", "/recension/20193-nvidia-geforce-gtx-titan-x/18"],
            ["GeForce GTX Titan X i SLI", "/recension/20216-nvidia-geforce-gtx-titan-x-i-sli/16"],
            ["Radeon HD 7970 GHz", "/recension/15564-amd-radeon-hd-7970-gigahertz-edition/17"],
            ["Radeon HD 7990", "/recension/16879-amd-radeon-hd-7990-malta/14"],
            ["Radeon R9 290X", "/recension/17772-amd-radeon-r9-290x/18"],
            ["Radeon R9 295X2", "/recension/18544-amd-radeon-r9-295x2/18"]
        ],
        ["Recensioner: Övrigt",
            ["Asus ROG Swift PG278Q", "/recension/19072-asus-rog-swift-pg278q"],
            ["Acer XB270HU Predator", "/recension/20186-acer-xb270hu-predator-ips-baserad-gamingskarm-i-144-hz-med-nvidia-g-sync"],
            ["Eizo Foris FG2421", "/recension/17817-eizo-foris-fg2421-gaming-med-hog-uppdateringsfrekvens-och-va-panel"],
            ["Billiga kylare", "/recension/18610-billiga-luftkylare-fran-arctic-cooling-cooler-master-och-silverstone"]
        ],
        ["Prestandaanalyser",
            ["SweClockers prestandaanalys: Processorer i BF3", "/artikel/14650-prestandaanalys-battlefield-3/5#pagehead"],
            ["SweClockers prestandaanalys: Grafikkort i BF3", "/artikel/14650-prestandaanalys-battlefield-3/4#pagehead"],
            ["SweClockers prestandaanalys: Processorer i BF4", "/artikel/17810-prestandaanalys-battlefield-4/4#pagehead"],
            ["SweClockers prestandaanalys: Grafikkort i BF4", "/artikel/17810-prestandaanalys-battlefield-4/3#pagehead"]
        ],
        ["Rabatter",
            ["Alina fraktfritt över 500:- (registrering)", "http://www.alina.se/registrera.aspx?sweclockers"],
            ["Inet fraktfritt", "http://www.inet.se/produkt/9990887/fraktfritt-sweclockers"]
        ],
        ["Windows",
            ["SweClockers installationsguide", "/artikel/15673-installera-windows-7-och-8-fran-ett-usb-minne"],
            ["Windows 7 USB/DVD Download Tool", "http://www.microsoftstore.com/store/msusa/html/pbPage.Help_Win7_usbdvd_dwnTool"],
            ["Windows 7", "http://www.microsoft.com/en-us/software-recovery"],
            ["Windows 8/8.1", "http://windows.microsoft.com/en-us/windows-8/upgrade-product-key-only"]
        ]
    ],

    categories: [
        // ==== Datorkomponenter ====
        [  2, "Kylning och överklockning av processorer"],
        [154, "Kylning och överklockning av processorer/Extreme"],
        [ 54, "Processorer, moderkort och minnen/AMD"],
        [ 55, "Processorer, moderkort och minnen/Intel"],
        [  3, "Processorer, moderkort och minnen/Övrigt"],
        [125, "Grafikkort/Geforce"],
        [126, "Grafikkort/Radeon"],
        [  4, "Grafikkort/Övrigt"],
        [  5, "Modifikationer och egna konstruktioner"],
        [143, "Modifikationer och egna konstruktioner/Projektloggar"],
        [  6, "Lagring"],
        [ 74, "Chassin och nätaggregat"],
        [ 56, "Kringutrustning"],
        [ 73, "Retro"],
        // ==== Datorer och system ====
        [ 86, "Stationära datorer/Köpråd"],
        [ 61, "Stationära datorer/Support"],
        [112, "Bärbara datorer/Köpråd"],
        [ 67, "Bärbara datorer/Support"],
        [102, "HTPC och mediaspelare"],
        [122, "Server"],
        [141, "Enkortsdatorer"],
        [129, "Surfplattor"],
        [ 75, "Mobiltelefoner"],
        [100, "Apple Mac"],
        // ==== Ljud, bild och kommunikation ====
        [ 77, "Ljud"],
        [101, "Skärmar och tv-apparater"],
        [131, "Skärmar och tv-apparater/Multiskärm"],
        [103, "Foto och video"],
        [ 14, "Nätverk och uppkoppling"],
        // ==== Spel ====
        [144, "Spelservrar och klanspel"],
        [149, "Spelservrar och klanspel/SpelClockers"],
        [ 76, "Actionspel och shooters"],
        [138, "Actionspel och shooters/ARMA och DayZ"],
        [123, "Actionspel och shooters/Battlefield"],
        [128, "Actionspel och shooters/Counter-Strike"],
        [116, "Rollspel och äventyr"],
        [134, "Rollspel och äventyr/Diablo III"],
        [121, "Rollspel och äventyr/World of Warcraft"],
        [150, "Strategi och MOBA"],
        [151, "Racing, sport och simulator"],
        [  8, "Övrigt om datorspel"],
        [ 84, "Spelkonsoler och konsolspel"],
        // ==== Mjukvara ====
        [145, "Moln- och internettjänster"],
        [ 10, "Programmering och digitalt skapande"],
        [ 22, "Microsoft Windows"],
        [155, "Microsoft Windows/Windows 10"],
        [ 17, "Linux och övriga operativsystem"],
        // ==== Övrigt ====
        [ 52, "Nyhetskommentarer"],
        [118, "Nyhetskommentarer/Annonskommentarer"],
        [ 78, "Nyhetskommentarer/Gallerikommentarer"],
        [ 71, "Butiker och tillverkare"],
        [146, "Butiker och tillverkare/Asus"],
        [127, "Butiker och tillverkare/Corsair"],
        [156, "Butiker och tillverkare/Inet"],
        [152, "Butiker och tillverkare/MSI (på engelska)"],
        [147, "Butiker och tillverkare/Webhallen"],
        [ 13, "Konsumenträtt"],
        [ 91, "Övriga ämnen/Akademiska ämnen"],
        [ 92, "Övriga ämnen/Underhållning och medier"],
        [ 93, "Övriga ämnen/Hobby, fritid och livsstil"],
        [104, "Övriga ämnen/SweClockers foldinglag"],
        [130, "Övriga ämnen/Kryptovalutor"]
    ],

    darkThemeCached: '.articleNavi .head{padding-top:3px}.bbColor[style="color: blue;"]{color:#09F!important}.spoilerContent .bbVideoYoutube:first-child{clear:both}.articleNavi .quick a,.bbIns,.bbMark,.pages a{border-radius:3px!important}.bbSpoiler .spoilerHeader{float:right;margin-top:7px;margin-right:5px}.bbIns,.bbMark{padding:0 1px!important}.header,.header .shadow,.menuItem,.searchField .fieldWrap,.searchField input,.signinDialog input,body{background-color:#000!important;color:#8A8A8A!important}.header,.header .shadow,.menuItem,body{background-image:url(http://blargmode.se/files/swec_dark_theme/grain_dark.png)!important}.bbIns,.bbMark{background-color:#713a11!important}.articleNavi .pageButton:hover,.bbTable th,.filterLinks .filterLink.isSelected,.forumForm .body,.forumList .numThreads,.forumList .numViews,.forumList .title,.forumPost,.forumResultPost,.infoBox,.marketList .status,.marketList .title,.memberTable .cell,.pages .isCurrent,.pages a.isCurrent:hover,.pages a.isCurrent:hover .label,.pages a:hover,.postBox,.signinDialog .inner,.stepWidget .stepItem.isSelected,.tanukiCombobox .tcbSelectedItem,.threadList .numReplies,.threadList .select,.threadList .status,.threadList .title,input,select,textarea{background-color:#222!important}.bbPoll .inner,.bbQuote,.bbSpoiler .spoilerFrame,.footer .top,.forumForm input,.forumForm textarea,.forumList .lastReply,.forumList .lastThread,.forumList .link,.forumList .numReplies,.forumList .status,.forumPost .details,.forumPost .profile,.forumResultPost .dateline,.infoTextWindow,.mainContent,.marketList .date,.marketList .price,.memberTable .alt2,.postBox .shortcut,.quickReply textarea,.showFrame,.tanukiCombobox .tcbTriggerFrame,.threadList .lastReply,.threadList .numViews,.threadMap .postElement{background-color:#111!important},.threadList .isSticky .numReplies,.threadList .isSticky .select,.threadList .isSticky .status,.threadList .isSticky .title{background-color:#272727!important}.threadList .isSelected .cell{background-color:#200e00!important}.threadList .isSticky .lastReply,.threadList .isSticky .numViews{background-color:#191919!important}.mainMenu .isSelected{background-color:#08090a!important;background-image:none!important}img[src*="/image/diagram/"]{background-color:#CCC}:not(.arrow):not(.handle){border-color:#333!important}.mainWidget .body .divider{border-color:#43413d!important}.bbTable thead .bbParagraph,.forumTable th .numReplies,.pages a:hover>.label,.postBox .head .title,.tanukiCombobox .tcbSelectedItem{color:#EBEBEB!important}.bbList,.bbParagraph,.bbPre,.bbcode h1,.bbcode h2,.bbcode h3,.bbcode h4,.bbcode h5,.bbcode h6,.contactInfo,.expanderHeader,.feedItem,.forumForm,.forumPoll .inner,.forumPost .quoteHead,.forumPost .showFrame,.forumPost .title,.forumResultPost,.forumRules,.forumTable tbody .numThreads,.forumTable td .by,.forumTable td .date,.forumTable td .descr,.forumTable td .numReplies,.forumTable td .time,.forumTable td.numReplies,.galleryFiles,.galleryFiles input,.galleryForm,.galleryForm input,.galleryForm select,.galleryForm textarea,.header .profile .options,.infoText,.infoTextWindow,.marketAcceptRules,.marketFilterBox input,.marketFilterBox select,.marketForm,.marketForm input,.marketForm select,.marketForm textarea,.marketList .row,.memberTable,.ninjaSearch h5,.pages .isCurrent .label,.profileHeader .label,.quickReply label,.searchField input,.signinDialog,.signinDialog input,.spoilerPlaceholder,.tanukiSelect select,.tanukiTextarea textarea,.tanukiTextbox input,label,select{color:#8A8A8A!important}#proofArticle,* a,.feedMore,.footer .top a::before,.forumList .lastThread h3,.galleryBody .commentLink::before,.header .profile .hasUnread a,.mwLabel.mwComments,.plLabel.plComments{color:#c15200!important}#proofArticle:hover,* a:hover,.feedMore:hover,.footer .top a::before:hover,.forumList .lastThread h3:hover,.galleryBody .commentLink::before:hover,.mwLabel.mwComments:hover,.plLabel.plComments:hover{color:#ff8d38!important}.articleCommentsWidget .boxAction .actionLabel,.forumPost .postHeader .headerLink,.forumTable .title h3 a,.mainWidget .label,.plHead a,.pushListInternal .link .label,.slide a,.socialWidget a{color:#EBEBEB!important}.commentsBubble,.commentsBubble:hover,.errorBox a,.footer .bottom a,.forumResultPost .postHeader .threadTitle .label,.mainWidget h5 a,.pushListInternal .head h5 a{color:#FFF!important}.pushListInternal .head a{color:#CCC!important}.link .label,.pushListExternal a span{color:#6A6A6A!important}.articleNavi .isCurrent a,.galleryItem a,.header a,.hotGallery a,.newsList .bbParagraph a,.pages a,.popularGalleries a,.tagSection h2 a,.threadMap .postElement a,.videoPush a{color:#8A8A8A!important}.button,.galleryFileEditor button,.tanukiButton,.taunkiButton,a.button{color:#DDD!important}.mwLabel,.mwLabel:hover,.plLabel,.plLabel:hover{color:#d8d8d8!important}.pln{color:#8A8A8A!important}.pun{color:#BBB!important}.kwd{color:#0050FF!important}.lit{color:#EBEBEB!important}.header .main{background:-webkit-gradient(linear,left top,left bottom,from(#08090a),color-stop(98%,#141416),to(#272829))!important;background:-webkit-linear-gradient(top,#08090a,#141416 98%,#272829)!important;background:-moz-linear-gradient(top,#08090a,#141416)!important;background:-o-linear-gradient(top,#08090a,#141416 98%,#272829)!important;background:linear-gradient(top,#08090a,#141416 98%,#272829)!important}.postBox .head{background:-webkit-linear-gradient(top,#979590,#84827d 60%,#7a7873)!important;background:-moz-linear-gradient(top,#979590,#7a7873)!important;background:-o-linear-gradient(top,#979590,#84827d 60%,#7a7873)!important;background:linear-gradient(top,#979590,#84827d 60%,#7a7873)!important}.bbExpander .expanderFade,.bbQuote.isExpandable>.quoteFrame>.quoteFade{background:-moz-linear-gradient(top,rgba(17,17,17,0)0,rgba(17,17,17,.5)25%,rgba(17,17,17,1)100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,rgba(17,17,17,0)),color-stop(25%,rgba(17,17,17,.5)),color-stop(100%,rgba(17,17,17,1)));background:-webkit-linear-gradient(top,rgba(17,17,17,0)0,rgba(17,17,17,.5)25%,rgba(17,17,17,1)100%);background:-o-linear-gradient(top,rgba(17,17,17,0)0,rgba(17,17,17,.5)25%,rgba(17,17,17,1)100%);background:linear-gradient(to bottom,rgba(17,17,17,0)0,rgba(17,17,17,.5)25%,rgba(17,17,17,1)100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#00111111", endColorstr="#111111", GradientType=0)}.button,.galleryFileEditor button,.tanukiButton,.taunkiButton{background-color:#3e3e3e!important;background-image:-webkit-linear-gradient(top,#3e3e3e),#353535)!important;background-image:-moz-linear-gradient(top,#3e3e3e,#353535)!important;background-image:-o-linear-gradient(top,#3e3e3e,#353535)!important;background-image:linear-gradient(to bottom,#3e3e3e,#353535)!important}.button:hover,.galleryFileEditor button:hover,.tanukiButton:hover,.taunkiButton:hover{background-color:#2a2a2a!important;background-image:-webkit-linear-gradient(top,#2a2a2a),#262626)!important;background-image:-moz-linear-gradient(top,#2a2a2a,#262626)!important;background-image:-o-linear-gradient(top,#2a2a2a,#262626)!important;background-image:linear-gradient(to bottom,#2a2a2a,#262626)!important}.pages .icon,.sideMenu .icon{background-image:url(http://blargmode.se/files/swec_dark_theme/spritemap.png)!important}img[src*="/artikel/diagram/"]{filter:invert(85%);-webkit-filter:invert(85%);-o-filter:invert(85%);-ms-filter:"invert(85%)";background:0 0!important}@-moz-document url-prefix(){.bbPre.showFrame,.bbSpoiler .spoilerFrame,.bbcode .bbQuote,.bbcode hr.bbHr{border:1px solid #333!important;border-top-color:#000!important;border-left-color:#000!important}}',
    darkThemeCacheDate: new Date("May 12, 2015 12:54:00")
};

var BASE64 = Object.freeze({
    DOGE: "data:image/png;base64,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",
    IMG: "data:image/png;base64,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",
    IMGUR: "data:image/png;base64,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",
    PM: "data:image/png;base64,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",
    PREVIOUS_PAGE: "data:image/png;base64,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",
    PREVIOUS_PAGE_FOCUS: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAHZJREFUeNrU1s0KwCAMA+Aw9t7mzbPDTsMh/jSFBjx/UNQUkqg3lATXgfowC7KAIygUnIFCwBXoCNyBtsATaAmMgKbASGgIOqBf0Al9wBv+NAC4kJWs0ZW+DCz/YFn+U7XXhL347FVuX05s61bKAvkAAAD//wMA/oqLeHWd3voAAAAASUVORK5CYII=",
    PRISJAKT: "data:image/png;base64,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",
    SETTINGS: "data:image/png;base64,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",
    SMILEY: "",
    SPLITQUOTE: "data:image/png;base64,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",
    URL: "data:image/png;base64,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",
    WINK: "data:image/png;base64,R0lGODlhEAAQAMQfAP+0AMCJa/vZbf/jaf7SM/3EHtrItr97K//bV/yqAeOiKv/iXsqjda1YJ/7YStB2Ef3heuW8XsmON7yCNf/mcePc0//oedysUNWEF7liHOGKDfnGR//of/+9AGcwAOfl4CH5BAEAAB8ALAAAAAAQABAAAAWe4Cd+BjOdE2OMLCNFAiQI18GwFXNBHGdBA8RGwqiIdL2exUJZOAqYm0HC8zEpA88zkSlFIBaPeEHWFgCawERAYQ7I5Scg0VgPKE042dGZ1xEeA296CHwddBMbHnpwCAUdhw0MCgVaCGQICASQaAEGBwAdHgSkBI+QXCsMGKFikK8ADwEiOayvsLJGtAwZGgkAcxoZAbosBgENyQ2eLCEAOw=="
});





//================================================================
// Exceptions
//================================================================

function ElementNotFoundException(message) {
    this.name    = "ElementNotFoundException";
    this.message = message;
}

function ContentCreationException(message) {
    this.name    = "ContentCreationException";
    this.message = message;
}

function TypeException(message) {
    this.name    = "TypeException";
    this.message = message;
}

function GeneralException(message) {
    this.name    = "GeneralException";
    this.message = message;
}





//================================================================
// General help functions
//================================================================

function isInt(n) {
    return Object.typeOf(n) === 'number' && n % 1 === 0;
}

function isString(s) {
    return Object.typeOf(s) === "string";
}

function isNonEmptyString(s) {
    return isString(s) && s !== "";
}

function isVersionNumber(s) {
    // Returns true if s is a string consisting of dot-separated integers
    return isString(s) && /^(\d+\.)*\d+$/.test(s);
}

function byID(i) {
    return document.getElementById(i);
}

function qSel(sel) {
    return document.querySelector(sel);
}

function category(c) {
    return "category." + c;
}

function closestID(element) {
    // Returns the ID of element, or the first ID that is found when
    // climbing towards the root of the DOM tree from element.
    if (element.id) {
        return element.id;
    }
    var x = element;
    while (!!x) {
        if (x.id) {
            return x.id;
        }
        x = x.parentElement;
    }
    return null;
}

function isLink(element) {
    return (element instanceof HTMLElement && element.tagName === "A");
}

function isEmptyLink(element) {
    // true if element is an <a> element with href="#"
    return (isLink(element) && element.getAttribute("href") === "#");
}

function wrap(text, startTag, endTag) {
    return startTag + text + endTag;
}

function invertCase(str) {
    var i, c, result = "";
    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);
        result += c.toUpperCase() === c ? c.toLowerCase() : c.toUpperCase();
    }
    return result;
}

function matches(str, regex) {
    return str.search(regex) !== -1;
}

function eventListener(id, eventName, func) {
    var element = byID(id);
    if (element instanceof HTMLElement) {
        element.addEventListener(eventName, func, false);
    }
}

function randomInt(min, max) {
    // Return an int between min (inclusive) and max (exlusive)
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomIntUpTo(max) {
    // Return an int between 0 (inclusive) and max (exclusive)
    return randomInt(0, max);
}

// Time

function timeOfDay(d) {
    if (d instanceof Date) {
        var startOfDay = new Date();
        startOfDay.setHours(0);
        startOfDay.setMinutes(0);
        startOfDay.setSeconds(0);
        return d.getTime() - startOfDay.getTime();
    } else {
        throw new GeneralException("Function timeOfDay expects one argument of type Date.");
    }
}

function timeIsBetween(t, start, end) {
    // Returns true if now is between startTime and endTime. If endTime < startTime, it is treated as being on the next day.
    // If we do not get an endTime argument, we always return true.
    if (t instanceof Date && start instanceof Date && end instanceof Date) {
        var timeOfDayT     = timeOfDay(t);
        var timeOfDayStart = timeOfDay(start);
        var timeOfDayEnd   = timeOfDay(end);
        if (timeOfDayEnd < timeOfDayStart) {
            // End time is before start time
            return (timeOfDayT < timeOfDayEnd || timeOfDayT >= timeOfDayStart);
        } else {
            // End time is after start time
            return (timeOfDayT < timeOfDayEnd && timeOfDayT >= timeOfDayStart);
        }
    } else {
        throw new GeneralException("Arguments now, startTime and endTime are required.");
    }
}

function isHHMMTime(s) {
    return isNonEmptyString(s) && /^\d{2}:\d{2}/.test(s);
}

function parseHours(s) {
    return s.slice(0,2);
}

function parseMinutes(s) {
    return s.slice(3,5);
}

function getTextInputsFrom(element) {
    if (element instanceof HTMLElement) {
        return element.querySelectorAll("input[type=text], input[type=number], input[type=time], textarea");
    } else throw new TypeException("Could not get text inputs from " + element + " because it is not an HTML element.");
}

function getCheckboxesFrom(element) {
    if (element instanceof HTMLElement) {
        return element.querySelectorAll("input[type=checkbox]");
    } else throw new TypeException("Could not get checkboxes from " + element + " because it is not an HTML element.");
}

function getSelectsFrom(element) {
    if (element instanceof HTMLElement) {
        return element.querySelectorAll("select");
    } else throw new TypeException("Could not get selects from " + element + " because it is not an HTML element.");
}

function isOlderVersion(ver, newestVer) {
    if (!isVersionNumber(ver) || !isVersionNumber(newestVer)) {
        throw new TypeException("Could not compare versions because isOlderVersion was called with invalid arguments (" + ver + " and " + newestVer + ").");
    }
    var version = ver;
    var newestVersion = newestVer;
    var match, versionPiece, newestVersionPiece;
    while (version !== "" || newestVersion !== "") {
        match = version.match(/^\d+/);
        versionPiece = !!match ? parseInt(match[0]) : 0;
        match = newestVersion.match(/\d+/);
        newestVersionPiece = !!match ? parseInt(match[0]) : 0;
        if (versionPiece < newestVersionPiece) {
            return true;
        } else if (versionPiece > newestVersionPiece) {
            return false;
        }
        version = version.replace(/^\d+\.?/, "");
        newestVersion = newestVersion.replace(/^\d+\.?/, "");
    }
    return false; // Since they are equal.
}

function scrollToElementWithID(id) {
    var element = byID(id);
    if (!!element) {
        element.scrollIntoView(true);
    } else addWarning("Could not scroll to element with ID "+id+" because such an element could not be found.");
}

function getURLAnchor() {
    var parts = document.location.href.split("#");
    return parts.length > 1 ? parts[1] : null;
}

function removeAnchor(link) {
    if (link instanceof HTMLAnchorElement) {
        link.href = link.href.replace(/#.*$/, "");
    }
}

function createLink(text, href, title) {
    if (isString(text) && isString(href)) {
        var link = document.createElement("a");
        link.href = href;
        link.textContent = text;
        if (isNonEmptyString(title)) {
            link.title = title;
        }
        return link;
    }
}

function createSwecButton(val) {
    var button = document.createElement("input");
    button.type = "button";
    button.classList.add("button");
    if (isString(val)) {
        button.value = val;
    }
    return button;
}

function createBSCIconButton(text, iconURL, href, title, id) {
    if (isNonEmptyString(text) && isNonEmptyString(iconURL)) {
        var link = createLink(text, href || "#", title);
        var icon = document.createElement("img");
        icon.src = iconURL;
        link.prependChild(icon);
        if (!!id) {
            link.id = id;
        }
        link.classList.add("button");
        link.classList.add("Better_SweClockers_IconButton");
        return link;
    } else throw new ContentCreationException("Cannot create an icon button without a value and an icon URL.");
}



//================================================================
// DOM extension
//================================================================

Object.typeOf = (function typeOf(global) {
  return function(obj) {
    if (obj === global) {
      return "global";
    }
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  };
})(this);

Node.prototype.empty = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

// Note: Inserts _this before referenceNode_, not the other way around:
Node.prototype.BSC_insertBefore = function(referenceNode) {
    referenceNode.parentNode.insertBefore(this, referenceNode);
};

// Note: Inserts _this after referenceNode_, not the other way around:
Node.prototype.BSC_insertAfter = function(referenceNode) {
    referenceNode.parentNode.insertBefore(this, referenceNode.nextSibling);
};

Node.prototype.prependChild = function(newNode) {
    this.insertBefore(newNode, this.firstChild);
};

Node.prototype.replaceWith = function(newNode) {
    this.parentNode.insertBefore(newNode, this.nextSibling);
    this.parentNode.removeChild(this);
};

String.prototype.BSC_trimLeft = function() {
    return this.replace(/^\s+/, "");
};

String.prototype.BSC_trimRight = function() {
    return this.replace(/\s+$/, "");
};

String.prototype.BSC_repeat = function(reps) {
    if (!isInt(reps) || reps < 0 || reps === Infinity) {
        throw new RangeError("String.prototype.BSC_repeat requires a non-negative integer as the argument.");
    }
    for (var i = 0, str = ""; i < reps; i++) {
        str += this;
    }
    return str;
};

HTMLSelectElement.prototype.BSC_getSelectedOption = function() {
    return this.options[this.selectedIndex];
};

HTMLTextAreaElement.prototype.BSC_insert = function(str, action) {
    // If action === "HIGHLIGHT", the inserted text will be highlighted.
    // If it is an integer, the cursor will be placed that many characters
    // from the beginning of the inserted text. Otherwise, the text is just
    // inserted.
    var start = this.selectionStart;
    var end = this.selectionEnd;
    var v = this.value;
    this.value = v.substring(0, start) + str + v.substring(end, v.length);
    if (action === HIGHLIGHT) {
        this.BSC_selectRange(start, start + str.length);
    } else if (isInt(action)) {
        this.BSC_selectRange(start + action, start + action);
    } else {
        this.BSC_selectRange(start + str.length, start + str.length);
    }
};

HTMLTextAreaElement.prototype.BSC_selectRange = function(start, end) {
    if (this.setSelectionRange) {
        this.focus();
        this.setSelectionRange(start, end);
    } else if (this.createTextRange) {
        var range = this.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
};

HTMLTextAreaElement.prototype.BSC_selectedText = function() {
    var start = this.selectionStart;
    var end   = this.selectionEnd;
    return this.value.substring(start, end);
};

HTMLTextAreaElement.prototype.BSC_getTextBeforeSelection = function() {
    return this.value.substring(0, this.selectionStart);
};

HTMLTextAreaElement.prototype.BSC_getTextAfterSelection = function() {
    return this.value.substring(this.selectionEnd);
};

HTMLTextAreaElement.prototype.BSC_wrapBB = function(startTag, endTag, cursorPos) {
    // If cursorPos is an integer, the cursor will be placed that
    // many characters from the beginning of the start tag;
    // otherwise, the wrapped text will stay highlighted.
    var start = this.selectionStart;
    var end   = this.selectionEnd;
    var val   = this.value;
    var replacement = startTag + this.BSC_selectedText() + endTag;
    this.value = val.substring(0, start) + replacement + val.substring(end);
    if (!isInt(cursorPos)) {
        this.BSC_selectRange(start + startTag.length, end + startTag.length);
    } else {
        this.BSC_selectRange(start + cursorPos, start + cursorPos);
    }
};

HTMLTextAreaElement.prototype.BSC_trimAtCursor = function() {
    var beforeSelection    = this.BSC_getTextBeforeSelection();
    var afterSelection     = this.BSC_getTextAfterSelection();
    var newBeforeSelection = beforeSelection.BSC_trimRight();
    this.value = newBeforeSelection + afterSelection.BSC_trimLeft();
    this.BSC_selectRange(newBeforeSelection.length, newBeforeSelection.length);
};

HTMLElement.prototype.BSC_greenify = function() {
    this.classList.add("Better_SweClockers_Green");
    this.classList.remove("Better_SweClockers_Red");
};

HTMLElement.prototype.BSC_redify = function() {
    this.classList.add("Better_SweClockers_Red");
    this.classList.remove("Better_SweClockers_Green");
};



//================================================================
// Better Sweclockers functions
//================================================================

function log(str) {
    if (BSC.pseudoConsole) {
        BSC.console.innerHTML += "<p>"+str+"</p>";
    }
    console.log("Better SweClockers: " + str);
}

function addException(e) {
    BSC.exceptions.push(e);
    logException(e);
}

function addWarning(str) {
    BSC.warnings.push(str);
    logWarning(str);
}

function logException(e) {
    logError(e.message);
    console.error(e);
}

function logWarning(str) {
    if (BSC.pseudoConsole) {
        BSC.console.innerHTML += "<p class=\"warning\">"+str+"</p>";
    }
    console.warn("Better SweClockers: " + str);
}

function logError(str) {
    if (BSC.pseudoConsole) {
        BSC.console.innerHTML += "<p class=\"error\">"+str+"</p>";
    }
    console.error("Better SweClockers: " + str);
}

function logWarnings() {
    var ws = BSC.warnings;
    if (ws.length > 0) {
        log("***********************************************");
        log("******** Better SweClockers Warnings **********");
        log("***********************************************");
        for (var i = 0, l = ws.length; i < l; i++) {
            logWarning(ws[i]);
        }
    }
}

function logExceptions() {
    var es = BSC.exceptions;
    if (es.length > 0) {
        log("***********************************************");
        log("******** Better SweClockers Exceptions ********");
        log("***********************************************");
        es.forEach(logException);
    }
}

function isLoggedIn() {
    return byID("signoutForm");
}

function isInThread() {
    // Will return false if editing a post (i.e. the pathname ends with "/redigera")
    return matches(document.location.pathname, /^\/forum\/(trad|post)/i) &&
           !isInAdvancedEditMode();
}

function isOnHTTPS() {
    return window.location.protocol === "https:";
}

function isOnFirstPageOfBSCThread() {
    return !!byID("p14497816"); // OP in BSC thread
}

function settingsFormRequested() {
    return matches(document.location.pathname, /^\/better-sweclockers$/i);
}

function isInAdvancedEditModeForum() {
    return matches(document.location.pathname, /^\/forum\/.*\/(svara(\?citera)?|redigera|ny\-trad)/i);
}

function isInAdvancedEditModeMarket() {
    return matches(document.location.pathname, /^\/marknad\/.+\/redigera\/?$/i);
}

function isInAdvancedEditModePM() {
    return matches(document.location.pathname, /^\/pm\/.+\/svara/i) ||
           matches(document.location.pathname, /^\/pm\/nytt-meddelande/i);
}

function isInAdvancedEditMode() {
    return isInAdvancedEditModeForum() ||
           isInAdvancedEditModeMarket() || 
           isInAdvancedEditModePM();
}

function isOnSettingsPage() {
    return matches(document.location.pathname, /^\/profil\/installningar/i);
}

function isOnBSCSettingsPage() {
    return matches(document.location.pathname, /^\/better\-sweclockers/i);
}

function isInNewPMMode() {
    return matches(document.location.pathname+document.location.search, /^\/pm\/nytt\-meddelande\?rcpts/i);
}

function shouldAutofocusTA() {
    var TA = BSC.TA, h1 = qSel("h1");
    if (isInAdvancedEditMode()) {
        if (!!TA && !!h1) {
            return h1.textContent.trim() === "Ny tråd" && TA.value !== "";
        } else {
            addException(new ElementNotFoundException("Failed to determine whether the main textarea should be autofocused because it or the page heading could not be found."));
        }
    }
    return false;
}

function extractOptionName(id) {
    if (isString(id)) {
        return id.replace("Better_SweClockers_Settings.", "");
    } else throw new TypeException("extractOptionName() failed because it was called with a non-string argument (" + id + ").");
}

function ACPCanBeInserted() {
    if (!isInAdvancedEditMode()) {
        log("Will not insert ACP because not in advanced edit mode.");
        return false;
    } else if (!!byID("Better_SweClockers_ACP")) {
        log("Will not insert ACP because it already exists.");
        return false;
    } else {
        return true;
    }
}

function LSPrefix(str) {
    return "Better_SweClockers." + str;
}

function LSSet(name, value) {
    localStorage.setItem(LSPrefix(name), value);
}

function LSGet(name) {
    return localStorage.getItem(LSPrefix(name));
}

function optionIsTrue(name) {
    return BSC.settings[name] === true;
}

function saveSettings() {
    log("Saving settings...");
    var JSONString = JSON.stringify(BSC.settings);
    LSSet("savedSettings", JSONString);
    log("Settings were saved.");
}

function loadSettings() {
    var defaultSettings = BSC.defaultSettings;
    var savedSettings   = JSON.parse(LSGet("savedSettings"));
    var loadedSettings  = {};
    if (!savedSettings) {
        addWarning("There were no saved settings. Loading default settings...");
        loadedSettings = defaultSettings;
        log("Loaded default settings.");
    } else {
        log("Loading saved settings...");
        Object.keys(defaultSettings).forEach(function(option) {
            if (savedSettings.hasOwnProperty(option)) {
                    loadedSettings[option] = savedSettings[option];
                    log("Loaded setting \"" + option + "\" with value " + savedSettings[option] + ".");
                } else {
                    loadedSettings[option] = defaultSettings[option];
                    addWarning("There was no saved value for setting \"" + option + "\". Loaded default value " + defaultSettings[option] + ".");
                }
        });
        log("Done loading settings.");
    }
    BSC.settings = loadedSettings;
    if (!loadedSettings.favoriteLinks) {
        loadFavoriteLinks(parseFavoriteLinks(loadedSettings.favoriteLinksRaw));
    }
    // Check if saved settings are too old:
    if (!isOnSettingsPage() && (!loadedSettings.version || isOlderVersion(loadedSettings.version, BSC.oldestRecommendedSettings))) {
        var msg = "Om du upplever problem med Better SweClockers, prova att återställa inställningarna.";
        addWarning("Running version "+BSC.version+", for which it is not recommended to use settings saved with a version older than "+BSC.oldestRecommendedSettings+". Displaying warning...");
        if (confirm("Hittade sparade inställningar från " + (!!loadedSettings.version ? "version "+loadedSettings.version : "en gammal version") + " av Better SweClockers. Det kan eventuellt ge upphov till konflikter med Better SweClockers "+BSC.version+". Det rekommenderas därför att du rensar alla inställningar. Vill du göra det? (Det går att göra senare om du inte gör det nu.)")) {
            if (confirm("ALLA inställningar kommer försvinna. Är du säker?")) {
                resetSettings();
                loadFavoriteLinks(parseFavoriteLinks(BSC.settings.favoriteLinksRaw));
            } else alert(msg);
        } else alert(msg);
    }
}

function resetSettings() {
    BSC.settings = BSC.defaultSettings;
    saveSettings();
    log("Settings were reset.");
}

function saveState() {
    var JSONString = JSON.stringify(BSC.state);
    LSSet("savedState", JSONString);
}

function loadState() {
    log("Loading saved state...");
    var savedState = JSON.parse(LSGet("savedState"));
    Object.keys(savedState).forEach(function(st) {
        BSC.setState(st, savedState[st]);
        log("Loaded state "+st+" with value "+savedState[st]+".");
    });
}

function bsSelectOptionsUsefulLinks(arr) {
    var html = "", i, j, arri, arrij, leni, lenj;
    for (i = 0, leni = arr.length; i < leni; i++) {
        arri = arr[i];
        html += '<optgroup label="' + arri[0] + '">';
        for (j = 1, lenj = arri.length; j < lenj; j++) {
            arrij = arri[j];
            html += '<option data-url="' + arrij[1] + '">' + arrij[0] + '</option>';
        }
        html += "</optgroup>";
    }
    return html;
}

function bbLink(url, text, bold) {
    // If bold is true, the text is wrapped in [b] tags.
    var str = text;
    if (bold) {
        str = "[b]"+str+"[/b]";
    }
    return '[url="'+url+'"]'+str+'[/url]';
}

function betterSwecInvertCase() {
    var TA = BSC.TA;
    TA.BSC_insert(invertCase(TA.BSC_selectedText()), HIGHLIGHT);
}

function embedImages() {
    var TA = BSC.TA;
    var selected = TA.BSC_selectedText();
    if (selected === "") {
        TA.BSC_insert("[img][/img]", 5);
    } else {
        var lines = selected.split("\n");
        var line, parsedLines = [];
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line !== "") {
                parsedLines.push("[img]"+line+"[/img]");
            } else {
                parsedLines.push("");
            }
        }
        TA.BSC_insert(parsedLines.join("\n"));
    }
}

function embedClickableImages() {
    var TA = BSC.TA;
    var selected = TA.BSC_selectedText();
    if (selected === "") {
        TA.BSC_insert("[url=\"\"][img][/img][/url]", 6);
    } else {
        var lines = selected.split("\n");
        var line, parsedLines = [];
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line !== "") {
                parsedLines.push("[url=\""+line+"\"][img]"+line+"[/img][/url]");
            } else {
                parsedLines.push("");
            }
        }
        TA.BSC_insert(parsedLines.join("\n"));
    }
}

function betterSwecInsertUsefulLink() {
    var TA = BSC.TA;
    var selectBox = byID("Better_SweClockers_UsefulLinksSelect");
    var bold = byID("Better_SweClockers_UsefulLinksBold").checked;
    var selectedOption = selectBox.BSC_getSelectedOption();
    if (TA.BSC_selectedText() === "") {
        TA.BSC_insert(bbLink(selectedOption.dataset.url, selectedOption.text, bold));
    } else {
        TA.BSC_wrapBB("[url=\"" + selectedOption.dataset.url + "\"]", "[/url]");
        if (bold) {
            TA.BSC_wrapBB("[b]", "[/b]");
        }
    }
}

function betterSwecGoogle() {
    var TA = BSC.TA;
    var selected = TA.BSC_selectedText();
    if (selected === "") {
        TA.BSC_wrapBB("[url=\"http://google.com/search?q=\"]", "[/url]", 33);
    } else {
        TA.BSC_wrapBB("[url=\"http://google.com/search?q=" + selected.trim().replace(/ +/g, "+") + "\"]", "[/url]");
    }
}

function betterSwecDuckDuckGo() {
    var TA = BSC.TA;
    var selected = TA.BSC_selectedText();
    if (selected === "") {
        TA.BSC_wrapBB("[url=\"https://duckduckgo.com/?q=\"]", "[/url]", 33);
    } else {
        TA.BSC_wrapBB("https://duckduckgo.com/?q=" + selected.trim().replace(/ +/g, "+") + "\"]", "[/url]");
    }
}

function betterSwecInsertEdit() {
    BSC.TA.BSC_insert("[b]EDIT:[/b] ");
}

function splitQuote() {
    var TA = BSC.TA;
    TA.BSC_trimAtCursor();
    var beforeSelection = TA.BSC_getTextBeforeSelection();
    var afterSelection  = TA.BSC_getTextAfterSelection();
    if (/\[\/quote\]$/i.test(beforeSelection) && /^\[quote(=(".+"|.+))?\]/i.test(afterSelection)) {
        // Cursor is between two already existing quotes, so just insert empty lines and place the cursor accordingly:
        TA.BSC_insert("\n\n\n\n", 1);
    } else {
        // Cursor is not between two existing quotes, so add quote tags as well:
        TA.BSC_insert("\n[/quote]\n\n\n\n[quote]\n", 10);
    }
}

function updateUsefulLinksGoTo() {
    var selectBox = byID("Better_SweClockers_UsefulLinksSelect");
    var button    = byID("Better_SweClockers_UsefulLinksGoTo");
    if (!!selectBox && !!button) {
        button.href = selectBox.BSC_getSelectedOption().dataset.url;
    } else addException(new ElementNotFoundException("Could not update Useful Links Go To button because it or the Useful Links select box could not be found."));
}

function betterSwecColorButtons() {
    var html = "", colors = BSC.settings.colors;
    if (!colors) {
        addWarning("Could not load saved colors because there were none." + (isOlderVersion(BSC.settings.version, BSC.version) ? " This is probably because the saved settings are too old." : "") + " Loaded default colors instead.");
        colors = BSC.defaultSettings.colors;
    }
    for (var i = 0; i < colors.length; i++) {
        html += '<div title="' + colors[i] + '" style="background-color: ' + colors[i] + ';" class="Better_SweClockers_ColorButton"></div>';
    }
    return html;
}

function setInitialTextareaHeight() {
    var h = parseInt(BSC.getState("largerTextareaActive") ? BSC.settings.largerTextareaHeight : BSC.settings.textareaHeight);
    if (isInt(h)) {
        BSC.addCSS(".s5fieldset .tctaFrame textarea { height: "+h+"px; }");
    } else addException(new TypeException("Could not set initial textarea height to "+h+" because it is not an integer."));
}

function setLargerTextarea(larger) {
    log("Setting textarea size to " + (larger ? BSC.settings.largerTextareaHeight : BSC.settings.textareaHeight) + "px...");
    var TA     = BSC.TA;
    var button = byID("Better_SweClockers_Button_LargerTextarea");
    if (!!TA && !!button) {
        if (larger) {
            TA.style.height = BSC.settings.largerTextareaHeight+"px";
            button.value = BSC.content.smallerTextarea;
        } else {
            TA.style.height = BSC.settings.textareaHeight+"px";
            button.value = BSC.content.largerTextarea;
        }
    }
    BSC.setState("largerTextareaActive", larger);
}

function toggleLargerTextarea() {
    setLargerTextarea(!BSC.getState("largerTextareaActive"));
}

function createBelowTAButton(value, id, eventHandler) {
    var b = createSwecButton(value);
    if (isString(id)) {
        b.id = id;
    }
    if (!!eventHandler) {
        b.addEventListener("click", eventHandler);
    }
    return b;
}

function getMyName() {
    log("Looking for username...");
    if (isLoggedIn()) {
        var usernameElement = qSel(".profile .name a");
        if (!!usernameElement && !!usernameElement.textContent && matches(usernameElement.textContent.trim(), /^Inloggad som .+/i)) {
            var username = usernameElement.textContent.trim().replace(/^Inloggad som /i, "");
            log("Found username: "+username);
            return username;
        } else {
            addException(new ElementNotFoundException("Could not extract username because its presumed parent (.profile .name a) could not be found or did not contain expected content."));
            return null;
        }
    } else if (isOnBSCSettingsPage()) {
        log("No need to extract username because currently on BSC settings page.");
    } else {
        addWarning("Could not extract username because not logged in.");
    }
    return null;
}

function getTAForm() {
    return byID("createForm") || byID("replyForm") || byID("editForm");
}

function getTAFieldset() {
    var TAForm = getTAForm();
    if (!!TAForm) {
        var x = getTA();
        while (!!x) {
            if (x.tagName.toLowerCase() === "fieldset" && x.classList.contains("s5fieldset")) {
                // x is the wanted .s5fieldset, return it:
                return x;
            }
            x = x.parentElement;
        }
        addException(new ElementNotFoundException("Could not find post reply form fieldset (.s5fieldset)."));
    } else addException(new ElementNotFoundException("Could not find post reply form fieldset (.s5fieldset) because its presumed ancestor (#createForm, #replyForm, or #editForm) could not be found."));
}

function getTA() {
    return isInAdvancedEditMode() && document.getElementById("__laika_cnt.textarea.0");
}

function insertButtonsBelowTA() {
    var TAForm = getTAForm();
    if (!!TAForm) {
        var belowTAButtonsContainer = TAForm.querySelector(".s5fieldset:last-child");
        if (!!belowTAButtonsContainer) {
            var lastDefaultButton = belowTAButtonsContainer.querySelector("button:last-of-type");
            if (!!lastDefaultButton) { 
                var container = document.createElement("span");
                container.id = "Better_SweClockers_ButtonsBelowTA";
                var largerTextareaButton = createBelowTAButton(BSC.getState("largerTextareaActive") ? BSC.content.smallerTextarea : BSC.content.largerTextarea,   "Better_SweClockers_Button_LargerTextarea",     toggleLargerTextarea);
                container.appendChild(largerTextareaButton);
                container.BSC_insertAfter(lastDefaultButton);
                log("Inserted buttons below textarea.");
            } else addException(new ElementNotFoundException("Could not insert buttons below textarea because their intended previous sibling (.s5fieldset:last-child button:last-of-type) could not be found."));
        } else addException(new ElementNotFoundException("Could not insert buttons below textarea because their intended parent (.s5fieldset:last-child) could not be found."));
    } else addException(new ElementNotFoundException("Could not insert buttons below textarea because the textarea form could not be found."));
}

function addAEMUnloadConfirmation() {
    // May not understand all ways of intentionally unloading AEM;
    // only considers clicking "Skicka meddelande" or "Förhandsgranska" as such.
    var setIntentionalUnload = function() {
        BSC.intentionalUnload = true;
    };
    var TA = BSC.TA, TAForm = getTAForm();
    if (!!TA && !!TAForm) {
        var submitButton = TAForm.querySelector("button[name=action][value=doSubmit]");
        var previewButton = TAForm.querySelector("button[name=action][value=doPreview]");
        if (!!submitButton && !!previewButton) {
            var initialTAContent = TA.value;
            submitButton.addEventListener("click", setIntentionalUnload);
            previewButton.addEventListener("click", setIntentionalUnload);
            window.addEventListener("beforeunload", function(event) {
                if (!BSC.intentionalUnload && TA.value !== initialTAContent) {
                    var msg = "Om du lämnar den här sidan riskerar du att förlora ditt påbörjade inlägg.";
                    (event || window.event).returnValue = msg;
                    return msg;
                }
            });
        } else addException(new ElementNotFoundException("Could not add unload confirmation because the submit and/or preview button could not be found."));
    } else addException(new ElementNotFoundException("Could not add unload confirmation because the main textarea was not found."));
}

function favoriteLinksElement() {
    // Must slice here to clone the array, so we don't modify it:
    var favLinks = BSC.settings.favoriteLinks.slice();
    favLinks.unshift(["Favoritlänkar", "#"]);
    var element = document.createElement("select");
    var elementHTML = "";
    var catOpen = false;
    var current, name, url, startMatch, endMatch, newTabMatch;
    for (var i = 0, length = favLinks.length; i < length; i++) {
        current = favLinks[i];
        name = current[0];
        url = current[1];
        if (isString(name) && !isString(url)) {
            // Category
            startMatch = name.match(/^###\s*.*/);
            endMatch = name.match(/^\/###/);
            if (!!startMatch) {
                // Category start tag
                elementHTML += catOpen ? "</optgroup>" : "";
                elementHTML += '<optgroup label="' + name.replace(/^###\s*/, "") + '">';
                catOpen = true;
            } else if (!!endMatch && catOpen === true) {
                // Category end tag
                elementHTML += "</optgroup>";
                catOpen = false;
            }
        } else {
            // Link
            newTabMatch = isString(name) ? name.match(/^!{3}\s*/) : undefined; // Name starts with !!! => open in new tab/window
            if (!!newTabMatch) {
                elementHTML += '<option data-url="' + url + '" data-target="new">' + name.replace(/^!{3}\s*/, "") + '*</option>';
            } else {
                elementHTML += '<option data-url="' + url + '">' + (name || url) + '</option>';
            }
        }
    }
    elementHTML += catOpen ? "</optgroup>" : "";
    elementHTML += '<option data-url="' + BSC.settingsURLFavoriteLinks + '">Redigera favoritlänkar</option>';
    element.innerHTML = elementHTML;
    element.id = "Better_SweClockers_FavoriteLinks";
    element.addEventListener("change", goToSelectedFavoriteLink);
    return element;
}

function goToSelectedFavoriteLink() {
    var element = byID("Better_SweClockers_FavoriteLinks");
    if (element instanceof HTMLSelectElement) {
        var selectedOption = element.BSC_getSelectedOption();
        var url = selectedOption.dataset.url;
        if (!!url) {
            if (selectedOption.dataset.target === "new") {
                open(url, "_blank");
            } else {
                document.location.href = url;
            }
        }
    }
}

function makeRoomForFavoriteLinks() {
    BSC.addCSS("\
        .fixed > .inner { position: relative; }\
        #wdgtSideRecentThreads { margin-top: "+BSC.favoriteLinksHeight+"px; }\
    ");
}

function canInsertFavoriteLinks() {
    return byID("wdgtSideRecentThreads") instanceof HTMLDivElement;
}

function insertFavoriteLinks() {
    log("Inserting Favorite Links dropdown box...");
    if (isLoggedIn() && !byID("Better_SweClockers_FavoriteLinks")) {
        var wdgtSideRecentThreads = byID("wdgtSideRecentThreads");
        if (wdgtSideRecentThreads instanceof HTMLDivElement) {
            try {
                var FLElement = favoriteLinksElement();
                FLElement.BSC_insertBefore(wdgtSideRecentThreads);
                log("Inserted Favorite Links dropdown box.");
            } catch (e) {
                addException(new ContentCreationException("Could not insert Favorite Links dropdown box because something went wrong when creating it: " + e.message));
            }
        } else addException(new ElementNotFoundException("Could not insert Favorite Links dropdown box because its intended nextSibling (#wdgtSideRecentThreads) could not be found."));
    }
}

function parseFavoriteLinks(str) {
    if (isString(str)) {
        var parsedLines = [];
        var lines = str.split("\n");
        var line, name, url;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line !== "") {
                line = line.trim();
                name = null;
                url = null;
                var categoryStartMatch = line.match(/^###\s*.*/);
                var categoryEndMatch = line.match(/^\/###\s*.*/);
                var linkMatch = line.match(/^(\S+.*\S+\s*===){0,1}\s*.+$/);
                if (!!categoryStartMatch) {
                    name = categoryStartMatch[0];
                } else if (!!categoryEndMatch) {
                    name = categoryEndMatch[0];
                } else if (!!linkMatch) {
                    // Line is not a category start or end tag
                    url = line;
                    var nameMatch = line.match(/^\s*\S+.*\S+\s*===/);
                    if (!!nameMatch) {
                        // Line contains name
                        name = nameMatch[0].replace("===", "").trim();
                        url = line.replace(nameMatch[0], "").trim();
                    }
                }
                parsedLines.push([name, url]);
            }
        }
        return parsedLines;
    } else {
        addException(new GeneralException("Could not parse favorite links because the argument to parseFavoriteLinks, " + str + ", is not a string."));
        return null;
    }
}

function loadFavoriteLinks(favs) {
    // Every item in arr should be ["Name", "URL"] (name and URL); [null, "URL"] (only URL); ["### Category", null] (category start); or ["/###", null] (category end).
    if (!!favs) {
        var fav, favName, favURL, validFavs = [];
        for (var i = 0; i < favs.length; i++) {
            fav = favs[i];
            favName = fav[0];
            favURL  = fav[1];
            if (isString(favURL)) {
                // Link
                if (!favName) {
                    favName = favURL;
                }
                validFavs.push(fav);
            } else if (isString(favName)) {
                // Category
                validFavs.push(fav);
            }
        }
        BSC.settings.favoriteLinks = validFavs;
        saveSettings();
    } else addException(new ContentCreationException("Failed to load favorite links because loadFavoriteLinks() was called with an invalid argument."));
}

function canEnableSearchWithGoogle() {
    return qSel("#search .searchField") instanceof HTMLDivElement &&
           !qSel("#Better_SweClockers_SearchWithGoogle");
}

function canEnableSearchWithDuckDuckGo() {
    return qSel("#search .searchField") instanceof HTMLDivElement &&
           !qSel("#Better_SweClockers_SearchWithDuckDuckGo");
}


function getSearchPhrase() {
    var searchField = qSel("#search .inner input");
    return !!searchField ? searchField.value : "";
}

function searchWithGoogle(phrase) {
    if (isNonEmptyString(phrase)) {
        var searchPhrase = ("site:sweclockers.com " + phrase.trim()).replace(/\s+/g, "+");
        log("Googling \"" + searchPhrase + "\"...");
        document.location.href = "//google.com/search?q=" + searchPhrase;
    } else logWarning("searchWithGoogle() requires a non-empty string as its argument.");
}

function searchWithDuckDuckGo(phrase) {
    if (isNonEmptyString(phrase)) {
        var searchPhrase = ("site:sweclockers.com " + phrase.trim()).replace(/\s+/g, "+");
        log("Quacking \"" + searchPhrase + "\"...");
        document.location.href = "//duckduckgo.com/?q=" + searchPhrase;
    } else logWarning("searchWithDuckDuckGo() requires a non-empty string as its argument.");
}

function enableSearchWithGoogle() {
    var searchField = qSel("#search .searchField");
    log("Inserting Google search button...");
    if (!!searchField) {
        BSC.addCSS("#search .fieldWrap { width: 148px; display: inline-block; } ");
        var googleButton = createSwecButton("G");
        googleButton.id = "Better_SweClockers_SearchWithGoogle";
        googleButton.title = "Sök med Google";
        googleButton.addEventListener("click", function() { searchWithGoogle(getSearchPhrase()); });
        searchField.appendChild(googleButton);
        log("Inserted Google search button.");
    } else addException(new ElementNotFoundException("Could not insert Google search button because its intended parent (#search .searchField) could not be found."));
}

function enableSearchWithDuckDuckGo() {
    var searchField = qSel("#search .searchField");
    log("Inserting DuckDuckGo search button...");
    if (!!searchField) {
        BSC.addCSS("#search .fieldWrap { width: 148px; display: inline-block; } ");
        var duckDuckGoButton = createSwecButton("D");
        duckDuckGoButton.id = "Better_SweClockers_SearchWithDuckDuckGo";
        duckDuckGoButton.title = "Sök med DuckDuckGo";
        duckDuckGoButton.addEventListener("click", function() { searchWithDuckDuckGo(getSearchPhrase()); });
        searchField.appendChild(duckDuckGoButton);
        log("Inserted DuckDuckGo search button.");
    } else addException(new ElementNotFoundException("Could not insert DuckDuckGo search button because its intended parent (#search .searchField) could not be found."));
}

function showColorPalette(show) {
    var innerWrapper = byID("Better_SweClockers_ColorPaletteInner");
    var button = byID("Better_SweClockers_Button_ColorPalette");
    if (innerWrapper instanceof HTMLDivElement && button instanceof HTMLInputElement) {
        innerWrapper.style.display = show ? "inline-block" : "none" ;
        button.value = (show ? "–" : "+") + " Färgpaletten";
        log(show ? "Expanded color palette." : "Collapsed color palette.");
        BSC.setState("showColorPalette", show);
    }
}

function toggleShowColorPalette() {
    var innerWrapper = byID("Better_SweClockers_ColorPaletteInner");
    if (innerWrapper !== null) {
        showColorPalette(innerWrapper.style.display === "none");
    }
}

function addToColorPalette(color) {
    // For future use
    if (isNonEmptyString(color)) {
        BSC.settings.colors.push(color);
        saveSettings();
        log("Added "+color+" to saved colors.");
    } else addException(new GeneralException("Could not add "+color+" to saved colors because it is not a string."));
}

function dogeInQuoteFix() {
    log("Fixing Doges in quotes...");
    var quotes = document.getElementsByClassName("quoteContent");
    var quote, links, link;
    var dogeSmiley = document.createElement("img");
    var dogeSmileyURL = BSC.smileyURLs.doge;
    dogeSmiley.src = dogeSmileyURL;
    for (var i = 0, len = quotes.length; i < len; i++) {
        quote = quotes[i];
        links = quote.getElementsByTagName("a");
        for (var a = 0, aLen = links.length; a < aLen; a++) {
            link = links[a];
            if (link.href === dogeSmileyURL) {
                // We have found a doge! Let's rescue him!
                dogeSmiley.cloneNode().BSC_insertAfter(link);
                link.style.display = "none";
                log("Doge found and rescued.");
            }
        }
    }
}

function canInsertDarkThemeByBlargmodeButton() {
    return qSel("#mainMenu .menu") instanceof HTMLUListElement;
}

function insertDarkThemeByBlargmodeButton() {
    // As usual, we only want to insert the button if it is not already there. Without this check, some browsers, including Mobile Safari, will keep spawning new buttons every time the user navigates back/forward.
    if (!byID("Better_SweClockers_DarkThemeButton")) {
        log("Inserting Dark Theme button...");
        var menu = qSel("#mainMenu .menu");
        if (!!menu) {
            var darkThemeButtonLi = document.createElement("li");
            darkThemeButtonLi.classList.add("menuItem");
            darkThemeButtonLi.id = "Better_SweClockers_DarkThemeButtonTab";
            darkThemeButtonLi.innerHTML = '<a href="#" target="_self" id="Better_SweClockers_DarkThemeButton" title="Ett mörkt tema för SweClockers av Blargmode">'+(optionIsTrue("darkThemeActive") ? BSC.content.deactivateDarkTheme : BSC.content.activateDarkTheme)+'</a>';
            menu.style.width = "900px"; // Otherwise the Dark Theme button won't fit on some pages.
            menu.appendChild(darkThemeButtonLi);
            byID("Better_SweClockers_DarkThemeButton").addEventListener("click", function(event) {
                event.preventDefault();
                toggleDarkTheme();
            });
            log("Inserted Dark Theme button.");
        } else {
            addException(new ElementNotFoundException("Could not insert Dark Theme button because its intended parent (.menu) was not found."));
        }
    }
}

function setDarkTheme(on) {
    BSC.settings.darkThemeActive = on;
    var styleInnerHTML = BSC.settings.darkThemeCache ? BSC.darkThemeCached : "@import url('"+BSC.darkThemeURL+"');";
    BSC.darkThemeStyleElement.id = "Better_SweClockers_DarkThemeByBlargmode";
    BSC.darkThemeStyleElement.innerHTML = on ? styleInnerHTML : "";
    var darkThemeButton = byID("Better_SweClockers_DarkThemeButton");
    if (!!darkThemeButton) {
        darkThemeButton.innerHTML = on ? BSC.content.deactivateDarkTheme : BSC.content.activateDarkTheme;
    }
}

function toggleDarkTheme() {
    setDarkTheme(!optionIsTrue("darkThemeActive"));
    saveSettings();
}

function autosetDarkTheme(on) {
    setDarkTheme(on);
    BSC.settings.darkThemeAllowAutoActivation   = !on;
    BSC.settings.darkThemeAllowAutoDeactivation = !!on;
    saveSettings();
}



//================================================================
// Functions to call upon page load (DOM manipulation etc)
//================================================================

function openImagesInNewTab() {
    function makeOpenable(bbImageDiv) {
        if (bbImageDiv instanceof HTMLDivElement) {
            var img = bbImageDiv.querySelector("a.clickArea img");
            var link = document.createElement("a");
            bbImageDiv.empty();
            img.title = BSC.content.openInNewTab;
            link.target = "_blank";
            link.href = img.src;
            link.appendChild(img);
            bbImageDiv.appendChild(link);
        }
    }
    var bbImageDivs = document.querySelectorAll(".bbImage.isZoomable");
    bbImageDivs.forEach(makeOpenable);
}

function handleDarkTheme() {
    var settings      = BSC.settings;
    var timeOnString  = settings.darkThemeByBlargmodeTimeOn;
    var timeOffString = settings.darkThemeByBlargmodeTimeOff;
    setDarkTheme(optionIsTrue("darkThemeActive"));
    if (isHHMMTime(timeOnString) && isHHMMTime(timeOffString)) {
        var currentTime      = new Date();
        var activationTime   = new Date();
        var deactivationTime = new Date();
        // Extract time data from saved settings:
        activationTime.setHours(parseHours(timeOnString));
        activationTime.setMinutes(parseMinutes(timeOnString));
        activationTime.setSeconds(0);
        deactivationTime.setHours(parseHours(timeOffString));
        deactivationTime.setMinutes(parseMinutes(timeOffString));
        deactivationTime.setSeconds(0);
        var isInAutoActivationPeriod = timeIsBetween(currentTime, activationTime, deactivationTime);
        if (isInAutoActivationPeriod && optionIsTrue("darkThemeAllowAutoActivation")) {
            autosetDarkTheme(true);
            log("Auto-activated Dark Theme at "+currentTime+".");
        } else if (!isInAutoActivationPeriod && optionIsTrue("darkThemeAllowAutoDeactivation")) {
            autosetDarkTheme(false);
            log("Auto-deactivated Dark Theme at "+currentTime+".");
        } else {
            setDarkTheme(optionIsTrue("darkThemeActive"));
        }
    }
}

function handleDarkThemeTimer() {
    setInterval(handleDarkTheme, BSC.darkThemeRefreshInterval);
}

function checkForBetterSweClockersAnchor() {
    var anchor = getURLAnchor();
    if (!!anchor && /^Better_SweClockers/.test(anchor)) {
        scrollToElementWithID(anchor);
    }
}

function canCheckForUpdate() {
    var BSCThreadOP = byID("post14497816"); // BSC thread OP element
    return !!BSCThreadOP && !!BSCThreadOP.nextSibling;
    // We do the .nextSibling check to ensure that the _entire_ OP element is loaded;
    // otherwise, some browsers (including Chrome 42) will not find the elements
    // inside it and will fail to run the update check. 
}

function createUpdateCheckElement(currentVersion, isOld) {
    var elem = document.createElement("span");
    elem.className = "Better_SweClockers_UpdateNotice " + (isOld ? "BSC_Old Better_SweClockers_Red" : "BSC_New Better_SweClockers_Green");
    elem.innerHTML = "Du kör <strong>v" + currentVersion + "</strong>" + (isOld ? " – uppdatering rekommenderas!" : ".");
    return elem;
}

function checkForUpdate() {
    log("Checking for update...");
    var BSCThreadOP = byID("post14497816");
    var currentVersion = BSC.version;
    var bbSizeElements, bbSizeElem, newestVersion, updateCheckElement, vNumber;
    var i = 0;
    if (!!BSCThreadOP) {
        try {
            bbSizeElements = BSCThreadOP.getElementsByClassName("bbSize");
            while (i < bbSizeElements.length) {
                bbSizeElem = bbSizeElements[i];
                vNumber = bbSizeElem.textContent.trim().replace("v", "");
                if (isVersionNumber(vNumber)) {
                    // We have found the element containing the version number of the latest release.
                    newestVersion = vNumber;
                }
                if (bbSizeElem.innerHTML === "&nbsp;") {
                    // We have found the element in which to insert the update check result.
                    updateCheckElement = bbSizeElem;
                    break;
                }
                i++;
            }

            if (!!updateCheckElement) {
                var newUpdateCheckElement = createUpdateCheckElement(currentVersion, isOlderVersion(currentVersion, newestVersion));
                updateCheckElement.replaceWith(newUpdateCheckElement);
            } else {
                addException(new ElementNotFoundException("Failed to check for update because the update check element could not be found."));
            }
        } catch (e) {
            addException(new GeneralException("Failed to check for update. " + e));
        }
    } else addException(new ElementNotFoundException("Failed to check for update because could not find OP of BSC thread (#p14497816)."));
}

function TAFocusDetection() {
    var TA = BSC.TA;
    if (TA instanceof HTMLTextAreaElement) {
        TA.addEventListener("focus", function() { BSC.TAIsFocused = true; });
        TA.addEventListener("blur", function() { BSC.TAIsFocused = false; });
    }
}

function stringButtonClicked(button) {
    var overrideString = button.dataset.override;
    BSC.TA.BSC_insert(overrideString || button.value);
}

function addStringButtonEventListeners() {
    var stringButtons = document.getElementsByClassName("Better_SweClockers_StringButton");
    for (var i = 0; i < stringButtons.length; i++) {
        stringButtons[i].addEventListener("click", function(event) { stringButtonClicked(this); event.stopPropagation(); }, true);
    }
}

function canPreventAccidentalSignout() {
    return !!byID("signoutForm") && !!Taiga && !!Common;
}

function preventAccidentalSignout() {
    log("Adding confirmation dialog to signout link...");
    var signoutForm = byID("signoutForm");
    if (!!signoutForm) {
        var signoutFormParent = signoutForm.parentNode;
        var safeSignoutForm = signoutForm.cloneNode(true);
        signoutForm.remove();
        if (!!Taiga && !!Common) {
            safeSignoutForm.addEventListener("click", function() {
                if (confirm("Är du säker på att du vill logga ut?")) {
                    var req = new Taiga.Xhr.JsonRpc.Request();
                    req.setUrl("/konto/rpc");
                    req.setMethod("signout");
                    req.setParams({
                        csrf: session.getCsrfToken()
                    });
                    req.onError(function() {
                        var f = new Common.Windows.MessageDialog();
                        f.addClass("errorDialog");
                        f.setMessage("Ett fel har uppstått och utloggningen misslyckades. Var god ladda om sidan och försök igen. Rensa cookies i din webbläsare för att logga ut manuellt.");
                        f.setModal(true);
                        f.openWindow();
                        f.centerOnScreen();
                    });
                    req.onSuccess(function() {
                        window.location.reload();
                    });
                    req.send();
                }
            });
        } else addException(new GeneralException("Failed to add confirmation dialog to signout link because the expected Taiga and/or Common API (defined by SweClockers) could not be found."));
        signoutFormParent.appendChild(safeSignoutForm);
    } else if (!byID("btnSignin")) addException(new ElementNotFoundException("Could not add confirmation dialog to signout link because it could not be found."));
}

function betterSwecShibeText() {
    var TA = BSC.TA;
    var selection = TA.BSC_selectedText();
    var lines = selection.split("\n");
    var line, parsedLines = [], stringToInsert, newIndentation;
    if (lines.length > 1) {
        // Selection spans multiple lines
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            newIndentation = randomIntUpTo(100-line.length);
            if (newIndentation < 0) {
                newIndentation = 0;
            }
            parsedLines.push(wrap((" ".BSC_repeat(newIndentation) + line), '[font="Comic Sans MS, Chalkboard SE, sans-serif"][color="red"][i]', '[/i][/color][/font]'));
        }
        stringToInsert = parsedLines.join("\n");
        TA.BSC_insert(stringToInsert);
    } else {
        TA.BSC_wrapBB('[font="Comic Sans MS, Chalkboard SE, sans-serif"][color="red"][i]        ', '[/i][/color][/font]');
    }
}

function canInsertAdvancedControlPanel() {
    return !!qSel(ACPInsertionPointSelector(BSC.settings.ACP_InsertionPoint));
}

function ACPInsertionPointSelector(insertionPoint) {
    switch (insertionPoint) {
        case ABOVE_STANDARD_CONTROL_PANEL:
            return ".toolbar";
        case ABOVE_TA:
            return ".tctaFrame";
        default: // Below textarea
            return ".tanukiTextarea .tcHint";
    }
}

// Creates HTML for a string button. If override is a string it will be the string
// that is inserted upon clicking the button; otherwise, value will be inserted.
function ACPButton(value, title, override) {
    if (isNonEmptyString(value)) {
        return '<input value="' + value + '"' + (isNonEmptyString(override) ? ' data-override="' + override + '"' : '') + ' title="' + (isString(title) ? title : value) + '" class="button Better_SweClockers_StringButton" type="button" />';
    } else throw new ContentCreationException("Could not create Advanced Control Panel button because the first argument (" + value + ") passed to ACPButton was not a non-empty string.");
}

function insertAdvancedControlPanel() {
    log("Inserting Advanced Control Panel...");
    // HTML for #Better_SweClockers_ACP
    var ACPHTML = "";
    // Text formatting, URL, IMG, Google search
    ACPHTML += '<input value="size" id="Better_SweClockers_Button_Size" class="button" type="button" />' +
        '<input value="color" id="Better_SweClockers_Button_Color" class="button" type="button" />' +
        '<input value="font" id="Better_SweClockers_Button_Font" class="button" type="button" />' +
        '<input value="quote" id="Better_SweClockers_Button_Quote" class="button" type="button" />' +
        '<input value="spoiler" title="För spoilers, mycket långa textstycken etc" id="Better_SweClockers_Button_Spoiler" class="button" type="button" />' +
        '<input value="noparse" title="Förhindrar att BB-kod parsas" id="Better_SweClockers_Button_Noparse" class="button" type="button" />' +
        '<input value="strike" title="Överstruken text" id="Better_SweClockers_Button_Strike" class="button" type="button" />' +
        '<input value="cmd" title="Inlinekod" id="Better_SweClockers_Button_Cmd" class="button" type="button" />' +
        '<input value="code" title="Kodstycke" id="Better_SweClockers_Button_Code" class="button" type="button" />' +
        '<input value="Formel" title="Typsnitt som passar för matematiska formler" id="Better_SweClockers_Button_Math" class="button" type="button" />' +
        '<a title="Förbättrad version av den inbyggda länkfunktionen" id="Better_SweClockers_Button_URL" class="button Better_SweClockers_IconButton" href="#"><img src="'+BASE64.URL+'" class="Better_SweClockers_IconButtonIcon20px" />URL</a>' +
        '<a title="Gör inbäddade bilder av alla markerade, icke-tomma rader. Fungerar även mitt i en rad." id="Better_SweClockers_Button_IMG" class="button Better_SweClockers_IconButton" href="#"><img src="'+BASE64.IMG+'" class="Better_SweClockers_IconButtonIcon20px" />IMG</a>' +
        '<a title="Gör inbäddade, explicit klickbara bilder av alla markerade, icke-tomma rader. Fungerar även mitt i en rad." id="Better_SweClockers_Button_URLIMG" class="button Better_SweClockers_IconButton" href="#"><img src="'+BASE64.IMG+'" class="Better_SweClockers_IconButtonIcon20px" />URL IMG</a>' +
        '<a title="Bädda in en YouTube-video med markerad text som URL" id="Better_SweClockers_Button_YouTube" class="button" href="#" /><span>You</span><span>Tube</span></a>' +
        '<a title="Länk till Google-sökning med markerad text som sökfras" id="Better_SweClockers_Button_Google" class="button" href="#" /><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></a>';
        '<a title="Länk till DuckDuckGo-sökning med markerad text som sökfras" id="Better_SweClockers_Button_DuckDuckGo" class="button" href="#" /><span>D</span><span>u</span><span>c</span><span>k</span><span>D</span><span>u</span><span>c</span><span>k</span><span>G</span><span>o</span></a>';
    // Doge buttons
    if (optionIsTrue("ACP_dogeButtons")) {
        ACPHTML += '<input value="shibe" title="wow" id="Better_SweClockers_Button_Shibe" class="button Better_SweClockers_ShibeText" type="button" />' +
                   '<a title="pls click" id="Better_SweClockers_Button_Doge" class="button Better_SweClockers_IconButton" href="#"><img src="' + BASE64.DOGE + '" />Doge</a>';
    }
    // Smileys
    if (optionIsTrue("ACP_smileys")) {
        ACPHTML += '<a href="'+BSC.BBCodeReferenceURL+'" title="Öppnas i en ny flik" class="button Better_SweClockers_IconButton" target="_blank"><img src="'+BASE64.WINK+'" />Smileys</a>';
    }
    // CAPS LOCK, Splitat, EDIT:
    ACPHTML += '<input value="CAPS LOCK" title="Fungerar precis som Caps Lock, fast på markerad text" id="Better_SweClockers_Button_CapsLock" class="button" type="button" />' +
               '<a title="Splitta citat vid markören så att du kan svara på varje del för sig" id="Better_SweClockers_Button_SplitQuote" class="button Better_SweClockers_IconButton" href="#"><img src="' + BASE64.SPLITQUOTE + '" />Splitat</a>' +
               '<input value="EDIT:" title="Infoga texten &quot;EDIT: &quot; i fetstil" id="Better_SweClockers_Button_Edit" class="button" type="button" />';
    // Special characters
    if (optionIsTrue("ACP_specialChars")) {
        ACPHTML += "<form><fieldset><legend>Specialtecken</legend>" +
                   ACPButton("\u2011", "Hårt bindestreck (tillåter ej radbrytning)") +
                   ACPButton("–", "Kort tankstreck (talstreck; intervall)") +
                   ACPButton("—", "Långt tankstreck") +
                   ACPButton("…", "Ellipsis") +
                   ACPButton("≈", "Ungefär lika med") +
                   ACPButton("− ", "Minustecken") +
                   ACPButton("×", "Multiplikationstecken") +
                   ACPButton("·", "Halvhög punkt (multiplikationstecken)") +
                   ACPButton("°", "Gradtecken") +
                   ACPButton("\u202F°C", "Grad Celsius (inkl. hårt blanksteg)") +
                   ACPButton("NBSP", "Hårt blanksteg (tillåter ej radbrytning)", "\xA0") +
                   ACPButton("NNBSP", "Smalt hårt blanksteg (tillåter ej radbrytning, används som enhets- och tusentalsseparator)", "\u202F") +
                   ACPButton("²", "Upphöjd tvåa") +
                   ACPButton("′", "Primtecken (fot; minuter; förstaderivata)") +
                   ACPButton("″", "Dubbelprimtecken (tum; sekunder; andraderivata)") +
                   ACPButton("»", "Gåsögon, höger") +
                   ACPButton("✓", "Bock") +
                   ACPButton("→", "Högerpil") +
                   "</fieldset></form>";
    }
    // Useful Links tool
    if (optionIsTrue("ACP_usefulLinks")) {
        ACPHTML += '\
            <form id="Better_SweClockers_UsefulLinks" title="Användbara länkar"><fieldset>\
                <legend>Användbara länkar</legend>\
                <select id="Better_SweClockers_UsefulLinksSelect"></select>\
                <input type="checkbox" title="Fetstil" checked id="Better_SweClockers_UsefulLinksBold" /><label for=""Better_SweClockers_UsefulLinksBold"" title="Fetstil"><strong>B</strong></label>\
                <input type="submit" value="Infoga" class="button" title="Infoga vald länk. Skriver INTE över markerad text." /><a href="#" class="button" target="_blank" id="Better_SweClockers_UsefulLinksGoTo" title="Öppna vald länk i en ny flik">Gå till</a>\
            </fieldset></form>\
        ';
    }
    // Prisjakt, Imgur
    if (optionIsTrue("ACP_quickLinks")) {
        ACPHTML += '\
            <a title="Öppna Prisjakt i en ny flik" id="Better_SweClockers_Button_Prisjakt" href="http://www.prisjakt.nu/kategori.php?k=328" class="button Better_SweClockers_IconButton" target="_blank"><img src="' + BASE64.PRISJAKT + '" />Prisjakt</a>\
            <a title="Öppna Imgur i en ny flik" id="Better_SweClockers_Button_Imgur" href="http://imgur.com" class="button Better_SweClockers_IconButton" target="_blank"><img src="' + BASE64.IMGUR + '" />Imgur</a>\
        ';
    }
    // Inställningar
    ACPHTML += '\
        <a title="Inställningar (öppnas i en ny flik)" target="_blank" id="Better_SweClockers_Button_Settings" class="button Better_SweClockers_IconButton" href="' + BSC.settingsURL + '"><img src="' + BASE64.SETTINGS + '" />Inst.</a>\
    ';
    // Färgpaletten
    if (optionIsTrue("ACP_colorPalette")) {
        ACPHTML += '\
            <br /><form><fieldset title="Färgar texten i vald färg, precis som [color] (snabbgenvägar för vanliga färger)">\
                <legend>Färgpaletten</legend>\
                <input value="+ Färgpaletten" id="Better_SweClockers_Button_ColorPalette" class="button" type="button" /><div id="Better_SweClockers_ColorPaletteInner" style="display: ' + (BSC.getState("showColorPalette") ? "inline-block" : "none") + ';">' +
              betterSwecColorButtons() +
              '</div></fieldset></form>';
    }

    var ACP = document.createElement("div");
    ACP.id = "Better_SweClockers_ACP";
    ACP.innerHTML = ACPHTML;
    var TAFieldset = getTAFieldset();
    if (!!TAFieldset) {
        var qSelector = ACPInsertionPointSelector(BSC.settings.ACP_insertionPoint);
        var elementToInsertACPBefore = TAFieldset.querySelector(qSelector);
        if (!!elementToInsertACPBefore) {
            ACP.BSC_insertBefore(elementToInsertACPBefore);
        } else {
            addException(new ElementNotFoundException("Could not insert Advanced Control Panel because its intended nextSibling (" + qSelector + ") could not be found."));
        }
    } else {
        addException(new ElementNotFoundException("Could not insert Advanced Control Panel because one of its intended ancestors (.s5fieldset) could not be found."));
    }
    var usefulLinksSelect = byID("Better_SweClockers_UsefulLinksSelect");
    if (!!usefulLinksSelect) {
        usefulLinksSelect.innerHTML = bsSelectOptionsUsefulLinks(BSC.usefulLinks);
    }

    // Add event listeners to advanced control panel buttons
    ACP.addEventListener("click", function(event) {
        var TA = BSC.TA;
        var target = event.target;
        var realTargetID = closestID(target);
        if (isEmptyLink(byID(realTargetID))) {
            event.preventDefault(event);
        }
        switch (realTargetID) {
            case "Better_SweClockers_Button_Size":
                TA.BSC_wrapBB('[size=""]', '[/size]', 7); break;
            case "Better_SweClockers_Button_Color":
                TA.BSC_wrapBB('[color=""]', '[/color]', 8); break;
            case "Better_SweClockers_Button_Font":
                TA.BSC_wrapBB('[font=""]', '[/font]', 7); break;
            case "Better_SweClockers_Button_Quote":
                TA.BSC_wrapBB('[quote=""]', '[/quote]', 8); break;
            case "Better_SweClockers_Button_Spoiler":
                TA.BSC_wrapBB("[spoiler]", "[/spoiler]"); break;
            case "Better_SweClockers_Button_URL":
                TA.BSC_wrapBB('[url=""]', '[/url]', 6); break;
            case "Better_SweClockers_Button_IMG":
                embedImages(); break;
            case "Better_SweClockers_Button_URLIMG":
                embedClickableImages(); break;
            case "Better_SweClockers_Button_Noparse":
                TA.BSC_wrapBB("[noparse]", "[/noparse]"); break;
            case "Better_SweClockers_Button_Strike":
                TA.BSC_wrapBB("[s]", "[/s]"); break;
            case "Better_SweClockers_Button_Cmd":
                TA.BSC_wrapBB("[cmd]", "[/cmd]"); break;
            case "Better_SweClockers_Button_Code":
                TA.BSC_wrapBB("[code]\n", "\n[/code]"); break;
            case "Better_SweClockers_Button_Math":
                TA.BSC_wrapBB('[font="serif"][size="3"]', '[/size][/font]'); break;
            case "Better_SweClockers_Button_YouTube":
                TA.BSC_wrapBB("[youtube]", "[/youtube]"); break;
            case "Better_SweClockers_Button_Google":
                betterSwecGoogle(); break;
            case "Better_SweClockers_Button_DuckDuckGo":
                betterSwecDuckDuckGo(); break;
            case "Better_SweClockers_Button_Shibe":
                betterSwecShibeText(); break;
            case "Better_SweClockers_Button_Doge":
                TA.BSC_insert("[img]" + BSC.smileyURLs.doge + "[/img]", false); break;
            case "Better_SweClockers_Button_CapsLock":
                betterSwecInvertCase(); break;
            case "Better_SweClockers_Button_SplitQuote":
                splitQuote(); break;
            case "Better_SweClockers_Button_Edit":
                betterSwecInsertEdit(); break;
            case "Better_SweClockers_Button_ColorPalette":
                toggleShowColorPalette(); break;
            case "Better_SweClockers_ColorPaletteInner":
                TA.BSC_wrapBB('[color="' + target.title + '"]', '[/color]'); break;
            default:
                log("Detected click event on " + target + " with ID \"" + target.id + "\", which has no action assigned to it. Ignoring event.");
        }
    });

    // Update href of Useful Links Go To button:
    eventListener("Better_SweClockers_UsefulLinksSelect", "change", updateUsefulLinksGoTo);
    // Go to selected Useful Link:
    eventListener("Better_SweClockers_UsefulLinks", "submit", function(event) { event.preventDefault(event); betterSwecInsertUsefulLink(); });
    var checkboxes = getCheckboxesFrom(ACP);
    for (var i = 0; i < checkboxes.length; i++) {
        // Make sure all checkboxes in ACP get the state they had last time:
        var checkbox = checkboxes[i];
        checkbox.checked = BSC.getState("ACPCheckbox."+checkbox.id);
        // And give them an event listener each to they can update their state:
        checkbox.addEventListener("change", function() {
            BSC.setState("ACPCheckbox."+checkbox.id, checkbox.checked);
        });
    }
    updateUsefulLinksGoTo();
    addStringButtonEventListeners();
    // End of insertAdvancedControlPanel
}

function removeLastNewline() {
    var TA = BSC.TA;
    if (!!TA && !BSC.TAIsFocused) {
        TA.value = TA.value.replace(/\[\/quote\]\n*$/, "[/quote]\n");
        log("Removed last newline (after [/quote]).");
    }
}

function autofocusTA() {
    var TA = BSC.TA;
    if (!!TA && !BSC.TAIsFocused) {
        log("Focused textarea.");
        TA.focus();
    } else addException(new ElementNotFoundException("Failed to autofocus main textarea because it could not be found."));
}

function removeMobileSiteDisclaimer() {
    var TA = BSC.TA;
    if (!!TA) {
        log("Looking for mobile site disclaimer...");
        var regex = /\n+.*Skickades från .*m\.sweclockers\.com.*$/mg;
        if (matches(TA.value, regex)) {
            TA.value = TA.value.replace(regex, "");
            log("Removed mobile site disclaimer.");
        } else log("Found no mobile site disclaimer.");
    }
}

function autofocusPMSubject() {
    log("Setting focus on PM subject textbox...");
    var subjectInput = byID("__laika_cnt.textbox.0");
    if (!!subjectInput) {
        subjectInput.focus();
        log("Done!");
    } else addException(new ElementNotFoundException("Could not set focus on PM subject textbox because it could not be found."));
}

function improvePaginationButtons() {
    BSC.CSS += '\
        .inner .threadPages {\
            height: 22px;\
            overflow: visible;\
        }\
        .inner .threadPages .inner {\
            height: 32px;\
        }\
        .threadPages .inner a {\
            box-sizing: border-box;\
            height: 32px;\
            margin: 0;\
            min-width: 32px;\
            padding: 8px;\
            vertical-align: top;\
        }\
    ';
}

function canRemovePageLinkAnchors() {
    return !!qSel(".articleNavi .pageList");
}

function removePageLinkAnchors() {
    log("Removing page link anchors ...");
    var pageList = qSel(".articleNavi .pageList");
    if (!!pageList) {
        var pageLinks = pageList.querySelectorAll("a");
        for (var i = 0, len = pageLinks.length; i < len; i++) {
            removeAnchor(pageLinks[i]);
        }
    } else addException(new ElementNotFoundException("Could not remove page link anchors because the page list element (.articleNavi .pageList) could not be found."));
    log("Done removing page link anchors.");
}

function extractUsernameFromPost(post) {
    try {
        var authLink = post.querySelector(".name a");
        return authLink.textContent.trim();
    } catch (e) {
        throw new ElementNotFoundException("Could not extract username from post.");    
    }
}

function getPostData(post) {
    if (!!post.dataset.post) {
        var parsedPostData = tryToParseJSON(post.dataset.post);
        if (parsedPostData !== false) {
            return parsedPostData;
        } else throw new GeneralException("Could not get data from post with ID "+post.id+" because it did not have valid JSON in its dataset.post.");
    } else throw new GeneralException("Could not get data from post with ID "+post.id+" because it did not have a dataset.post.");
}

function addPMLinks() {
    function err(id) { addException(new ContentCreationException("Could not insert PM button because could not extract user ID from data-post attribute of post with ID "+id+".")); }
    log("Inserting PM links...");
    var myName = BSC.myName;
    var forumPosts = BSC.forumPosts;
    var forumPost, parsedPostData, userID, author, pmHref, pmLink, pmLinkParent;
    for (var i = 0, len = forumPosts.length; i < len; i++) {
        forumPost = forumPosts[i];
        try {
            parsedPostData = getPostData(forumPost);
        } catch (e) {
            addException(e);
        }
        userID = !!parsedPostData && parsedPostData.userid;
        author = extractUsernameFromPost(forumPost) || " denna användare";
        if (!!userID) {
            if (author !== myName) {
                pmHref = "/pm/nytt-meddelande?rcpts="+userID;
                pmLink = createBSCIconButton("PM", BASE64.PM, pmHref, "Skicka ett privat meddelande till "+author);
                pmLinkParent = forumPost.querySelector(".details");
                pmLinkParent.appendChild(pmLink);
            }
        } else err(forumPost.id);
    }
    // We have to position the PM button absolutely so it does not cause
    // minor page jumping on some devices (e.g. iOS 7). Therefore, we also
    // have to position .details non-statically, so our absolute positioning
    // works.
    BSC.CSS += "\
        .forumPost .details .Better_SweClockers_IconButton { position: absolute; margin-left: 8px; }\
        .forumPost .details { position: relative; }\
    ";
    log("Done inserting PM links.");
}

function highlightOwnPosts() {
    log("Styling own posts...");
    // Relies on posts having .isReader if they are user's own.
    BSC.CSS += "\
        .forumPost.isReader {\
            box-shadow: -8px 0 0 #C15200;\
        }\
    ";
    log("Done styling own posts.");
}

function getReplyURL() {
    var quickReplyForm = qSel("#quickreply form");
    if (!!quickReplyForm) {
        return quickReplyForm.getAttribute("action");
    } else throw new ElementNotFoundException("Failed to detect reply URL because the quick reply form (#quickreply form) could not be found.");
}

function quoteSignatureForm(signatureText, postid, author, tip) {
    var fakeForm = document.createElement("form");
    fakeForm.method = "POST";
    fakeForm.action = getReplyURL();
    fakeForm.className = "btnGroup";
    var input_message = document.createElement("input");
    input_message.type = "hidden";
    input_message.name = "message";
    input_message.value = '[quote postid="'+postid+'" name="'+author+'"]\n' + signatureText.trim() + '\n[/quote]\n' + tip;
    fakeForm.appendChild(input_message);
    var input_csrf = document.createElement("input");
    input_csrf.type = "hidden";
    input_csrf.name = "csrf";
    input_csrf.value = session.getCsrfToken();
    fakeForm.appendChild(input_csrf);
    var input_action = document.createElement("input");
    input_action.type = "hidden";
    input_action.name = "action";
    input_action.value = "doPreview";
    fakeForm.appendChild(input_action);
    var quoteSignatureButton = document.createElement("input");
    quoteSignatureButton.type = "submit";
    quoteSignatureButton.className = "button Better_SweClockers_QuoteSignatureButton";
    quoteSignatureButton.value = "Citera sign.";
    quoteSignatureButton.title = "Citera den här signaturen";
    fakeForm.appendChild(quoteSignatureButton);
    return fakeForm;
}

function addQuoteSignatureButtons() {
    log("Inserting quote signature buttons...");
    try {
        // We add an overkill margin-left to force the button to stay on
        // the same line even when the container is too narrow, such as
        // on tablets. float: right; is needed so that the button is
        // "glued" to the buttons on its right:
        BSC.addCSS("\
            .Better_SweClockers_QuoteSignatureButton { height: 24px !important; box-sizing: border-box !important; border-radius: 0; margin-left: -1000px !important; float: right !important; }\
        ");
        var forumPosts = BSC.forumPosts;
        var forumPost, postid, author, signature, controls, fakeForm;
        for (var i = 0, len = forumPosts.length; i < len; i++) {
            forumPost = forumPosts[i];
            postid = getPostData(forumPost).postid;
            author = extractUsernameFromPost(forumPost);
            signature = forumPost.querySelector(".signature .text .bbcode");
            if (author !== BSC.myName) {
                if (!!signature) {
                    controls = forumPost.querySelector(".cell.controls");
                    fakeForm = quoteSignatureForm(signature.textContent.trim(), postid, author, BSC.settings.quoteSignatureTip);
                    controls.appendChild(fakeForm);
                } else log("Did not insert quote signature button under post "+postid+" because no signature was found.");
            }
        }
        log("Inserted quote signature buttons.");
    } catch(e) {
        logError("Failed to insert quote signature buttons.");
        addException(e);
    }
}

function highlightUnreadPMs() {
    BSC.CSS += "\
        #threadList-1 h2 { font-weight: normal; }\
        #threadList-1 tr.hasUnreadPosts,\
        #threadList-1 tr.hasUnreadPosts h2 { font-weight: bold; }\
        #threadList-1 tr.hasUnreadPosts td.status { box-shadow: inset 5px 0 0 0 #d96b0f; }\
    ";
    log("Highlighted unread PMs.");
}

function addMainCSS() {
    log("Adding main CSS...");
    BSC.CSS += '\
        #Better_SweClockers_Console > hr {\
            background-color: #ddd;\
            border-top: 1px gray solid;\
            border-bottom: 1px gray solid;\
            display: block;\
            height: 8px;\
            margin: 0;\
            width: 100%;\
        }\
        #Better_SweClockers_Console {\
            background-color: #f6f6f6;\
            bottom: 0;\
            height: 200px;\
            position: fixed;\
            width: 100%;\
            z-index: 9999999;\
        }\
        #Better_SweClockers_Console pre {\
            font-family: monospace;\
            height: 100%;\
            overflow-x: hidden;\
            overflow-y: scroll;\
            padding-left: 8px;\
            white-space: pre;\
        }\
        #Better_SweClockers_Console p {\
            border-bottom: 1px #ddd solid;\
        }\
        #Better_SweClockers_Console p.warning {\
            color: rgb(192, 160, 0);\
        }\
        #Better_SweClockers_Console p.error {\
            color: red;\
        }\
        ' +

        // General fixes
        '.forumPost .postHeader.table { height: 25px; }' + // constant height for the post headers

        // Dark theme button
        '\
        #Better_SweClockers_DarkThemeButtonTab {\
            background-color: rgb(20, 20, 20);\
            border-color: black;\
        }\
        #Better_SweClockers_DarkThemeButtonTab a {\
            color: #909090 !important;\
            text-align: center;\
            width: 144px;\
        }\
        .Better_SweClockers_Green { color: #208000; }\
        .Better_SweClockers_Red { color: #D00; }\
        .Better_SweClockers_UpdateNotice { font-size: medium; background-size: 16px 16px; background-repeat: no-repeat; padding-left: 22px; }\
        .Better_SweClockers_UpdateNotice.BSC_New { background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" version="1.1"><style>.thick {stroke-width: 14;stroke-linecap: square;fill: none;}.green {stroke: #208000;}.red {stroke: #D00;}</style><path class="thick green" d="M10 32 l15 15l29 -29"/></svg>\'); }\
        .Better_SweClockers_UpdateNotice.BSC_Old { background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" version="1.1"><style>.thick {stroke-width: 14;stroke-linecap: square;fill: none;}.green {stroke: #208000;}.red {stroke: #D00;}</style><path class="thick red" d=" M 14 14 l 36 36 M 50 14 l -36 36 "/></svg>\'); }\
        #Better_SweClockers_SearchWithGoogle {\
            box-sizing: border-box;\
            -moz-box-sizing: border-box;\
            color: #166beb;\
            font-family: Georgia;\
            font-size: 18px;\
            height: 24px;\
            padding: 0 4px;\
            width: 24px;\
            vertical-align: top;\
        }\
        #Better_SweClockers_SearchWithDuckDuckGo {\
            box-sizing: border-box;\
            -moz-box-sizing: border-box;\
            color: #166beb;\
            font-family: Georgia;\
            font-size: 18px;\
            height: 24px;\
            padding: 0 4px;\
            width: 24px;\
            vertical-align: top;\
        }\
        .header .sections {\
            overflow: visible !important;\
            height: 85px;\
        }\
        #subMenu {\
            max-width: 900px; /* to make room for Favorite Links */\
        }\
        .sections .section.profile {\
            position: relative; /* for absolute positioning of Favorite Links */\
        }\
        #Better_SweClockers_FavoriteLinks {\
            height: '+BSC.favoriteLinksHeight+'px;\
            position: absolute;\
            margin: 0;\
            top: -'+(BSC.favoriteLinksHeight+5)+'px;\
        }\
        body a.Better_SweClockers_Link:link, body a.Better_SweClockers_Link:visited {\
            color: #D26000;\
            text-decoration: none;\
        }\
        body a.Better_SweClockers_Link:hover, body a.Better_SweClockers_Link:focus, body a.Better_SweClockers_Link:active {\
            text-decoration: underline;\
        }\
        .forumForm.postEditForm .s5fieldset .tanukiTextbox { max-width: 100%; }\
        #Better_SweClockers_ACP { margin: 8px 0 8px 0; }\
        #Better_SweClockers_ACP > * { vertical-align: top; display: inline-block; margin-bottom: 10px; }\
        #Better_SweClockers_ACP .button { height: 23px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; border-radius: 0; }\
        #Better_SweClockers_ACP input { width: auto; }\
        #Better_SweClockers_ACP input[type=submit] { min-width: 48px; display: inline-block; }\
        #Better_SweClockers_ACP select { height: 23px; padding: 0; }\
        .Better_SweClockers_StringButton { min-width: 25px; padding-left: 8px; padding-right: 8px; }\
        #Better_SweClockers_ACP fieldset { border: 1px solid #cdc9c1; border-radius: 3px; padding: 3px; margin: 0 0 5px 0; }\
        #Better_SweClockers_ACP fieldset > * { vertical-align: top; margin: 0; }\
        #Better_SweClockers_ACP fieldset input[type=checkbox] { margin-top: 4px; }\
        #Better_SweClockers_ACP fieldset label { display: inline-block; margin-top: 2px; }\
        #Better_SweClockers_ACP fieldset legend { display: none; }\
        #Better_SweClockers_ACP fieldset .button { margin: 0 3px 0 0; display: inline-block; }\
        #Better_SweClockers_ACP fieldset .button:last-child { margin-right: 0; }\
        #Better_SweClockers_ACP fieldset input[type=text] { height: 21px; margin: 0; padding: 0 2px; width: 96px; }\
        #Better_SweClockers_ACP form { margin: 0; padding: 0; }\
        #Better_SweClockers_ACP label { cursor: pointer; display: inline; font-size: 12px; margin: 0; padding: 0 0 0 2px; }\
        #Better_SweClockers_ACP input[type=checkbox] { cursor: pointer; }\
        #Better_SweClockers_Button_Strike { text-decoration: line-through; }\
        #Better_SweClockers_Button_Cmd,\
        #Better_SweClockers_Button_Code {\
            font-family: "Courier New", monospace; font-weight: normal;\
        }\
        #Better_SweClockers_Button_Math { font-family: Georgia, serif; font-weight: normal; }\
        .Better_SweClockers_IconButton { padding-left: 26px !important; }\
        .Better_SweClockers_IconButton img { position: absolute; top: 2px; left: 4px; height: 16px; }\
        .Better_SweClockers_IconButton img.Better_SweClockers_IconButtonIcon20px { top: 0; left: 2px; height: 20px; }\
        #Better_SweClockers_ACP #Better_SweClockers_Button_ColorPalette { margin-right: 0; width: 96px; }\
        #Better_SweClockers_ACP div.Better_SweClockers_ColorButton {\
            background: none;\
            border: none;\
            -moz-box-sizing: border-box;\
            -webkit-box-sizing: border-box;\
            box-sizing: border-box;\
            display: inline-block;\
            height: 23px;\
            position: relative;\
            width: 23px;\
        }\
        #Better_SweClockers_ACP div.Better_SweClockers_ColorButton:hover,\
        #Better_SweClockers_ACP div.Better_SweClockers_ColorButton:active {\
            /*outline: 2px rgba(0, 0, 0, 0.8) solid;*/\
            border-radius: 3px;\
            cursor: pointer;\
            height: 27px;\
            margin: -2px;\
            width: 27px;\
            z-index: 9;\
        }\
        #Better_SweClockers_ColorPaletteInner { display: none; height: 23px; margin-left: 3px; }\
        #Better_SweClockers_Button_YouTube {\
            color: black;\
            font-family: "Arial Narrow", Arial;\
        }\
        #Better_SweClockers_Button_YouTube span:nth-child(2) {\
            color: white;\
            background-color: #E00;\
            border-radius: 4px;\
            padding: 1px 2px 0 2px;\
        }\
        #Better_SweClockers_Button_Google {\
            font-family: Georgia, serif;\
            background: rgb(249,248,244);\
            background: -moz-linear-gradient(top, rgba(249,248,244,1) 0%, rgba(229,228,224,1) 100%);\
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(249,248,244,1)), color-stop(100%,rgba(229,228,224,1)));\
            background: -webkit-linear-gradient(top, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
            background: -o-linear-gradient(top, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
            background: -ms-linear-gradient(top, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
            background: linear-gradient(to bottom, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
        }\
        #Better_SweClockers_Button_DuckDuckGo {\
            font-family: Georgia, serif;\
            background: rgb(249,248,244);\
            background: -moz-linear-gradient(top, rgba(249,248,244,1) 0%, rgba(229,228,224,1) 100%);\
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(249,248,244,1)), color-stop(100%,rgba(229,228,224,1)));\
            background: -webkit-linear-gradient(top, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
            background: -o-linear-gradient(top, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
            background: -ms-linear-gradient(top, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
            background: linear-gradient(to bottom, rgba(249,248,244,1) 0%,rgba(229,228,224,1) 100%);\
        }\
        #Better_SweClockers_Button_Google:hover {\
            background: rgb(252,251,247);\
            background: -moz-linear-gradient(top, rgba(252,251,247,1) 0%, rgba(242,241,237,1) 100%);\
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(252,251,247,1)), color-stop(100%,rgba(242,241,237,1)));\
            background: -webkit-linear-gradient(top, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
            background: -o-linear-gradient(top, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
            background: -ms-linear-gradient(top, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
            background: linear-gradient(to bottom, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
        }\
        #Better_SweClockers_Button_DuckDuckGo:hover {\
            background: rgb(252,251,247);\
            background: -moz-linear-gradient(top, rgba(252,251,247,1) 0%, rgba(242,241,237,1) 100%);\
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(252,251,247,1)), color-stop(100%,rgba(242,241,237,1)));\
            background: -webkit-linear-gradient(top, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
            background: -o-linear-gradient(top, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
            background: -ms-linear-gradient(top, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
            background: linear-gradient(to bottom, rgba(252,251,247,1) 0%,rgba(242,241,237,1) 100%);\
        }\
        #Better_SweClockers_Button_Google span:nth-child(3n+1) { color: #176dee; }\
        #Better_SweClockers_Button_Google span:nth-child(4n+2) { color: #da4532; }\
        #Better_SweClockers_Button_Google span:nth-child(3) { color: #eeb003; }\
        #Better_SweClockers_Button_Google span:nth-child(5) { color: #009957; }\
        #Better_SweClockers_Button_DuckDuckGo span:nth-child(3n+1) { color: #176dee; }\
        #Better_SweClockers_Button_DuckDuckGo span:nth-child(4n+2) { color: #da4532; }\
        #Better_SweClockers_Button_DuckDuckGo span:nth-child(3) { color: #eeb003; }\
        #Better_SweClockers_Button_DuckDuckGo span:nth-child(5) { color: #009957; }\
        #Better_SweClockers_UsefulLinksSelect { width: 128px; }\
        .Better_SweClockers_ShibeText { color: red; font-family: "Comic Sans MS", "Chalkboard SE", sans-serif; font-style: italic; }\
        #Better_SweClockers_ButtonsBelowTA { float: right; margin-right: 20px; }\
        ' +
        
        // Options form:
        '\
        #Better_SweClockers { width: 640px; margin: 0 auto; }\
        #Better_SweClockers fieldset { margin-top: 24px; }\
        #Better_SweClockers img.logo { width: 100%; }\
        #Better_SweClockers label { display: inline-block; }\
        #Better_SweClockers select { display: inline-block; margin-left: 8px; width: auto; }\
        #Better_SweClockers kbd { font-family: "Courier New", monospace; color: #D00; }\
        #Better_SweClockers textarea { display: block; font-family: "Courier New", monospace; margin-bottom: 8px; width: 98%; }\
        #Better_SweClockers_Settings\\.uninterestingForumsRaw { display: none !important; }\
        #Better_SweClockers_Settings\\.darkThemeByBlargmodeTimeOn,\
        #Better_SweClockers_Settings\\.darkThemeByBlargmodeTimeOff {\
            margin: 0 8px;\
            width: 96px;\
        }\
        #Better_SweClockers textarea { min-height: 128px; }\
        #Better_SweClockers_Settings_ImportExportStatus { height: 1em; margin: 12px 0 0 0; }\
        #Better_SweClockers_Settings_ImportExportInfo { margin: 12px 0; }\
        #Better_SweClockers_Settings_SuccessReport { height: 20px; }\
    ' +


    '\
        .Better_SweClockers_Uninteresting { opacity: 0.3 !important; }\
        .pushListInternal #Better_SweClockers_FilterSettingsExpandLink {\
            font-size: 12px;\
            margin-right: 24px;\
            height: 17px;\
        }\
        #Better_SweClockers_FilterSettings {\
            color: rgb(40, 40, 40);\
        }\
        #Better_SweClockers_FilterSettings input[type=checkbox] {\
            vertical-align: top;\
        }\
        #Better_SweClockers_FilterSettings label {\
            display: inline-block;\
            padding: 0;\
            margin-left: 4px;\
            max-width: 200px;\
        }\
        #Better_SweClockers_FilterSettings ul {\
            background-color: white;\
            border: 1px black solid;\
            display: none;\
            height: 512px;\
            margin-top: 16px;\
            overflow-y: scroll;\
            overflow-x: hidden;\
            padding: 8px;\
            width: 252px;\
        }\
        #Better_SweClockers_FilterSettings ul::before {\
            color: rgb(120, 120, 120);\
            content: "Kryssa för de kategorier du vill filtrera bort. Inställningarna sparas automatiskt.";\
            display: block;\
            font-size: 11px;\
            line-height: 1.2em;\
            margin-bottom: 8px;\
        }\
        #Better_SweClockers_FilterSettings ul li:first-of-type {\
            border-bottom: 1px rgb(128,128,128) solid;\
            font-weight: bold;\
            margin-bottom: 6px;\
        }\
    ';
}

function insertDarkThemeStyleElement() {
    document.head.appendChild(BSC.darkThemeStyleElement);
}

function insertStyleElement() {
    BSC.styleElement.innerHTML = BSC.CSS;
    BSC.styleElement.id = "Better_SweClockers_Style";
    document.head.appendChild(BSC.styleElement);
}

function updateStyleElement() {
    BSC.styleElement.textContent = BSC.CSS;
}

function canInsertSettingsLinkLi() {
    return qSel(".sideMenu .menuItems") instanceof HTMLUListElement &&
           !qSel(".optionBetterSweClockers");
}

function insertSettingsLinkLi() {
    try {
        var menuItems = qSel(".sideMenu .menuItems");
        var settingsLinkLi = menuItems.lastElementChild.cloneNode(true);
        var settingsLink = settingsLinkLi.firstElementChild;
        settingsLinkLi.title = "Better SweClockers";
        settingsLinkLi.className = "menuItem optionBetterSweClockers";
        settingsLink.href = BSC.settingsURL;
        settingsLink.lastElementChild.textContent = "Better SweClockers";
        menuItems.appendChild(settingsLinkLi);
    } catch(e) {
        addException(new ElementNotFoundException("Failed to insert link to settings form because the DOM structure of its parent element (.sideMenu .menuItems) did not look like expected: "+e.message));
    }
}

function stripEntities(str) {
    if (isString(str)) {
        return str.replace(/&/g, "&amp;");
    } else throw new TypeException("Could not strip entities from " + str + " because it is not a string.");
}

function addCheckboxToSettingsObject(checkbox, settingsObj) {
    if (checkbox instanceof HTMLInputElement && settingsObj instanceof Object) { 
        var optionName = extractOptionName(checkbox.id);
        settingsObj[optionName] = checkbox.checked;
    } else addException(new GeneralException("addCheckboxToSettingsObject failed because it was called with invalid arguments."));
}

function addTextInputToSettingsObject(input, settingsObj) {
    if ((input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) && settingsObj instanceof Object) {
        var id = input.id;
        if (id !== "Better_SweClockers_Settings_Textarea") {
            var optionName = extractOptionName(id);
            settingsObj[optionName] = input.value;
        }
    } else addException(new GeneralException("addTextInputToSettingsObject failed because it was called with invalid arguments."));
}

function addSelectToSettingsObject(select, settingsObj) {
    if (select instanceof HTMLSelectElement && settingsObj instanceof Object) {
        var optionName = extractOptionName(select.id);
        settingsObj[optionName] = select.selectedIndex;
    } else addException(new GeneralException("addSelectToSettingsObject failed because it was called with invalid arguments."));
}

function parseOptionsForm() {
    var settingsFieldset = byID("Better_SweClockers");
    if (!settingsFieldset) {
        addException(new ElementNotFoundException("Failed to parse options form because it does not exist."));
        return;
    }
    var i, parsedSettings = {};
    var oldSettingsDarkThemeOn  = BSC.settings.darkThemeByBlargmodeTimeOn;
    var oldSettingsDarkThemeOff = BSC.settings.darkThemeByBlargmodeTimeOff;
    var checkboxes = getCheckboxesFrom(settingsFieldset);
    var textInputs = getTextInputsFrom(settingsFieldset);
    var selects    = getSelectsFrom(settingsFieldset);
    var uninterestingForumsRawTextarea = byID("Better_SweClockers_Settings.uninterestingForumsRaw");
    // We will add all the checkboxes automatically:
    for (i = 0; i < checkboxes.length; i++) {
        addCheckboxToSettingsObject(checkboxes[i], parsedSettings);
    }
    // The same goes for text inputs ...
    for (i = 0; i < textInputs.length; i++) {
        addTextInputToSettingsObject(textInputs[i], parsedSettings);
    }
    // ... and selects:
    for (i = 0; i < selects.length; i++) {
        addSelectToSettingsObject(selects[i], parsedSettings);
    }
    // Dark Theme auto-activation must be handled separately:
    if (oldSettingsDarkThemeOn !== BSC.settings.darkThemeByBlargmodeTimeOn ||
        oldSettingsDarkThemeOff !== BSC.settings.darkThemeByBlargmodeTimeOff) {
        parsedSettings.darkThemeAllowAutoActivation = true;
        parsedSettings.darkThemeAllowAutoDeactivation = true;
    }
    if (!!uninterestingForumsRawTextarea) {
        var uninterestingForumsRaw = uninterestingForumsRawTextarea.value;
        if (uninterestingForumsRaw !== "") {
            try {
                var uifArray = JSON.parse(uninterestingForumsRaw);
                var uif = {};
                if (Object.typeOf(uifArray) === "array") {
                    for (i = 0; i < uifArray.length; i++) {
                        uif[uifArray[i]] = true;
                    }
                    parsedSettings.uninterestingForums = uif;
                } else throw new TypeException("Expected object but saw "+Object.typeOf(uif)+".");
            } catch(e) {
                throw new GeneralException("Failed to parse uninteresting forums.");
            }
        }
    }
    parsedSettings.version = BSC.version;
    return parsedSettings;
}

function settingsIDPrefix(optionName) {
    return "Better_SweClockers_Settings." + optionName;
}

function canInsertOptionsForm() {
    return !!document.body;
}

function insertOptionsForm() {
    function checked(opt)      { return optionIsTrue(opt) ? " checked" : ""; }
    function checkboxList(str) { return '<div class="tanukiControl tanukiCheckbox"><ul class="checkboxList">' + str + '</ul></div>'; }
    function subFieldset(legend, html, id) {
        return '<fieldset' + (isNonEmptyString(id) ? ' id="'+id+'"' : "") + ' class="s5fieldset">\n<legend>' + legend + '</legend>\n' + html + '</fieldset>';
    }
    function settingsCheckbox(optionName, labelText) {
        if (isNonEmptyString(optionName) && isNonEmptyString(labelText)) {
            return '<li class="checkboxItem"><input type="checkbox" id="' + settingsIDPrefix(optionName) + '"' + checked(optionName) + ' /><label for="' + settingsIDPrefix(optionName) + '">' + labelText + '</label></li>';
        } else throw new ContentCreationException("Could not create settings checkbox for option " + optionName + " because the generator function was called with invalid arguments (" + optionName + " and " + labelText + ").");
    }
    function keysWithTrueValue(obj) {
        var trueKeys = [];
        Object.keys(obj).forEach(function(key) {
            if (obj[key] === true) {
                trueKeys.push(key);
            }
        })
        return trueKeys;
    }
    function hideSuccessReport() {
        byID("Better_SweClockers_Settings_SuccessReport").style.visibility = "hidden";
    }
    function handleSaveRequest() {
        BSC.settings = parseOptionsForm();
        saveSettings();
        loadFavoriteLinks(parseFavoriteLinks(BSC.settings.favoriteLinksRaw));
        var successReport = byID("Better_SweClockers_Settings_SuccessReport");
        if (successReport instanceof HTMLDivElement) {
            successReport.style.visibility = "visible";
            successReport.innerHTML = "Inställningarna sparades."
            setTimeout(hideSuccessReport, 2000);
        }
    }
    function saveSettingsError(ex) {
        addException(ex);
        alert("Ett fel inträffade när inställningarna skulle sparas.\n\n"+ex.message);
    }
    var referrer = document.referrer || "/";
    document.title = "Inställningar för Better SweClockers";
    document.head.appendChild((function() { var link = document.createElement("link"); link.rel="stylesheet"; link.href=BSC.defaultStylesheetURL; return link; })());
    if (!byID("Better_SweClockers")) {
        var settingsHTML = "";
        var BSCSettingsForm = document.createElement("form");
        var BSCSettingsFieldset = document.createElement("fieldset");
        var parentOfAllForms = document.body;
        var ACPInsertionPoint = BSC.settings.ACP_insertionPoint;
        BSCSettingsForm.id = "Better_SweClockers";
        BSCSettingsForm.method = "post";
        BSCSettingsFieldset.classList.add("s5fieldset");
        settingsHTML += '<legend></legend>\
                        <img src="' + BSC.logoURL + '" class="logo" alt="Better SweClockers" />\
                        <p>Dessa inställningar sparas endast lokalt.</p>\
                        <p><a href="' + BSC.documentationURL + '"><strong>Dokumentation/hjälp</strong></a></p>\
                        <p><a href="' + referrer + '"><strong>Tillbaka till SweClockers</strong></a></p>' +
                        subFieldset("Advanced Control Panel (ACP)",
                            checkboxList(
                                settingsCheckbox("advancedControlPanel", "<strong>Aktivera Advanced Control Panel</strong>")
                            ) +
                            '<label for="Better_SweClockers_Settings.ACP_insertionPoint">ACP:s position:</label>' +
                            '<select id="Better_SweClockers_Settings.ACP_insertionPoint">' +
                                '<option'+(ACPInsertionPoint === ABOVE_STANDARD_CONTROL_PANEL ? " selected":"")+'>Ovanför standardkontrollpanelen</option>' +
                                '<option'+(ACPInsertionPoint === ABOVE_TA ? " selected":"")+'>Under standardkontrollpanelen</option>' +
                                '<option'+(ACPInsertionPoint === BELOW_TA ? " selected":"")+'>Under textrutan (standard)</option></select>' +
                            checkboxList(
                                settingsCheckbox("ACP_dogeButtons", '<span class="Better_SweClockers_ShibeText">very doge buttons             wow</span>') +
                                settingsCheckbox("ACP_smileys", "Länk till SweClockers smileyreferens") +
                                settingsCheckbox("ACP_specialChars", "Knappar för specialtecken") +
                                settingsCheckbox("ACP_usefulLinks", "Verktyg för användbara länkar") +
                                settingsCheckbox("ACP_quickLinks", "Genvägar till Prisjakt och Imgur") +
                                settingsCheckbox("ACP_colorPalette", "Färgpaletten")
                            )
                        ) +
                        subFieldset("Avancerat redigeringsläge",
                            checkboxList(
                                settingsCheckbox("addAEMUnloadConfirmation", 'Förhindra oavsiktlig unload mitt i ett inlägg') +
                                settingsCheckbox("removeLastNewline", "Endast <em>en</em> tom rad efter citat") +
                                settingsCheckbox("autofocusTA", "Autofokusera textfältet") +
                                settingsCheckbox("removeMobileSiteDisclaimer", 'Ta bort <span style="font-size: x-small;">Skickades från <a href="http://m.sweclockers.com">m.sweclockers.com</a> ur citat</span>') +
                                settingsCheckbox("autofocusPMSubject", "Autofokusera ämnesraden vid nytt PM")
                            ) +
                            '<label for="Better_SweClockers_Settings.textareaHeight">Textrutans höjd:</label> <input id="Better_SweClockers_Settings.textareaHeight" value="'+BSC.settings.textareaHeight+'" type="number" /> pixlar (standard: '+BSC.defaultSettings.textareaHeight+')' +
                            '<br /><label for="Better_SweClockers_Settings.largerTextareaHeight">Större textruta:</label> <input id="Better_SweClockers_Settings.largerTextareaHeight" value="'+BSC.settings.largerTextareaHeight+'" type="number" /> pixlar (standard: '+BSC.defaultSettings.largerTextareaHeight+')'
                        ) +
                        subFieldset("Navigering",
                            checkboxList(
                                settingsCheckbox("betterPaginationButtons", "Förbättrade bläddringsknappar i forumet") +
                                settingsCheckbox("highlightUnreadPMs", "Framhäv olästa PM i inkorgen") +
                                settingsCheckbox("addPMLinks", "PM-knappar i foruminlägg") +
                                settingsCheckbox("highlightOwnPosts", "Framhäv egna inlägg") +
                                settingsCheckbox("quoteSignatureButtons", 'Citera signatur-knappar i foruminlägg') +
                                settingsCheckbox("removePageLinkAnchors", "Ta bort <pre>#content</pre>-ankare i länkar till andra sidor i en artikel")
                            ) +
                            '<label for="Better_SweClockers_Settings.quoteSignatureTip">Text att infoga efter citat av signatur:</label>\
                            <textarea id="Better_SweClockers_Settings.quoteSignatureTip">'+BSC.settings.quoteSignatureTip+'</textarea>'
                        ) +
                        subFieldset("Sökfält",
                            checkboxList(
                                settingsCheckbox("searchWithGoogle", "Knapp för att söka med Google istället för standardsökfunktionen") +
                                settingsCheckbox("searchWithDuckDuckGo", "Knapp för att söka med DuckDuckGo istället för standardsökfunktionen")
                            )
                        ) +
                        subFieldset("Diverse",
                            checkboxList(
                                settingsCheckbox("fixAdHeight", "<strong>Lås höjden på reklam etc</strong>") +
                                settingsCheckbox("fixArticleImageHeight", "Lås artikelbildens höjd") +
                                settingsCheckbox("DOMOperationsDuringPageLoad", "Utför DOM-operationer under sidladdning") +
                                settingsCheckbox("hideThumbnailCarousel", "Göm thumbnailvyn högst upp") +
                                settingsCheckbox("hideFacebookButtons", "Dölj Facebookdelningsknappar") +
                                settingsCheckbox("enableFilter", "Forumfilter för <strong>Nytt i forumet</strong>") +
                                settingsCheckbox("preventAccidentalSignout", "Förhindra oavsiktlig utloggning") +
                                settingsCheckbox("dogeInQuoteFix", 'Visa Doge-smiley i citat (istället för en Imgur-länk) <span class="Better_SweClockers_ShibeText">         win</span>') +
                                settingsCheckbox("openImagesInNewTab", "Öppna bilder i ny flik (istället för att förstora dem)")
                            ) +
                            '<textarea hidden id="Better_SweClockers_Settings.uninterestingForumsRaw">' + JSON.stringify(keysWithTrueValue(BSC.settings.uninterestingForums)) + '</textarea>'
                        ) +
                        subFieldset("Favoritlänkar",
                            checkboxList(
                                settingsCheckbox("enableFavoriteLinks", "Visa menyn <strong>Favoritlänkar</strong>")
                            ) +
                            '<label for="Better_SweClockers_Settings.favoriteLinksRaw">Redigera favoritlänkar:</label>\
                            <textarea id="Better_SweClockers_Settings.favoriteLinksRaw">' + stripEntities(BSC.settings.favoriteLinksRaw) + '</textarea>\
                            <p>Varje rad bör följa mönstret <kbd>Namn === URL</kbd>. Grupper kan märkas upp med starttaggen <kbd>### Gruppnamn</kbd> och den valfria sluttaggen <kbd>/###</kbd> (på egna rader). Inled med <kbd>!!!</kbd> för att länken ska öppnas i en ny flik. Se avsnitt 3.5.2 i <a href="' + BSC.documentationURL + '">dokumentationen</a>.</p>',
                        "Favoritlänkar") +
                        subFieldset("Blargmodes mörka tema",
                            checkboxList(
                                settingsCheckbox("darkThemeByBlargmode", '<strong>Aktivera <a href="/forum/10-programmering-och-digitalt-skapande/1089561-ett-morkt-tema-till-sweclockers/">Blargmodes mörka tema</a></strong> (infoga på/av-knapp)') +
                                settingsCheckbox("darkThemeCache", 'Använd cachad version (uppdaterad '+BSC.darkThemeCacheDate.toDateString()+')')
                            ) +
                            '<label for="Better_SweClockers_Settings.darkThemeByBlargmodeTimeOn">Aktivera automatiskt mellan</label> <input type="time" id="Better_SweClockers_Settings.darkThemeByBlargmodeTimeOn" title="Klockslag för aktivering (HH:MM)" value="' + BSC.settings.darkThemeByBlargmodeTimeOn + '" />' +
                            '<label for="Better_SweClockers_Settings.darkThemeByBlargmodeTimeOff"> och</label> <input type="time" id="Better_SweClockers_Settings.darkThemeByBlargmodeTimeOff" title="Klockslag för deaktivering (HH:MM)" value="' + BSC.settings.darkThemeByBlargmodeTimeOff + '" />' +
                            '<p><kbd>HH:MM</kbd> (om din webbläsare inte har ett särskilt gränssnitt för att välja klockslag).</p>'
                        ) +
                        subFieldset("Hantera inställningar",
                            '<textarea id="Better_SweClockers_Settings_Textarea" placeholder="Klistra in exporterad kod här och klicka på Importera"></textarea>\
                            <input type="button" class="button" value="Importera" id="Better_SweClockers_Settings_Import" />\
                            <input type="button" class="button" value="Exportera" id="Better_SweClockers_Settings_Export" />\
                            <input type="button" class="button" value="Återställ" id="Better_SweClockers_Settings_Reset" />\
                            <div id="Better_SweClockers_Settings_ImportExportStatus"></div>\
                            <div id="Better_SweClockers_Settings_ImportExportInfo"><p>Importerade inställningar sparas först när du klickar på <strong>OK</strong> eller <strong>Verkställ</strong>.</p><p>Om du klickar på <strong>Exportera</strong> exporteras de <em>ifyllda</em> inställningarna; inte de sparade.</p></div>'
                        ) +
                        '<input type="submit" value="OK" class="button" />' +
                        '<input id="Better_SweClockers_Settings_Apply" type="button" value="Verkställ" class="button" />' +
                        '<a href="' + referrer + '" class="button">Avbryt</a>' +
                        '<div id="Better_SweClockers_Settings_SuccessReport"></div>';
        BSCSettingsFieldset.innerHTML = settingsHTML;
        BSCSettingsForm.appendChild(BSCSettingsFieldset);
        parentOfAllForms.empty();
        parentOfAllForms.appendChild(BSCSettingsForm);

        eventListener("Better_SweClockers_Settings_Import", "click", importSettings);
        eventListener("Better_SweClockers_Settings_Export", "click", exportSettings);
        eventListener("Better_SweClockers_Settings_Reset",  "click", askResetSettings);
        eventListener("Better_SweClockers_Settings_Apply",  "click", function() {
            try {
                handleSaveRequest();
            } catch(e) {
                saveSettingsError(e);
            }            
        });
        eventListener("Better_SweClockers", "submit", function(event) {
            try {
                event.preventDefault(event);
                handleSaveRequest();
                window.location.href = referrer;
            } catch(e) {
                saveSettingsError(e);
            }
        });
    }
}

function updateSettingsForm(loadedSettings) {
    var form = byID("Better_SweClockers");
    var checkboxes = getCheckboxesFrom(form);
    var stringInputs = getTextInputsFrom(form);
    var selects = getSelectsFrom(form);
    var favoriteLinksRawBox = byID("Better_SweClockers_Settings.favoriteLinksRaw");
    var optionName, checkbox, input, select;
    if (!!favoriteLinksRawBox && loadedSettings.hasOwnProperty("favoriteLinksRaw")) {
        favoriteLinksRawBox.value = loadedSettings.favoriteLinksRaw;
    }
    for (var i = 0, len = checkboxes.length; i < len; i++) {
        checkbox = checkboxes[i];
        optionName = extractOptionName(checkbox.id);
        if (loadedSettings.hasOwnProperty(optionName)) {
            checkbox.checked = loadedSettings[optionName] === true;
        }
    }
    for (i = 0; i < stringInputs.length; i++) {
        input = stringInputs[i];
        optionName = extractOptionName(input.id);
        if (loadedSettings.hasOwnProperty(optionName)) {
            input.value = loadedSettings[optionName];
        }
    }
    for (i = 0; i < selects.length; i++) {
        select = selects[i];
        optionName = extractOptionName(select.id);
        if (loadedSettings.hasOwnProperty(optionName)) {
            select.selectedIndex = loadedSettings[optionName] || 0;
        }
    }
}

function tryToParseJSON(str) {
    try {
        var parsed = JSON.parse(str);
        if (!!parsed && Object.typeOf(parsed) === "object") {
            return parsed;
        }
    } catch(e) {
        log("Could not parse this string because it is not valid JSON: " + str);
    }
    return false;
}

function importSettings() {
    var textarea = byID("Better_SweClockers_Settings_Textarea");
    if (!!textarea) {
        var parsedSettings = tryToParseJSON(textarea.value);
        var statusField = byID("Better_SweClockers_Settings_ImportExportStatus");
        if (!!parsedSettings) {
            if (confirm("Är du säker på att du vill importera dessa inställningar? Dina nuvarande inställningar kommer skrivas över om du klickar på <strong>OK</strong> eller <strong>Verkställ</strong>.")) {
                updateSettingsForm(parsedSettings);
                statusField.innerHTML = "Inställningarna importerades. Klicka på <strong>OK</strong> eller <strong>Verkställ</strong> för att spara.";
                statusField.BSC_greenify();
            }
        } else {
            if (textarea.value === "") {
                statusField.innerHTML = "Vänligen klistra in tidigare exporterad JSON-kod i textfältet och försök sedan igen.";
            } else {
                addException(new TypeException("Could not import settings because the string to import was not valid JSON."));
                statusField.innerHTML = "Inställningarna kunde inte importeras. Detta kan bero på att koden du försöker importera inte är giltig JSON.";
            }
            statusField.BSC_redify();
        }
    }
}

function exportSettings() {
    var textarea = byID("Better_SweClockers_Settings_Textarea");
    if (!!textarea) {
        var OK = true, JSONString, statusField;
        try {
            JSONString = JSON.stringify(parseOptionsForm());
        } catch(e) {
            OK = false;
        }
        textarea.value = JSONString;
        statusField = byID("Better_SweClockers_Settings_ImportExportStatus");
        if (!!statusField) {
            if (OK) {
                statusField.innerHTML = "Inställningarna exporterades. Kopiera koden och spara den för att kunna importera dem senare.";
                statusField.BSC_greenify();
            } else {
                statusField.innerHTML = "Ett fel uppstod när inställningarna skulle exporteras.";
                statusField.BSC_redify();
            }
        }
    } else addException(new ElementNotFoundException("Failed to export settings because the textarea to export to (#Better_SweClockers_Settings_Textarea) could not be found."));
}

function askResetSettings() {
    if (confirm("Alla inställningar kommer återställas till standard. Bland annat kommer dina favoritlänkar försvinna. Är du säker?")) {
        if (confirm("ALLA inställningar kommer återställas. Jag frågar en gång till: Är du säker på att du vill det?")) {
            resetSettings();
            document.location.reload();
        }
    }
}



//================================================================
// "Nytt i forumet" filter
//================================================================

function toggleShowFilterSettings() {
    var settingsList = byID("Better_SweClockers_FilterSettingsList");
    var betterSwecFilterSettingsExpandLink = byID("Better_SweClockers_FilterSettingsExpandLink");
    if (!!settingsList) { 
        if (settingsList.style.display === "block") {
            settingsList.style.display = "none";
            betterSwecFilterSettingsExpandLink.innerHTML = "+ Filterinställningar";
        }
        else {
            settingsList.style.display = "block";
            betterSwecFilterSettingsExpandLink.innerHTML = "– Filterinställningar";
        }
    }
}

function allCategoriesAreChecked() {
    if (!!BSC.filterSettingsList) {
        var listItems = BSC.filterSettingsList.children;
        for (var i = 1; i < listItems.length; i++) {
            if (!listItems[i].firstElementChild.checked) {
                return false;
            }
        }
        return true;
    } else addException(new ElementNotFoundException("Could not check whether all checkboxes are checked because the filter settings list element could not be found."));
}

function filterSettingsClicked(eventTarget) {
    if (eventTarget instanceof HTMLInputElement && eventTarget.type === "checkbox") {
        // Target of click event is a checkbox.
        log("Detected click event on #"+eventTarget.id+".");
        if (eventTarget.id === "Better_SweClockers_FilterSettingsToggleAll") {
            toggleAllFilterCategories(eventTarget.checked);
        } else {
            toggleFilterCategory(eventTarget);
            setSelectAll(allCategoriesAreChecked());
        }
    }
}

function toggleFilterCategory(checkbox) {
    BSC.settings.uninterestingForums[checkbox.dataset.forumid.toString()] = checkbox.checked;
    saveSettings();
}

function toggleAllFilterCategories(checkedState) {
    var cat;
    var listItems = BSC.filterSettingsList.children;
    for (var i = 1; i < listItems.length; i++) {
        // Start with i = 1 to exclude the "Select all" checkbox.
        cat = listItems[i].firstElementChild;
        cat.checked = checkedState;
        toggleFilterCategory(cat);
    }
}

function setSelectAll(state) {
    if (!!BSC.filterSettingsList) {
        var listItems = BSC.filterSettingsList.children;
        listItems[0].firstElementChild.checked = state;
    }
}

function enableFilterControls() {
    function inputBoxState(catID) {
        return BSC.settings.uninterestingForums[catID] ? " checked" : "";
    }
    function categoriesArrToObj(arr) {
        var obj = {}, arri;
        for (var i = 0, len = arr.length; i < len; i++) {
            arri = arr[i];
            obj[arri[0]] = arri[1];
        }
        return obj;
    }
    log("Applying forum filter...");
    var plBody = qSel("#wdgtSideRecentThreads .plBody");
    var plNyhetstips = qSel("#wdgtSideRecentThreads .plNyhetstips");
    if (!!plBody && !!plNyhetstips) {
        var pushListUL = plBody.querySelector("ul");
        if (!!pushListUL) {
            var listItems = pushListUL.getElementsByTagName("li");
            var categoriesArray = BSC.categories;
            var categories = categoriesArrToObj(categoriesArray);
            var uninterestingForums = BSC.settings.uninterestingForums;
            var filterSettingsWrapper = document.createElement("div");
            var filterSettingsExpandLink = document.createElement("a");
            filterSettingsExpandLink.id = "Better_SweClockers_FilterSettingsExpandLink";
            filterSettingsExpandLink.href = "#";
            filterSettingsExpandLink.classList.add("Better_SweClockers_Link");
            filterSettingsExpandLink.innerHTML = "+ Filterinställningar";
            var categoryName, currentItem, currentItemDataThread, currentItemDataThreadParsed, currentItemForumID, currentItemLink;
            for (var i = 0; i < listItems.length; i++) {
                currentItem = listItems[i];
                currentItemDataThread = currentItem.dataset.thread;
                if (!!currentItemDataThread) {
                    currentItemDataThreadParsed = JSON.parse(currentItemDataThread);
                    if (!!currentItemDataThreadParsed && isInt(currentItemDataThreadParsed.forumid)) {
                        currentItemLink = currentItem.firstElementChild;
                        currentItemForumID = currentItemDataThreadParsed.forumid;
                        categoryName = categories[currentItemForumID] || "Okänt underforum";
                        if (!!currentItemLink) {
                            currentItemLink.title = categoryName + "/" + currentItemLink.title;
                            if (uninterestingForums[currentItemForumID] === true) {
                                log(categoryName+" is marked by user as uninteresting. Hiding \""+currentItemLink.textContent.trim()+"\"...");
                                currentItem.classList.add("Better_SweClockers_Uninteresting");
                            }
                        }
                    }
                }
            }
            log("Forum filter applied. Inserting filter controls...");
            var filterSettingsWrapperHTML = '\
            <ul title="Kryssa för de kategorier du vill filtrera bort" id="Better_SweClockers_FilterSettingsList">\
                <li><input type="checkbox" id="Better_SweClockers_FilterSettingsToggleAll" /><label for="Better_SweClockers_FilterSettingsToggleAll">Markera alla</label></li>';
            var cat, catID, catIDPrefixed, catName;
            for (var c = 0, len = categoriesArray.length; c < len; c++) {
                cat = categoriesArray[c];
                catID = cat[0];
                catIDPrefixed = category(catID);
                catName = cat[1];
                filterSettingsWrapperHTML += '<li><input type="checkbox" data-forumid="'+catID+'" id="Better_SweClockers.' + catIDPrefixed + '"' + inputBoxState(catID) + ' /><label for="Better_SweClockers.' + catIDPrefixed + '">' + catName + '</label></li>';
            }
            filterSettingsWrapperHTML += '</ul>';
            filterSettingsWrapper.innerHTML = filterSettingsWrapperHTML;
            filterSettingsWrapper.id = "Better_SweClockers_FilterSettings";
            plNyhetstips.appendChild(filterSettingsExpandLink);
            filterSettingsWrapper.BSC_insertAfter(plNyhetstips);
            eventListener("Better_SweClockers_FilterSettingsExpandLink", "click", function(event) { event.preventDefault(event); toggleShowFilterSettings(); });
            var filterSettingsList = byID("Better_SweClockers_FilterSettingsList");
            BSC.filterSettingsList = filterSettingsList;
            filterSettingsList.addEventListener("click", function(event) { filterSettingsClicked(event.target); }, false);
            setSelectAll(allCategoriesAreChecked());
        } else addException(new ElementNotFoundException("Could not add filter controls because #wdgtSideRecentThreads ul could not be found."));
    } else addException(new ElementNotFoundException("Could not add filter controls because #wdgtSideRecentThreads "+(!!plBody ? ".plNyhetstips" : ".plBody")+" could not be found."));
}

function fixAdHeight() {
    log("Fixing banner heights etc...");
    // Some of these rules are only temporary to prevent "element jumping",
    // and must be restored once the ads have loaded. This will be done by showSideBannersAgain().
    BSC.CSS += "\
        .top #siteHeader .banner {\
            height: "+BSC.bannerHeightTop+"px;\
            max-height: "+BSC.bannerHeightTop+"px;\
            overflow: hidden;\
        }\
        .pushListInternal {\
            margin-bottom: "+ (16 + BSC.bannerHeightSide) +"px;\
        }\
        .ad.adInsider {\
            height: "+BSC.bannerHeightSide+"px;\
            min-height: "+BSC.bannerHeightSide+"px;\
            max-height: "+BSC.bannerHeightSide+"px;\
            overflow: hidden;\
            display: none;\
        }\
        .adModule {\
            height: "+BSC.bannerHeightMid+"px;\
            overflow-y: hidden;\
        }\
    ";
    log("Fixed banner heights.");
}

function fixArticleImageHeight() {
    log("Fixing article image height...");
    BSC.CSS += "\
        .whiteHeader.articleHeader > .articleBBCode {\
            min-height: 440px;\
        }\
    ";
    log("Fixed article image height.");
}

function showSideBannersAgain() {
    // Restore the CSS that was temporarily set by fixAdHeight():
    BSC.addCSS(".pushListInternal { margin-bottom: 8px; }\
                .ad.adInsider     { display: block; }");
}

function hideThumbnailCarousel() {
    BSC.addCSS("#carousel { display: none; }");
}

function hideFacebookButtons() {
    BSC.CSS += "\
        .greyContentShare, .threadShare {\
            display: none;\
        }\
    ";
}

function insertPseudoConsole() {
    BSC.consoleContainer.id = "Better_SweClockers_Console";
    BSC.consoleContainer.appendChild(document.createElement("hr"));
    BSC.consoleContainer.appendChild(BSC.console);
    document.body.appendChild(BSC.consoleContainer);
}

function stopPerformingDOMOperations() {
    clearInterval(BSC.DOMTimer);
}

function assignDOMVariables() {
    BSC.TA = getTA();
    BSC.myName = getMyName();
    BSC.forumPosts = document.getElementsByClassName("forumPost");
}

function performDOMOperations() {
    log("Performing DOM operations...");
    // Assumes that BSC.DOMOperations is an array where each item is an array of two functions, i.e. [[b1, f1], [b2, f2], ... , [bn, fn]].
    // For each element in BSC.DOMOperations, its second function will run if the first returns true.
    var ops = BSC.DOMOperations;
    if (ops.length === 0) {
        stopPerformingDOMOperations();
        log("All DOM operations performed.");
        return;
    }
    var i = 0;
    while (i < ops.length) {
        if ((ops[i][0])()) {
            BSC.runDOMOperation(i);
        } else {
            i++;
        }
    }
}




//================================================================
// The Section of Supposedly Beautiful Code
//================================================================

// Runs on document-start (before page load):
function prepare() {
    try {
        log("***********************************************");
        log("******** Better SweClockers started! **********");
        log("***********************************************");
        loadSettings();
        loadState();
        if (optionIsTrue("fixAdHeight")) {
            fixAdHeight();
        }
        if (optionIsTrue("fixArticleImageHeight")) {
            fixArticleImageHeight();
        }
        handleDarkTheme();
        insertDarkThemeStyleElement();
        addMainCSS();
        insertStyleElement();
        setInitialTextareaHeight();
        if (optionIsTrue("highlightUnreadPMs")) {
            highlightUnreadPMs();
        }
        if (optionIsTrue("betterPaginationButtons")) {
            improvePaginationButtons();
        }
        if (optionIsTrue("enableFavoriteLinks")) {
            makeRoomForFavoriteLinks();
        }
        if (optionIsTrue("hideThumbnailCarousel")) {
            hideThumbnailCarousel();
        }
        if (optionIsTrue("hideFacebookButtons")) {
            hideFacebookButtons();
        }
        updateStyleElement();
    } catch(e) {
        logError("Fatal " + e.name + ": " + e.message);
        console.error(e);
    } finally {
        log("DOM-independent actions done. Proceeding to DOM operations...");
        run();
    }
}

function run() {
    try {
        if (BSC.getState("firstTimeUsingBSC") === true) {
            BSC.setState("firstTimeUsingBSC", false);
            if (confirm("Välkommen – du kör nu Better SweClockers! Vill du gå direkt till inställningsmenyn?")) {
                window.location.href = BSC.settingsURL;
            }
        }
        if (settingsFormRequested()) {
            log("Settings form requested. Inserting it...");
            BSC.addDOMOperation(canInsertOptionsForm, insertOptionsForm);
        } else {
            log("Checking which DOM operations to run...");

            if (BSC.pseudoConsole) {
                insertPseudoConsole();
            }

            if (optionIsTrue("enableFavoriteLinks")) {
                BSC.addDOMOperation(canInsertFavoriteLinks, insertFavoriteLinks);
            }

            if (optionIsTrue("darkThemeByBlargmode")) {
                BSC.addDOMOperation(canInsertDarkThemeByBlargmodeButton, insertDarkThemeByBlargmodeButton);
            }

            if (optionIsTrue("searchWithGoogle")) {
                BSC.addDOMOperation(canEnableSearchWithGoogle, enableSearchWithGoogle);
            }

            if (optionIsTrue("searchWithDuckDuckGo")) {
                BSC.addDOMOperation(canEnableSearchWithDuckDuckGo, enableSearchWithDuckDuckGo);
            }

            if (isOnSettingsPage()) {
                BSC.addDOMOperation(canInsertSettingsLinkLi, insertSettingsLinkLi);
            }

            if (optionIsTrue("advancedControlPanel") && ACPCanBeInserted()) {
                BSC.addDOMOperation(canInsertAdvancedControlPanel, insertAdvancedControlPanel);
            }

            if (optionIsTrue("preventAccidentalSignout")) {
                BSC.addDOMOperation(canPreventAccidentalSignout, preventAccidentalSignout);
            }

            if (optionIsTrue("removePageLinkAnchors")) {
                BSC.addDOMOperation(canRemovePageLinkAnchors, removePageLinkAnchors);
            }

            if (isInThread()) {
                BSC.addDOMOperation(canCheckForUpdate, checkForUpdate);
            }
        }

        // By using this timer, we can check every x ms which DOM operations can be performed, and execute those.
        // This is mostly useful on very slow connections, in which case the user would otherwise have to wait for the DOM to load completely.
        // On fast connections, onBeforeAds may fire before performDOMOperations() is called for the first time, which is not really desirable.
        // Therefore, the user must explicitly choose to run BSC in Slow Connection Mode if they wish to do so.
        if (optionIsTrue("DOMOperationsDuringPageLoad")) {
            log("DOM operations during page load active. Starting DOM checker...");
            BSC.DOMTimer = setInterval(performDOMOperations, BSC.DOMTimerInterval);
        } else {
            log("Done. Waiting for onBeforeAds or DOMContentLoaded event...");
        }
    } catch (e) {
        logError("Fatal " + e.name + ": " + e.message);
        console.error(e);
    } finally {
        var finishBecauseOBA = function() { finish("onBeforeAds"); };
        var finishBecauseDCL = function() { finish("DOMContentLoaded"); afterAds(); };
        document.addEventListener("onBeforeAds", finishBecauseOBA, false);
        document.addEventListener("DOMContentLoaded", finishBecauseDCL, false);
    }
}

// Runs on onBeforeAds (custom event fired by SweClockers before the ads start loading) or DOMContentLoaded (in case onBeforeAds doesn't fire):
function finish(eventName) {
    if (BSC.finishHasRun === true) {
        return;
    }
    BSC.finishHasRun = true;
    try {
        log("Detected "+eventName+" event.");
        performDOMOperations();
        stopPerformingDOMOperations();
        assignDOMVariables();
        TAFocusDetection();
        handleDarkThemeTimer();

        if (optionIsTrue("openImagesInNewTab")) {
            // Open images in new tab instead of enlarging them
            openImagesInNewTab();
        }

        if (isInAdvancedEditMode()) {
            // Expand color palette if it was expanded last time:
            showColorPalette(!!BSC.getState("showColorPalette"));
            insertButtonsBelowTA();
            if (optionIsTrue("addAEMUnloadConfirmation")) {
                addAEMUnloadConfirmation();
            }
        }

        if (optionIsTrue("removeLastNewline")) {
            // User wants one empty line instead of two in textarea
            removeLastNewline();
        }

        if (optionIsTrue("autofocusTA") && shouldAutofocusTA()) {
            // User wants autofocus on textarea
            autofocusTA();
        }

        if (optionIsTrue("removeMobileSiteDisclaimer")) {
            // User wants to remove "Skickades från m.sweclockers.com"
            removeMobileSiteDisclaimer();
        }

        if (optionIsTrue("autofocusPMSubject") && isInNewPMMode()) {
            autofocusPMSubject();
        }

        if (optionIsTrue("enableFilter") && !isOnBSCSettingsPage()) {
            // User wants to enable filter for "Nytt i forumet"
            enableFilterControls();
        }

        if (isInThread()) {
            if (optionIsTrue("addPMLinks")) {
                addPMLinks();
            }

            if (optionIsTrue("highlightOwnPosts")) {
                highlightOwnPosts();
            }

            if (optionIsTrue("quoteSignatureButtons")) {
                addQuoteSignatureButtons();
            }
        }

        if (optionIsTrue("dogeInQuoteFix")) {
            // User wants to show Doge smileys in quotes
            dogeInQuoteFix();
        }

        updateStyleElement();
        checkForBetterSweClockersAnchor();
    } catch (e) {
        logError("Fatal " + e.name + ": " + e.message);
        console.error(e);
    } finally {
        logWarnings();
        logExceptions();
        log("***********************************************");
        log("******** Better SweClockers finished! *********");
        log("***********************************************");
        document.dispatchEvent(new Event("Better_SweClockers_finished"));
    }
}

function afterAds() {
    if (optionIsTrue("fixAdHeight")) {
        showSideBannersAgain();
    }
}

// We will not run BSC at all on HTTPS:
if (!isOnHTTPS()) {
    prepare();
} else {
    // Except for fixAdHeight(), which is too important to skip:
    fixAdHeight();
    insertStyleElement();
}

// Public API (not accessible if BSC is sandboxed by the userscripts engine):
return {
    getVersion:            function()  { return BSC.version; },
    getUsername:           function()  { return BSC.myName; },
    getSetting:            function(s) { return BSC.settings[s]; },
    getDocumentationURL:   function()  { return BSC.documentationURL; },
    getSettingsURL:        function()  { return BSC.settingsURL; },
    getDarkThemeCacheDate: function()  { return BSC.darkThemeCacheDate; }
};

// Wrapper IIFE end:
})();

