import {state} from "../trio.js"

export function parseUri(uri) {
    let u = uri.split('?', 2)
    return {
        path: u[0],
        parameters: u[1] ? Object.fromEntries(u[1].split('&').map(v => v.split('=', 2))) : {}
    }
}

export function locationModel(serializable) {
    let models = Object.fromEntries(Object.entries(serializable).map(([k,v]) => [k, state(v)]))
    let args = []
    let argsModel = state()
    Object.entries(models).forEach(([k,v],i) => {
        v.onChange(nv => {
            args[i] = nv === serializable[k] ? null : nv
            argsModel.set(argsModel)
        })
    })
    return argsModel.map(v => {
        let vs = v.filter(i => i)
        return vs.length > 0 ? '?' + vs.join('&') : ''
    })
}