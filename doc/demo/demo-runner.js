import { ul, li, byId, head, body, meta, a, h1, div, pre, boolean, toggle } from "../../trio.js"

let examples = {
    stateview: 'State view',
    expander: 'Expander',
    dialog: 'Dialog'
}

let displayList = boolean()

function item(name, href) {
    return li().add(a('demo-' + href + '.html').add(name))
}

head().add(
    meta().name('viewport').content('width=device-width, initial-scale=1.0')
)

body().add(
    div('stripe').add(''),
    div('nav').add(
        a('').add('< Prev'),
        a('index.html').add('^ Up'),
        a().onClick(toggle(displayList)).add('...'),
        a('').add('Next >')
    ),
    ul().display(displayList).setClass('list').add(
        item('State view', 'stateview'),
        item('Expander', 'expander'),
        item('Dialog', 'dialog'),
        item('Simple data table', 'data-table'),
        item('Search data table', 'search-table'),
        item('Nested structure table', 'data-table-struct'),
        item('Tree table', 'tree-table'),
        item('Tree table loading subtrees via rest API on expansion', 'dynamic-tree-table'),
        item('Layout with sidebar', 'layout-sidebar'),
        item("Drag'n'drop", 'drag-n-drop'),
        item("Post channel", "post-channel"),
        item("Data form", "data-form")
    ),
    h1().add(' demo'),
    pre().id('demoSourceView').add(byId("demoSource").get().outerHTML)
)

