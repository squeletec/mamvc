/*
 * Class state represents, observable state.
 */
class State {

    constructor(value = null) {
        this.value = value
        this.observers = []
    }

    set(value) {
        this.value = value
        this.observers.forEach(observer => observer(this.value))
        return this
    }

    update(value) {
        return value === this.value ? this : this.set(value)
    }

    get() {
        return this.value
    }

    map(mappingFunction) {
        let result = new State()
        this.onChange(value => result.set(mappingFunction(value)))
        return result
    }

    and(state) {
        return on(this, state).apply((a, b) => a && b)
    }

    or(state) {
        return on(this, state).apply((a, b) => a || b)
    }

    onChange(observer, trigger = true) {
        this.observers.push(observer)
        if(trigger) observer(this.value)
        return this
    }

}

export function state(value = null) {
    return new State(value)
}

export function boolean(value = false) {
    return state(value)
}

export function on(...parameters) {
    return {apply(f) {
        let result = state()
        let args = parameters.map((p, i) => p instanceof State ? p.onChange(value => {
            args[i] = value
            result.set(f(...args))
        }, false).get() : p)
        return result.set(f(...args))
    }}
}

export function concat(...parameters) {
    return on(...parameters).apply((...p) => p.join(''))
}

export function fill(name, parameter) {
    function rep(t, name, value) {return t.replaceAll('{' + name + '}', value)}
    let inputs = []
    let f = t => t
    let i = t => t
    return {
        fill(name, parameter) {
            if(parameter instanceof State) {
                inputs.push(parameter)
                let p = f
                f = t => rep(p(t), name, parameter.get())
            } else {
                let p = i
                i = t => rep(p(t), name, parameter)
            }
            return this
        },
        into(template) {
            return on(i(template), ...inputs).apply(f)
        }
    }.fill(name, parameter)
}



export function toggle(model) {
    return () => model.set(!model.get())
}

export function set(model, value) {
    return () => model.set(value)
}

export function copyToClipboard(nodeOrBuilder) {
    let node = nodeOrBuilder instanceof XNode ? nodeOrBuilder.get() : nodeOrBuilder
    return function(event) {
        if(document.selection) {
            let ieRange = document.body.createTextRange()
            ieRange.moveToElementText(node)
            ieRange.select().createTextRange()
        } else if(window.getSelection) {
            let domRange = document.createRange()
            domRange.selectNode(node)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(domRange)
            document.execCommand("copy")
            window.getSelection().removeAllRanges()
        }
    }
}


/**
 * Class UI Element is a wrapper for DOM element, marking, that such object has a DOM element representing it's
 * visualization.
 */
class XNode {
    constructor(node) {this.node = node}

    get() {
        return this.node
    }

    prepend(node) {
        this.node.parentNode.insertBefore(x(node).get(), this.node)
        return this
    }

    remove() {
        this.node.parentNode.removeChild(this.node)
        return this
    }

    replace(replacement) {
        this.node.parentNode.replaceChild(replacement.node, this.node)
        return this
    }
}


function xNode(node) {
    return new XNode(node);
}

class XText extends XNode {
    constructor(text) {
        super(text instanceof Node ? text : document.createTextNode(text));
    }

    setValue(value) {
        this.node.nodeValue = value
        return this;
    }
}

function xText(text) {
    return new XText(text)
}

function x(parameter) {
    if(parameter instanceof XNode) return parameter
    if(parameter instanceof Node) return xNode(parameter)
    return text(parameter)
}

function valueView(value) {
    let builder = xText(document.createTextNode(value.get()))
    value.onChange(v => builder.setValue(v), false)
    return builder
}

export function text(value) {
    return value instanceof State ? valueView(value) : xText(document.createTextNode(value));
}

class XBuilder extends XNode {
    /**
     * Class DOM fluent builder.
     *
     * @constructor
     */
    constructor(node) {
        super(node);
    }

    /*
      Fluent DOM tree manipulation methods
     */
    add(...args) {
        for(let i = 0; i < args.length; i++)
            if(args[i] !== null && args[i] !== undefined)
                this.node.appendChild(x(args[i]).get())
        return this
    }

    to(parent) {
        parent.add(this)
        return this
    }

    clear() {
        while(this.node.firstChild) this.node.removeChild(this.node.firstChild)
        return this
    }

    setValue(value) {
        this.node.nodeValue = value
        return this;
    }

    /*
     Manipulation of Element attributes.
     */
    set(name, ...args) {
        if(args.length === 0)
            return this
        let attr = value => {
            if(value === null) this.node.removeAttribute(name)
            else this.node.setAttribute(name, value)
        }
        let value = X(...args)
        if(value instanceof State) value.onChange(attr)
        else attr(value)
        return this
    }

