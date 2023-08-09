import {Observable} from "./Observable.js";

export class ObservableTransformer extends Observable {

    constructor(parent, transform) {
        super();
        this._parent = parent
        this._transform = transform
    }

    get() {
        return this._transform(this._parent.get());
    }

    observe(observer, invokeNow = true) {
        this._parent.observe(value => observer(this._transform(value)), invokeNow)
        return this
    }

    trigger() {
        this._parent.trigger();
        return this
    }
}

Observable.prototype.map = function(transformer) {
    return new ObservableTransformer(this, transformer)
}
