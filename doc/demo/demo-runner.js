import { ul, li, byId, head, body, meta, a, h1, div, pre, boolean, toggle } from "../../trio.js"

let examples = [
    ['stateview', 'State view'],
    ['expander', 'Expander'],
    ['dialog', 'Dialog'],
    ['data-table', 'Simple data table'],
    ['search-table', 'Search data table'],
    ['data-table-struct', 'Data table with nested structure'],
    ['simple-paged-tree-table', 'Simple Paged Tree table'],
    ['dynamic-paged-tree-table', 'Paged Tree table loading node children dynamically'],
    ['layout-sidebar', 'Layout with sidebar'],
    ['drag-n-drop', 'Drag and drop']
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
        a(p > 0 ? 'demo-' + examples[p - 1][0] + '.html' : null).add('< Prev'),
        a('index.html').add('^ Up'),
        a().onClick(toggle(displayList)).add('...'),
        a(p < examples.length - 1 ? 'demo-' + examples[p + 1][0] + '.html' : null).add('Next >')
    ),
    ul().display(displayList).setClass('list').add(
        ...examples.map(([k,v]) => item(v, k))
        /*
        item('Tree table loading subtrees via rest API on expansion', 'dynamic-tree-table'),
        item("Post channel", "post-channel"),
        item("Data form", "data-form")*/
    ),
    h1().add(' demo'),
    pre().id('demoSourceView').add(byId("demoSource").get().outerHTML)
)

