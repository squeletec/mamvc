import {
    form, table, thead, tbody, tr, td, th, a, each, caption, list, not,
    on, state, set, trigger, when, inputText, submit, reset, to, XBuilder, span, captionTop,
    captionBottom, timer, space, boolean, execute, div, toggle, checkbox, label
} from "../trio.js";
import {pageModel} from "./data-page.js";
import {transformingColumn} from "./data-table-column.js";
import {expander} from "./elements.js";

function _th(col, i, context) {
    let t = th()
    return t.add(col.renderHeader(t, i, context))
}

function _td(item, i, column, context) {
    let t = td()
    return t.add(column.renderCell(item, t, i, context))
}

class AbstractDataTable extends XBuilder {

    constructor(dataModel) {
        super(table().get());
        let columnMove = state()
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(trigger(dataModel))
        this.rowModel = (tr, data) => {}
        this.visibleColumnsModel = this.columnsModel.map(cols => cols.filter(col => !col.hidden()))
        this.add(
            thead().add(tr().add(each(this.visibleColumnsModel, (column, index) => {
                    return _th(column, index, this)
                      .transfer(columnMove, index)
                      .receive(columnMove, from => this.moveColumn(from, index), 'rap-table-header-receiver', 'rap-table-header-drop')
            })))
        )
    }

    repaint() {
        this.columnsModel.trigger()
        return this
    }

    enableColumnMove() {
        return this.repaint()
    }

    enableColumnFiltering() {
        let vis = boolean()
        return this.add(captionTop().position('relative').add(div('rap-columns').position('absolute').right('0', '').top('0', '').marginLeft('-0.5', 'em').add(a().setClass('rap-columns-toggle').onClick(toggle(vis)).add('⋮'),
            div('rap-columns-visibility').display(vis).position('absolute').textLeft().whiteSpace('nowrap').right(0)
                .add(each(this.columnsModel, column => div().add(
                    checkbox(column.getName()).checked(column.hidden() ? null : 'checked').onChange(() => {column.hide(!column.hidden()); this.columnsModel.trigger()}, true),
                    label(column.getName()).add(column.getName())
                ))))
        ))
    }
    
    customizeRow(customizer) {
        this.rowModel = customizer
        return this.repaint()
    }
    
    column(...defs) {
        this.columnsModel.get().push(...defs)
        return this.repaint()
    }

    moveColumn(from, to) {
        let f = this.columnsModel.get().splice(from, 1)
        this.columnsModel.get().splice(to, 0, ...f)
        return this.repaint()
    }

    captionTop(...args) {
        return this.add(caption().captionSide('top').textLeft().nowrap().add(...args))
    }

    captionBottom(...args) {
        return this.add(caption().captionSide('bottom').textLeft().nowrap().add(...args))
    }

}

class DataTable extends AbstractDataTable {
    constructor(dataModel) {
        super(dataModel)
        this.add(tbody().add(each(
                dataModel,
                (item, index) => tr().apply(this.rowModel, item).add(each(this.visibleColumnsModel, column => _td(item, index, column, this)))
            ))
        )
    }
}


function indent(depth) {
    return span().paddingLeft(depth, 'em')
}

function button(command) {
    return a().setClass('rap-tree-table-page-more').onClick(command)
}

export function treeModel(model) {
    return (display, parent, depth) => depth > 0 ? set(display, {content: parent.children, first: true, last: true}) : () => model.onChange(value => display.set({content: value, last: true}))
}

function treePageControls(command, depth, table) {
    return tr().add(each(table.columnsModel, c => c.isTreeColumn
        ? td().setClass('rap-tree-table-page-controls').add(indent(depth), button(command).add('...')) : td()
    ))
}

export function nodeState(expandCommand, model) {
    return boolean().onChange(execute(expandCommand, () => model.set({content: [], first: true, last: true})))
}

function content(table, page, commandFactory, depth, moreCommand, lessCommand) {
    let f = space()
    page.onChange(value => {
        f.clear()
        if(!value.first && lessCommand) {
            f.add(treePageControls(lessCommand, depth, table))
        }
        value.content.forEach((item, index) => {
            let display = pageModel()
            let expandCommand = commandFactory(display, item, depth)
            f.add(tr().add(each(table.columnsModel, column => _td({data: item, depth: depth, nodeState: nodeState(expandCommand, display)}, index, column, table))))
            if(notLeaf(item))
                f.add(content(table, display, commandFactory, depth + 1, expandCommand.more, expandCommand.less))
        })
        if(!value.last && moreCommand) {
            f.add(treePageControls(moreCommand, depth, table))
        }
    })
    return f
}

function notLeaf(item) {
    return item.hasOwnProperty('children')
}

class TreeDataTable extends AbstractDataTable {
    constructor(rootPage, commandFactory) {
        super(rootPage)
        let rootLevelCommand = commandFactory(rootPage, null, 0)
        rootLevelCommand()
        this.add(tbody().add(content(this, rootPage, commandFactory, 1, rootLevelCommand.more, rootLevelCommand.less)))
    }

    treeColumn(def) {
        return super.column(transformingColumn(def, (row, t) => {
            t.add(indent(row.depth), notLeaf(row.data) ? expander(row.nodeState) : span('rap-tree-table-leaf-indent').display('inline-block').width('1', 'em'), ' ')
            return row.data.item
        }, true))
    }

    column(...defs) {
        return super.column(...defs.map(def => transformingColumn(def, row => row.data.item)))
    }

}
export function treeTable(childrenCommandFactory) {
    return new TreeDataTable(pageModel(), childrenCommandFactory)
}

export function pageControls(page, result, loading) {
    let firstDisabled = result.first.map(to('silver'))
    let lastDisabled = result.last.map(to('silver'))
    let notFirst = not(result.first)
    let notLast = not(result.last)
    return form().onSubmit(event => page.set(parseInt(event.target.page.value) - 1)).add(
        a().setClass('paging first-page').color(firstDisabled).add('\u226A').title('Go to first page').onClick(when(notFirst, set(page, 0))),
        a().setClass('paging prev-page').color(firstDisabled).add('<').title('Go to previous page').onClick(when(notFirst, set(page, result.number.map(v => v - 1)))),
        span('paging current-page').add('Page: ', inputText('page').width(2, 'em').value(result.map(v => v.numberOfElements > 0 ? v.number + 1 : 0)), ' of ', result.totalPages, ' (rows ', result.pageable.offset.map(v => v + 1), ' - ', on(result.pageable.offset, result.numberOfElements).apply((a, b) => a + b), ' of ', result.totalElements, ')'),
        a().setClass('paging next-page').color(lastDisabled).add('>').title('Go to next page').onClick(when(notLast, set(page, result.number.map(v => v + 1)))),
        a().setClass('paging last-page').color(lastDisabled).add('\u226B').title('Go to last page').onClick(when(notLast, set(page, result.totalPages.map(v => v - 1)))),
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
