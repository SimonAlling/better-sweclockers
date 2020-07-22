# Built-In Editing Tools

This document describes some of the inner workings of SweClockers' built-in editing tools.

## `insertAtCaret`

Text is inserted in the textarea by `Tanuki.Templates.Textarea.Helpers.insertAtCaret`, shown in this excerpt from `combine.min.js`, pretty-printed in Chrome and with some renamed variables for readability:

```javascript
d.insertAtCaret = function(textarea, before, after) {
    textarea.focus();
    var c = textarea.scrollTop;
    if (after === undefined) {
        after = ""
    }
    if (document.selection) {
        // I think this is for legacy compatibility or something. /Alling
        sel = document.selection.createRange();
        sel.text = before + sel.text + after;
        textarea.focus()
    } else {
        if (textarea.selectionStart || textarea.selectionStart === 0) {
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + before + textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) + after + textarea.value.substring(end, textarea.value.length);
            textarea.selectionStart = start + before.length + end - start;
            textarea.selectionEnd = textarea.selectionStart;
            textarea.focus();
            textarea.scrollTop = c
        } else {
            textarea.value += before + after;
            textarea.scrollTop = c
        }
    }c
}
;
```

## `setSelection`

Text can also be inserted by `Tanuki.Templates.Textarea.Helpers.setSelection`, shown below – again pretty-printed and with renamed variables:

```javascript
d.setSelection = function(textarea, replacement) {
    var range = d.getSelectionRange(textarea);
    textarea.focus();
    if (document.selection) {
        // I think this is for legacy compatibility or something. /Alling
        sel = document.selection.createRange();
        sel.text = replacement;
        sel.collapse()
    } else {
        if (textarea.selectionStart || textarea.selectionStart === 0) {
            var start = textareac.selectionStart;
            var end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end, textarea.value.length);
            textarea.selectionStart = start + replacement.length + end - start;
            textarea.selectionEnd = textarea.selectionStart
        } else {
            textarea.value += replacement
        }
    }
    d.setSelectionRange(textarea, range[0], range[0] + replacement.length)
}
;
```

## The URL/hyperlink button

The URL button seems to be a bit of a special case:

```javascript
Main.Forms.Toolbar.Buttons = (function(e) {
    var d = Main.Forms.Toolbar;
    function f(a, b) {
        d.LabelButton.call(this);
        this.setTitle(a);
        this.addClass(b);
        this.setCallback(Taiga.Fn.proxy(this.insertTemplate, this))
    }
    Taiga.Fn.inherit(f, d.LabelButton);
    (function(a) {
        a.insertTemplate = function() {
            var b = this.getSelection();
            var o = b.split("\n");
            if (b.length > 0 && o.length > 1) {
                var m = [];
                for (var i in o) {
                    var p = Taiga.Strings.trim(o[i]);
                    var p = Taiga.Strings.sprintf("[url]%s[/url]", p);
                    m.push(p)
                }
                this.setSelection(m.join("\n"));
                this.clearSelection()
            } else {
                var n = "";
                var c = "";
                if (b.match(/^([a-z]+:\/\/|www\.)/i)) {
                    n = b
                } else {
                    c = b
                }
                n = prompt("Skriv adressen (URL)", n);
                c = prompt("Beskriv länken (valfritt)", c);
                if (n === null || n.length < 1) {
                    return
                } else {
                    if (c === null || c.length < 1) {
                        c = n
                    }
                    this.setSelection("[url=" + n + "]" + c + "[/url]", "");
                    this.clearSelection()
                }
            }
        }
    }
    )(f.prototype);
    e.HyperlinkButton = f;
    return e
}
)(Main.Forms.Toolbar.Buttons || {});
```
