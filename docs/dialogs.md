In Chrome, at least version 83 on Ubuntu 20.04, pressing Esc (instead of clicking Cancel) when a `confirm`/`alert`/`prompt` dialog is being shown causes all text input elements, including the textarea, to become disabled/grayed out until the page/viewport/document is unfocused (e.g. by focusing the address bar, Alt-tabbing or triggering another dialog).
Not even reloading the page enables them again (although it may seem like it if `prevent_accidental_unload` is enabled, since its popup takes focus from the page).

## Minimal example

```html
<!DOCTYPE html>

<title>Dialogs</title>

<textarea></textarea>

<a href="javascript:void(0)" onclick="alert('A');">Click here</a>
```

The problem seems to lie with the dialogs themselves and not how they are triggered:

* `<a>` or `<input type="button">` doesn't matter.
* `onclick` or `addEventListener` doesn't matter.
* `javascript:void(0)` or `#` doesn't matter.
