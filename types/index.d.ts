import Callsite from 'callsite';

type CallSiteParserFunction = (callSite: Callsite.CallSite) => any;

interface CaptureAndParseStackNamedParameters {
    limit?: number;
    startStackFunction?: Function;
    callSiteParser?: CallSiteParserFunction;
}

interface ParseStackTraceParameters {
    callSiteParser?: CallSiteParserFunction;
    cwd?: string;
    currentTrace: string;
}

interface DefaultFramesType {
    function_name: string;
    file_name: string;
    line_number: number;
    column_number: number;
    in_app: boolean;
}

export interface CaptureAndParseStackReturnValue {
    frames: DefaultFramesType[] | any[];
}

export function captureAndParseStackTrace(args: CaptureAndParseStackNamedParameters): CaptureAndParseStackReturnValue;
export function parseStackTrace(args: ParseStackTraceParameters): CaptureAndParseStackReturnValue;
