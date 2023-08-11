import {table, thead, tr, th, a, each, captionBottom, state, trigger, Content, captionTop, boolean, div, toggle, checkbox, label, stateProxy, td} from "../../trio/mvc.js";

export class AbstractDataTable extends Content {

    constructor(dataModel) {
        super(table().get());
        let columnMove = state()
        this.columnsModel = stateProxy([])
        this.columnsModel.onChange(trigger(dataModel))
        this.rowModel = (tr, data) => {}
        this.moveEnabled = false
        this.visibleColumnsModel = this.columnsModel.map(cols => cols.filter(col => !col.hidden()))
        this.add(
            thead().add(tr().add(each(this.visibleColumnsModel, (column, index) => {
                let header = th()
                if(this.moveEnabled) header
                    .transfer(columnMove, index)
                    .receive(columnMove, from => this.moveColumn(from, index), 'rap-table-header-receiver', 'rap-table-header-drop')
                return header.add(column.renderHeader(header, index, this))
            })))
        )
    }

    repaint() {
        this.columnsModel.trigger()
        return this
    }

    enableColumnMove() {
        this.moveEnabled = true
        return this.repaint()
    }

    enableColumnFiltering() {
        let vis = boolean()
        return this.add(
            captionTop().position('relative').add(
                div().setClass('rap-columns').position('absolute').right('0', '').top('0', '').marginLeft('-0.5', 'em').add(
                    a().setClass('rap-columns-toggle').onClick(toggle(vis)).add('⋮'),
                    div().setClass('rap-columns-visibility').display(vis).position('absolute').textLeft().whiteSpace('nowrap').right(0).add(
                        each(this.columnsModel, column => div().add(
                            checkbox(column.getName()).checked(column.hidden() ? null : 'checked').onChange(() => {column.hide(!column.hidden()); this.columnsModel.trigger()}, true),
                            label(column.getName()).add(column.getName())
                        ))
                    )
                )
            )
        )
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
        return this.add(captionTop().textLeft().nowrap().add(...args))
    }

    captionBottom(...args) {
        return this.add(captionBottom().textLeft().nowrap().add(...args))
    }

}


export function row(table, index, item, cellData = item) {
    return tr().apply(table.rowModel, item).add(each(table.visibleColumnsModel, column => {
        let cell = td()
        return cell.add(column.renderCell(cellData, cell, index, table))
    }))
}
