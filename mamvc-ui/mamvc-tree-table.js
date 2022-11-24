import {builder, table, thead, tbody, tr, td, th, XNode, each, list, state, range, boolean} from "../mamvc.js";
import {expander} from "./mamvc-elements.js";

export function nodeModel(item = {}) {
    return state({item:item, children:[]}).hierarchy()
}

class TreeTable extends XNode {

    constructor(channel, item) {
        super(table().get());
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => channel.model().set(channel.model().get()))
        let subTree = (parent) => {
            return parent.hasOwnProperty('children') ? range(
                tr().add(each(this.columnsModel, column => column.cell(parent.item))),
                parent.children,
                child => subTree(child)
            ) : tr().add(each(this.columnsModel, column => column.cell(parent.item)))
        }
        builder(this.get()).add(
            thead().add(tr().add(each(this.columnsModel, column => th().add(column.name)))),
            tbody().add(subTree(channel.setModel(nodeModel(item)).model())),
        )
    }

    treeColumn(name, content = rowData => td().add(expander(boolean()), ' ', rowData[name])) {
        return this.column(name, content)
    }

    column(name, content = rowData => td().add(rowData[name])) {
        this.columnsModel.get().push({name: name, cell: content})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

}

export function treeTable(channel, item = {}) {
    return new TreeTable(channel, item)
}
