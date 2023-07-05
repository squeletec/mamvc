import {Content} from "./Content.js"

function content(node) {
    return new Content(node)
}
export class DynamicFragmentBuilder extends Content {
   #start
   #end
   constructor(start, end) {
       super(document.createDocumentFragment())
       this.get().appendChild(this.#start = start)
       this.get().appendChild(this.#end = content(end).get())
   }

   add(...args) {
       this.#end.prepend(...args)
       return this
   }

   clear() {
       while(this.#start.nextSibling && this.#start.nextSibling !== this.#end.get()) {
           content(this.#start.nextSibling).remove()
       }
       return this
   }
}

function clearRange(s, e) {
    while(s.nextSibling && s.nextSibling !== e)
        content(s.nextSibling).remove()
}
