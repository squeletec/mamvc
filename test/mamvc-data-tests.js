import {state, div, text, channel} from "../mamvc.js"
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

})
