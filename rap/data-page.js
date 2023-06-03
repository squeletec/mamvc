import {state, remote} from "../trio.js";

export function emptyPage() {
    return {
        "pageable": {
            "sort": {
                "sorted": false,
                "unsorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 0,
        "last": true,
        "totalElements": 0,
        "size": 0,
        "number": 0,
        "numberOfElements": 0,
        "sort": {
            "sorted": false,
            "unsorted": true
        },
        "first": true,
        "content": []
    }
}

export function pageModel() {
    return state(emptyPage()).hierarchy()
}

export function pageRequestModel(pageSize = 25) {
    return state({page: 0, size: pageSize}).hierarchy()
}

export function pageApi(uri) {
    return remote(uri, {page: 0, size: 25}, pageModel())
}

export function searchApi(uri, input = searchPage()) {
    return remote(uri, input, pageModel())
}


export function searchPage(params = {}) {
    let input = state({query: '', order: '', page: 0, size: 25, ...params})
    for(let p in input.get()) if(input.get().hasOwnProperty(p))
        input[p] = input.transform((o, v) => {o.page=0; o[p]=v})
    return input
}
