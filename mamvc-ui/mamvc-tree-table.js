import {table, thead, tbody, tr, td, th, XBuilder, each, list, state, range, span, boolean, set, execute} from "../mamvc.js";
import {expander} from "./mamvc-elements.js";

export function nodeModel(item = {}) {
    return state({item:item, children:[]}).hierarchy()
}

function cell(level, column, rowData, c = td()) {
    return c.add(column.cell(rowData, c, level))
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
        let subTree = (parent, level = 0) => {
            let row = tr().add(each(this.columnsModel, column => cell(level, column, parent)))
            return parent.hasOwnProperty('children') ? range(
                row,
                parent.children,
                child => subTree(state(child).hierarchy(), level + 1)
            ) : row
        }
        this.add(
            thead().add(tr().add(each(this.columnsModel, column => th().add(column.name)))),
            tbody().add(each(rootModel, item => subTree(state(item).hierarchy()))),
        )
    }

    treeColumn(name, content = rowData => rowData[name]) {
        this.columnsModel.get().push({name: name, cell: (node, td, level) => {
            td.add(span().paddingLeft(level, 'em'))
            return content(node.item, node.hasOwnProperty('children') ? td.add(expander(nodeExpander(this.childrenCommand(node, level), node.children)), ' ') : td, level)
        }})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

    column(name, content = rowData => rowData[name]) {
        this.columnsModel.get().push({name: name, cell: (node, td, level) => content(node.item, td, level)})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

}

export function treeTable(channel, childrenModels = staticExpand) {
    return new TreeTable(channel, childrenModels)
}
