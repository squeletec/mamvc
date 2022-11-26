import {div, h1, h2, h3, pre, XNode} from "../mamvc.js";

export function doc(name) {
    return div('document').add(h1().add(name))
}

export function section(name) {
    return div('section').add(
        h2().add(name)
    )
}

export function method(f) {
    return div('method').add(
        h3().add(f.toString().split("{")[0])
    )
}

export function description(...values) {
    return div('description').add(...values)
}

export function parameter(name, ...description) {
    return div('parameter').add()
}

export function example(code) {
    return pre().setClass('example')
}
