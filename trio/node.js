/*
BSD 2-Clause License

Copyright (c) 2022, c0stra
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import {isState} from "./state.js";

/**
 * Class XNode is a wrapper for DOM element, providing builder interface for basic operations on the node.
 */
export class XNode {

    #node

    /**
     * Constructor of the XNode wrapper creating a wrapper on top of provided DOM Node.
     * @param node Wrapped DOM Node.
     */
    constructor(node) {
        this.#node = node
    }

    /**
     * Get the wrapped DOM Node.
     * @returns {*} Wrapped DOM Node
     */
    get() {
        return this.#node
    }

    /**
     * Prepend provided content before this node.
     * @param node Content to prepend
     * @returns {XNode} This builder instance.
     */
    prepend(node) {
        this.#node.parentNode.insertBefore(x(node).get(), this.#node)
        return this
    }

    /**
     * Remove this node from the document (from its parent).
     * @returns {XNode} This builder instance.
     */
    remove() {
        this.#node.parentNode.removeChild(this.#node)
        return this
    }

    /**
     * Replace this node with provided content.
     * @param replacement Replacement.
     * @returns {XNode} This builder instance.
     */
    replace(replacement) {
        this.#node.parentNode.replaceChild(x(replacement).get(), this.#node)
        return this
    }

    /**
     * Append this node to provided builder.
     * @param parent Builder to append this one to.
     * @returns {XNode} This builder instance.
     */
    to(parent) {
        parent.add(this)
        return this
    }

    /**
     * Set node value.
     * @param value Text value to set.
     * @returns {XNode} This builder instance.
     */
    setValue(value) {
        this.#node.nodeValue = value
        return this;
    }
}

/**
 * Create XNode wrapping DOM text node with provided value.
 * @param value Value of the text node.
 * @returns {XNode} New XNode instance.
 */
export function text(value = '') {
    if(isState(value)) {
        let node = new XNode(document.createTextNode(value.get()))
        value.onChange(v => node.setValue(v))
        return node
    }
    return new XNode(document.createTextNode(value))
}

/**
 * Turn provided content into an XNode.
 * If it's already an XNode, then leave it as is.
 * If it's DOM Node, then wrap it with XNode.
 * If it's State (see state.js), then it creates new text node, which observes the state value.
 * Otherwise, new text node containing text representation of the content is created.
 * @param parameter Content to be turned into an XNode.
 * @returns {XNode} XNode created based on the logic described.
 */
export function x(parameter) {
    if (parameter instanceof XNode)
        return parameter
    if (parameter instanceof Node)
        return new XNode(parameter)
    return text(parameter)
}
