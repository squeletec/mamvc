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
import {concat, isState, state, boolean } from "./mamvc-state.js";

const SUCCESS_STATUSES = new Set([200, 0])

class Channel {
    constructor(uri) {
        this._uri = isState(uri) ? uri : state(uri)
        this._model = state()
        this._busy = boolean()
        this._progress = state({total: 0, done: 0}).hierarchy()
    }

    setModel(model) {
        this._model = model
        return this
    }

    model() {
        return this._model
    }

    progress() {

    }

    set(value) {
        this.model().set(value)
        this._busy.set(false)
        return this
    }
/*
        onGetRequest(uri, ...args) {
            let request = new XMLHttpRequest()
            request.open('GET', uri, true)
            this.onRequest(request, ...args)
            request.send()
        },

        onRequest(request, ...args) {
            request.onprogress = event => {
                if(event.lengthComputable)
                    this.totalCount.set(event.total)
                this.doneCount.set(event.loaded)
            }
            request.onreadystatechange = () => {
                if(request.readyState === request.DONE) {
                    if(SUCCESS_STATUSES.has(request.status))
                        process(request, ...args)
                    else
                        this.onerror(new Error('Request failed: ' + request.status + ' ' + request.statusText + '\n\n' + request.responseText))
                }
            }
        },

 */

    get() {
        this._busy.set(true)
        let request = new XMLHttpRequest()
        request.open("get", this._uri.get())
        prepareRequest(request, this._progress, this._model).send()
        return this
    }

    post(data) {
        this._busy.set(true)
        let request = new XMLHttpRequest()
        request.open("post", this._uri.get())
        request.setRequestHeader('Content-Type', 'application/json')
        prepareRequest(request, this._progress, this._model).send(JSON.stringify(data))
        return this
    }

    every(milliseconds) {
        setInterval(() => this.update(), milliseconds)
        return this
    }
}

function prepareRequest(request, progressModel, dataModel) {
    request.onprogress = event => {
        if(event.lengthComputable)
            progressModel.totalCount.set(event.total)
        progressModel.doneCount.set(event.loaded)
    }
    request.onreadystatechange = () => {
        if(request.readyState === request.DONE) {
            if(SUCCESS_STATUSES.has(request.status))
                dataModel.set(JSON.parse(request.responseText))
            else
                this.onerror(new Error('Request failed: ' + request.status + ' ' + request.statusText + '\n\n' + request.responseText))
        }
    }
    return request
}

export function channel(...uri) {
    return new Channel(concat(uri))
}
