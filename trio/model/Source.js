export class Source extends ObservableDelegate {
    uri
    model
    loading
  
    constructor(uri, model = null, loading = boolean()) {
        super(model)
        this.uri = uri
        this.model = state(model)
        this.loading = loading
        this.uri.observe(value => this.#request(value), false)
    }

    #request(value) {
        request()
        return this
    }

    trigger() {
        this.#request(this.uri.get())
        return this
    }
}
