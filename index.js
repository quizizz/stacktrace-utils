const StackUtils = require('stack-utils');

function _defaultCallSiteParser(callSite) {
    const functionName = callSite.getFunctionName(), methodName = callSite.getMethodName();
    const possibleFunctionName = functionName != null ? functionName : (methodName != null ? methodName : '<unknown>'); 
    return {
        function_name: possibleFunctionName,
        file_name: callSite.getFileName(),
        line_number: callSite.getLineNumber(),
        column_number: callSite.getColumnNumber(),
    };
}

function _identifyInternalCallSites(parsedCallSites) {
    const internalModules = StackUtils.nodeInternals();
    let updatedCallSites = [];
    parsedCallSites.forEach(callSite => {
        const fileName = callSite.file_name.replace(/\\/g, '/');
        if (internalModules.some(internal => {
            let stackLine = fileName + ':' + callSite.line_number + ':' + callSite.column_number;
            if (internal.toString().startsWith('/\\(') && internal.toString().endsWith('\\)$/')) {
                stackLine = '(' + stackLine + ')';
            }
            return internal.test(stackLine);
        })) {
            updatedCallSites.push(Object.assign(callSite, { in_app: false }));
        } else {
            updatedCallSites.push(Object.assign(callSite, { in_app: true }));
        }
    });
    return updatedCallSites;
}

/**
 * Captures and parses call sites in stack trace to generate stack trace
 * in structured format, rather than string.
 * 
 * @param {number} limit - limits the number of calls in stack trace.
 * @param {Function} startStackFunction - function where the stack trace should start from. first line will be the
 * function that calls startStackFunction.
 * @param {Function} callSiteParser - function to parse CallSite objects from a stack trace.
 * @returns {*} - parsed call sites.
 */

function captureAndParseStackTrace({ 
    limit = 20, 
    startStackFunction = captureAndParseStackTrace, 
    callSiteParser = _defaultCallSiteParser 
} = {}) {
    const stackUtils = new StackUtils({ wrapCallSite: callSiteParser });
    const parsedCallSites = stackUtils.capture(limit, startStackFunction);

    if (callSiteParser === _defaultCallSiteParser) {
        return { frames: _identifyInternalCallSites(parsedCallSites) };
    }

    return { frames: parsedCallSites };
}

module.exports = {
    captureAndParseStackTrace,
};