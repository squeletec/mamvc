import { ul, li, byId, head, body, meta, a, h1, div, pre, boolean, toggle } from "../../trio.js"

let examples = [
    ['stateview', 'State view'],
    ['expander', 'Expander'],
    ['dialog', 'Dialog'],
    ['data-table', 'Simple data table'],
    ['search-table', 'Search data table'],
    ['data-table-struct', 'Data table with nested structure'],
    ['tree-table', 'Tree table'],
    ['dynamic-tree-table', 'Tree table loading node children dynamically']
]

let positions = Object.fromEntries(examples.map(([v,k], i) => ['demo-' + v + '.html', i]))

let displayList = boolean()

function item(name, href) {
    return li().add(a('demo-' + href + '.html').add(name))
}

let p = positions[location.pathname.substring(location.pathname.lastIndexOf('/') + 1)]

head().add(
    meta().name('viewport').content('width=device-width, initial-scale=1.0')
)

body().add(
    div('stripe').add('RAP Examples'),
    div('nav').add(
        a(p > 0 ? examples[p - 1] : null).add('< Prev'),
        a('index.html').add('^ Up'),
        a().onClick(toggle(displayList)).add('...'),
        a(p < examples.length - 1 ? examples[p + 1] : null).add('Next >')
    ),
    ul().display(displayList).setClass('list').add(
        ...examples.map(([k,v]) => item(v, k))
        /*
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
        item("Data form", "data-form")*/
    ),
    h1().add(' demo'),
    pre().id('demoSourceView').add(byId("demoSource").get().outerHTML)
)

