import {state} from "./StateModel.js";


export function string(value = "") {
    if(value === null || "string" === typeof value) {
        return state(value)
    }
    throw new Error("Required type 'string', but got " + value)
}

export function boolean(value = false) {
    if(value === true || value === false)
        return state(value)
    throw new Error("Required type 'boolean', but got " + value)
}

export function list(value = []) {
    if(Array.isArray(value))
        return state(value)
    throw new Error("Required type 'Array', but got " + value)
}
