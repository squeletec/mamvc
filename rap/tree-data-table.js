import {table, thead, tbody, tr, td, th, a, each, list, state, set, XBuilder, span, boolean, execute, space} from "../trio.js";
import {expander} from "./elements.js";
import {pageModel, TColumn} from "./data-table.js";

function _th(col, i) {
    let t = th()
    return t.add(col.renderHeader(t, i))
}

function _td(item, i, column) {
    let t = td()
    return t.add(column.renderCell(item, t, i))
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

function content(columnsModel, page, commandFactory, depth, moreCommand, lessCommand) {
    let f = space()
    page.onChange(value => {
        f.clear()
        if(!value.first && lessCommand) f.add(tr().add(td().setClass('rap-tree-table-page-controls').colspan(columnsModel.length).add(
            a().setClass('rap-tree-table-page-less').onClick(lessCommand).add('...')
        )))
        value.content.forEach((item, index) => {
            let display = pageModel()
            let expandCommand = commandFactory(display, item, depth)
            f.add(tr().add(each(columnsModel, column => _td({data: item, depth: depth, nodeState: nodeState(expandCommand, display)}, index, column))))
            if(notLeaf(item))
                f.add(content(columnsModel, display, commandFactory, depth + 1, expandCommand.more, expandCommand.less))
        })
        if(!value.last && moreCommand) f.add(tr().add(td().setClass('rap-tree-table-page-controls').colspan(columnsModel.length).add(
            a().setClass('rap-tree-table-page-more').onClick(moreCommand).add('...')
        )))
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
                (column, index) => _th(column, index).setClass('header-' + column.getName())
                    .transfer(columnMove, index)
                    .receive(columnMove, from => this.moveColumn(from, index), 'header-receiver', 'header-drop')
            ))),
            tbody().add(content(this.columnsModel, rootPage, commandFactory, 1, rootLevelCommand.more, rootLevelCommand.less))
        )
    }

    treeColumn(def) {
        this.columnsModel.get().push(new TColumn(def, (row, t) => {
            t.add(
                span().paddingLeft(row.depth, 'em'),
                notLeaf(row.data) ? expander(row.nodeState) : span('rap-tree-table-leaf-indent'),
                ' '
            )     
            return row.data.item
        }))
        this.columnsModel.trigger()
        return this
    }

    column(...defs) {
        this.columnsModel.get().push(...defs.map(def => new TColumn(def, row => row.data.item)))
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
