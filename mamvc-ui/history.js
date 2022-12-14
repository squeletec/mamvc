import {state} from "../trio.js"

export function parseUri(uri) {
    let u = uri.split('?', 2)
    return {
        path: u[0],
        parameters: u[1] ? Object.fromEntries(u[1].split('&').map(v => v.split('=', 2)).map(([k,v]) => [k,decodeURIComponent(v)])) : {}
    }
}

export function parseParam(parameters, name, defaultValue) {
    if(parameters.hasOwnProperty(name)) {
        switch (typeof defaultValue) {
            case "number": return parseFloat(parameters[name])
            case "boolean": return "true" === parameters[name].toLowerCase()
            default: return parameters[name]
        }
    }
    else return defaultValue
}

export function toModels(parsedUri, defaultValues) {
    return Object.fromEntries(Object.entries(defaultValues).map(([k,v]) => [k, state(parseParam(parsedUri.parameters, k, v))]))
}

export function locationModel(parsedUri, defaultValues, serializableStates = toModels(parsedUri, defaultValues)) {
    let args = {}
    let argsModel = state()
    Object.entries(serializableStates).forEach(([k,v],i) => {
        v.onChange(nv => {
            args[k] = nv === defaultValues[k] ? null : nv
            argsModel.set(args)
        })
    })
    return argsModel.map(args => {
        let vs = Object.entries(args).filter(([k, v]) => v)
        return vs.length > 0 ? parsedUri.path + '?' + vs.map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&') : parsedUri.path
    })
}

export function pushStates(locationModel, defaultValues, serializableStates) {
    let allowPush = true
    locationModel.onChange(location => allowPush && window.history.pushState({}, window.title, location))
    window.addEventListener('popstate', () => {
        allowPush = false
        let parsedUri = parseUri(window.location.toString())
        for(let name in serializableStates) if(serializableStates.hasOwnProperty(name)) {
            serializableStates[name].update(parseParam(parsedUri.parameters, name, defaultValues[name]))
        }
        allowPush = true
    })
}

export function serialize(defaultValues) {
    let parsedUri = parseUri(window.location.toString())
    let serializedStates = toModels(parsedUri, defaultValues)
    pushStates(locationModel(parsedUri, defaultValues, serializedStates), defaultValues, serializedStates)
    return serializedStates
}
