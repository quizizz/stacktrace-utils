import Callsite from 'callsite';

type CallSiteParserFunction = (callSite: Callsite.CallSite) => any;

interface CaptureAndParseStackNamedParameters {
    limit?: number;
    startStackFunction?: Function;
    callSiteParser?: CallSiteParserFunction;
}

interface CaptureAndParseStackReturnValue {
    frames: any[];
}

export type captureAndParseStackTrace = ({limit, startStackFunction, callSiteParser}: CaptureAndParseStackNamedParameters) => CaptureAndParseStackReturnValue;