import {Model} from "./Model.js";

export class PropertyModel extends Model {

    #parent

    #property

    constructor(parent, property) {
        super();
        this.#parent = parent
        this.#property = property
    }

    get() {
        return this.#parent.get()?.[this.#property]
    }

    observe(observer, invokeNow = true) {
        this.#parent.onChange(value => observer(value?.[this.#property]), invokeNow);
        return this
    }

    trigger() {
        this.#parent.trigger();
        return this
    }

    set(newValue) {
        if(this.get() === newValue)
            return this
        this.#parent.get()[this.#property] = newValue
        return this.trigger()
    }

    name() {
        return this.#property;
    }

}
