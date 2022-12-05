import {form, call, a} from "../mamvc.js";

export function dataForm(restCall) {
    return form().onSubmit(call(restCall))
}

export function action(restCall) {
    return a().onClick(call(restCall))
}
