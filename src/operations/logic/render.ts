import { JSX, render } from "preact";
import { isString } from "ts-type-guards";
import { log } from "userscripter";

import { truncate } from "~src/utilities";

/**
 * A function assumed to insert `placeholder` in `parent`.
 */
type InsertIn<Parent extends Element> = (
    /*
    This type has an object parameter instead of two plain parameters because otherwise it would be easy to accidentally pass something that's not an actual insertion function.
    In particular, one could accidentally pass `insertBefore` instead of `insertBefore(reference)` and get no type error.
    It's still possible to pass something stupid like `console.log` or `() => {}`, but that's hard to prevent and not very likely anyway.
    We could have parameterized over the type of `placeholder` and required that the return type be that type, but then one might be tempted to pass something like `({ placeholder }) => placeholder`.
    Using `void` makes it obvious that the function should have at least some side effect.
    */
    (_: { parent: Parent, placeholder: Text }) => void
)

type Insert = InsertIn<Element>

/**
 * Renders a virtual node at a specific position in a parent element.
 * @param parent The element to render inside.
 * @param insert A function describing where in the parent element the rendered element should be inserted. It will be given `{ parent, placeholder }` and will be assumed to actually insert `placeholder` directly under `parent`.
 * @param vnode The virtual node to render.
 */
export function renderIn<Parent extends Element>(
    parent: Parent,
    insert: InsertIn<Parent>,
    vnode: JSX.Element,
): void {
    const placeholder = document.createTextNode(""); // Doesn't matter what type of node we use here, because it will be replaced by the rendered element.
    insert({ parent, placeholder });
    if (placeholder.parentNode === parent) { // "If the optional replaceNode parameter is provided, it must be a child of containerNode." https://preactjs.com/guide/v10/api-reference/
        render(vnode, parent, placeholder);
    } else {
        const nodeType = isString(vnode.type) ? ` "${vnode.type}"` : ""; // Cluttered message if it's not a string.
        const nodeProps = truncate(200, JSON.stringify(vnode.props)); // Cluttered message if it's too long.
        log.error(`Placeholder for virtual${nodeType} node with properties\n\n    ${nodeProps}\n\nwas not inserted directly under the intended parent element.`);
    }
}

export const insertAtTheEnd: Insert = (
    ({ parent, placeholder }) => {
        parent.append(placeholder);
    }
);

export const insertAtTheBeginning: Insert = (
    ({ parent, placeholder }) => {
        parent.prepend(placeholder);
    }
);

export const insertBefore: (reference: Node) => Insert = (
    reference => ({ parent, placeholder }) => {
        parent.insertBefore(placeholder, reference);
    }
);

export const insertAfter: (reference: Node) => Insert = (
    reference => ({ parent, placeholder }) => {
        parent.insertBefore(placeholder, reference.nextSibling); // If reference.nextSibling is null, reference is the last child and placeholder will be inserted after it.
    }
);
