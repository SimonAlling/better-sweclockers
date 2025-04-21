import * as Storage from "ts-storage";

import * as CONFIG from "~src/config";
import * as T from "~src/text";

export default (e: {
    saveButton: HTMLElement,
    previewButton: HTMLElement,
}) => {
    const saveButton = e.saveButton as HTMLButtonElement; // Selector should ensure this.
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const label = document.createElement("label");
    label.classList.add(CONFIG.CLASS.checkbox);
    label.title = T.general.draft_mode_toggle_tooltip;
    label.appendChild(checkbox);
    const text = document.createTextNode(T.general.draft_mode_toggle_label);
    label.appendChild(text);
    const response = Storage.get_session(CONFIG.KEY.draft_mode, false);
    if (![ Storage.Status.ABSENT, Storage.Status.OK ].includes(response.status)) {
        return `Could not read draft mode state (error type: ${response.status}).`;
    }
    const draftModeEnabled = response.value;
    checkbox.checked = draftModeEnabled;
    checkbox.addEventListener("change", toggle(checkbox, saveButton));
    (e.previewButton).insertAdjacentElement("afterend", label);
    apply(draftModeEnabled, saveButton);
};

function toggle(checkbox: HTMLInputElement, saveButton: HTMLButtonElement): (_: Event) => void {
    return _ => {
        const draftModeEnabled = checkbox.checked;
        Storage.set_session(CONFIG.KEY.draft_mode, draftModeEnabled);
        apply(draftModeEnabled, saveButton);
    };
}

function apply(draftModeEnabled: boolean, saveButton: HTMLButtonElement): void {
    saveButton.disabled = draftModeEnabled;
    saveButton.title = draftModeEnabled ? T.general.draft_mode_enabled_tooltip : "";
}
