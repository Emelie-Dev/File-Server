
 
 // Core Modules

import crypto from "crypto";

import fs from "fs";

import path from "path";

// Third party Modules

import * as dotenv from "dotenv";

dotenv.config(
    {path: "./.config.env"}
    );

 import express from "express";
 
 import morgan from "morgan";
 
 import cors from "cors";
 
 import compression from "compression";
 
 // Local Modules
 
 
  import configRouter from "./Routes/configRoute.js";
 
 
  import loginRouter from "./Routes/loginRoute.js";
  
  import confirmRouter from "./Routes/confirmConnectionRoute.js";
  
  import sseRouter from  "./Routes/sseRoute.js";
  
 import detailsRouter from  "./Routes/detailsRoute.js";
  
  ///////////////////////////
  

// The instance of the express application 
 
 const app = express();
 
 // Makes sure the real ip address is given.
 
app.set("trust proxy", true);


 // Middlewares

// Compresses the response

//app.use(compression())
 
 // Enable cors policy
 
 app.use(cors()); 
 
 // Enables parsing of  JSON request body
 
 app.use(express.json());
 
 // Enables parsing of textrequest body
 
 app.use(express.text());
 
 
 // Serves static files
 
app.use(express.static(`${path.join(process.env.PWD, "Public")}`, {index:false, dotfiles: "allow"}))

// Disables the x-powered-by property in the response header
 
 app.disable("x-powered-by");
 
 
 
// app.use(morgan("dev"));

 /////////////////////////
 
 
// For decryption 
 
function decryptData(data, key, iv) {
    
  const cipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  
  let decryptedText = cipher.update(data.toString(), "hex", "utf-8");
  
  decryptedText += cipher.final("utf-8");
  
  return decryptedText;
}


 // Checks if the server name is set

let serverName;

try {

serverName = decryptData(atob(process.env.SERVERNAME.toString()), Buffer.from(process.env.SERVERNAMEENCRYPTIONKEY, "hex"), Buffer.from(process.env.SERVERNAMEINITIALIZATIONVECTOR, "hex")).toString().trim();

if(serverName.toString() == "") {
    
  throw new Error ();
  
}  else {
    

app.locals.serverName = `${serverName.toString()}'s `;

}
} catch (err) {
    app.locals.serverName = "";
  
}


// Checks if a password is set for authentication

try {

app.locals.password = decryptData(atob(process.env.CONNECTIONPASSWORD.toString()), Buffer.from(process.env.CONNECTIONPASSWORDENCRYPTIONKEY, "hex"), Buffer.from(process.env.CONNECTIONPASSWORDINITIALIZATIONVECTOR, "hex"));

} catch (err) {
    
   app.locals.password = "";
}



// Checks if the maximum number of connections is set


try {
 
app.locals.connectionLimit = decryptData(atob(process.env.CONNECTIONLIMIT.toString()), Buffer.from(process.env.CONNECTIONLIMITENCRYPTIONKEY, "hex"), Buffer.from(process.env.CONNECTIONLIMITINITIALIZATIONVECTOR, "hex"));
    
} catch (err) {
    
  app.locals.connectionLimit = "";
}


// checks if the confirm connection is set

try {
    
  app.locals.confirmConnection = decryptData(atob(process.env.CONFIRMCONNECTION.toString()), Buffer.from(process.env.CONFIRMCONNECTIONENCRYPTIONKEY, "hex"), Buffer.from(process.env.CONFIRMCONNECTIONINITIALIZATIONVECTOR, "hex"));
  
  
if(app.locals.confirmConnection.toString() == "false") {
    
  throw new Error ();
  
}
  
} catch (err) {
    
  app.locals.confirmConnection = "";
}


// checks if file operations is allowed


try {
    
    
  app.locals.fileOperations = decryptData(atob(process.env.ENABLEFILEOPERATIONS.toString()), Buffer.from(process.env.ENABLEFILEOPERATIONSENCRYPTIONKEY, "hex"), Buffer.from(process.env.ENABLEFILEOPERATIONSINITIALIZATIONVECTOR, "hex"));
  
  
if(app.locals.fileOperations.toString() == "false") {
    
  throw new Error ();
  
}
  
    
} catch (err) {
    
  app.locals.fileOperations = "";
}

// checks if a password is set for file operations 

try {
    
  app.locals.fileOperationsPassword = decryptData(atob(process.env.FILEOPERATIONSPASSWORD.toString()), Buffer.from(process.env.FILEOPERATIONSPASSWORDENCRYPTIONKEY, "hex"), Buffer.from(process.env.FILEOPERATIONSPASSWORDINITIALIZATIONVECTOR, "hex"));
    
} catch (err) {
    
    
   app.locals.fileOperationsPassword = "";
    
}

// checks if the owner is connected

app.locals.ownerConnected = false;

 // creates a set of authenticated ip address
 
 app.locals.whiteList = new Set();

 // creates a set of connected ip address

app.locals.connectionList = new Set();

// creates a set of confirmed ip address

app.locals.confirmedList = new Set();

app.locals.confirmedObj = new Set();

app.locals.deniedObj = new Set();



// creates a set of denied IP address

app.locals.deniedList = new Set();


app.use("/sse", sseRouter);


app.use("/confirmConnection", confirmRouter);


app.use("/login", loginRouter);

app.use("/details", detailsRouter);


 export {app, express};
 
