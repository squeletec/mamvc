import {PropertyModel} from "./PropertyModel.js";

export function stateProxy(state) {
    return new Proxy(state, {
        get(target, name) {
            if(target[name] === undefined)
                target[name] = stateProxy(new PropertyModel(target, name))
            return target[name]
        },
    })
}
