import * as m from "../../mamvc.js"
import {doc, method, section, description, parameter, example} from "../mamvc-doc.js"
import {code} from "../../mamvc.js";

m.body().add(
    doc('Document builder API').add(
        section('Element builders').add(
            method(m.builder).add(
                description('Use the DOM builder features on top of standard Javascript DOM Element.')
            ),
            method(m.byId).add(

            ),
            method(m.element).add(

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
