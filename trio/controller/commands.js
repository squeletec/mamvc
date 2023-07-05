
export function set(model, value) {
    return isObservable(value) ? () => model.set(value.get()) : () => model.set(value)
}

export function toggle(model) {
    return () => model.set(!model.get())
}