    setClass(...value) {return this.set('class', ...value)}
    id(...value) {return this.set('id', ...value)}
    name(...value) {return this.set('name', ...value)}
    title(...value) {return this.set('title', ...value)}
    href(...value) {return this.set('href', ...value)}
    type(...value) {return this.set('type', ...value)}
    value(...value) {return this.set('value', ...value)}
    readonly(...value) {return this.set('readonly', ...value)}
    action(...value) {return this.set('action', ...value)}
    target(...value) {return this.set('target', ...value)}
    method(...value) {return this.set('method', ...value)}
    size(...value) {return this.set('size', ...value)}
    src(...value) {return this.set('src', ...value)}
    alt(...value) {return this.set('alt', ...value)}
    draggable(...value) {return this.set('draggable', ...value)}
    rel(...value) {return this.set('rel', ...value)}
    colspan(...value) {return this.set('colspan', ...value)}
    rowspan(...value) {return this.set('rowspan', ...value)}
    autocomplete(...value) {return this.set('autocomplete', ...value)}
    checked(value) {return this.set('checked', value)}
    disabled(value) {return this.set('disabled', value instanceof State ? mapBooleanModel(value, true) : value)}

    /*
      Manipulation of Element style properties
     */
    css(property, ...args) {
        if(args.length === 0)
            return this
        let value = X(...args)
        let node = this.node;
        function css(value) {
            if(value === null) node.style.removeProperty(property)
            else node.style.setProperty(property, value)
        }
        if(value instanceof State) value.onChange(css)
        else css(value)
        return this
    }

    display(value) {
        return this.css('display', (value instanceof State && (value.value === true || value.value === false)) ? mapBooleanModel(value, null, 'none') : value)
    }

    textAlign(value) {return this.css('text-align', value)}
    textLeft() {return this.textAlign('left')}
    textRight() {return this.textAlign('right')}
    textCenter() {return this.textAlign('center')}
    width(value, unit = 'px') {return this.css('width', X(value, unit))}
    height(value, unit = 'px') {return this.css('height', X(value, unit))}
    top(value, unit = 'px') {return this.css('top', X(value, unit))}
    bottom(value, unit = 'px') {return this.css('bottom', X(value, unit))}
    left(value, unit = 'px') {return this.css('left', X(value, unit))}
    right(value, unit = 'px') {return this.css('right', X(value, unit))}
    resize(value) {return this.css('resize', value)}
    color(value) {return this.css('color', value)}
    fontSize(...args) {return this.css('font-size', ...args)}
    fontStyle(...args) {return this.css('font-style', ...args)}
    fontWeight(...args) {return this.css('font-weight', ...args)}
    visibility(value) {return this.css('visibility', value)}
    opacity(...args) {return this.css('opacity', ...args)}
    backgroundColor(value) {return this.css('background-color', value)}
    backgroundImage(...args) {return this.css('background-image', ...args)}
    backgroundRepeat(...args) {return this.css('background-repeat', ...args)}
    backgroundSize(...args) {return this.backgroundRepeat('no-repeat').css('background-size', ...args)}
    linearGradient(value) {return this.backgroundImage('linear-gradient(', value, ')')}
    position(value) {return this.css('position', value)}
    float(value) {return this.css('float', value)}
    paddingLeft(value, unit = 'px') {return this.css('padding-left', X(value, unit))}
    paddingRight(value, unit = 'px') {return this.css('padding-right', X(value, unit))}
    paddingTop(value, unit = 'px') {return this.css('padding-top', X(value, unit))}
    paddingBottom(value, unit = 'px') {return this.css('padding-bottom', X(value, unit))}
    marginLeft(value, unit = 'px') {return this.css('margin-left', X(value, unit))}
    marginRight(value, unit = 'px') {return this.css('margin-right', X(value, unit))}
    marginTop(value, unit = 'px') {return this.css('margin-top', X(value, unit))}
    marginBottom(value, unit = 'px') {return this.css('margin-bottom', X(value, unit))}
    cursor(value) {return this.css('cursor', value)}
    transition(value) {return this.css('transition', value)}
    transform(value) {return this.css('transform', value)}
    rotate(value, unit) {return this.transform(X('rotate(', value, unit, ')'))}
    overflow(value) {return this.css('overflow', value)}
    overflowX(value) {return this.css('overflow-x', value)}
    overflowY(value) {return this.css('overflow-y', value)}

    /*
     Dealing with events
     */
    on(event, handler, bubble) {
        this.node.addEventListener(event, bubble ? handler : function (e) {
            handler(e)
            e.preventDefault()
            return false
        })
        return this
    }

