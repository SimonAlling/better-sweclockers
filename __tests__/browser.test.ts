import { check } from "jest-function";

import * as browser from "../src/browser";

import { sorted } from "./utilities";

// What Is My Browser (WIMB) Database:
// https://developers.whatismybrowser.com/useragents/explore/software_type_specific/web-browser

describe("Android detection", () => {
    it("is sound", () => {
        const NON_ANDROID_USER_AGENT_STRINGS = [
            `Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36`, // Windows, Chrome 60 (from WIMB)
            `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36`, // Ubuntu 20.04, Chrome 83
            `Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0`, // Ubuntu, Firefox 24 (from WIMB)
            `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0`, // Ubuntu 20.04, Firefox 78
            `Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1`, // iPad Pro, iOS 11, Safari (from Chrome developer tools)
            `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`, // iPhone X, iOS 13, Safari (from Chrome developer tools)
        ] as const;
        // Enforce sorted order in source code:
        expect(NON_ANDROID_USER_AGENT_STRINGS).toEqual(sorted(NON_ANDROID_USER_AGENT_STRINGS));
        const soundnessSpecification = NON_ANDROID_USER_AGENT_STRINGS.map(x => ({ in: x, out: false }));
        check(browser.isAndroid).against(soundnessSpecification);
    });

    it("is complete", () => {
        const ANDROID_USER_AGENT_STRINGS = [
            `Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0`, // Galaxy S9, Firefox
            `Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36`, // Galaxy S9, Chrome
            `Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Mobile Safari/537.36`, // Galaxy S5 in Chrome developer tools
            `Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Mobile Safari/537.36`, // Moto G4 in Chrome developer tools
            `Mozilla/5.0 (Linux; Android 6.0.1; RedMi Note 5 Build/RB3N5C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36`, // WIMB
            `Mozilla/5.0 (Linux; Android 7.0; F5321) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36`, // Xperia X Compact, Chrome
            `Mozilla/5.0 (Linux; Android 7.1.2; AFTMM Build/NS6265; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36`, // WIMB
        ] as const;
        // Enforce sorted order in source code:
        expect(ANDROID_USER_AGENT_STRINGS).toEqual(sorted(ANDROID_USER_AGENT_STRINGS));
        const completenessSpecification = ANDROID_USER_AGENT_STRINGS.map(x => ({ in: x, out: true }));
        check(browser.isAndroid).against(completenessSpecification);
    });
});
