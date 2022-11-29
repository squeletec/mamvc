import {div} from "../mamvc.js";

export function mainWithSidebar(mainContent, sidebarContent) {
    return div().display('flex').add(
        div('sidebar').add(sidebarContent),
        div().flex('auto').add(mainContent)
    )
}
