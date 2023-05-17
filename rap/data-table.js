import {form,
    table,
    thead,
    tbody,
    tr,
    td,
    th,
    a,
    each,
    caption,
    list,
    not,
    on,
    state,
    string,
    set,
    trigger,
    when,
    inputText,
    submit,
    reset,
    to,
    XBuilder,
    span,
    remote,
    resolve,
    last,
    boolean,
    execute,
    range,
    captionTop,
    captionBottom,
    timer,
    toggle,
    div, checkbox, label
} from "../trio.js";
import {expander} from "./elements.js";

export function pageModel() {
    return state({
        "pageable": {
            "sort": {
                "sorted": false,
                "unsorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 0,
        "last": true,
        "totalElements": 0,
        "size": 0,
        "number": 0,
        "numberOfElements": 0,
        "sort": {
            "sorted": false,
            "unsorted": true
        },
        "first": true,
        "content": []
    }).hierarchy()
}

export function pageRequestModel(pageSize = 25) {
    return state({page: 0, size: pageSize}).hierarchy()
}

function cell(func, row, c) {
    return c.add(func(row, c))
}

/*
function row(data, path, index, level, display) {
    return {
        data: data,
        display: display,
        path: path,
        item() {return resolve(this.data, this.path)},
        index: index,
        level: level
    }
}
 */

export class Column {
    getName() {}
    renderHeader(index) {return this.getName()}
    renderCell(data, td, index) {}
    hidden() {}
    hide(value) {}
}

class TColumn extends Column {
    #delegate
    #function
    constructor(d, f) {
        super();
        this.#delegate = d
        this.#function = f
    }

    getName() {
        return this.#delegate.name();
    }

    renderHeader(index) {
        return this.#delegate.header(index);
    }

    hidden() {
        return this.#delegate.hidden();
    }

    hide(value) {
        return this.#delegate.hide(value);
    }

    renderCell(data, td, index, depth) {
        super.renderCell(this.#function(data, td), td, index, depth);
    }
}

class RColumn extends Column {

    constructor(name, get) {
        super();
        this.n = name
        this.get = get
        this.h = false
        this.index = new PColumn()
    }

    getName() {
        return this.n;
    }

    renderCell(data, td, index) {
        return this.get(data);
    }

    hidden() {
        return this.h
    }

    hide(value) {
        this.h = value
        return this
    }
}

class PColumn extends Column {

    getName() {
        "index";
    }

    renderHeader(index) {
        return "#";
    }

    renderCell(data, td, index) {
        return index
    }

    hidden() {
        return false
    }

    hide(value) {
        return this
    }
}
export function objectPath(n = '', sss = o => o) {
    let c = new RColumn(n, sss)
    return new Proxy(c, {
        get(target, property) {
            return c[property] ? c[property] : objectPath(property, o => sss(o)?.[property])
        }
    })
}

export let row = objectPath()

function _th(col, i) {
    let t = th()
    return t.add(col.renderHeader(t, i))
}

function _td(item, i, column) {
    let t = td()
    return t.add(column.renderCell(item, t, i))
}

class DataTable extends XBuilder {

    constructor(dataModel, offset = state(0)) {
        super(table().get());
        let columnMove = state()
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => dataModel.trigger())
        this.visibleColumnsModel = this.columnsModel.map(cols => cols.filter(col => !col.hidden()))
        let vis = boolean()
        this.add(
            captionTop().position('relative').add(div('rap-columns').position('absolute').right('0', '').top('0', '').marginLeft('-0.5', 'em').add(a().setClass('rap-columns-toggle').onClick(toggle(vis)).add('⋮'),
                div('rap-columns-visibility').display(vis).position('absolute').textLeft().whiteSpace('nowrap').right(0)
                    .add(each(this.columnsModel, column => div().add(
                        checkbox(column.getName()).checked(column.hidden() ? null : 'checked').onChange(() => {column.hide(!column.hidden()); this.columnsModel.trigger()}, true),
                        label(column.getName()).add(column.getName())
                    ))))
            ),
            thead().add(tr().add(each(
                this.visibleColumnsModel,
                (column, index) => {
                    return _th(column, index).setClass('header-' + column.getName()).transfer(columnMove, index).receive(columnMove, from => this.moveColumn(from, index), 'header-receiver', 'header-drop')
                }))
            ),
            tbody().add(each(
                dataModel,
                (item, index) => tr().add(each(this.visibleColumnsModel, column => _td(item, offset.get() + index, column)))
            ))
        )
    }

    column(...defs) {
        this.columnsModel.get().push(...defs)
        this.columnsModel.trigger()
        return this
    }

    moveColumn(from, to) {
        let f = this.columnsModel.get().splice(from, 1)
        this.columnsModel.get().splice(to, 0, ...f)
        this.columnsModel.trigger()
    }

    captionTop(...args) {
        return this.add(caption().captionSide('top').textLeft().nowrap().add(...args))
    }

    captionBottom(...args) {
        return this.add(caption().captionSide('bottom').textLeft().nowrap().add(...args))
    }
}

export function pageControls(page, result, loading) {
    let firstDisabled = result.first.map(to('silver'))
    let lastDisabled = result.last.map(to('silver'))
    let notFirst = not(result.first)
    let notLast = not(result.last)
    return form().onSubmit(event => page.set(parseInt(event.target.page.value) - 1)).add(
        a().setClass('paging first-page').color(firstDisabled).add('\u23EE\uFE0E').title('Go to first page').onClick(when(notFirst, set(page, 0))),
        a().setClass('paging prev-page').color(firstDisabled).add('\u23F4\uFE0E').title('Go to previous page').onClick(when(notFirst, set(page, result.number.map(v => v - 1)))),
        span('paging current-page').add('Page: ', inputText('page').width(2, 'em').value(result.map(v => v.numberOfElements > 0 ? v.number + 1 : 0)), ' of ', result.totalPages, ' (rows ', result.pageable.offset.map(v => v + 1), ' - ', on(result.pageable.offset, result.numberOfElements).apply((a, b) => a + b), ' of ', result.totalElements, ')'),
        a().setClass('paging next-page').color(lastDisabled).add('\u23F5\uFE0E').title('Go to next page').onClick(when(notLast, set(page, result.number.map(v => v + 1)))),
        a().setClass('paging last-page').color(lastDisabled).add('\u23ED\uFE0E').title('Go to last page').onClick(when(notLast, set(page, result.totalPages.map(v => v - 1)))),
        a().setClass('paging reload-page', loading.map(to(' data-loading'))).add('\u21BB').title('Reload page').onClick(trigger(page)),
        span('paging load-timer').add(loading.map(to(' loading ', ' loaded in ')), timer(loading), ' ms.')
    )
}

export function dataTable(result, offset = state(0)) {
    return new DataTable(result, offset)
}

export function pageTable(pageCall, page = pageCall.input.page, result = pageCall.output) {
    return dataTable(result.map(v => v.content), result.pageable.offset)
        .captionTop(pageCall.error)
        .captionBottom(pageControls(page, result, pageCall.loading))
}

export function pageApi(uri) {
    return remote(uri, {page: 0, size: 25}, pageModel())
}

export function searchControls(query) {
    return form().onSubmit(event => query.set(event.target.query.value)).onReset(set(query, '')).add(
        inputText('query').model(query),
        submit('Search'),
        reset('Clear')
    )
}

export function searchTable(searchCall, page = searchCall.input.page, query = searchCall.input.query, result = searchCall.output) {
    // This line is currently causing duplicate rest call with intermediate state.
    // query.onChange(() => page.set(0), false, false)
    return dataTable(result.map(v => v.content), result.pageable.offset).add(
        captionTop().setClass('search').textLeft().nowrap().add(searchControls(query)),
        captionTop().setClass('error').textLeft().nowrap().add(searchCall.error),
        captionBottom().setClass('paging').textLeft().nowrap().add(pageControls(page, result, searchCall.loading))
    )
}

export function searchApi(uri, input = searchPage()) {
    return remote(uri, input, pageModel())
}

export function searchPage(params = {}) {
    let input = state({query: '', order: '', page: 0, size: 25, ...params})
    for(let p in input.get()) if(input.get().hasOwnProperty(p))
        input[p] = input.transform((o, v) => {o.page=0; o[p]=v})
    return input
}

function staticExpand(display, node) {
    return set(display, node.children)
}

export function nodeExpander(expandCommand, model) {
    return boolean().onChange(execute(expandCommand, set(model, [])))
}

class TreeTable extends XBuilder {

    constructor(rootModel, childrenCommand = staticExpand) {
        super(table().get());
        let columnMove = state()
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => rootModel.trigger())
        this.childrenCommand = childrenCommand
        let subTree = (parent, index, level = 1) => {
            let display = list()
            let r = tr().add(each(this.columnsModel, column => _td({data: parent, level: level, display: display}, index, column)))
            //cell(column.cell, row(parent, column.name, index, level, display), td())))
            return parent.hasOwnProperty('children') ? range(r, display, (child, index) => subTree(child, index, level + 1)) : r
        }
        this.add(
            thead().add(tr().add(each(
                this.columnsModel,
                (column, index) => _th(column, index).setClass('header-' + column.getName())
                    //.transfer(columnMove, index)
                    //.receive(columnMove, from => this.moveColumn(from, index), 'header-receiver', 'header-drop')
                ))),
            tbody().add(each(rootModel, (item, index) => subTree(item, index)))
        )
    }

    treeColumn(def) {
        this.columnsModel.get().push(new TColumn(def, (row, t) => {
            t.add(span().paddingLeft(row.level, 'em'))
            if(row.data.hasOwnProperty('children'))
                t.add(expander(nodeExpander(this.childrenCommand(row.display, row.data, row.level), row.display)), ' ')
            return row.data
        }))
        this.columnsModel.trigger()
        return this
    }

    column(...defs) {
        this.columnsModel.get().push(...defs.map(def => new TColumn(def, row => row.data)))
        this.columnsModel.trigger()
        return this
    }
/*
    column(name, content = self) {
        //let c = (row, t) => content(node.item, t)
        //c.header = content.header
        this.columnsModel.get().push({name: ['item', name], cell: content})
        this.columnsModel.trigger()
        return this
    }

    columns(def) {
        let p = (d, ...keys) => {
            for(let k in d) if(d.hasOwnProperty(k)) {
                let c = d[k]
                switch (typeof c) {
                    case "function": this.columnsModel.get().push({name: [...keys, k], cell: c})
                        break
                    case "object": if(!Array.isArray(c)) p(c, ...keys, k)
                        break
                }
            }
        }
        p(def, 'item')
        this.columnsModel.trigger()
        return this
    }
*/

    moveColumn(from, to) {
        let f = this.columnsModel.get().splice(from, 1)
        this.columnsModel.get().splice(to, 0, ...f)
        this.columnsModel.trigger()
    }

}

export function treeTable(channel, childrenModels = staticExpand) {
    return new TreeTable(channel, childrenModels)
}


export function self(row) {
    return row.item()
}
self.header = row => last(row.path)

export function path(row) {
    return self(row)
}
path.header = row => row.path.join(".")

export function position(row) {
    return row.index + 1
}
position.header = () => '#'

export function named(name, cellFunction) {
    let f = (row, c) => cellFunction(row, c)
    f.header = () => name
    return f
}
