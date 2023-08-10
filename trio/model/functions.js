import {state} from "./StateModel.js";
import {isObservable} from "./Observable.js";


export function argumentsModel(...modelsAndValues) {
    let value = new Array(modelsAndValues.length)
    let model = state(value)
    modelsAndValues.forEach((v, i) => value[i] = isObservable(v) ? v.observe(x => {
        value[i] = x;
        model.trigger()
    }, false).get() : v)
    return model
}

export function functionModel(f, ...args) {
    return argumentsModel(...args).map(v => f(...v))
}


export function join(glue, array) {
    return argumentsModel(...array).map(a => a.join(glue))
}

export function concat(...args) {
    return join('', args)
}

export function to(trueValue, falseValue = null) {
    return value => value ? trueValue : falseValue
}

export function falseTo(falseValue) {
    return to(null, falseValue)
}

export let negate = value => !value

export let invert = value => -value

export function runEitherOr(trueCommand, falseCommand) {
    return value => value ? trueCommand() : falseCommand()
}

export function usingTemplate(template) {
    let parts = template.split(/\{([^{]+)}/g)
    let values = Array.from(parts)
    return function(value) {
        for(let i = 1; i < values.length; i += 2) values[i] = value[parts[i]]
        return values.join('')
    }
}

export function usingUriTemplate(template) {
    let fileFunction = usingTemplate(template)
    return function(raw) {
        let value = {}
        Object.getOwnPropertyNames(raw).forEach(name => value[name] = encodeURIComponent(raw[name]))
        let params = Object.getOwnPropertyNames(value).filter(n => n && !template.includes('{' + n + '}'))
        let file = fileFunction(value)
        if(params.length > 0) {
            file += (file.includes('?') ? '&' : '?') + params.map(n => n + '=' + value[n]).join('&')
        }
        return file
    }
}

export function properties(map) {
    return function(object) {
        return Object.fromEntries(Object.entries(object).map(([name, value]) => [name, map(value)]))
    }
}

export function timer(booleanState, result = state(), updatePeriod = 1000) {
    let interval = null
    let start = 0
    function update() {
        result.set(new Date().getTime() - start)
    }
    function handle(value) {
        if(value) {
            if(interval === null) {
                start = new Date().getTime()
                update()
                interval = setInterval(update, updatePeriod)
            }
        } else {
            if(interval !== null) {
                clearInterval(interval)
                update()
                interval = null
            }
        }
    }
    booleanState.onChange(handle)
    return result
}
