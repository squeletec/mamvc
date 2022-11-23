import {to, span, toggle, div, on, boolean, when, falseTo, XNode, a} from "./mamvc.js";


class Dialog extends XNode {
    constructor(title) {
        let content = div('dialog-content')
        let titleBar = div('dialog-title-bar').add(a().setClass('dialog-close-button').float('right').add('x').onClick(() => this.remove()), title)
        let dialog = div('dialog').display('inline-block').add(titleBar, content)
        super(overlay().add(dialog).get());
        this.content = content
        this.titleBar = titleBar
        this.dialog = dialog
    }

    add(...elements) {
        this.content.add(...elements)
        return this
    }

    dialogClass(...value) {
        this.dialog.setClass(...value)
        return this
    }

    titleBarClass(...value) {
        this.titleBar.setClass(...value)
        return this
    }

    contentClass(...value) {
        this.content.setClass(...value)
        return this
    }
}

export function dialog(title) {
    return new Dialog(title)
}
