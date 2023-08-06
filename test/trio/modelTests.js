import {assert, assertState, suite} from "../test-runner.js";
import {state} from "../../trio/model/StateModel.js";
import {stateProxy} from "../../trio/model/StateProxy.js";

suite({
    name: "Model tests",

    testModel() {
        let model = state()
        assertState(model, null)
        model.set("A")
        assertState(model, "A")
    },

    testModelObserverExecutedNow() {
        let model = state("A")
        let value = null
        assert(value, null)
        model.observe(v => value = v)
        assert(value, "A")
        model.set("B")
        assert(value, "B")
    },

    testModelObserverNotExecutedNow() {
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
