export class Source extends ObservableDelegate {
  
    constructor(uri, model, state, error) {
        super(model)
        this.uri = uri
        this.model = state(model)
        this.state = state
        this.error = error
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
