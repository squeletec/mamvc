import {Content, node} from "./Content.js";
import {concat, join, falseTo, to} from "../model/functions.js";
import {isObservable} from "../model/Observable.js";
import {boolean} from "../model/factory.js";

export class ElementBuilder extends Content {

    #class

    constructor(node) {
        super(node);
        this.#class = []
    }

    add(...args) {
        for(let i = 0; i < args.length; i++)
            if(args[i] !== null && args[i] !== undefined)
                this.get().appendChild(node(args[i]))
        return this
    }

    clear() {
        let node = this.get()
        while(node.firstChild) node.removeChild(node.firstChild)
        return this
    }


    _manipulate(f, args) {
        let value = args.length === 1 ? args[0] : concat(...args)
        if(isObservable(value)) value.onChange(f)
        else f(value)
        return this
    }

    /*
     Manipulation of Element attributes.
     */
    set(name, ...args) {
        return (args.length === 0) ? this : this._manipulate(value => {
            if(value === null) this.get().removeAttribute(name)
            else this.get().setAttribute(name, value)
        }, args)
    }

    setClass(...value) {return this.set('class', join(' ', ...(this.#class = value)))}
    addClass(...value) {return this.setClass(...this.#class.concat(...value))}
    id(...value) {return this.set('id', ...value)}
    name(...value) {return this.set('name', ...value)}
    title(...value) {return this.set('title', ...value)}
    href(...value) {return this.set('href', ...value)}
    type(...value) {return this.set('type', ...value)}
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
    disabled(value) {return this.set('disabled', isObservable(value) ? value.map(to(true)) : value)}
    content(...value) {return this.set('content', ...value)}

    /*
      Manipulation of Element style properties
     */
    css(property, ...args) {
        return (args.length === 0) ? this : this._manipulate(value => {
            if(value === null) this.get().style.removeProperty(property)
            else this.get().style.setProperty(property, value)
        }, args)
    }

    display(value) {
        return this.css('display', (isObservable(value) && (value.get() === true || value.get() === false)) ? value.map(falseTo('none')) : value)
    }

    textAlign(value) {return this.css('text-align', value)}
    verticalAlign(value) {return this.css('vertical-align', value)}
    textLeft() {return this.textAlign('left')}
    textRight() {return this.textAlign('right')}
    textCenter() {return this.textAlign('center')}
    width(...args) {return this.css('width', ...args)}
    height(...args) {return this.css('height', ...args)}
    top(...args) {return this.css('top', ...args)}
    bottom(...args) {return this.css('bottom', ...args)}
    left(...args) {return this.css('left', ...args)}
    right(...args) {return this.css('right', ...args)}
    resize(value) {return this.css('resize', value)}
    color(value) {return this.css('color', value)}
    fontSize(...args) {return this.css('font-size', ...args)}
    fontStyle(...args) {return this.css('font-style', ...args)}
    fontWeight(...args) {return this.css('font-weight', ...args)}
    visibility(value) {return this.css('visibility', value)}
    opacity(...args) {return this.css('opacity', ...args)}
    background(...args) {return this.css('background', ...args)}
    backgroundColor(value) {return this.css('background-color', value)}
    backgroundImage(...args) {return this.css('background-image', ...args)}
    backgroundRepeat(...args) {return this.css('background-repeat', ...args)}
    backgroundSize(...args) {return this.backgroundRepeat('no-repeat').css('background-size', ...args)}
    linearGradient(value) {return this.backgroundImage('linear-gradient(', value, ')')}
    position(value) {return this.css('position', value)}
    float(value) {return this.css('float', value)}
    padding(...args) {return this.css('padding', ...args)}
    paddingLeft(...args) {return this.css('padding-left', ...args)}
    paddingRight(...args) {return this.css('padding-right', ...args)}
    paddingTop(...args) {return this.css('padding-top', ...args)}
    paddingBottom(...args) {return this.css('padding-bottom', ...args)}
    margin(...args) {return this.css('margin', ...args)}
    marginLeft(...args) {return this.css('margin-left', ...args)}
    marginRight(...args) {return this.css('margin-right', ...args)}
    marginTop(...args) {return this.css('margin-top', ...args)}
    marginBottom(...args) {return this.css('margin-bottom', ...args)}
    border(...args) {return this.css('border', ...args)}
    borderTop(...args) {return this.css('border-top', ...args)}
    borderBottom(...args) {return this.css('border-bottom', ...args)}
    borderLeft(...args) {return this.css('border-left', ...args)}
    borderRight(...args) {return this.css('border-right', ...args)}
    borderRadius(...args) {return this.css('border-radius', ...args)}
    cursor(value) {return this.css('cursor', value)}
    transition(value) {return this.css('transition', value)}
    transform(value) {return this.css('transform', value)}
    rotate(value, unit) {return this.transform(concat('rotate(', value, unit, ')'))}
    overflow(value) {return this.css('overflow', value)}
    overflowX(value) {return this.css('overflow-x', value)}
    overflowY(value) {return this.css('overflow-y', value)}
    flex(...args) {return this.css('flex', ...args)}
    flexDirection(...args) {return this.css('flex-direction', ...args)}
    gap(...args) {return this.css('gap', ...args)}
    captionSide(...args) {return this.css('caption-side', ...args)}
    whiteSpace(...args) {return this.css('white-space', ...args)}
    nowrap() {return this.whiteSpace('nowrap')}
    boxSizing(value) {return this.css('box-sizing', value)}
    borderBox() {return this.boxSizing('border-box')}

    setProperty(name, ...args) {
        return (args.length === 0) ? this : this._manipulate(value => {
            if(value === null) this.get()[name] = null
            else this.get()[name] = value
        }, args)
    }

    value(...args) {
        return this.setProperty('value', ...args)
    }

    /*
     Dealing with events
     */
    on(event, handler, bubble) {
        this.get().addEventListener(event, bubble ? handler : e => {
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

    receive(channel, action, dragStartClass, dragOverClass) {
        return this
            .onDragover(e => null !== channel.get() && e.preventDefault())
            .onDrop(() => null != channel.get() && action(channel.get()))
            .receivingClasses(channel, dragStartClass, dragOverClass)
    }

    receiving(channel, model) {
        channel.onChange(value => value || model.set(false))
        return this.onDragover(() => channel.get() && model.set(true)).onDragleave(set(model, false))
    }

    receivingClasses(channel, dragStartClass, dragOverClass) {
        let indication = boolean()
        if(dragStartClass) this.addClass(channel.map(to(dragStartClass)))
        if(dragOverClass) this.addClass(indication.map(to(" " + dragOverClass)))
        return this.receiving(channel, indication)
    }

    /*
     Special binding
     */
    model(model) {return this.value(model).onChange(() => model.set(this.get().value))}

    apply(f, ...args) {
        f(this, ...args)
        return this
    }

}


export function builder(node) {
    if(node instanceof Node)
        return new ElementBuilder(node)
    throw new ReferenceError("Provided value must be instance of Node. Got: " + node);

}
