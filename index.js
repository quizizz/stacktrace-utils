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

function _defaultStringTraceParser(callSite) {
    const functionName = callSite.function;
    const possibleFunctionName = functionName != null ? functionName : (methodName != null ? methodName : '<unknown>');

    return {
        function_name: possibleFunctionName,
        file_name: callSite.file,
        line_number: callSite.line,
        column_number: callSite.column
    };
}

function _identifyInternalCallSites(parsedCallSites) {
    const internalModules = StackUtils.nodeInternals();
    let updatedCallSites = [];
    parsedCallSites.forEach(callSite => {
        let fileName = 'unknown';
        if (callSite.file_name) {
            fileName = callSite.file_name.replace(/\\/g, '/');
        }
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

/**
 * Parses a given stack trace and returns it in a structured format
 * 
 * @param {Function} callSiteParser - function to parse CallSite-like objects from a stack trace
 * @param {string} cwd - Current working directory as a string path. Will be removed from the trace file names
 * @param {string} currentTrace - The stack trace to parse (as a string, usually the `.stack` property of an Error object)
 * @returns {*} - parsed call sites
 */
function parseStackTrace({
    callSiteParser = _defaultStringTraceParser,
    cwd = null,
    currentTrace
} = {}) {
    const opts = {
        wrapCallSite
    };

    if (cwd) {
        opts.cwd = cwd;
    }

    const stack = new StackUtils({ wrapCallSite: callSiteParser, cwd });
    const parsedSites = currentTrace.split('\n')
                        .map((trace) => trace.trim())
                        .map((trace) => stack.parseLine(trace))
                        .map(Boolean);

    if (callSiteParser === _defaultStringTraceParser) {
        return {
            frames: _identifyInternalCallSites(parsedSites)
        };
    }

    return {
        frames: parsedCallSites
    };
}

module.exports = {
    captureAndParseStackTrace,
    parseStackTrace,
};