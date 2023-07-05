import {Content} from "./Content.js";
import {isObservable} from "../model/Observable.js";

export class TextNodeBuilder extends Content {
    constructor(text) {
        super(document.createTextNode(text));
    }

    setValue(newValue) {
        this.get().nodeValue = newValue
    }
}

function observableTextContent(observable) {
    let c = new TextNodeBuilder(observable.get())
    observable.observe(v => c.setValue(v))
    return c
}

export function textNode(value = '') {
    return isObservable(value) ? observableTextContent(value) : new TextNodeBuilder(value)
}
