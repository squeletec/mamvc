import {stateProxy} from "../../trio/model/StateProxy.js";

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
    return stateProxy(emptyPage())
}

export function pageRequestModel(pageSize = 25) {
    return stateProxy({page: 0, size: pageSize})
}
