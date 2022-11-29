import {form, table, thead, tbody, tr, td, th, a, each, tfoot, list, not, on, state, set, when, inputText, submit, reset, get, XBuilder, channel, span} from "../mamvc.js";


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

function cell(column, rowData, c = td()) {
    return c.add(column(rowData, c))
}

class DataTable extends XBuilder {

    constructor(dataModel) {
        super(table().get());
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => dataModel.set(dataModel.get()))
        this.add(
            thead().add(tr().add(each(this.columnsModel, column => th().add(column.name)))),
            tbody().add(each(
                dataModel,
                rowData => tr().add(each(this.columnsModel, column => cell(column.cell, rowData)))
            ))
        )
    }

    column(name, content = rowData => rowData[name]) {
        this.columnsModel.get().push({name: name, cell: content})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

    columns(def) {
        for(k in def) if(def.hasOwnProperty(k)) {
            if(typeof def[k] === 'function')
                this.column(k, o => def[k](o[k]))
        }
    }
    
    paging(pageChannel, pageRequest, page = pageChannel.model()) {
        return this.add(
            tfoot().add(
                tr().add(td().colspan(this.columnsModel.length).add(
                    a().setClass('paging first-page').add('\u23EE\uFE0E').title('Go to first page').onClick(when(not(page.first), set(pageRequest.page, 0))),
                    a().setClass('paging prev-page').add('\u23F4\uFE0E').title('Go to previous page').onClick(when(not(page.first), set(pageRequest.page, page.number.map(v => v - 1)))),
                    span('paging current-page').add('Showing results ', page.pageable.offset.map(v => v + 1), ' - ', on(page.pageable.offset, page.size).apply((a, b) => a + b), ' of total ', page.totalElements),
                    a().setClass('paging next-page').add('\u23F5\uFE0E').title('Go to next page').onClick(when(not(page.last), set(pageRequest.page, page.number.map(v => v + 1)))),
                    a().setClass('paging last-page').add('\u23ED\uFE0E').title('Go to last page').onClick(when(not(page.last), set(pageRequest.page, page.totalPages))),
                    a().setClass('paging reload-page').add('\u21BB').title('Reload page').onClick(() => pageChannel.get())
                ))
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
