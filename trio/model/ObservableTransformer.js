import {Observable} from "./Observable.js";

export class ObservableTransformer extends Observable {
    #parent
    #transform

    constructor(parent, transform) {
        super();
        this.#parent = parent
        this.#transform = transform
    }

    get() {
        return this.#transform(this.#parent.get());
    }

    observe(observer, invokeNow = true) {
        this.#parent.onChange(value => this.#transform(value), invokeNow)
        return this
    }

    trigger() {
        this.#parent.trigger();
        return this
    }
}

Observable.prototype.map = function(transformer) {
    return new ObservableTransformer(this, transformer)
}