    onClick(handler, bubble) {return this.on('click', handler, bubble)}
    onSubmit(handler, bubble) {return this.on('submit', handler, bubble)}
    onReset(handler, bubble) {return this.on('reset', handler, bubble)}
    onInput(handler, bubble) {return this.on('input', handler, bubble)}
    onChange(handler, bubble) {return this.on('change', handler, bubble)}

    onMouseOver(handler) {return this.on('mouseover', handler, true)}
    onMouseOut(handler) {return this.on('mouseout', handler, true)}

    onDragstart(handler) {return this.on('dragstart', handler, true)}
    onDrag(handler) {return this.on('drag', handler, true)}
    onDrop(handler) {return this.on('drop', handler, true)}
    onDragend(handler) {return this.on('dragend', handler, true)}
    onDragover(handler) {return this.on('dragover', handler, true)}
    onDragleave(handler) {return this.on('dragleave', handler, true)}

    transfer(channel, data) {
        return this.draggable(true).cursor('grab').onDragstart(set(channel, data)).onDragend(set(channel, null))
    }

    receive(channel, action) {
        return this.onDragover(e => null !== channel.get() && e.preventDefault()).onDrop(() => null != channel.get() && action(channel.get()))
    }

    receiving(channel, model) {
        channel.onChange(value => value || model.set(false))
        return this.onDragover(() => channel.get() && model.set(true)).onDragleave(set(model, false))
    }

    /*
     Special binding
     */
    model(model) {return (this.get().nodeName === 'TEXTAREA' ? this.add(model) : this.value(model)).onChange(() => model.set(this.get().value))}

}

function builder(node) {
    return new XBuilder(node)
}

/*
  Ready to use element builders.
 */
function body() {return builder(document.body)}
function head() {return builder(document.head)}
function byId(id) {return builder(document.getElementById(id))}
function element(name, ...className) {return  builder(document.createElement(name)).setClass(...className)}
function meta() {return element('meta')}
function base() {return element('base')}
function div(...className) {return element('div', ...className)}
function span(...className) {return element('span', ...className)}
function img(...src) {return element('img').src(...src)}
function link(rel) {return element('link').rel(rel)}
function a(...href) {return element('a').href(...href)}
function h1() {return element('h1')}
function h2() {return element('h2')}
function h3() {return element('h3')}
function h4() {return element('h4')}
function h5() {return element('h5')}
function p() {return element('p')}
function pre() {return element('pre')}
function code() {return element('code')}
function ul() {return element('ul')}
function ol() {return element('ul')}
function li() {return element('li')}
function small() {return element('small')}
function strong() {return element('strong')}
function em() {return element('em')}
function abbr() {return element('abbr')}
function time(value) {return element('time').add(text(value))}
function form(method) {return element('form').method(method || 'POST')}
function textarea(name) {return element('textarea').name(name)}
function input(type, name) {return element('input').type(type).name(name)}
function inputText(name) {return input('text', name)}
function password(name) {return input('password', name)}
function checkbox(name) {return input('checkbox', name)}
function radio(name) {return input('radio', name)}
function submit(value) {return input('submit').value(value)}
function reset(value) {return input('reset').value(value)}
function select(name) {return element('select').name(name)}
function option(value) {return element('option').value(value)}
function label(forInput) {return element('label').set('for', forInput)}
function fieldset(legendValue) {return legendValue ? element('fieldset').add(legend(legendValue)) : element('fieldset')}
function legend(value) {return element('legend').add(text(value))}
function dd() {return element('dd')}
function dl() {return element('dl')}
function dt() {return element('dt')}
function dfn() {return element('dfn')}
function table() {return element('table')}
function tbody() {return element('tbody')}
function thead() {return element('thead')}
function tfoot() {return element('tfoot')}
function tr() {return element('tr')}
function td() {return element('td')}
function th() {return element('th')}
function sub() {return element('sub')}
function sup() {return element('sup')}
function details() {return element('details')}
function summary() {return element('summary')}
function del() {return element('del')}
function ins() {return element('ins')}
function hr() {return element('hr')}
function br() {return element('br')}
function iframe(...src) {return element('iframe').src(src)}
function fragment(...args) {return builder(document.createDocumentFragment()).add(...args)}

function range(start, model, itemView = item => item, end = xText('')) {
    let f = fragment(start, end)
    model.onChange(value => {
        for(let n = start.get().nextSibling, s; n && n !== end.get(); n = s) {
            s = n.nextSibling
            builder(n).remove()
        }
        value.forEach(item => end.prepend(itemView(item)))
    })
    return f
}

function each(model, itemView = item => item, end = xText('')) {
    return range(xText(''), model, itemView, end)
}


function refresh(listModel, itemKey, itemView = item => item, boundary = xText('')) {
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
