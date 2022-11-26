import {
    form,
    builder,
    table,
    thead,
    tbody,
    tr,
    td,
    th,
    a,
    XNode,
    each,
    tfoot,
    list,
    not,
    on,
    state,
    set,
    when,
    inputText, submit, reset, get
} from "../mamvc.js";


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

function cell(column, rowData, c = td()) {
    return c.add(column.cell(rowData, c))
}

class DataTable extends XNode {

    constructor(channel, pageRequest) {
        super(table().get());
        let page = channel.setModel(pageModel()).model()
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => channel.model().set(channel.model().get()))
        builder(this.get()).add(
            thead().add(tr().add(each(this.columnsModel, column => th().add(column.name)))),
            tbody().add(each(
                page.content,
                rowData => tr().add(each(this.columnsModel, column => cell(column, rowData)))
            )),
            tfoot().add(
                tr().add(td().colspan(this.columnsModel.length).add(
                    a().add('<<').onClick(when(not(page.first), set(pageRequest.page, 0))),
                    a().add('<').onClick(when(not(page.first), set(pageRequest.page, page.number.map(v => v - 1)))),
                    'Displaying results ', page.pageable.offset, ' - ', on(page.pageable.offset, page.size).apply((a, b) => a + b), ' of total ', page.totalElements,
                    a().add('>').onClick(when(not(page.last), set(pageRequest.page, page.number.map(v => v + 1)))),
                    a().add('>>').onClick(when(not(page.last), set(pageRequest.page, page.totalPages))),
                    a().add('%').onClick(() => channel.get())
                ))
            )
        )
    }

    column(name, content = rowData => rowData[name]) {
        this.columnsModel.get().push({name: name, cell: content})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

}

export function pageTable(channel, pageRequest) {
    return new DataTable(channel, pageRequest)
}

export function search(channel, queryModel) {
    return form().onSubmit(get(channel)).onReset(set(queryModel, '')).add(
        inputText('query').model(queryModel),
        submit('Search'),
        reset('Clear')
    )
}
