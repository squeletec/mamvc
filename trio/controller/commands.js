import {isObservable} from "../model/Observable.js";

export function set(model, value) {
    return isObservable(value) ? () => model.set(value.get()) : () => model.set(value)
}

export function toggle(model) {
    return () => model.set(!model.get())
}

export function when(condition, command) {
    return () => condition.get() && command()
}

export function trigger(model) {
    return () => model.trigger()
}

export function increment(model, by = 1) {
    return () => model.set(model.get() + by)
}

export function decrement(model, by = 1) {
    return increment(model, -by)
}

export function invert(model) {
    return model.set(-model.get())
}

export function remove(content) {
    return () => content.remove()
}

export function clear(content) {
    return () => content.clear()
}

export function show(dialog) {
    return () => dialog.get().showModal()
}

export function close(dialog) {
    return () => dialog.get().close()
}
