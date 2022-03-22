const {workerData, parentPort} = require('worker_threads');
const {type, data} = workerData;
parentPort.postMessage(JSON.stringify({type, data}));
process.exit(0);
