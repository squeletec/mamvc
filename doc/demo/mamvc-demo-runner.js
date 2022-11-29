import { byId, body, a, h1, div, pre } from "../../mamvc.js"

body().add(
    h1().add(a('index.html').title('Back to list of all examples').add('<'), ' Demo'),
    pre().id('demoSourceView').add(byId("demoSource").get().outerHTML)
)

