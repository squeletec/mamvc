import {state, div, text, channel, remote, uriModel} from "../mamvc.js"
import {suite, assertState } from "./mamvc-test-runner.js";


suite({
    name: "Basic data test suite",

    async testGetChannel() {
        let myState = state()
        channel('data/string.json').setModel().get()
        await new Promise(resolve => setTimeout(resolve, 1000));
        assertState(myState, "OK")
    },

    async testPostChannel() {
        let myState = state()
        channel('data/string.json').setModel().post({data:"A"})
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
