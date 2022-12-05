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
import {concat, isState, state, boolean} from "./mamvc-state.js";

const SUCCESS_STATUSES = new Set([200, 0])

class Channel {
    constructor(uri) {
        this._uri = isState(uri) ? uri : state(uri)
        this._uri.onChange(() => this.get(), false)
        this._model = state()
        this._busy = boolean()
        this._progress = state({total: 0, done: 0}).hierarchy()
    }

    setModel(model) {
        this._model = model
        return this
    }

    map(mappingFunction, result) {
        this._model.map(mappingFunction, result)
        return this
    }

    model() {
        return this._model
    }

    progress() {
        return this._progress
    }

    busy() {
        return this._busy
    }

    set(value) {
        this.model().set(value)
        this._busy.set(false)
        return this
    }

    get() {
        this._busy.set(true)
        fetch(this._uri.get()).then(response => response.json()).then(json => this.set(json)).catch()
        return this
    }

    post(data) {
        this._busy.set(true)
        fetch(this._uri.get(), {method: 'POST', body: JSON.stringify(data)}).then(response => response.json()).then(json => this.set(json)).catch()
        return this
    }

    getEvery(milliseconds) {
        setInterval(() => this.get(), milliseconds)
        return this
    }
}

export function channel(...uri) {
    return new Channel(concat(...uri))
}

function setArg(value, args, i, rest) {
    return isState(value) ? value.onChange(v => {
        args[i] = v
        rest.call()
    }, false).get() : value
}

class RestCall {
    constructor(input, template, output, loading) {
        this.input = input
        this.output = output
        this.error = state()
        this.loading = loading
        this.args = template.split(/\{([^}]+)}/)
        let used = new Set()
        for(let i = 1; i < this.args.length; i += 2) {
            let name = this.args[i]
            if(input.hasOwnProperty(name)) {
                this.args[i] = setArg(input[name], this.args, i, this)
                used.add(name)
            }
            else throw new Error('Parameter ' + name + ' not bound.')
        }
        let sep = template.indexOf("?") < 0 ? "?" : "&"
        for(let name in input) if(input.hasOwnProperty(name) && !used.has(name)) {
            this.args.push(sep + name, setArg(input[name], this.args, this.args.length, this))
            sep = "&"
        }
    }

    set(value) {
        this.output.set(value)
        this.loading.set(false)
    }

    call() {
        this.loading.set(true)
        fetch(this.args.join('')).then(r => r.json()).then(r => this.output.set(r))
        return this
    }

    callEvery(milliseconds) {
        setInterval(() => this.call())
        return this
    }
}

export function remote(template, input, output = state(), loading = boolean()) {
    return new RestCall(input, template, output, loading)
}

export function resolve(object, propertyNames) {
    for(let i = 0; i < propertyNames.length; i++)
        if(typeof object === "object") object = object[propertyNames[i]]
    return object
}

export function last(array) {
    return array[array.length - 1]
}


export function self(row) {
    return row.item()
}
self.header = row => last(row.path)

export function path(row) {
    return self(row)
}
path.header = row => row.path.join(".")

export function position(row) {
    return row.index + 1
}
position.header = () => '#'
