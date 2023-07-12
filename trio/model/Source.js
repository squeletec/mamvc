export class Source extends {
    uri
    model
    loading
  
    constructor(uri, model = state(), loading = boolean()) {
        this.uri = uri
        this.model = model
        this.loading = loading
        this.uri.observe(value => this.#request(value), false)
    }

    #request(value) {
        request()
        return this
    }

    get() {
        return this.#model.get()
    }

    trigger() {
        this.#request(this.uri.get())
        return this
    }
}
