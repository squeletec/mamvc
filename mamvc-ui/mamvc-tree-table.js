import {table, thead, tbody, tr, td, th, XBuilder, each, list, state, range, span, boolean, set, execute} from "../mamvc.js";
import {expander} from "./mamvc-elements.js";

export function nodeModel(item = {}) {
    return state({item:item, children:[]}).hierarchy()
}

function cell(level, cellFunction, rowData, path, c) {
    return c.add(cellFunction(rowData, path, c, level))
}

function staticExpand(nodeModel) {
    return set(nodeModel.children, nodeModel.children.get())
}

export function nodeExpander(expandCommand, model) {
    return boolean().onChange(execute(expandCommand, set(model, [])))
}

class TreeTable extends XBuilder {

    constructor(rootModel, childrenCommand = staticExpand) {
        super(table().get());
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => rootModel.set(rootModel.get()))
        this.childrenCommand = childrenCommand
        let subTree = (parent, level = 1) => {
            let row = tr().add(each(this.columnsModel, column => cell(level, column.cell, parent, column.name, td())))
            return parent.hasOwnProperty('children') ? range(
                row,
                parent.children,
                (child, index) => subTree(state(child).hierarchy(), level + 1)
            ) : row
        }
        this.add(
            thead().add(tr().add(each(this.columnsModel, column => cell(-1, column.cell.header || (n => n), column.name, column.name, th().setClass('header-' + column.name))))),
            tbody().add(each(rootModel, item => subTree(state(item).hierarchy()))),
        )
    }

    treeColumn(name, content = rowData => rowData[name]) {
        this.columnsModel.get().push({name: name, cell: (node, path, td, level) => {
            td.add(span().paddingLeft(level, 'em'))
            return content(node.item, path, node.hasOwnProperty('children') ? td.add(expander(nodeExpander(this.childrenCommand(node, level), node.children)), ' ') : td, level)
        }})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

    column(name, content = rowData => rowData[name]) {
        let c = (node, path, t, level) => content(node.item, path, t, level)
        c.header = content.header
        this.columnsModel.get().push({name: name, cell: c})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

}

export function treeTable(channel, childrenModels = staticExpand) {
    return new TreeTable(channel, childrenModels)
}
