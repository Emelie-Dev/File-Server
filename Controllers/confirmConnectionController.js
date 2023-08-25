

// Core Modules



// Third party Modules


import DeviceDetector from "node-device-detector";

// Local Modules


////////////////////


import {Emitter, domainName} from "./../server.js"


export const getConfirmation =  (req,res) => {
    
 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;

  if (confirmConn) {
      
 

 let userAgent = req.get('user-agent');
      
Emitter.emit("confirmclient", userAgent, req.ip);

  
Emitter.on("allowaccess", async (ip) => {
         
      
const clientIp = req.ip || req.socket.remoteAddress;
    
  if (ip.toString() == clientIp.toString())  {
  
req.app.locals.whiteList.add(clientIp);

req.app.locals.confirmedList.add(clientIp);

await res.status(200).send("success");

let confirmedObj  = [...req.app.locals.confirmedObj];

 for (let [key, val] of confirmedObj.entries())  {
  
 if(val.ip == clientIp) {
     
    return;
 }
     
 }

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});


let deviceDetails = detector.detect(userAgent);

let deviceBrand  = deviceDetails.device.brand.toString().trim();

let deviceModel  = deviceDetails.device.model.toString().trim();

let deviceName = "";

if((deviceBrand == "") && (deviceModel == ""))  {
    
    deviceName  = "Not Detected";
} else {
    
    deviceName = `${deviceBrand} ${deviceModel}`;
}

let newObj = {deviceName, ip: clientIp, time: new Date().getTime()};
   
req.app.locals.confirmedObj.add(newObj);

Emitter.emit("addclient", newObj);
 
 return;
 
  } else if (ip.toString() == "all") {
      
    
req.app.locals.whiteList.add(clientIp);

req.app.locals.confirmedList.add(clientIp);

 await res.status(200).send("success");
 
 
let confirmedObj  = [...req.app.locals.confirmedObj];

 for (let [key, val] of confirmedObj.entries())  {
  
 if(val.ip == clientIp) {
     
    return;
 }
     
 }

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});


let deviceDetails = detector.detect(userAgent);

let deviceBrand  = deviceDetails.device.brand.toString().trim();

let deviceModel  = deviceDetails.device.model.toString().trim();

let deviceName = "";

if((deviceBrand == "") && (deviceModel == ""))  {
    
    deviceName  = "Not Detected";
} else {
    
    deviceName = `${deviceBrand} ${deviceModel}`;
}

   
req.app.locals.confirmedObj.add({deviceName, ip: clientIp, time: new Date().getTime()});

return;
   
  } else {
      
      
      
  }

});

 Emitter.on("denyaccess", async (ip) => {
   
 const clientIp = req.ip || req.socket.remoteAddress;
 
  if (ip.toString() == clientIp.toString())  {

req.app.locals.deniedList.add(clientIp);
   
 await res.status(403).send("success");
 
let deniedObj  = [...req.app.locals.deniedObj];

 for (let [key, val] of deniedObj.entries())  {
  
 if(val.ip == clientIp) {
     
    return;
 }
     
 }

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});


let deviceDetails = detector.detect(userAgent);

let deviceBrand  = deviceDetails.device.brand.toString().trim();

let deviceModel  = deviceDetails.device.model.toString().trim();

let deviceName = "";

if((deviceBrand == "") && (deviceModel == ""))  {
    
    deviceName  = "Not Detected";
} else {
    
    deviceName = `${deviceBrand} ${deviceModel}`;
}

let newObj = {deviceName, ip: clientIp, time: new Date().getTime()};
   
req.app.locals.deniedObj.add(newObj);

Emitter.emit("denyclient", newObj);
 
  
} else if (ip.toString() == "all") {
      
   
req.app.locals.deniedList.add(clientIp);
   
 await res.status(403).send("success");
 
let deniedObj  = [...req.app.locals.deniedObj];

 for (let [key, val] of deniedObj.entries())  {
  
 if(val.ip == clientIp) {
     
    return;
 }
     
 }

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});


let deviceDetails = detector.detect(userAgent);

let deviceBrand  = deviceDetails.device.brand.toString().trim();

let deviceModel  = deviceDetails.device.model.toString().trim();

let deviceName = "";

if((deviceBrand == "") && (deviceModel == ""))  {
    
    deviceName  = "Not Detected";
} else {
    
    deviceName = `${deviceBrand} ${deviceModel}`;
}

let newObj = {deviceName, ip: clientIp, time: new Date().getTime()};
   
req.app.locals.deniedObj.add(newObj);

Emitter.emit("denyclient", newObj);
 
  
  } else {
      
      
  }

   });
   
  } else {
  
    return res.status(403).send(`<!DOCTYPE HTML>

<html>
    
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    
    </head>
    <body>
 <span style="color:red;font-size: 1.2rem;"><b> Forbidden </b></span>
 </body>
 </html>`);

      
  }
 
}


