import {Model} from "./Model.js";

export class StateTransformer extends Model {

    #target

    #transform

    constructor(target, transform) {
        super();
        this.#target = target
        this.#transform = transform
    }

    get() {
        this.#target.get();
    }

    observe(observer, invokeNow = true) {
        this.#target.onChange(observer, invokeNow)
        return this
    }

    trigger() {
        this.#target.trigger()
        return this
    }

    set(newValue) {
        this.#target.set(this.#transform(newValue))
        return this
    }

}

Model.prototype.apply = function (inputTransformer) {
    return new StateTransformer(this, inputTransformer)
}
