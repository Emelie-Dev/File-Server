
// Core Modules


// Third party Modules


// Local Modules




////////////////////


import { domainName } from "./../server.js";

 
export const getDetails = (req, res) => {
  
  let showIp = false;  
    
 if(req.params.ip) {
     
 showIp = req.params.ip.toString().trim() == "true" ? true : false;
     
 }
 
    
let ip = req.ip.toString();

let state = domainName.toString() == ip;

let allowFileOperation = req.app.locals.fileOperations.toString() != "";

let fileOperationsPassword = req.app.locals.fileOperationsPassword.toString() != "";


 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;
 
 let ownerConnected  = req.app.locals.ownerConnected;
 
 if(showIp) {
     
return res.status(200).json({
       
     status: "success",
     data: {
     
     owner: state,
     
     allowFileOperation,
     
     fileOperationsPassword,
     
     confirmConn,
     
     ip,
     
     ownerConnected
    
     }
   });
    
     
} else {
    
       return res.status(200).json({
       
     status: "success",
     data: {
     
     owner: state,
     
     allowFileOperation,
     
     fileOperationsPassword,
     
     confirmConn,
     
     ownerConnected
}

});

}

}
