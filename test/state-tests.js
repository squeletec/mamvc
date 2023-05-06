import {state, boolean, concat, template} from "../trio.js"
import {suite, assert, assertState } from "./test-runner.js";


suite({

    name: "Basic State test suite",

    testStateChanged() {
        let myState = state()
        myState.set(45)
        assert(myState.get(), 45)
    },

    testInitialStateBroadcasted() {
        let myState = state("A")
        let capture = null
        myState.onChange(value => capture = value)
        assert(capture, "A")
    },

    testStateChangeBroadcasted() {
        let myState = state()
        let capture = null
        myState.onChange(value => capture = value, false)
        myState.set("A")
        assert(capture, "A")
    },

    testStateUpdateToSameValueBroadcasted() {
        let myState = state("B")
        myState.onChange(value => {throw new Error("No update expected")}, false)
        myState.update("B")
    },

    testMapping() {
        let myState = state()
        let mappedState = myState.map(s => s ? s.content : null)
        assert(mappedState.get(), null)
        myState.set({content:"C"})
        assert(mappedState.get(), "C")
    },

    testAnd() {
        let operandA = boolean(true)
        let operandB = boolean(true)
        let and = operandA.and(operandB)
        assert(and.get(), true)
        operandA.set(false)
        assert(and.get(), false)
    },

    testConcat() {
        let a = state('')
        let b = state('')
        let result = concat("a", a, " b", b)
        assertState(result, "a b")
        a.set(" A")
        assertState(result, "a A b")
        b.set(" B")
        assertState(result, "a A b B")
    },

    testTemplate() {
        let d = state('D')
        let s= template('path/{x}/{a}/{x}', {a: 1, x: d})
        assertState(s, 'path/D/1/D')
        d.set('X')
        assertState(s, 'path/X/1/X')
    },

    testHierarchyAccess() {
        let page = state({content: "A"}).hierarchy()
        assertState(page.content, "A")
    },

    testArrayHierarchyAccess() {
        let page = state(['a', '3']).hierarchy()
        assertState(page.length, 2)
    },

    testNestedHieararchyAccess() {
        let model = state({a:{b:"c"}}).hierarchy()
        assertState(model.a.b, "c")
    }

})
