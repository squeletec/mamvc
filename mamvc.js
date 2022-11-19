/*
 * Class state represents, observable state.
 */
class State {

    constructor(value = null) {
        this.value = value
        this.observers = []
    }

    set(value) {
        this.value = value
        this.observers.forEach(observer => observer(this.value))
        return this
    }

    update(value) {
        return value === this.value ? this : this.set(value)
    }

    get() {
        return this.value
    }

    map(mappingFunction) {
        let result = new State()
        this.onChange(value => result.set(mappingFunction(value)))
        return result
    }

    and(state) {
        return on(this, state).apply((a, b) => a && b)
    }

    or(state) {
        return on(this, state).apply((a, b) => a || b)
    }

    onChange(observer, trigger = true) {
        this.observers.push(observer)
        if(trigger) observer(this.value)
        return this
    }

}

function state(value = null) {
    return new State(value)
}

function boolean(value = false) {
    return state(value)
}

function on(...parameters) {
    return {apply(f) {
        let result = state()
        let args = parameters.map(p => p instanceof State ? p.onChange(value => {
            args[i] = value
            result.set(f(...args))
        }, false).get() : p)
        return result.set(f(...args))
    }}
}

function concat(...parameters) {
    return on(...parameters).apply(...p => p.join(''))
}

function fill(template, ...parameters) {
    return on(...parameters).apply(...p => p)
}