export const enableAccess = (req,res) => {
    
    
  let contentType = req.get("Content-Type");
  
  
 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;
 
const clientIp = req.ip || req.socket.remoteAddress;
 
 if(clientIp.toString() == domainName.toString()) {
     
 if(contentType == "application/json") {
     
  if(confirmConn) {
      
     
    
 let { data , ip } = req.body;
 
    
 switch (data.toString().trim()) {
    
   case "success_yes":
       
   Emitter.emit("allowaccess", ip);
   Emitter.emit("successcalled");
   
  return  res.status(200).send("success");
  break;
  
   case "success_no":
       
  Emitter.emit("denyaccess", ip);
  Emitter.emit("successcalled");

  return  res.status(200).send("success");     
  break;
  
   case "error_yes":
       
  Emitter.emit("allowaccess", ip);
  Emitter.emit("errorcalled");
  
  return  res.status(200).send("success");
 break;
 
 
   case "error_no":
       
  Emitter.emit("denyaccess", ip);
  Emitter.emit("errorcalled");
  
  return  res.status(200).send("success");  
  break;
  
  case "config_yes":
       
  Emitter.emit("allowaccess", ip);
  
  Emitter.emit("configcalled");
   return  res.status(200).send("success");  
  case "config_no":
      
        
  Emitter.emit("denyaccess", ip);
 Emitter.emit("configcalled");
 
    return  res.status(200).send("success");  
  }
  
  
  } else {
   
    return res.status(403).json({
    
    status: "fail",
    type: "Forbidden",
    data: (`You are not allowed to confirm or deny clients.`)
    
  });   
      
  }     
 } else {
     
 
 return res.status(400).send("Bad request");
 
 } 

} else {
    
  
    return res.status(403).json({
    
    status: "fail",
    type: "Permission",
    data: (`You don't have access to confirm or deny clients.`)
    
  });
        
    
}

}

export const changeAccess = (req,res)  => {
   
    
  let contentType = req.get("Content-Type");
  
  
 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;
 
const clientIp = req.ip || req.socket.remoteAddress;
   
     
  if(domainName.toString() == clientIp.toString()) {
 
 
 if(contentType == "application/json")  {
    
 let { reqType, ip, deviceName } = req.body;
 
 
 if(ip.toString() == domainName.toString()) {
     
     
   return res.status(403).json({
    
    status: "fail",
    type: "Forbidden",
    data: "The server owner access cannot be altered."
   })
   
 } else {

 if(reqType.toString() == "deny") {
     
  if(confirmConn) {  
   
 
let confirmedObj  = [...req.app.locals.confirmedObj];

let denyElem = confirmedObj.find(el => el.ip == ip);

 if(denyElem) {
     
  req.app.locals.confirmedObj.delete(denyElem);  
  
 } else {
     
 
 return res.status(404).send("This client doesn't exist in the list of confirmed clients."); 
 
 }
     
 
 
 let newObj = {deviceName, ip, time: new Date().getTime()};
   
req.app.locals.deniedObj.add(newObj);


req.app.locals.deniedList.add(ip);

 req.app.locals.confirmedList.delete(ip);
 
 Emitter.emit("changeaccess", "deny", ip);
  
  return res.send("Done");
 
  } else {
      
   return res.status(403).json({
    
    status: "fail",
    type: "Forbidden",
    data: "Before denying clients, you need to check the 'Confirm Connection' box."
   })
   
  }
  
 } else if (reqType.toString() == "confirm") {
     
  if(confirmConn) {  
   
  
let deniedObj  = [...req.app.locals.deniedObj];

let confirmElem = deniedObj.find(el => el.ip == ip);

 if(confirmElem) {
     
  req.app.locals.deniedObj.delete(confirmElem);  
  
 } else {
     
 
 return res.status(404).send("This client doesn't exist in the list of denied clients."); 
 
 }
     
 
 
 let newObj = {deviceName, ip, time: new Date().getTime()};
   
req.app.locals.confirmedObj.add(newObj);

req.app.locals.confirmedList.add(ip);

 req.app.locals.deniedList.delete(ip);
  
   
 Emitter.emit("changeaccess", "confirm", ip);
 
  return res.send("Done");
 
  } else {
      
   return res.status(403).json({
    
    status: "fail",
    type: "Forbidden",
    data: "Before confirming clients, you need to check the 'Confirm Connection' box."
   })
   
  }
     
     
     
 } else if (reqType.toString() == "denyall") {
     
      
  if(confirmConn) {  
   
 
let confirmedObj  = [...req.app.locals.confirmedObj];

confirmedObj.forEach(obj => {
 
 let newObj = {deviceName: obj.deviceName, ip: obj.ip, time: new Date().getTime()};
 
req.app.locals.confirmedObj.delete(obj);      
  
   
req.app.locals.deniedObj.add(newObj);


req.app.locals.deniedList.add(obj.ip);

 req.app.locals.confirmedList.delete(obj.ip);
  
  
 Emitter.emit("changeaccess", "deny", obj.ip);   
})
  
return res.status(200).send("Done");
 
  } else {
      
  return res.status(403).json({
    
    status: "fail",
    type: "Forbidden",
    data: "Before denying clients, you need to check the 'Confirm Connection' box."
   })
   
  }
     
     
 } else if (reqType.toString() == "confirmall") {
    
  if(confirmConn) {  
   
 
let deniedObj  = [...req.app.locals.deniedObj];

deniedObj.forEach(obj => {
 
 let newObj = {deviceName: obj.deviceName, ip: obj.ip, time: new Date().getTime()};
 
req.app.locals.deniedObj.delete(obj);      
  
   
req.app.locals.confirmedObj.add(newObj);


req.app.locals.confirmedList.add(obj.ip);

 req.app.locals.deniedList.delete(obj.ip);
  
  
 Emitter.emit("changeaccess", "confirm", obj.ip);
   
})
  
return res.status(200).send("Done");
 
  } else {
      
  return res.status(403).json({
    
    status: "fail",
    type: "Forbidden",
    data: "Before confirming clients, you need to check the 'Confirm Connection' box."
   })
   
  }

     
   } else {
   
 return res.status(400).send("Bad request");
       
     
 }
 
 }
  
 } else {
     
 
 return res.status(400).send("Bad request");
     
 }
 
  } else {
      
    return res.status(403).json({
    
    status: "fail",
    type: "Permission",
    data: (`<!DOCTYPE HTML>

<html>
    
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    
    </head>
    <body>
 <span style="color:red;font-size: 1.2rem;"><b>You don't have access to the configuration file.</b></span>
 </body>
 </html>`)
    
  });
    
}

}