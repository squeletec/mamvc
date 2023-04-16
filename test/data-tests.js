import {state, div, text, remote, uriModel} from "../trio.js"
import {suite, assertState } from "./test-runner.js";


suite({
    name: "Basic data test suite",

    async testGetChannel() {
        let myState = state()
        remote('data/string.json', null, myState).call()
        await new Promise(resolve => setTimeout(resolve, 1000));
        assertState(myState, "OK")
    },

    async testPostChannel() {
        let myState = state()
        remote('data/string.json', null, myState).setPostData({data:"A"}).call()
        await new Promise(resolve => setTimeout(resolve, 1000));
        assertState(myState, "OK")
    },

    testUriModelTemplateChange() {
        let input = {id: state(1), page: state(0)}
        let m = uriModel("uri/{id}/x.html", input)
        assertState(m, "uri/1/x.html?page=0")
        input.id.set(4)
        assertState(m, "uri/4/x.html?page=0")
    },

    testUriModelParamChange() {
        let input = {id: state(1), page: state(0)}
        let m = uriModel("uri/{id}/x.html", input)
        assertState(m, "uri/1/x.html?page=0")
        input.page.set(1)
        assertState(m, "uri/1/x.html?page=1")
    }

})
