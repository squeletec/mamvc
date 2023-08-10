import {boolean, span, falseTo, to, toggle, when} from "../../trio/mvc.js";

export function expander(model, enabled = boolean(true)) {
    return span()
        .display('inline-block')
        .cursor('pointer')
        .transition('transform .2s ease-in-out')
        .transform(model.map(to('rotate(90deg)')))
        .color(enabled.map(falseTo('silver')))
        .add('\u25B6')
        .onClick(when(enabled, toggle(model)))
}
