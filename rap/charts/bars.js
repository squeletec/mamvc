import {div, functionModel} from "../../trio/mvc.js";

export function hbar(valueModel) {
    return div().setClass('rap-horizontal-bar').position('absolute').bottom(0).left(0).height(100, '%').width(valueModel, '%')
}

export function vbar(valueModel) {
    return div().setClass('rap-vertical-bar').position('absolute').bottom(0).left(0).width(100, '%').height(valueModel, '%')
}

export function progressBar(done, total) {
    return div().setClass('rap-progress-bar').backgroundSize(functionModel((d, t) => ((t > 0) ? 100 * d / t : 0), done, total), '%')
}
