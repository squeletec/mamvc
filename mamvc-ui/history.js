import {state} from "../trio.js"

export function parseUri(uri) {
    let u = uri.split('?', 2)
    return {
        path: u[0],
        parameters: u[1] ? Object.fromEntries(u[1].split('&').map(v => v.split('=', 2))).
    }
}
