import {table, thead, tbody, tr, td, th, a, each, list, state, set, XBuilder, span, boolean, execute, space} from "../trio.js";
import {expander} from "./elements.js";
import {pageModel} from "./data-page.js";
import {transformingColumn} from "./data-table-column.js";

function _th(col, i, table) {
    let t = th()
    return t.add(col.renderHeader(t, i, table))
}

function _td(item, i, column, table) {
    let t = td()
    return t.add(column.renderCell(item, t, i, table))
}

export function treeModel(model) {
    return (display, parent, depth) => depth > 0 ? set(display, {content: parent.children, first: true, last: true}) : () => model.onChange(value => display.set({content: value, last: true}))
}

export function nodeState(expandCommand, model) {
    return boolean().onChange(execute(expandCommand, () => model.set({content: [], first: true, last: true})))
}

function notLeaf(item) {
    return item.hasOwnProperty('children')
}

function indent(depth) {
    return span().paddingLeft(depth, 'em')
}

function button(command) {
    return a().onClick(command)
}

function treePageControls(command, depth, table) {
    return tr().add(each(table.columnsModel, c => c.isTreeColumn
                         ? td().add(indent(depth), button(command).add('...'))
                         : td()
                        ))
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
            f.add(tr().add(each(table.columnsModel, c => c.isTreeColumn ? td().setClass('rap-tree-table-page-controls').add(
                    span().paddingLeft(depth, 'em'),
                a().setClass('rap-tree-table-page-more').onClick(moreCommand).add('...')
            ) : td())))
        }
    })
    return f
}

class PagedTreeTable extends XBuilder {

    constructor(commandFactory) {
        super(table().get());
        let rootPage = pageModel()
        let columnMove = state()
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => rootPage.trigger())
        let rootLevelCommand = commandFactory(rootPage, null, 0)
        rootLevelCommand()
        this.add(
            thead().add(tr().add(each(
                this.columnsModel,
                (column, index) => _th(column, index, this)
                    .transfer(columnMove, index)
                    .receive(columnMove, from => this.moveColumn(from, index), 'header-receiver', 'header-drop')
            ))),
            tbody().add(content(this, rootPage, commandFactory, 1, rootLevelCommand.more, rootLevelCommand.less))
        )
    }

    treeColumn(def) {
        this.columnsModel.get().push(transformingColumn(def, (row, t) => {
            t.add(
                span().paddingLeft(row.depth, 'em'),
                notLeaf(row.data) ? expander(row.nodeState) : span('rap-tree-table-leaf-indent').display('inline-block').width('1', 'em'), //.color('transparent').add('\u25B6'),
                ' '
            )     
            return row.data.item
        }, true))
        this.columnsModel.trigger()
        return this
    }

    column(...defs) {
        this.columnsModel.get().push(...defs.map(def => transformingColumn(def, row => row.data.item)))
        this.columnsModel.trigger()
        return this
    }

    moveColumn(from, to) {
        let f = this.columnsModel.get().splice(from, 1)
        this.columnsModel.get().splice(to, 0, ...f)
        this.columnsModel.trigger()
    }

}

export function treeTable(childrenModels) {
    return new PagedTreeTable(childrenModels)
}
