import { r } from "src/utilities";

// We want to match elements like
//   <li data-thread="{"threadid":1234567,"forumid":42}">
// based on the forumid property. To be sure that we match it properly (without
// false positives) regardless of where in the string it is, we need two rules:
// 1. ..."forumid":42,
// 2. ..."forumid":42}

export default function(uninterestingIDs: ReadonlyArray<number>): string {
    return uninterestingIDs.map(cssForId).join("");
}

function cssForId(id: number): string {
    return (
r`
.plItemList li[data-thread*="\"forumid\":${id},"],
.plItemList li[data-thread*="\"forumid\":${id}\}"] {
    opacity: 0.2;
}
`
    )
};
