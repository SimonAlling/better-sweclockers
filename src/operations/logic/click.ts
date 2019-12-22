import { BUTTON_CLICK_EVENT } from "~src/operations/prevent-accidental-unload";

export function clickOn(element: HTMLElement): void {
    // Prevent accidental unload listens for these events:
    element.dispatchEvent(new Event(BUTTON_CLICK_EVENT));
    // click() is necessary for the button to be triggered; dispatching
    // mousedown and then mouseup is not.
    element.click();
}
