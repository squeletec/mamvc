import {div} from "../trio.js";

export function mainWithSidebar(mainContent, ...sidebarContent) {
    return div().display('flex').add(
        div('sidebar').add(...sidebarContent),
        mainContent.flex('auto')
    )
}
