import {tbody, each, state, a, captionBottom, captionTop, form, inputText, reset, span, submit, set, trigger, when, to, functionModel, negate, timer} from "../../trio/mvc.js";
import {AbstractDataTable, row} from "./AbstractDataTable.js";

export class DataTable extends AbstractDataTable {
    constructor(dataModel) {
        super(dataModel)
        this.add(tbody().add(each(dataModel, (item, index) => row(this, index, item))))
    }
}

export function dataTable(result, offset = state(0)) {
    return new DataTable(result, offset)
}

export function pageControls(page, result, loading) {
    let firstDisabled = result.first.map(to('silver'))
    let lastDisabled = result.last.map(to('silver'))
    let notFirst = result.first.map(negate)
    let notLast = result.last.map(negate)
    return form().onSubmit(event => page.set(parseInt(event.target.page.value) - 1)).add(
        a().setClass('paging first-page').color(firstDisabled).add('\u226A').title('Go to first page').onClick(when(notFirst, set(page, 0))),
        a().setClass('paging prev-page').color(firstDisabled).add('<').title('Go to previous page').onClick(when(notFirst, set(page, result.number.map(v => v - 1)))),
        span('paging current-page').add('Page: ', inputText('page').width(2, 'em').value(result.map(v => v.numberOfElements > 0 ? v.number + 1 : 0)), ' of ', result.totalPages, ' (rows ', result.pageable.offset.map(v => v + 1), ' - ', functionModel((a, b) => a + b, result.pageable.offset, result.numberOfElements), ' of ', result.totalElements, ')'),
        a().setClass('paging next-page').color(lastDisabled).add('>').title('Go to next page').onClick(when(notLast, set(page, result.number.map(v => v + 1)))),
        a().setClass('paging last-page').color(lastDisabled).add('\u226B').title('Go to last page').onClick(when(notLast, set(page, result.totalPages.map(v => v - 1)))),
        a().setClass('paging reload-page', loading.map(to(' data-loading'))).add('\u21BB').title('Reload page').onClick(trigger(page)),
        span('paging load-timer').add(loading.map(to(' loading ', ' loaded in ')), timer(loading), ' ms.')
    )
}

export function pageTable(pageCall, page = pageCall.input.page, result = pageCall.output) {
    return dataTable(result.map(v => v.content), result.pageable.offset)
        .captionTop(pageCall.error)
        .captionBottom(pageControls(page, result, pageCall.loading))
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
