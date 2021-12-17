// const StackTrace = require('stacktrace-js');


// Error.prepareStackTrace = function(dummyObj, stackTrace) {
// 	//console.log(stackTrace);
// 	let structured = [];
// 	for (let frame of stackTrace) {
// 		//console.log(frame.getFileName(), frame.getFunction(), frame.getFunctionName());
// 		structured.push({
// 			fileName: frame.getFileName(),
// 			functionName: frame.getFunctionName,
// 		});
// 	}
// 	return structured;
// };

// var error = new Error('BOOM!');

// var callback = function(stackframes) {
//     // var stringifiedStack = stackframes.map(function(sf) {
//     //     return sf.toString();
//     // }).join('\n');
//     console.log(stackframes);
// };

// var errback = function(err) { console.log(err.message); };

// StackTrace.fromError(error).then(callback).catch(errback);

//console.log(`error: ${error}`);

// import { get } from 'stack-trace';


// function currFunc() {
// 	const trace = get(currFunc);
// 	return trace;
// }

// for (let call of currFunc()) {
// 	console.log(call.getFunctionName());
// }


const AnotherError = require('./another-error');

function f1() {
	console.log('function f1');
	throw new AnotherError('this is another error!');
}

function f2() {
	f1();
}


function f3(){
	f2();
}

try {
	f3();
} catch (err) {
	console.log(err.parsedStack);
	console.log(err.stack);
}