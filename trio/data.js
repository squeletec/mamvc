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
import {isState, state, boolean, string, template, join, argStates, usingUriTemplate} from "./state.js";

const SUCCESS_STATUSES = new Set([200, 0])


function setArg(value, args, i, result) {
    return isState(value) ? value.map(encodeURIComponent).onChange(v => {
        args[i] = v
        result.set(args.join(''))
    }, false).get() : value
}

function args(uriTemplate, input) {
    return input === null ? [] : Object.getOwnPropertyNames(input).filter(name => !uriTemplate.includes('{' + name + '}')).map(name => input[name].map(v => v ? name + '=' + encodeURIComponent(v) : null))
}

export function filter(array, predicate = v => v) {
    return array.filter(predicate)
}

export function uriModel(uriTemplate, input) {
   return input.map(usingUriTemplate(uriTemplate))
}

export function uriModel2(uriTemplate, input) {
    let file = template(uriTemplate, input)
    let request = argStates(...args(uriTemplate, input)).map(filter).map(a => a.join('&'))
    let glue = uriTemplate.includes('?') ? '&' : '?'
    return argStates(file, request).map(filter).map(a => a.join(glue))
}

class RestCall {
    constructor(template, input, output, loading) {
        this.input = isState(input) ? input : state(input)
        this.data = null
        this.output = output
        this.error = string()
        this.loading = loading
        this.uri = uriModel(template, input)
        this.uri.onChange(() => this.call(), false)
    }

    setPostData(data, sendOnChange = true) {
        this.data = data
        if(sendOnChange)
            this.data.onChange(() => this.call(), false)
        return this
    }

    set(value) {
        this.output.set(value)
        this.loading.set(false)
    }

    setError(value) {
        this.error.set(value)
        this.loading.set(false)
    }

    call() {
        this.loading.set(true)
        this.error.set('')
        fetch(this.uri.get(), this.data ? {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.data.get())
        } : {}).then(r => r.ok
            ? r.json().then(r => this.set(r))
            : r.headers.get('Content-Type').indexOf('json') < 0
                ? this.setError(r.statusText)
                : r.json().then(j => this.setError(j.message))
        ).catch(reason => this.setError(reason))
        return this
    }

    callEvery(milliseconds) {
        setInterval(() => this.call())
        return this
    }
}

export function remote(template, input = {}, output = state(), loading = boolean()) {
    return new RestCall(template, input, output, loading)
}

export function resolve(object, propertyNames) {
    for(let i = 0; i < propertyNames.length; i++)
        if(typeof object === "object" && object) object = object[propertyNames[i]]
    return object
}

export function last(array) {
    return array[array.length - 1]
}
