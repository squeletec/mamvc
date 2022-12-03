import { ul, li, byId, body, a, h1, div, pre } from "../../mamvc.js"

function item(name, href) {
    return li().add(a('mamvc-demo-' + href + '.html').add(name))
}

body().add(
    h1().add(a('index.html').title('Back to list of all examples').add('<'), ' Demo'),
    ul().add(
        item('State view', 'stateview'),
        item('Expander', 'expander'),
        item('Dialog', 'dialog'),
        item('Simple data table', 'data-table'),
        item('Search data table', 'search-table'),
        item('Nested structure table', 'data-table-struct'),
        item('Tree table', 'tree-table'),
        item('Tree table loading subtrees via rest API on expansion', 'dynamic-tree-table'),
        item('Layout with sidebar', 'layout-sidebar'),
    ),
    pre().id('demoSourceView').add(byId("demoSource").get().outerHTML)
)

