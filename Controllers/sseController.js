// Core Modules



// Third party Modules


import DeviceDetector from "node-device-detector";

// Local Modules


////////////////////


import {Emitter, domainName} from "./../server.js"


export const sendEvent = (req,res) => {
    
   res.set({
       
     'Content-Type': 'text/event-stream',
     'Cache-Control': 'no-cache',
     'Connection': 'keep-alive'

   });
   
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

setInterval(() => {
    
 res.write(":Continuous Connection\n\n");
}, 5000);



Emitter.on("confirmclient", (ag, ip) => {
    
 
let userAgent;
    

userAgent = ag;

let deviceDetails;

let deviceName;

try {
    

deviceDetails = detector.detect(userAgent);


deviceName = {browser: deviceDetails.client.name, deviceBrand: deviceDetails.device.brand, deviceModel: deviceDetails.device.model, ip};

} catch (err) {
    
    
}





res.write(`event: newclient\ndata: ${JSON.stringify(deviceName)}\n\n`);
  
})


Emitter.on("successcalled", () => {
    
  let data = {data: "successcalled"};
  
  res.write(`event: successcalled\ndata: ${JSON.stringify(data)}\n\n`);
  
})



Emitter.on("errorcalled", () => {
    
let data = {data: "errorcalled"};
  
  res.write(`event: errorcalled\ndata: ${JSON.stringify(data)}\n\n`);
  
})

Emitter.on("configcalled", () => {
    
let data = {data: "configcalled"};
  
  res.write(`event: configcalled\ndata: ${JSON.stringify(data)}\n\n`);
  
})




}


export const clientEvent = (req,res) => {
    
   
const clientIp = req.ip || req.socket.remoteAddress;
    
  if (clientIp.toString() == domainName.toString()) {
      
  
 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;
 
 if(confirmConn)  {
    
  res.set({
       
     'Content-Type': 'text/event-stream',
     'Cache-Control': 'no-cache',
     'Connection': 'keep-alive'

   });
   
setInterval(() => {
    
 res.write(":Continuous Connection\n\n");
}, 5000);

  
    
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

Emitter.on("addclient", (obj) => {
   
  if(typeof obj == "object") {
      
  
res.write(`event: addclient\ndata: ${JSON.stringify(obj)}\n\n`);
  
  } else {
      
   return;
   
  }
    
})



Emitter.on("denyclient", (obj) => {
   
  if(typeof obj == "object") {
      
  
res.write(`event: denyclient\ndata: ${JSON.stringify(obj)}\n\n`);
  
  } else {
      
   return;
   
  }
    
})


 } else {
     
 return;
 }

} else {
    
 return;
    
}

}

export const changeEvent = (req,res) => {
  
  
const clientIp = req.ip || req.socket.remoteAddress;
    
   
    
  if (clientIp.toString() != domainName.toString()) {
      
  
 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;
 
 
 if(confirmConn)  {
    
  res.set({
       
     'Content-Type': 'text/event-stream',
     'Cache-Control': 'no-cache',
     'Connection': 'keep-alive'

   });
   
setInterval(() => {
    
 res.write(":Continuous Connection\n\n");
}, 5000);

  
Emitter.on("changeaccess", (type, ip) => {
  
 let data = {ip, type};
 
res.write(`event: changeaccess\ndata: ${JSON.stringify(data)}\n\n`);
   
})
  

 } else {
     
 return;
 }

} else {
    
 return;
    
}


    
}
