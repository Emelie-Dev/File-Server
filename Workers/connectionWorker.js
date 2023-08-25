
// Core Modules


import { workerData, parentPort } from "worker_threads";



// Third party Modules

import DeviceDetector from "node-device-detector";

// Local Modules


///////////////////////
  
    
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

let deviceDetails = detector.detect(workerData.userAgent);
   
 parentPort.postMessage(deviceDetails);
   
