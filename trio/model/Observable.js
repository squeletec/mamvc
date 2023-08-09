/**
 * Observable represents a value, which notifies observers about its changes.
 */
export class Observable {

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

    /**
     * Name of the observer bean.
     * @return {string}
     */
    getName() {
        return ""
    }

    routeTo(model, invokeNow) {
        this.observe(value => model.set(value), invokeNow)
        return this
    }

}


export function isObservable(object) {
    return object instanceof Observable
}
