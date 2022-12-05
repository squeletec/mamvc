import {
    form, table, thead, tbody, tr, td, th, a, each, caption, list, not, on, state, string, set, when, inputText, submit,
    reset, to, XBuilder, channel, span, remote, resolve, last, self
} from "../mamvc.js";

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

    moveColumn(from, to) {
        let f = this.columnsModel.get().splice(from, 1)
        this.columnsModel.get().splice(to, 0, ...f)
        this.columnsModel.set(this.columnsModel.get())
    }

    captionTop(...args) {
        return this.add(caption().captionSide('top').textLeft().nowrap().add(...args))
    }

    captionBottom(...args) {
        return this.add(caption().captionSide('bottom').textLeft().nowrap().add(...args))
    }
}

export function pageControls(page, result) {
    let firstDisabled = result.first.map(to('silver'))
    let lastDisabled = result.last.map(to('silver'))
    let notFirst = not(result.first)
    let notLast = not(result.last)
    return form().onSubmit(event => page.page.set(parseInt(event.target.page.value) - 1)).add(
        a().setClass('paging first-page').color(firstDisabled).add('\u23EE\uFE0E').title('Go to first page').onClick(when(notFirst, set(page, 0))),
        a().setClass('paging prev-page').color(firstDisabled).add('\u23F4\uFE0E').title('Go to previous page').onClick(when(notFirst, set(page, result.number.map(v => v - 1)))),
        span('paging current-page').add('Page: ', inputText('page').width(2, 'em').value(result.number.map(v => v + 1)), ' of ', result.totalPages, ' (rows ', result.pageable.offset.map(v => v + 1), ' - ', on(result.pageable.offset, result.size).apply((a, b) => a + b), ' of ', result.totalElements, ')'),
        a().setClass('paging next-page').color(lastDisabled).add('\u23F5\uFE0E').title('Go to next page').onClick(when(notLast, set(page, result.number.map(v => v + 1)))),
        a().setClass('paging last-page').color(lastDisabled).add('\u23ED\uFE0E').title('Go to last page').onClick(when(notLast, set(page, result.totalPages.map(v => v - 1)))),
        a().setClass('paging reload-page').add('\u21BB').title('Reload page').onClick(set(page, page))
    )
}

export function dataTable(result, offset = state(0)) {
    return new DataTable(result, offset)
}

export function pageTable(pageCall, page = pageCall.input.page, data = pageCall.output) {
    return dataTable(data.map(v => v.content), data.pageable.offset).captionBottom(pageControls(page, data))
}

export function pageApi(uri) {
    return remote(uri, {page: state(0), size: state(25)}, pageModel())
}

export function searchControls(query) {
    return form().onSubmit(event => query.set(event.target.query.value)).onReset(set(query, '')).add(
        inputText('query').model(query),
        submit('Search'),
        reset('Clear')
    )
}

export function searchTable(searchCall, page = searchCall.input.page, query = searchCall.input.query, result = searchCall.output) {
    return pageTable(searchCall, page, result).captionTop(searchControls(query))
}

export function searchApi(uri) {
    return remote(uri, {query: string(), order: string(), page: state(0), size: state(25)}, pageModel())
}
