import {table, thead, tbody, tr, td, th, XBuilder, each, list, state, range, span, boolean, set, execute, resolve, self} from "../mamvc.js";
import {expander} from "./mamvc-elements.js";

export function nodeModel(item = {}) {
    return state({item:item, children:[]}).hierarchy()
}

function cell(cellFunction, rowData, c) {
    return c.add(cellFunction(rowData, c))
}

function row(data, path, index, level) {
    return {
        data: data,
        path: path,
        item() {return resolve(this.data, this.path)},
        index: index,
        level: level
    }
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
        let subTree = (parent, index, level = 1) => {
            let r = tr().add(each(this.columnsModel, column => cell(column.cell, row(parent, column.name, index, level), td())))
            return parent.hasOwnProperty('children') ? range(
                r,
                parent.children,
                (child, index) => subTree(state(child).hierarchy(), index, level + 1)
            ) : r
        }
        this.add(
            thead().add(tr().add(each(this.columnsModel, (column, index) => cell(column.cell.header || (n => n), row(column.name, column.name, index, -1), th().setClass('header-' + column.name))))),
            tbody().add(each(rootModel, (item, index) => subTree(state(item).hierarchy(), index))),
        )
    }

    treeColumn(name, content = self) {
        let c = {name: ['item', name], cell: (row, td) => {
            td.add(span().paddingLeft(row.level, 'em'))
            return content(row, row.data.hasOwnProperty('children') ? td.add(expander(nodeExpander(this.childrenCommand(row.data, row.level), row.data.children)), ' ') : td, row.level)
        }}
        c.cell.header = content.header
        this.columnsModel.get().push(c)
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

    column(name, content = self) {
        //let c = (row, t) => content(node.item, t)
        //c.header = content.header
        this.columnsModel.get().push({name: ['item', name], cell: content})
        this.columnsModel.set(this.columnsModel.get())
        return this
    }

    columns(def) {
        let p = (d, ...keys) => {
            for(let k in d) if(d.hasOwnProperty(k)) {
                let c = d[k]
                switch (typeof c) {
                    case "function": this.columnsModel.get().push({name: [...keys, k], cell: c})
                        break
                    case "object": if(!Array.isArray(c)) p(c, ...keys, k)
                        break
                }
            }
        }
        p(def, 'item')
        this.columnsModel.set(this.columnsModel.get())
        return this
    }
}

export function treeTable(channel, childrenModels = staticExpand) {
    return new TreeTable(channel, childrenModels)
}
