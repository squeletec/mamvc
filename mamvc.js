class State {
    constructor(value = null) {
        this.value = value
        this.observers = []
    }

    set(value) {
        this.value = value
        for(let i = 0; i < this.observers.length; i++)
            this.observers[i](this.value)
        return this
    }

    get() {
        return this.value
    }

    map(mappingFunction) {
        let result = new State()
        this.onChange(value => result.set(mappingFunction(value)))
        return result
    }

    onChange(observer, trigger = true) {
        this.observers.push(observer)
        if(trigger) observer(this.value)
        return this
    }
}
