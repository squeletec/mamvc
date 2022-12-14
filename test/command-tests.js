import {state, boolean, set, toggle, when} from "../trio.js"
import {suite, assertState } from "./test-runner.js";


suite({
    name: "Basic command test suite",

    testSetCommand() {
        let myState = state()
        let myCommand = set(myState, "X")
        myCommand()
        assertState(myState, "X")
    },

    testToggleCommand() {
        let myState = boolean()
        let myCommand = toggle(myState)
        assertState(myState, false)
        myCommand()
        assertState(myState, true)
        myCommand()
        assertState(myState, false)
    },

    testConditionalCommand() {
        let enabled = boolean()
        let model = state()
        let command = when(enabled, set(model, "A"))
        command()
        assertState(model, null)
        enabled.set(true)
        assertState(model, null)
        command()
        assertState(model, "A")
    }

})
