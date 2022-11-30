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
