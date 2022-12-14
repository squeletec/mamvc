import {locationModel, parseUri, toModels} from "../mamvc-ui/history.js"
import {suite, assert, assertState} from "./mamvc-test-runner.js";


suite({

    name: "History serialization tests",

    testParseUri() {
        let parsedUri = parseUri('https://host/path/file.html')
        assert(parsedUri.path, 'https://host/path/file.html')
        assert(Object.entries(parsedUri.parameters).length, 0)
    },

    testParseUriWithOneParameters() {
        let parsedUri = parseUri('https://host/path/file.html?arg1=val1')
        assert(parsedUri.path, 'https://host/path/file.html')
        assert(parsedUri.parameters.arg1, 'val1')
        assert(parsedUri.parameters.arg2, undefined)
        assert(Object.entries(parsedUri.parameters).length, 1)
    },

    testParseUriWithParameters() {
        let parsedUri = parseUri('https://host/path/file.html?arg1=val1&arg2=5')
        assert(parsedUri.path, 'https://host/path/file.html')
        assert(parsedUri.parameters.arg1, 'val1')
        assert(parsedUri.parameters.arg2, '5')
        assert(Object.entries(parsedUri.parameters).length, 2)
    },

    testDefaultLocationModel() {
        let location = locationModel(parseUri("index.html?size=35"), {query: '', size: 35})
        assertState(location, 'index.html')
    },

    testLocationModel() {
        let location = locationModel(parseUri("index.html?size=45"), {query: '', size: 35})
        assertState(location, 'index.html?size=45')
    },

    testLocationModelUpdates() {
        let defaults = {query: '', size: 35}
        let parsedUri = parseUri("index.html?size=45")
        let serializable = toModels(parsedUri, defaults)
        let location = locationModel(parsedUri, defaults, serializable)
        assertState(location, 'index.html?size=45')
        serializable.query.set('Ahoj')
        assertState(location, 'index.html?query=Ahoj&size=45')
    }
})
