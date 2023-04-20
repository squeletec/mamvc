/*
BSD 2-Clause License

Copyright (c) 2022, c0stra
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Interface like class Observable
 */
class Observable {

    onChange(observer, triggerNow = true, push = true) {}

    set(value) {}

    get() {}

    trigger() {}

}

function getProperty(object, property) {
    return object === null ? null : object === undefined ? undefined : object[property]
}

class PropertyState extends Observable {
    #parent;
    #property;

    constructor(parent, property) {
        super();
        this.#parent = parent
        this.#property = property
    }

    onChange(observer, triggerNow = true, push = true) {
        this.#parent.onChange(value => observer(getProperty(value, this.#property), triggerNow, push))
        return this
    }

    set(value) {
        this.#parent.get()[this.#property] = value
        return this.trigger()
    }

    get() {
        return getProperty(this.#parent.get(), this.#property);
    }

    trigger() {
        this.#parent.trigger();
        return this
    }
}


/**
 * Class state represents, observable state.
 */
class State extends Observable {
    #value;
    #observers;

    constructor(value = null) {
        super();
        this.#value = value
        this.#observers = []
    }

    trigger() {
        this.#observers.forEach(observer => observer(this.#value))
        return this
    }

    set(value) {
        this.#value = value
        return this.trigger()
    }

    update(value) {
        return value === this.#value ? this : this.set(value)
    }

    get() {
        return this.#value
    }

    map(mappingFunction, result = new State()) {
        this.onChange(value => result.set(mappingFunction(value)))
        return result
    }

    hierarchy(structure = this.#value) {
        if('object' === typeof structure) {
            if(Array.isArray(structure))
                this.length = this.map(_ => (_ === undefined || _ === null) ? _ : _.length)
            else
                for(let property in structure)
                    if(structure.hasOwnProperty(property))
                        this[property] = this.map(_ => (_ === undefined || _ === null) ? _ : _[property], isState(structure[property]) ? structure[property] : new State(structure[property]).hierarchy())
        }
        return this
    }

    and(state) {
        return on(this, state).apply((a, b) => a && b)
    }

    or(state) {
        return on(this, state).apply((a, b) => a || b)
    }

    onChange(observer, trigger = true, push = true) {
        if(push) this.#observers.push(observer)
        else this.#observers.unshift(observer)
        if(trigger) observer(this.#value)
        return this
    }

}

export function isState(variable) {
    return variable instanceof Observable
}

export function state(value = null) {
    return new State(value)
}

export function string(value = '') {
    return state(value)
}

export function boolean(value = false) {
    return state(value)
}

export function list(value = []) {
    return state(value)
}

export function to(trueValue, falseValue = null) {
    return value => value ? trueValue : falseValue
}

export function falseTo(falseValue) {
    return to(null, falseValue)
}

export function execute(trueCommand, falseCommand) {
    return value => value ? trueCommand() : falseCommand()
}

export function on(...parameters) {
    return {apply(f, result = state()) {
        let args = parameters.map((p, i) => isState(p) ? p.onChange(value => {
            args[i] = value
            result.set(f(...args))
        }, false).get() : p)
        return result.set(f(...args))
    }}
}

export function concat(...parameters) {
    return join('', ...parameters)
}

export function join(separator, ...parameters) {
    return on(...parameters).apply((...p) => p.join(separator))
}

export function fill(name, parameter) {
    function rep(t, name, value) {return t.replaceAll('{' + name + '}', value)}
    let inputs = []
    let f = t => t
    let i = t => t
    return {
        fill(name, parameter) {
            if(isState(parameter)) {
                inputs.push(parameter)
                let p = f
                f = t => rep(p(t), name, parameter.get())
            } else {
                let p = i
                i = t => rep(p(t), name, parameter)
            }
            return this
        },
        into(template) {
            return on(i(template), ...inputs).apply(f)
        }
    }.fill(name, parameter)
}

export function not(booleanModel) {
    return booleanModel.map(v => !v)
}

export function hook(handler, timeout = 0) {
    let result, send = true
    return value => {
        result = value
        if(send) {
            send = false
            setTimeout(() => {
                send = true
                handler(result)
            }, timeout)
        }
    }
}


export function timer(booleanState, updatePeriod = 1000) {
    let result = state()
    let interval = null
    let start = 0
    function update() {
        result.set(new Date().getTime() - start)
    }
    function handle(value) {
        if(value) {
            if(interval === null) {
                start = new Date().getTime()
                update()
                interval = setInterval(update, updatePeriod)
            }
        } else {
            if(interval !== null) {
                clearInterval(interval)
                update()
                interval = null
            }
        }
    }
    booleanState.onChange(handle)
    return result
}
