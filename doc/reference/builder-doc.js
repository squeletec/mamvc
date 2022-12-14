import * as m from "../../trio.js"
import {doc, method, section, description, parameter, example} from "../doc.js"
import {code} from "../../trio.js";

m.body().add(
    doc('Document builder API').add(
        section('Element builders').add(
            method(m.builder).add(
                description('Create the DOM builder, and use its features on top of existing DOM Element.'),
                parameter('node', 'DOM node, retrieved by standard DOM API.'),
                example('builder(document.forms[0]).setClass("form-class")')
            ),
            method(m.byId).add(
                description('Create DOM builder for element with provided id.'),
                parameter('id', 'Id of the existing element.')
            ),
            method(m.element).add(
                description('Create DOM element with provided tag name.'),
                parameter('name', 'Name of the element to create.')
            ),
            method(m.body).add(
                description('Element to access ', code().add('document.body')),
                example('body().add(h1().add("Header"))')
            ),
            method(m.head).add(
                description('Element to access ', code().add('document.head')),
                example('head().add(link().rel("icon"))')
            )
        ),
        section('DOM manipulation').add(

        ),
        section('Attribute builders').add(

        ),
        section('Style builders').add(

        ),
        section('Property builders').add(

        ),
        section('Event handlers').add(

        )
    )
)
