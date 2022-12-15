import {form, call, a, state} from "../trio.js";

function merge(object, form) {
    Object.entries(form.elements).filter(([k,v],i) => k !== '' + i).forEach(([k,v]) => object[k] = v.type === 'checkbox' ? v.checked : v.value)
    return object
}

export function dataForm(restCall, mergeFunction = merge) {
    if(!restCall.data)
        restCall.setPostData(state({}), false)
    let postData = restCall.data
    return form().onSubmit(event => postData.set(mergeFunction(postData.get(), event.target)))
}

export function action(restCall) {
    return a().onClick(call(restCall))
}
