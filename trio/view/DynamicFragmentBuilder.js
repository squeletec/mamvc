import {Content, text} from "./Content.js"

function content(node) {
    return new Content(node)
}
export class DynamicFragmentBuilder extends Content {
   #start
   #end
   constructor(start, end) {
       super(document.createDocumentFragment())
       this.get().appen
       dChild((this.#start = start).get())
       this.get().appendChild((this.#end = end).get())
   }

   add(...args) {
       this.#end.prepend(...args)
       return this
   }

   clear() {
       clearRange(this.#start.get(), this.#end.get())
       return this
   }
}

function clearRange(s, e) {
    while(s.nextSibling && s.nextSibling !== e)
        content(s.nextSibling).remove()
}

export function dynamicFragment(start = text(), end = text()) {
    return new DynamicFragmentBuilder()
}
