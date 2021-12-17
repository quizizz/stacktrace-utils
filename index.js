const StackUtils = require('stack-utils');

function _defaultCallSiteParser(callSite) {
    const isInternal = callSite.getFileName().includes('internal/');
    return {
        function: callSite.getFunctionName(),
        method: callSite.getMethodName(),
        filename: callSite.getFileName(),
        lineno: callSite.getLineNumber(),
        colno: callSite.getColumnNumber(),
        in_app: !isInternal,
    };
}

function captureAndParseStackTrace({ limit = 20, startStackFunction = captureAndParseStackTrace, callSiteParser = _defaultCallSiteParser } = {}) {
    const stackUtils = new StackUtils({ wrapCallSite: callSiteParser });
    const parsedCallSites = stackUtils.capture(limit, startStackFunction);

    return {
        frames: parsedCallSites,
    };
}

module.exports = {
    captureAndParseStackTrace,
};