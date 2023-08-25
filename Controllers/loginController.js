// Core Modules

import fs from "fs";

// Third party Modules




// Local Modules


///////////////////////


import {Emitter, domainName} from "./../server.js"

export const logIn = (req,res) => {
    
 let password = req.body.toString();
 
 if((req.app.locals.password.toString()) !== password) {
   
   
    return res.status(401).send("Wrong password");
    
 } else if(req.ip.toString() == domainName.toString()) {
     
       
const clientIp = req.ip || req.socket.remoteAddress;
  

  
req.app.locals.whiteList.add(clientIp);

req.app.locals.confirmedList.add(clientIp); 

return res.status(200).send("Successful")
  
   } else if (req.app.locals.confirmConnection.toString() == "true") {
        
const clientIp = req.ip || req.socket.remoteAddress;
  
  
req.app.locals.whiteList.add(clientIp); 
  
 return res.status(511).send("Confirmation Required");
    
   
 } else {
 
 
  
const clientIp = req.ip || req.socket.remoteAddress;
  

  
req.app.locals.whiteList.add(clientIp);


return res.status(200).send("Successful")
 
}

}