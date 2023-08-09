import {assert, assertState, suite} from "../test-runner.js";
import {state, stateProxy} from "../../trio/mvc.js";

suite({

    name: "Model tests",

    modelGetReturnsLastSetValue() {
        let model = state()
        assertState(model, null)
        model.set("A")
        assertState(model, "A")
    },

    modelNotifiesObserverWithInitialValueAndOnEveryUpdate() {
        let model = state("A")
        let value = null
        assert(value, null)
        model.observe(v => value = v)
        assert(value, "A")
        model.set("B")
        assert(value, "B")
    },

    modelDoesntNotifyObserverWithInitialValueWhenInstructed() {
        let model = state("A")
        let value = null
        assert(value, null)
        model.observe(v => value = v, false)
        assert(value, null)
        model.set("B")
        assert(value, "B")
    },

    testModelProxy() {
        let model = stateProxy(state())
        model.set({name: "B"})
        assertState(model.name, "B")
        model.name.set("A")
        assert(model.get().name, "A")
    }

})
