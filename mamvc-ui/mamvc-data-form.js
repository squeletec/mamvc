import {form, call, a, state} from "../mamvc.js";

function merge(object, form) {
    return object
}

export function dataForm(restCall) {
    if(!restCall.data)
        restCall.setPostData(state({}), false)
    let postData = restCall.data
    return form().onSubmit(event => postData.set(merge(postData.get(), event.target)))
}

export function action(restCall) {
    return a().onClick(call(restCall))
}
