import {Model} from "./Model.js";
import {Observable} from "./Observable.js";

export class StateModel extends Model {

    #value

    #observers

    constructor(initialValue) {
        super();
        this.#value = initialValue
        this.#observers = []
    }

    get() {
        return this.#value;
    }

    observe(observer, invokeNow = true) {
        this.#observers.push(observer)
        if(invokeNow)
            observer(this.#value)
        return this
    }

    trigger() {
        this.#observers.forEach(observer => observer(this.#value))
        return this
    }

    set(newValue) {
        if(this.#value === newValue)
            return this
        this.#value = newValue
        return this.trigger()
    }

}


export function state(value = null) {
    return value instanceof Observable ? value : new StateModel(value)
}
