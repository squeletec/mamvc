import {PropertyModel} from "./PropertyModel.js";

let stateProxyHandler = {
    get(target, name) {
        return (target[name] === undefined) ? target[name] = stateProxy(new PropertyModel(target, name)) : target[name]
    }
}

export function stateProxy(state) {
    return new Proxy(state, stateProxyHandler)
}
