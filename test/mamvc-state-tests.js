import {state, boolean, concat, fill } from "../mamvc.js"
import {suite, assert, assertState } from "./mamvc-test-runner.js";


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
        let p1 = state('')
        let p2 = state('')
        let f1 = "C"
        let result = fill('place1', p1).fill('place2', p2).fill('place3', f1).into("fixed/{place1}/aha/{place2}/aa/{place3}/{place2}")
        assertState(result, "fixed//aha//aa/C/")
        p1.set('value1')
        p2.set('value2')
        assertState(result, "fixed/value1/aha/value2/aa/C/value2")
    },

    testStructure() {
        let page = state({content: "A"}).hierarchy()
        assertState(page.content, "A")
    },

    testNestedStructure() {
        let model = state({a:{b:"c"}}).hierarchy()
        assertState(model.a.b, "c")
    }

})
