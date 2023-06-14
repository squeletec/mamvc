import {} from "../trio.js";

/**
 * Base column class, a.k.a interface with few default methods.
 *
 * It represents the column with all instructions for it's rendering in dataTable and treeDataTable.
 */
export class Column {

    /**
     * Abstract method to get column name.
     */
    getName() {}

    /**
     * Method to render column header. By default, it simply returns the column name.
     * It gets invoked on any change to the visible table structure. Changes of the structure are e.g. Defining new
     * column, moving a column via drag'n'drop or hiding / showing a column via the table menu.
     *
     * @param th th element in the table. This is provided as parameter to allow customizations, like setting custom
     *           class, direct css styling, event handlers etc.
     * @param columnPosition Current position of the column.
     * @param table Additional table context provided by the table implementation. It can be explicitly associated with the
     *                table.
     * @returns {*} Content to be appended into the th element in the table.
     */
    renderHeader(th, columnPosition, table) {
        return this.getName()
    }

    /**
     * Method to render cell for every row in the data source of the table.
     * It gets invoked (re-rendered) each time either the data changes, or the table structure changes.
     *
     * @param data Data for the current row to be rendered.
     * @param td td element in the table. This is provided as parameter to allow customizations, like setting custom
     *           class, direct css styling, event handlers etc.
     * @param rowIndex Row index in the dataset.
     * @param table Additional table context provided by the table implementation. It can be explicitly associated with the
     * table.
     * @returns {*} Content to be appended into the td element in the table.
     */
    renderCell(data, td, rowIndex, table) {
        return data?.[this.getName()]
    }

    /**
     * Indicator, if this column is currently hidden or not.
     * @returns {boolean} True if the column is now hidden, otherwise false.
     */
    hidden() {
        return false
    }

    /**
     * Instruction to hide or show the column.
     * @param value Boolean flag: True (default) if the column should become hidden, false, if it shouldn't get hidden,
     *              but visible.
     * @returns {Column} The column itself, so it can get chained.
     */
    hide(value = true) {
        return this
    }

    /**
     * Instruction to show or hide the column.
     * @param value Boolean flag: True (default) if the column should become visible, false, if it shouldn't get visible,
     *              but hidden.
     * @returns {Column} The column itself, so it can get chained.
     */
    show(value = true) {
        return this.hide(!value)
    }
}


export class BasicColumn extends Column {

    constructor(name, get = data => data?.[name]) {
        super();
        this.__name = name
        this.__get = get
        this.__hidden = false
    }

    getName() {
        return this.__name;
    }

    renderCell(data, td, index, table) {
        return this.__get(data);
    }

    hidden() {
        return this.__hidden
    }

    hide(value) {
        this.__hidden = value
        return this
    }

}


export function basicColumn(name, get = data?.[name]) {
    return new BasicColumn(name, get)
}


export class DataTransformingColumn extends Column {

    constructor(delegate, dataTransformingFunction, isTreeColumn = false) {
        super();
        this.__delegate = delegate
        this.__function = dataTransformingFunction
        this.isTreeColumn = isTreeColumn
    }

    getName() {
        return this.__delegate.getName();
    }


    renderHeader(th, columnPosition, table) {
        return this.__delegate.renderHeader(th, columnPosition, table);
    }

    hidden() {
        return this.__delegate.hidden();
    }

    hide(value) {
        return this.__delegate.hide(value);
    }

    renderCell(data, td, index, table) {
        return this.__delegate.renderCell(this.__function(data, td, index, table), td, index, table);
    }

}


export function transformingColumn(delegate, transformingFunction, isTreeColumn = false) {
    return new DataTransformingColumn(delegate, transformingFunction, isTreeColumn)
}

export class PositionColumn extends Column {

    getName() {
        return "#";
    }

    renderCell(data, td, index) {
        return index
    }

}

export let position = new PositionColumn()

export function objectPath(name = '', get = o => o) {
    let c = new BasicColumn(name, get)
    return new Proxy(c, {
        get(target, property) {
            return c[property] !== undefined ? c[property] : objectPath(property, o => get(o)?.[property])
        }
    })
}

export let row = objectPath()
