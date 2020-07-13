export function supportsExecCommand(userAgent: string): boolean {
    /*
    Hard to know for sure, but Gecko browsers don't support it as of 2020-07-18 (Firefox 78).
    https://bugzilla.mozilla.org/show_bug.cgi?id=1220696
    "Why not use feature detection?" Because document.execCommand can't be feature-detected:

        "Note: Only returns true if part of a user interaction. Don't try using the return value to verify browser support before calling a command."

    https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Return_value
    */

    // Make sure the preference labels referencing this function match the implementation.
    return !/Gecko\/\d{8}/.test(userAgent);
    // Many browsers have "Gecko" in their user agent strings, but I believe only Gecko ones have the eight-digit suffix.
}
