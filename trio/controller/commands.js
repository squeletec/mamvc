
export function set(model, value) {
    return () => model.set(value)
}
