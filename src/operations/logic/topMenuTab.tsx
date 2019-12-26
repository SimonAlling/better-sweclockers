import { h } from "preact";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import { fromMaybeUndefined } from "~src/utilities";

export function tab(x: Readonly<{
    title: string,
    id: string,
    classes?: readonly string[],
    link: Readonly<{
        href?: string,
        openInNewTab?: boolean,
        onClick?: () => void,
    }>,
}>): JSX.Element {
    return (
        <li
            title={x.title}
            id={x.id}
            class={[SITE.CLASS.menuItem, CONFIG.CLASS.iconTab].concat(fromMaybeUndefined([], x.classes)).join(" ")}
        >
            <a
                href={fromMaybeUndefined("javascript:void(0)", x.link.href)}
                target={x.link.openInNewTab ? "_blank" : undefined}
                onClick={x.link.onClick}
            >
                <span></span>
            </a>
        </li>
    );
}
