import {tbody, tr, td, a, each, set, trigger, span, boolean, runEitherOr, dynamicFragment} from "../../trio/mvc.js";
import {pageModel} from "./Page.js";
import {transformingColumn} from "./Column.js";
import {expander} from "../controls/expander.js";
import {AbstractDataTable, row} from "./AbstractDataTable.js";


export class TreeDataTable extends AbstractDataTable {
    constructor(rootPage, commandFactory) {
        super(rootPage)
        let rootLevelCommand = commandFactory(rootPage, null, 0)
        rootLevelCommand()
        this.add(tbody().add(content(this, rootPage, commandFactory, 1, rootLevelCommand)))
    }

    treeColumn(def) {
        return super.column(transformingColumn(def, (row, t) => {
            t.add(indent(row.depth), notLeaf(row.data) ? expander(row.nodeState) : notLeafIndent(), ' ')
            return row.data.item
        }, true))
    }

    column(...defs) {
        return super.column(...defs.map(def => transformingColumn(def, row => row.data.item)))
    }
}

function notLeafIndent() {
    return span().setClass('rap-tree-table-leaf-indent').display('inline-block').width('1', 'em')
}

function content(table, page, commandFactory, depth, parentCommand) {
    let f = dynamicFragment()
    page.onChange(value => {
        f.clear()
        if(!value.first && parentCommand.less) {
            f.add(treePageControls(parentCommand.less, depth, table))
        }
        value.content.forEach((item, index) => {
            let display = pageModel()
            page.onChange(trigger(display))
            let expandCommand = commandFactory(display, item, depth)
            f.add(row(table, index, item, {data: item, depth: depth, nodeState: nodeState(expandCommand, display)}))
            if(notLeaf(item))
                f.add(content(table, display, commandFactory, depth + 1, expandCommand))
        })
        if(!value.last && parentCommand.more) {
            f.add(treePageControls(parentCommand.more, depth, table))
        }
    })
    return f
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
        ? td().setClass('rap-tree-table-page-controls').add(indent(depth), notLeafIndent(), button(command).add('...')) : td()
    ))
}

export function nodeState(expandCommand, model) {
    return boolean().onChange(runEitherOr(expandCommand, () => model.set({content: [], first: true, last: true})))
}

function notLeaf(item) {
    return item.hasOwnProperty('children')
}

export function treeTable(childrenCommandFactory) {
    return new TreeDataTable(pageModel(), childrenCommandFactory)
}
