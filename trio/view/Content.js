import {isObservable} from "../model/Observable";

export class Content {

    #node

    constructor(node) {
        this.#node = node
    }

    get() {
        return this.#node
    }

    remove() {
        if(this.#node.parentNode) this.#node.parentNode.removeChild(this.#node)
        return this
    }

    replace(replacement) {
        if(this.#node.parentNode) this.#node.parentNode.replaceChild(node(replacement), this.#node)
        return this
    }

}


export function node(value) {
    if(value instanceof Content) return value.get()
    if(value instanceof Node) return value
    if(isObservable(value)) return observableTextNode(value)
    return document.createTextNode(value)
}

function observableTextNode(observable) {
    let n = document.createTextNode(observable.get())
    observable.observe(value => n.nodeValue = value, false)
    return n
}

export function text(value = '') {
    return content(isObservable(value) ? observableTextNode(value) : document.createTextNode(value))
}

export function content(node) {
    return new Content(node)
}
