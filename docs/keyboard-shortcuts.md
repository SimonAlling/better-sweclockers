# Keyboard Shortcuts

SweClockers' built-in keyboard shortcuts for bold, italic and underline are implemented as `keydown` events on the textarea.
The event handlers can be seen in this excerpt from `combine.min.js`, pretty-printed in Chrome and with some renamed variables for readability:

```javascript
Main.Forms.Toolbar = (function(d) {
    function c() {
        Laika.Controls.TemplateControl.call(this);
        this._groups = [];
        this.registerProperty(new Tanuki.Templates.ClassListProperty(["toolbar"]))
    }
    Taiga.Fn.inherit(c, Laika.Controls.TemplateControl);
    (function(a) {
        // ...
        a.onKeydownHandler = function (event) {
            if (event.ctrlKey && !event.altKey) {
                switch (event.keyCode) {
                    case 66:
                        this.insertAtCaret("[b]", "[/b]");
                        Laika.DOM.Event.preventDefault(event);
                        Laika.DOM.Event.stopPropagation(event);
                        break;
                    case 73:
                        this.insertAtCaret("[i]", "[/i]");
                        Laika.DOM.Event.preventDefault(event);
                        Laika.DOM.Event.stopPropagation(event);
                        break;
                    case 85:
                        this.insertAtCaret("[u]", "[/u]");
                        Laika.DOM.Event.preventDefault(event);
                        Laika.DOM.Event.stopPropagation(event);
                        break
                }
            }
        };
    )(c.prototype);
    d.Toolbar = c;
    return d
}
)(Main.Forms.Toolbar || {})
;
```
