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

/*
Micro Ajax MVC library.

 */
import { isState } from "./state.js";
import { XNode } from "./builder.js";

/*
Commands
 */

export function toggle(model) {
    return () => model.set(!model.get())
}

export function set(model, value) {
    return isState(value) ? () => model.set(value.get()) : () => model.set(value)
}

export function call(rest) {
    return () => rest.call()
}

export function when(condition, command) {
    return () => condition.get() && command()
}

export function copyToClipboard(nodeOrBuilder) {
    let node = nodeOrBuilder instanceof XNode ? nodeOrBuilder.get() : nodeOrBuilder
    return function(event) {
        if(document.selection) {
            let ieRange = document.body.createTextRange()
            ieRange.moveToElementText(node)
            ieRange.select().createTextRange()
        } else if(window.getSelection) {
            let domRange = document.createRange()
            domRange.selectNode(node)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(domRange)
            document.execCommand("copy")
            window.getSelection().removeAllRanges()
        }
    }
}

export function showModal(dialog) {
    return () => dialog.get().showModal()
}

export function close(dialog) {
    return () => dialog.get().close()
}

export function add(model, increment) {
    return () => model.set(model.get() + increment)
}
