
export function suite(definition, reporter = domReporter()) {

    let errors = []
    reporter.suiteStart(definition)

    for(let property in definition) {
        if(definition.hasOwnProperty(property) && typeof definition[property] === "function") {
            reporter.testStart(property, definition[property])
            try {
                definition[property]()
                reporter.testPassed()
            } catch (error) {
                reporter.testFailed(error)
                errors.push(error)
            }
        }
    }

    if(errors.length > 0) reporter.suiteFailed(errors)
    else reporter.suitePassed()

}

export function assert(actual, expected) {
    if(actual !== expected) {
        assert.reporter.assertionFailed(actual, expected)
        throw new Error("Expected: <" + expected + ">, but was <" + actual + ">")
    }
    assert.reporter.assertionPassed(actual, expected)
}
assert.reporter = {
    assertionFailed() {},
    assertionPassed() {}
}

export function assertState(state, expectedValue) {
    return assert(state.get(), expectedValue)
}

export function domReporter() {
    let reportTable = document.body.appendChild(document.createElement('table'))
    let reportHead = reportTable.appendChild(document.createElement('thead'))
    let reportItems = reportTable.appendChild(document.createElement('tbody'))
    let currentTest = null

    function element(type, content) {
        let cell = document.createElement(type)
        cell.appendChild(document.createTextNode(content))
        return cell
    }

    function nameCell(name) {
        return element('th', name)
    }

    function startCell() {
        return element('td', new Date().toISOString().substring(0, 23).replace("T", " "))
    }

    function detail(data) {
        return element('pre', data)
    }

    return {
        suiteStart(definition) {
            let headRow = reportHead.appendChild(document.createElement('tr'))
            headRow.appendChild(nameCell(definition.name || 'DefaultSuite'))
            headRow.appendChild(startCell())
            headRow.appendChild(element('td', ''))
            headRow.appendChild(element('td', ''))
        },
        suitePassed() {

        },
        suiteFailed(errors) {

        },
        testStart(name, func) {
            currentTest = reportItems.appendChild(document.createElement('tr'))
            currentTest.appendChild(nameCell(name)).appendChild(detail(func)).setAttribute('class', 'left')
            currentTest.appendChild(startCell())
        },
        testPassed() {
            currentTest.appendChild(element('td', 'passed')).setAttribute('class', 'passed')
            currentTest.appendChild(element('td', ''))
        },
        testFailed(error) {
            currentTest.appendChild(element('td', 'failed')).setAttribute('class', 'failed')
            currentTest.appendChild(element('td', error.message)).appendChild(detail(error.stack)).setAttribute('class', 'right')
            console.error(error)
        }

    }

}
