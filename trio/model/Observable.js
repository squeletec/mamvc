import {PropertyModel} from "./PropertyModel.js";

export class Observable {

    constructor() {
        this.$ = new Proxy({}, {
            get: (target, name) => target.hasOwnProperty(name) ? target[name] : target[name] = new PropertyModel(this, name)
        })
    }

    /**
     * Get current value of the observable
     * @return current value
     */
    get() {
        throw new Error("Undeclared method Observable.get()")
    }

    /**
     * Observe changes of this Observable with provided observer function.
     * @param observer
     * @param invokeNow
     * @return this
     */
    observe(observer, invokeNow = true) {
        throw new Error("Undeclared method Observable.observe(observer, invokeNow = true)")
    }

    /**
     * Trigger all observers with current value.
     * @return this
     */
    trigger() {
        throw new Error("Undeclared method trigger()")
    }

    name() {
        return ""
    }

}


export function isObservable(object) {
    return object instanceof Observable
}
