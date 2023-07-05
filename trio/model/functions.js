import {state} from "./StateModel.js";
import {isObservable} from "./Observable.js";


export function argumentsModel(...modelsAndValues) {
    let value = new Array(modelsAndValues.length)
    let model = state(value)
    modelsAndValues.forEach((v, i) => value[i] = isObservable(v) ? v.observe(x => {
        value[i] = x;
        model.trigger()
    }, false).get() : v)
    return model
}

export function functionModel(f, ...args) {
    return argumentsModel(...args).map(v => f(...v))
}


export function join(glue, array) {
    return argumentsModel(...array).map(a => a.join(glue))
}

export function concat(...args) {
    return join('', args)
}
