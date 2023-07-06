import {builder} from "./ElementBuilder";
import {text} from "./Content.js"
import {dynamicFragment} from "./DynamicFragmentBuilder";

/**
 * Builder created on top of the existing document body element.
 * @returns {ElementBuilder}
 */
export function body() {
    return builder(document.body)
}

/**
 * Builder created on top of the existing document head element.
 * @returns {ElementBuilder}
 */
export function head() {
    return builder(document.head)
}

/**
 * Builder created on top of the existing element found by id.
 * @returns {ElementBuilder}
 */
export function byId(id) {
    return builder(document.getElementById(id))
}

/**
 * Create new DOM Element with provided name and wrap it with a builder.
 * @param name Element name.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function element(name) {
    return builder(document.createElement(name))
}

/**
 * Create new DOM Element 'meta' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function meta() {
    return element('meta')
}

/**
 * Create new DOM Element 'base' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function base() {
    return element('base')
}

export function div() {
    return element('div')
}

export function span() {
    return element('span')
}

export function img(...src) {
    return element('img').src(...src)
}

export function link(rel) {
    return element('link').rel(rel)
}

export function a(...href) {
    return element('a').href(...href)
}

/**
 * Create new DOM Element 'h1' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function h1() {
    return element('h1')
}

/**
 * Create new DOM Element 'h2' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function h2() {
    return element('h2')
}

/**
 * Create new DOM Element 'h3' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function h3() {
    return element('h3')
}

/**
 * Create new DOM Element 'h4' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function h4() {
    return element('h4')
}

/**
 * Create new DOM Element 'h5' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function h5() {
    return element('h5')
}

/**
 * Create new DOM Element 'h6' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function h6() {
    return element('h6')
}

/**
 * Create new DOM Element 'p' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function p() {
    return element('p')
}

/**
 * Create new DOM Element 'pre' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function pre() {
    return element('pre')
}

/**
 * Create new DOM Element 'code' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function code() {
    return element('code')
}

/**
 * Create new DOM Element 'ul' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function ul() {
    return element('ul')
}

/**
 * Create new DOM Element 'ol' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function ol() {
    return element('ol')
}

/**
 * Create new DOM Element 'li' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function li() {
    return element('li')
}

/**
 * Create new DOM Element 'small' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function small() {
    return element('small')
}

/**
 * Create new DOM Element 'strong' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function strong() {
    return element('strong')
}

/**
 * Create new DOM Element 'em' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function em() {
    return element('em')
}

/**
 * Create new DOM Element 'abbr' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function abbr() {
    return element('abbr')
}

/**
 * Create new DOM Element 'time' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function time(value) {
    return element('time').add(value)
}

/**
 * Create new DOM Element 'form' and wrap it with a builder.
 * @param method Method of form submission (GET|POST). Default value is POST
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function form(method = 'POST') {
    return element('form').method(method)
}

export function textarea(name) {
    return element('textarea').name(name)
}

export function input(type, name) {
    return element('input').type(type).name(name)
}

export function inputText(name) {
    return input('text', name)
}

export function inputHidden(name) {
    return input('hidden', name)
}

export function password(name) {
    return input('password', name)
}

export function checkbox(name) {
    return input('checkbox', name)
}

export function radio(name) {
    return input('radio', name)
}

export function submit(value) {
    return input('submit').value(value)
}

export function reset(value) {
    return input('reset').value(value)
}

export function select(name) {
    return element('select').name(name)
}

export function option(value) {
    return element('option').value(value)
}

export function label(forInput) {
    return element('label').set('for', forInput)
}

export function fieldset(legendValue) {
    return legendValue ? element('fieldset').add(legend(legendValue)) : element('fieldset')
}

export function legend(value) {
    return element('legend').add(value)
}

/**
 * Create new DOM Element 'dd' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function dd() {
    return element('dd')
}

/**
 * Create new DOM Element 'dl' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function dl() {
    return element('dl')
}

/**
 * Create new DOM Element 'dt' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function dt() {
    return element('dt')
}

/**
 * Create new DOM Element 'dfn' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function dfn() {
    return element('dfn')
}

/**
 * Create new DOM Element 'table' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function table() {
    return element('table')
}

/**
 * Create new DOM Element 'tbody' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function tbody() {
    return element('tbody')
}

/**
 * Create new DOM Element 'thead' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function thead() {
    return element('thead')
}

/**
 * Create new DOM Element 'tfoot' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function tfoot() {
    return element('tfoot')
}

/**
 * Create new DOM Element 'tr' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function tr() {
    return element('tr')
}

/**
 * Create new DOM Element 'td' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function td() {
    return element('td')
}

/**
 * Create new DOM Element 'th' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function th() {
    return element('th')
}

/**
 * Create new DOM Element 'caption' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function caption() {
    return element('caption')
}

export function captionTop() {
    return caption().captionSide('top')
}

export function captionBottom() {
    return caption().captionSide('bottom')
}

/**
 * Create new DOM Element 'sub' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function sub() {
    return element('sub')
}

/**
 * Create new DOM Element 'sup' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function sup() {
    return element('sup')
}

/**
 * Create new DOM Element 'details' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function details() {
    return element('details')
}

/**
 * Create new DOM Element 'summary' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function summary() {
    return element('summary')
}

/**
 * Create new DOM Element 'del' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function del() {
    return element('del')
}

/**
 * Create new DOM Element 'ins' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function ins() {
    return element('ins')
}

/**
 * Create new DOM Element 'hr' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function hr() {
    return element('hr')
}

/**
 * Create new DOM Element 'br' and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function br() {
    return element('br')
}

export function iframe(...src) {
    return element('iframe').src(src)
}

export function dialog(title = div('dialog-close').position('absolute').top('inherit').right('inherit').add('x').onClick(event => event.target.parentNode.close())) {
    return element('dialog').add(title)
}

/**
 * Create new DOM Fragment with provided content and wrap it with a builder.
 * @returns {ElementBuilder} New XBuilder instance.
 */
