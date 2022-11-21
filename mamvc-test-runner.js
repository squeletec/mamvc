
export function suite(definition, reporter = domReporter()) {

    let errors = []
    reporter.suiteStart(definition)

    for(let property in definition) {
        if(definition.hasOwnProperty(property) && typeof definition[property] === "function") {
            reporter.testStart(property)
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

    function cell(type, content) {
        let cell = document.createElement(type)
        cell.appendChild(document.createTextNode(content))
        return cell
    }

    function nameCell(name) {
        return cell('th', name)
    }

    function startCell() {
        return cell('td', new Date().toISOString().substring(0, 23).replace("T", " "))
    }

    return {
        suiteStart(definition) {
            let headRow = reportHead.appendChild(document.createElement('tr'))
            headRow.appendChild(nameCell(definition.name || 'DefaultSuite'))
            headRow.appendChild(startCell())
            headRow.appendChild(cell('td', ''))
            headRow.appendChild(cell('td', ''))
        },
        suitePassed() {

        },
        suiteFailed(errors) {

        },
        testStart(name) {
            currentTest = reportItems.appendChild(document.createElement('tr'))
            currentTest.appendChild(nameCell(name))
            currentTest.appendChild(startCell())
        },
        testPassed() {
            currentTest.appendChild(cell('td', 'passed')).setAttribute('class', 'passed')
            currentTest.appendChild(cell('td', ''))
        },
        testFailed(error) {
            currentTest.appendChild(cell('td', 'failed')).setAttribute('class', 'failed')
            currentTest.appendChild(cell('td', error.message))
            console.error(error)
        }

    }

}
