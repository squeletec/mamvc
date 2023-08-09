import {PropertyModel} from "./PropertyModel.js";
import {isObservable} from "./Observable.js";
import {state} from "./StateModel.js";

let stateProxyHandler = {
    get(target, name) {
        return (target[name] === undefined) ? target[name] = stateProxy(new PropertyModel(target, name)) : target[name]
    }
}

export function stateProxy(stateOrValue = null) {
    return new Proxy(isObservable(stateOrValue) ? stateOrValue : state(stateOrValue), stateProxyHandler)
}
