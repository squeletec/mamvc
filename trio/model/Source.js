export class Source extends {
    uri
    model
    loading
  
    constructor(uri, model = state(), loading = boolean()) {
        this.uri = uri
        this.model = model
        this.loading = loading
        this.uri.observe(value => request(value, this.model, this.loading).get())
    }
  
    get() {
        return this.#model.get()
    }
}
