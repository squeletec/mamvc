import {form, table, thead, tbody, tr, td, th, a, each, caption, list, not, on, state, set, when, inputText, submit, reset, get, XBuilder, channel, span} from "../mamvc.js";


export function pageModel() {
    return state({
        "content": [],
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
        "first": true
    }).hierarchy()
}

export function pagedChannel(...uri) {
    return channel(...uri).setModel(pageModel())
}

function cell(func, rowData, name, c) {
    return c.add(func(rowData, name, c))
}

class DataTable extends XBuilder {

    constructor(dataModel) {
        super(table().get());
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => dataModel.set(dataModel.get()))
        this.add(
            thead().add(tr().add(each(this.columnsModel, column => cell(column.cell.header || self.header, column.name, column.name, th())))),
            tbody().add(each(
                dataModel,
                rowData => tr().add(each(this.columnsModel, column => cell(column.cell, rowData, column.name, td())))
            ))
        )
    }

    column(name, content = rowData => resolve(rowData, name)) {
        this.columnsModel.get().push({name: [name], cell: content})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

    columns(def) {
        let p = (d, ...keys) => {
            for(let k in d) if(d.hasOwnProperty(k)) {
                let c = d[k]
                switch (typeof c) {
                    case "function":
                        let rf = (row, path, e) => c(resolve(row, ...keys, k), path, e)
                        rf.header = c.header
                        this.columnsModel.get().push({name: [...keys, k], cell: rf})
                        break
                    case "object":
                        if(!Array.isArray(c)) p(c, ...keys, k)
                        break
                }
            }
        }
        p(def)
        this.columnsModel.set(this.columnsModel.get())
        return this
    }
    
    paging(pageChannel, pageRequest, page = pageChannel.model()) {
        let firstDisabled = page.first.map(to('silver'))
        let lastDisabled = page.last.map(to('silver'))
        return this.add(
            caption().captionSide('bottom').textLeft().nowrap().add(
                a().setClass('paging first-page').color(firstDisabled).add('\u23EE\uFE0E').title('Go to first page').onClick(when(not(page.first), set(pageRequest.page, 0))),
                a().setClass('paging prev-page').color(firstDisabled).add('\u23F4\uFE0E').title('Go to previous page').onClick(when(not(page.first), set(pageRequest.page, page.number.map(v => v - 1)))),
                span('paging current-page').add('Rows ', page.pageable.offset.map(v => v + 1), ' - ', on(page.pageable.offset, page.size).apply((a, b) => a + b), ' of ', page.totalElements),
                a().setClass('paging next-page').color(lastDisabled).add('\u23F5\uFE0E').title('Go to next page').onClick(when(not(page.last), set(pageRequest.page, page.number.map(v => v + 1)))),
                a().setClass('paging last-page').color(lastDisabled).add('\u23ED\uFE0E').title('Go to last page').onClick(when(not(page.last), set(pageRequest.page, page.totalPages.map(v => v - 1)))),
                a().setClass('paging reload-page').add('\u21BB').title('Reload page').onClick(() => pageChannel.get())
            )
        )
    }
}

export function dataTable(dataModel) {
    return new DataTable(dataModel)
}

export function pageTable(channel, pageRequest) {
    return dataTable(channel.setModel(pageModel()).model().content).paging(channel, pageRequest)
}

export function search(channel, queryModel) {
    return form().onSubmit(get(channel)).onReset(set(queryModel, '')).add(
        inputText('query').model(queryModel),
        submit('Search'),
        reset('Clear')
    )
}

export function resolve(object, ...propertyNames) {
    for(let i = 0; i < propertyNames.length; i++)
        if(typeof object === "object") object = object[propertyNames[i]]
    return object
}

export function self(value) {
    return value
}
self.header = name => name[name.length - 1]

export function path(value) {
    return value
}
path.header = name => name.join(".")
