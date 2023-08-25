
// Core Modules

import fs from "fs";

import crypto from "crypto"

// Third party Modules




// Local Modules

//////////////////

import { PORT, domainName} from "./../server.js";

// Function for encrypting

function encryptData(data, key, iv) {
    
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  
  let encryptedText = cipher.update(data.toString(), "utf-8", "hex");
  
  encryptedText += cipher.final("hex");
  
  return encryptedText;
}


 
 //. Configuration file

let configFile;

try {
 
 configFile = fs.readFileSync("./Assets/config.html");
 
} catch (err) {
    
    console.error("\nConfiguration File not found. Make sure the 'config.html' is in the 'Assets' folder and type in 'rs' to restart the server.");
 process.exit(0)
    
}

// Route handler for get cofig request 

export const getConfigurationFile = (req,res) => {
    
  let clientIp = req.ip || req.socket.remoteAddress;
    
  if(domainName.toString() != clientIp.toString()) {
      
          
  return res.status(403).send(`<!DOCTYPE HTML>

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
      
  } else {
    
    
const modifiedConfig = configFile.toString().replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replaceAll("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replace("{{%OWNER%}}", true).replaceAll("{{DETAILSURL}}", `http://${domainName}:${PORT}/details`).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`);
  
 return res.status(511).send(modifiedConfig);
  }
}

// Request handler for post request

export const logIn = (req,res) => {
    
 let password = req.body.toString();
 
 let clientIp = req.ip || req.socket.remoteAddress;
    
  if(domainName.toString() != clientIp.toString()) {
      
          
  return res.status(403).send("Forbidden");   
      
  } else {
      
  
 if(req.app.locals.password.toString() == "") {
     
     
return res.send("Successful");

 } else if ((req.app.locals.password.toString()) !== password) {
   
   
    return res.status(401).send("Wrong password")
 }
 
 
  
return res.status(200).send("Successful");

}
 
}
// Route handler for PUT config request

export const updateConfiguration = (req,res) => {
  
  let clientIp = req.ip || req.socket.remoteAddress;
    
  if(domainName.toString() != clientIp.toString()) { 
       
          
  return res.status(403).send("Forbidden");      
  } else {
       
 let {port, rootDirectory, netInterface, enableFileOperations, fileOperationsPassword, confirmConnection, connectionPassword, connectionLimit, serverName} = req.body;
 
 
 // Convert the request body to an array of objects
 
 let requestDetails = Object.entries(req.body);
 
 // Validates the requestDetails
 
 if(requestDetails.length != 9) {
     
   return res.status(400).send("Invalid request body."); 
   
 } 
 
  
 // converts each item in requestDetails to configuration format and joins them
 
 
 let configurationDetails = requestDetails.map(prop => {
     
 
  const key = prop[0].toString().toUpperCase();
  
  
 // Generates an encryption key 

const encryptionKey = crypto.randomBytes(32);
 
 // Generates an initialization Vector
 
 const initializationVector = crypto.randomBytes(16);
 
 // Encrypts the value of each item 
  
  const value = btoa(encryptData(prop[1].toString(), encryptionKey, initializationVector));
  
  // Joins each item encryptionKey and initializationVector
  
  
  const result = `${key}=${value}\n${key}ENCRYPTIONKEY=${encryptionKey.toString("hex")}\n${key}INITIALIZATIONVECTOR=${initializationVector.toString("hex")}`
   
   return result;
 }).join("\n");
 
  
 // Write the configurationDetails to the .config.env file 
 
 fs.writeFile("./.config.env", configurationDetails, (err) => {
     
     if(err) {
         
  console.log("An unknown error occurred, please type in 'rs' to restart the server.");
  
   process.exit(0);
 
     }
      
  
    // console.log(configurationDetails)
  let i = 0;
  
 
  return res.status(200).send("Saved Successfully. Type in 'rs' in the terminal to restart the server and enable the changes."); 
  
    
 })
 
 
}
 
}

// Route handler for getting Confirmed Clients

export const getClientsDetails = (req,res)  => {
    
  let clientIp = req.ip || req.socket.remoteAddress;
  
  let contentType = req.get("Content-Type");
  
  
 let confirmConn = req.app.locals.confirmConnection.toString() != "true" ? false : true;
 
    
  if(domainName.toString() != clientIp.toString()) {
      
          
  return res.status(403).json({
  
  status: "fail",
  type: "Permission",
  data: {
  
  text: (`<!DOCTYPE HTML>

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
 
  }
  
 });  
      
  } else if (!confirmConn) {
      
       
  return res.status(403).json({
  
  status: "fail",
  type: "Forbidden",
  data: {
  
  text: "You are Forbidden"
  }
  
 });     
      
      
  } else if (contentType == "application/json") {
     
  return res.status(200).json({
    
    status: "success",
    data: {
      
 confirmedList: [...req.app.locals.confirmedObj],
   
 deniedList: [...req.app.locals.deniedObj]
        
    }
       
   })
      
  } else {
      
   
 return res.status(400).send("Bad request");
      
  }
    
}