import {assertState, suite} from "../test-runner.js";
import {getChannel, postChannel, properties, state, stateProxy, usingTemplate, usingUriTemplate} from "../../trio/mvc.js";

suite({

    name: "Channel tests",

    testGetChannel() {
        let input = state({id: 1, name: "a", content: "body"})
        let channel = getChannel("data/channel{id}/{name}.json", input)
        channel.trigger()
    },

    testPostChannel() {
        let input = state({id: 1, name: "a", content: "body"})
        let channel = postChannel("data/channel{id}/{name}.json", input)
        channel.trigger()
    },

    testNestedGetUri() {
        let params = stateProxy({query: ""})
        assertState(params.query, "")
        let param = state({id: 1})
        param.map(usingTemplate("id={id}")).routeTo(params.query)
        assertState(params.query, "id=1")
        let uri = params.map(properties(encodeURIComponent)).map(usingUriTemplate("data/channel1/a.json"))
        assertState(uri, "data/channel1/a.json?query=id%253D1")
    },

    testGetChannelLoadedOnInput() {
        let input = stateProxy({id: 1, name: "a", content: "body"})
        getChannel("data/channel{id}/{name}.json", input).observeInput()
        input.name.set("b")
    }
})
