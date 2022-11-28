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
 * Class state represents, observable state.
 */
class State {

    constructor(value = null) {
        this._value = value
        this._observers = []
    }

    set(value) {
        this._value = value
        this._observers.forEach(observer => observer(this._value))
        return this
    }

    update(value) {
        return value === this._value ? this : this.set(value)
    }

    get() {
        return this._value
    }

    map(mappingFunction, result = new State()) {
        this.onChange(value => result.set(mappingFunction(value)))
        return result
    }

    hierarchy(structure = this._value) {
        if('object' === typeof structure) {
            if(Array.isArray(structure))
                this.length = this.map(v => v.length)
            else
                for(let property in structure)
                    if(structure.hasOwnProperty(property))
                        this[property] = this.map(_ => (_ === undefined || _ === null) ? _ : _[property], new State(structure[property]).hierarchy())
        }
        return this
    }

    and(state) {
        return on(this, state).apply((a, b) => a && b)
    }

    or(state) {
        return on(this, state).apply((a, b) => a || b)
    }

    onChange(observer, trigger = true) {
        this._observers.push(observer)
        if(trigger) observer(this._value)
        return this
    }

}

export function isState(variable) {
    return variable instanceof State
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
    return on(...parameters).apply((...p) => p.join(''))
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
