import {to, span, toggle, div, on, boolean, when, falseTo, inputText} from "../trio.js";

export function expander(model, enabled = boolean(true)) {
    return span().display('inline-block').cursor('pointer')
        .transition('transform .2s ease-in-out').transform(model.map(to('rotate(90deg)')))
        .color(enabled.map(falseTo('silver')))
        .add('\u25B6')
        .onClick(when(enabled, toggle(model)))
}

export function hbar(valueModel) {
    return div('horizontal-bar').position('absolute').bottom(0).left(0).height(100, '%').width(valueModel, '%')
}

export function vbar(valueModel) {
    return div('vertical-bar').position('absolute').bottom(0).left(0).width(100, '%').height(valueModel, '%')
}

export function progressBar(done, total) {
    return div('progress-bar').backgroundSize(on(done, total).apply((d, t) => ((t > 0) ? 100 * d / t : 0)), '%')
}

export function action(command) {
    return a().setClass('action').onClick(command)
}

export function handle() {
    return div('handle').onDrag(event => {
        let dx = event.pageX - event.target.pageX
        let dy = event.pageY - event.target.pageY
    }).onDragend(event => {})
}

export function inputTextAutocomplete(name, suggest) {
    return inputText(name).onInput(event => {})
}
