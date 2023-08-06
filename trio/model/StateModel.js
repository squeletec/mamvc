import {Model} from "./Model.js";
import {Observable} from "./Observable.js";

export class StateModel extends Model {

    constructor(initialValue) {
        super();
        this._value = initialValue
        this._observers = []
    }

    get() {
        return this._value;
    }

    observe(observer, invokeNow = true) {
        this._observers.push(observer)
        if(invokeNow)
            observer(this._value)
        return this
    }

    trigger() {
        this._observers.forEach(observer => observer(this._value))
        return this
    }

    set(newValue) {
        if(this._value === newValue)
            return this
        this._value = newValue
        return this.trigger()
    }

}


export function state(value = null) {
    return value instanceof Observable ? value : new StateModel(value)
}
