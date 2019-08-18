import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { h } from "preact";
import { fromMaybeUndefined } from "src/utilities";

export function tab(x: Readonly<{
    title: string,
    id: string,
    classes?: ReadonlyArray<string>,
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
            class={[SITE.CLASS.menuItem].concat(fromMaybeUndefined([], x.classes)).join(" ")}
        >
            <a
                href={fromMaybeUndefined("javascript:void(0)", x.link.href)}
                target={x.link.openInNewTab ? "_blank" : undefined}
                onClick={x.link.onClick}
            >
                <span style="display:inline-block;"></span>
            </a>
        </li>
    );
}
