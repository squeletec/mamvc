import {
    builder,
    table,
    thead,
    tbody,
    tr,
    td,
    th,
    XNode,
    each,
    list,
    state,
    range,
    onDemand,
    channel,
    span, boolean
} from "../mamvc.js";
import {expander} from "./mamvc-elements.js";

export function nodeModel(item = {}) {
    return state({item:item, children:[]}).hierarchy()
}

function cell(level, column, rowData, c = td()) {
    return c.add(column.cell(rowData, c, level))
}

function staticExpand(childrenModel, expanded) {
    let children = childrenModel.get()
    expanded.onChange(v => childrenModel.set(v ? children : []))
}

export function loadFrom(channelProvider) {
    return (childrenModel, expanded, level) => onDemand(channelProvider(childrenModel, level).setModel(childrenModel), expanded).setInitial([])
}

class TreeTable extends XNode {

    constructor(rootModel, childrenModels = staticExpand) {
        super(table().get());
        this.columnsModel = list().hierarchy()
        this.columnsModel.onChange(() => rootModel.set(rootModel.get()))
        this.childrenModels = childrenModels
        let subTree = (parent, level = 0) => {
            let row = tr().add(each(this.columnsModel, column => cell(level, column, parent)))
            return parent.hasOwnProperty('children') ? range(
                row,
                parent.children,
                child => subTree(state(child).hierarchy(), level + 1)
            ) : row
        }
        builder(this.get()).add(
            thead().add(tr().add(each(this.columnsModel, column => th().add(column.name)))),
            tbody().add(each(rootModel, item => subTree(state(item).hierarchy()))),
        )
    }

    treeColumn(name, content = rowData => rowData[name]) {
        this.columnsModel.get().push({name: name, cell: (node, td, level) => {
            if(node.hasOwnProperty('children')) {
                let expanded = boolean()
                this.childrenModels(node.children, expanded, level)
                return content(node.item, td.add(span().paddingLeft(level, 'em'), expander(expanded), ' '), level)
            }
            else return content(node.item, td.add(span().paddingLeft(level, 'em')), level)
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
