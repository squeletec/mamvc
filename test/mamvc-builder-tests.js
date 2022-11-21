import {state, div, text } from "../mamvc.js"
import {suite, assert } from "./mamvc-test-runner.js";


suite({
    name: "Basic builder test suite",

    testText() {
        assert(text('A').get().textContent, 'A')
    },

    testTextObservingState() {
        let myState = state('E')
        let t = text(myState)
        assert(t.get().textContent, 'E')
        myState.set('F')
    },

    testContentObservingState() {
        let myState = state("C")
        let d = div().add(myState)
        assert(d.get().innerHTML, 'C')
        myState.set("D")
        assert(d.get().innerHTML, 'D')
    }
})
