export class Request {
    #uri
    #model
    constructor(uri, model) {
        this.#uri = uri
        this.#model = model
    }

    request() {
        let request = new XmlHttpRequest()
        request.open(method)
    }
  
    post(data) {
        
    }

    get() {
      
    }
  
}
