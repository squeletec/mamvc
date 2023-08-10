import {form, inputText, postChannel, state, textarea, trigger} from "../../trio/mvc.js";

export function editForm(uri, model, result = state()) {
    let channel = postChannel(uri, model, result)
    return form().onSubmit(trigger(channel))
}

export function edit(propertyModel) {
    return inputText(propertyModel.getName()).model(propertyModel)
}

export function editArea(propertyModel) {
    return textarea(propertyModel.getName()).model(propertyModel)
}

