import { ul, li, byId, body, a, h1, div, pre } from "../../trio.js"

function item(name, href) {
    return li().add(a('demo-' + href + '.html').add(name))
}

body().add(
    ul().float('right').add(
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
    h1().add(a('index.html').title('Back to list of all examples').add('<'), ' Demo'),
    pre().id('demoSourceView').add(byId("demoSource").get().outerHTML)
)

