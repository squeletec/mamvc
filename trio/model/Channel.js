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

/**
 * Class Channel represents channel for exchange data between the GUI and the server.
 */
export class Channel extends Model {

    constructor(uriMapping, input, output) {
        super();
        this.input = input
        this.uri = input.map(properties(encodeURIComponent)).map(uriMapping)
        this.output = output
        this.setStateModel(state({state: XMLHttpRequest.UNSENT, loading: false}))
    }

    request(method) {
        return  observeRequest(method, this.uri, this.stateModel, this.output)
    }

    setStateModel(stateModel) {
        this.stateModel = stateModel
        return this
    }

    set(newValue) {
        this.output.set(newValue);
        return this
    }

    get() {
        return this.output.get();
    }

    observe(observer, invokeNow = true) {
        this.output.observe(observer, invokeNow);
        return this
    }

    observeInput() {
        this.input.observe(() => this.trigger());
        return this
    }

}

/**
 * Get channel.
 */
class GetChannel extends Channel {

    constructor(uri, input, output) {
        super(usingUriTemplate(uri), input, output);
    }

    trigger() {
        this.request("GET").send()
        return this
    }

}

/**
 * POST channel.
 */
class PostChannel extends Channel {

    constructor(uri, input, output) {
        super(usingTemplate(uri), input, output);
    }

    trigger() {
        this.request("POST").send(JSON.stringify(this.input.get()))
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
    return new GetChannel(uri, input, result)
}

export function postChannel(uri, input, result = fromJson()) {
    return new PostChannel(uri, input, result)
}
