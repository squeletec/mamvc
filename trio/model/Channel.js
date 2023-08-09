import {Model} from "./Model.js";
import {state} from "./StateModel.js";
import "./StateTransformer.js"
import {properties, usingTemplate, usingUriTemplate} from "./functions.js";

function observeRequest(method, uri, state, result) {
    let request = new XMLHttpRequest()
    state.set({state: XMLHttpRequest.UNSENT, loaded: 0, loading: false})
    request.onreadystatechange = () => {
        if(request.readyState === XMLHttpRequest.DONE) if(request.status === 200 || request.status === 0) try {
            result.set(request)
        } catch (error) {
            request.onerror(null)
        } else {
            request.onerror(null)
        }
    }
    request.onprogress = event => state.set({
        state: XMLHttpRequest.LOADING,
        total: event.total,
        loaded: event.loaded,
        loading: true
    })
    request.onerror = () => state.set({
        state: XMLHttpRequest.DONE,
        loading: false
    })
    request.open(method, uri.get())
    return request
}


export class Channel extends Model {

    #uri
    #model
    #stateModel

    constructor(uri, model = state().transform(request => JSON.parse(request.responseText))) {
        super();
        this.#uri = uri
        this.#model = model
        this.setStateModel(state({state: XMLHttpRequest.UNSENT, loading: false}))
    }

    request(method) {
        return  observeRequest(method, this.#uri, this.#stateModel, this.#model)
    }

    setStateModel(stateModel) {
        this.#stateModel = stateModel
        return this
    }

    set(newValue) {
        this.#model.set(newValue);
        return this
    }

    get() {
        return this.#model.get();
    }

    observe(observer, invokeNow = true) {
        this.#model.observe(observer, invokeNow);
        return this
    }

    observeInput() {
        this.#uri.observe(() => this.trigger())
        return this
    }

}


class GetChannel extends Channel {

    constructor(uri, model) {
        super(uri, model);
    }

    trigger() {
        this.request("GET").send()
        return this
    }

}

class PostChannel extends Channel {

    #input

    constructor(uri, input, model) {
        super(uri, model);
        this.#input = input
    }

    trigger() {
        this.request("POST").send(JSON.stringify(this.#input.get()))
        return this
    }

    observeInput() {
        this.#input.observe(() => this.trigger());
        return this
    }

}

export function fromJson(model = state()) {
    return model.apply(request => request === null ? null : JSON.parse(request.responseText))
}

export function fromText(model = state()) {
    return model.apply(request => request === null ? null : request.responseText)
}

export function getChannel(uri, input, result = fromJson()) {
    return new GetChannel(input.map(properties(encodeURIComponent)).map(usingUriTemplate(uri)), result)
}

export function postChannel(uri, input, result = fromJson()) {
    return new PostChannel(input.map(properties(encodeURIComponent)).map(usingTemplate(uri)), input, result)
}