export function fragment(...args) {
    return builder(document.createDocumentFragment()).add(...args)
}

export function flexRow(...args) {
    return div().display('flex').add(...args)
}

export function flexColumn(...args) {
    return div().display('flex').flexDirection('column').add(...args)
}

export function auto(...args) {
    return div().flex('auto').add(...args)
}

/**
 * Space with start and end boundary, which will be populated dynamically as reaction to model change, using its display
 * function.
 * On any change of the model, the space is re-rendered using the display function.
 * It can handle following situation.
 * If model value is an array, every item will be rendered using the display function and inserted into the space.
 * If model value is null, space stays empty.
 * Otherwise, the value itself is rendered using the display function.
 *
 * This function will always re-render all items newly on model change. That means, that any state in the previously
 * rendered item view may be lost.
 * For rendering, which re-uses previously rendered items, if they remain, see function `refresh()`.
 *
 * @param start Start element of the space.
 * @param model Model (state), driving the content.
 * @param itemDisplayFunction Function used to render an item. The function accepts the item value, and an index, and
 *        must return appendable content.
 * @param end Optional end element, which is used as an anchor of the space, so all rendered content is prepended before
 *        this element. If not provided, artificial empty text node is created for that purpose.
 * @returns {Content} Fragment builder.
 */
export function range(start, model, itemDisplayFunction = item => item, end = text()) {
    let f = dynamicFragment(start, end)
    model.onChange(value => {
        f.clear();
        (Array.isArray(value) ? value : null === value ? [] : [value]).forEach((item, index) => f.add(itemDisplayFunction(item, index)))
    })
    return f
}

/**
 * Space which will be populated dynamically as reaction to model change, using its display function.
 * On any change of the model, the space is re-rendered using the display function.
 * It can handle following situation.
 * If model value is an array, every item will be rendered using the display function and inserted into the space.
 * If model value is null, space stays empty.
 * Otherwise, the value itself is rendered using the display function.
 *
 * This function will always re-render all items newly on model change. That means, that any state in the previously
 * rendered item view may be lost.
 * For rendering, which re-uses previously rendered items, if they remain, see function `refresh()`.
 *
 * @param model Model (state), driving the content.
 * @param itemDisplayFunction Function used to render an item. The function accepts the item value, and an index, and
 *        must return appendable content.
 * @param end Optional end element, which is used as an anchor of the space, so all rendered content is prepended before
 *        this element. If not provided, artificial empty text node is created for that purpose.
 * @returns {Content} Fragment builder.
 */
export function each(model, itemDisplayFunction = (item, index) => item, end = text()) {
    return range(text(), model, itemDisplayFunction, end)
}


export function refresh(listModel, itemKey, itemView = item => item, boundary = text()) {
    let f = fragment(boundary)
    let viewMap = new Map()
    listModel.onChange(value => {
        viewMap.forEach(view => view.remove())
        let nView = new Map()
        value.forEach((item, i) => {
            let key = itemKey(item)
            let view = viewMap.has(key) ? viewMap.get(key) : itemView(item)
            nView.set(key, view)
            boundary.prepend(view)
        })
        viewMap = nView
    })
    return f
}
