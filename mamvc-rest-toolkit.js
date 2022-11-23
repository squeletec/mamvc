import {to, span, toggle, div, on, boolean, when, falseTo, XNode, a} from "./mamvc.js";

export * from "./mamvc-rtk-data-table.js"

export function expander(model, enabled = boolean(true)) {
    return span().display('inline-block').cursor('pointer')
        .transition('transform .2s ease-in-out').transform(model.map(to('rotate(90deg)')))
        .color(enabled.map(falseTo('silver')))
        .add('\u25B6')
        .onClick(when(enabled, toggle(model)))
}

export function hbar(valueModel, className = 'progress') {
    return div(className).position('absolute').bottom(0).left(0).height(100, '%').width(valueModel, '%')
}

export function vbar(valueModel, className = 'progress') {
    return div(className).position('absolute').bottom(0).left(0).width(100, '%').height(valueModel, '%')
}

export function progressBar(done, total, className = 'progress-bar') {
    return div(className).backgroundSize(on(done, total).apply((d, t) => ((t > 0) ? 100 * d / t : 0)), '%')
}

function overlay() {
    return div().position('fixed').top(0).left(0).bottom(0).right(0).backgroundColor('rgba(0,0,0,0.5)').textAlign('center').verticalAlign()
}

class Dialog extends XNode {
    constructor(title) {
        let content = div()
        let titleBar = div().add(a().float('right').add('x').onClick(() => this.remove()), title)
        let dialog = div().display('inline-block').add(titleBar, content)
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
