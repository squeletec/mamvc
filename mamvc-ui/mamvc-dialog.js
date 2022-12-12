import {div, XNode, a} from "../trio.js";

function overlay() {
    return div().position('fixed').top(0).left(0).bottom(0).right(0).backgroundColor('rgba(0,0,0,0.5)').textAlign('center').verticalAlign()
}

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
