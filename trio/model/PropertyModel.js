import {Model} from "./Model.js";

export class PropertyModel extends Model {

    constructor(parent, property) {
        super();
        this._parent = parent
        this._property = property
    }

    get() {
        return this._parent.get()?.[this._property]
    }

    observe(observer, invokeNow = true) {
        this._parent.onChange(value => observer(value?.[this._property]), invokeNow);
        return this
    }

    trigger() {
        this._parent.trigger();
        return this
    }

    set(newValue) {
        if(this.get() === newValue)
            return this
        this._parent.get()[this._property] = newValue
        return this.trigger()
    }

    getName() {
        return this._property;
    }

}
