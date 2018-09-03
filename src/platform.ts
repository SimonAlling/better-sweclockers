export enum OS {
    Android = "Android",
    iOS = "iOS",
    Linux = "Linux",
    Mac = "Mac",
    UNIX = "UNIX",
    Windows = "Windows",
}

const ID = {
    ANDROID: "Android",
    LINUX: "Linux",
    UNIX: "X11",
    IOS: [ "iPhone", "iPad", "iPod" ],
    MAC: [ "Macintosh", "MacIntel", "MacPPC", "Mac68K" ],
    WINDOWS: [ "Win32", "Win64", "Windows", "WinCE" ],
};

export const CURRENT_PLATFORM: OS | undefined = (() => {
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    if (ID.IOS.includes(platform)) return OS.iOS;
    if (ID.MAC.includes(platform)) return OS.Mac;
    if (ID.WINDOWS.includes(platform)) return OS.Windows;
    if (userAgent.includes(ID.ANDROID)) return OS.Android;
    if (platform.includes(ID.LINUX)) return OS.Linux;
    if (userAgent.includes(ID.UNIX)) return OS.UNIX;
})();
