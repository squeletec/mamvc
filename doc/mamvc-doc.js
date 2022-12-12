import {div, h1, h2, h3, a, pre, XNode} from "../trio.js";

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
        a().name(f.name),
        h3().add(a('#', f.name).setClass('self-link').add('🔗'), f.toString().split("{")[0].substring('function'.length))
    )
}

export function description(...values) {
    return div('description').add(...values)
}

export function parameter(name, ...description) {
    return div('parameter').add(
        div('name').add(name),
        div('description').add(...description)
    )
}

export function example(code) {
    return pre().setClass('example')
}
