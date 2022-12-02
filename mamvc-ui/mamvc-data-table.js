import {
    form,
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
    when,
    inputText,
    submit,
    reset,
    get,
    to,
    XBuilder,
    channel,
    span,
    template
} from "../mamvc.js";

export function last(array) {
    return array[array.length - 1]
}

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

export function pagedChannel(...uri) {
    return channel(...uri).setModel(pageModel())
}

function cell(func, row, c) {
    return c.add(func(row, c))
}

function row(data, path, index) {
    return {
        data: data,
        path: path,
        item() {return resolve(this.data, this.path)},
        index: index
    }
}

export function resolve(object, propertyNames) {
    for(let i = 0; i < propertyNames.length; i++)
        if(typeof object === "object") object = object[propertyNames[i]]
    return object
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

class DataTable extends XBuilder {

    constructor(dataModel, offset = state(0)) {
        super(table().get());
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => dataModel.set(dataModel.get()))
        this.add(
            thead().add(tr().add(each(this.columnsModel, (column, index) => cell(column.cell.header || self.header, row(column.name, column.name, index), th().setClass('header-' + last(column.name)))))),
            tbody().add(each(
                dataModel,
                (item, index) => tr().add(each(this.columnsModel, column => cell(column.cell, row(item, column.name, offset.get() + index), td())))
            ))
        )
    }

    column(name, content = self) {
        this.columnsModel.get().push({name: [name], cell: content})
        this.columnsModel.set(this.columnsModel.get())
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
        p(def)
        this.columnsModel.set(this.columnsModel.get())
        return this
    }
    
    captionTop(...args) {
        return this.add(caption().captionSide('top').textLeft().nowrap().add(...args))
    }

    captionBottom(...args) {
        return this.add(caption().captionSide('bottom').textLeft().nowrap().add(...args))

    }
}

export function pageControls(pageRequest, pageChannel, page = pageChannel.model()) {
    let firstDisabled = page.first.map(to('silver'))
    let lastDisabled = page.last.map(to('silver'))
    return form().onSubmit(event => pageRequest.page.set(parseInt(event.target.page.value) - 1)).add(
        a().setClass('paging first-page').color(firstDisabled).add('\u23EE\uFE0E').title('Go to first page').onClick(when(not(page.first), set(pageRequest.page, 0))),
        a().setClass('paging prev-page').color(firstDisabled).add('\u23F4\uFE0E').title('Go to previous page').onClick(when(not(page.first), set(pageRequest.page, page.number.map(v => v - 1)))),
        span('paging current-page').add('Page: ', inputText('page').width(2, 'em').value(page.number.map(v => v + 1)), ' of ', page.totalPages, ' (rows ', page.pageable.offset.map(v => v + 1), ' - ', on(page.pageable.offset, page.size).apply((a, b) => a + b), ' of ', page.totalElements, ')'),
        a().setClass('paging next-page').color(lastDisabled).add('\u23F5\uFE0E').title('Go to next page').onClick(when(not(page.last), set(pageRequest.page, page.number.map(v => v + 1)))),
        a().setClass('paging last-page').color(lastDisabled).add('\u23ED\uFE0E').title('Go to last page').onClick(when(not(page.last), set(pageRequest.page, page.totalPages.map(v => v - 1)))),
        a().setClass('paging reload-page').add('\u21BB').title('Reload page').onClick(() => pageChannel.get())
    )
}

export function dataTable(dataModel, offset = state(0)) {
    return new DataTable(dataModel, offset)
}

export function pageTable(pageRequest, channel) {
    let page = pageModel()
    return dataTable(page.map(v => v.content), page.pageable.offset).captionBottom(pageControls(pageRequest, channel.setModel(page)))
}

export function searchControls(queryModel) {
    return form().onSubmit(event => queryModel.set(event.target.query.value)).onReset(set(queryModel, '')).add(
        inputText('query').model(queryModel),
        submit('Search'),
        reset('Clear')
    )
}

export function searchTable(pageRequest, channel, queryModel) {
    return pageTable(pageRequest, channel).captionTop(searchControls(queryModel))
}
