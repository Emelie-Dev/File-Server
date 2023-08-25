

// Core Modules

import readline from "readline";

import fs from "fs";

import crypto from "crypto";

import { EventEmitter } from "events";

import path from "path";

import { workerData, Worker, isMainThread, parentPort } from "worker_threads";

// Third party Modules

import { config } from "dotenv";

config({path: "./.config.env"});

import os from "os";

import QRcode from "qrcode";

import DeviceDetector from "node-device-detector";

// Local Modules 

 import {app, express} from "./app.js";
 
 
  import FilesRouter from "./Routes/FilesRoute.js";
 
 
  import configRouter from "./Routes/configRoute.js";
 
 import fileOperationsRouter from "./Routes/fileOperationsRoute.js"
 ///////////////////////////
 

 // Inheriting from the events module
 
 class MyEvents extends EventEmitter {
     
   constructor () {
   super ();
   }
 }
 
 
 
export const Emitter = new MyEvents();

Emitter.setMaxListeners(Infinity);

let clientId = 0;

// For decryption 
 
function decryptData(data, key, iv) {
    
  const cipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  
  let decryptedText = cipher.update(data.toString(), "hex", "utf-8");
  
  decryptedText += cipher.final("utf-8");
  
  return decryptedText;
}


// Gets the authentication file

let authenticationFile;

  try {

 authenticationFile = fs.readFileSync("./Assets/authentication.html");
 
 
 } catch (err) {
  
 console.error("\nAuthentication File not found. Make sure the 'authentication.html' is in the 'Assets' folder and type in 'rs' to restart the server.");
 
 process.exit(0)
}


// Gets the confirmation file


let confirmationFile;


try {
    
  confirmationFile = fs.readFileSync("./Assets/confirmationFile.html");
 
    
} catch (err) {
    
  console.error("\nAn HTML File was not found. Make sure the 'confirmationFile.html' is in the 'Assets' folder and type in 'rs' to restart the server.");
 
 process.exit(0)
    
}


 //. Configuration file

let configFile;

try {
 
 configFile = fs.readFileSync("./Assets/config.html");
 
} catch (err) {
    
    console.error("\nConfiguration File not found. Make sure the 'config.html' is in the 'Assets' folder and type in 'rs' to restart the server.");
 process.exit(0)
    
}


 export let PORT;
 
 export let netInt = "";
 
 export let domainName = "";
 
 export let rootDir = "";

  let serverText = "";
  
  // Variable for checking if server is configured properly
  
 let configVal = true;
 
 // Creates a readline interface
 
 
 const details = readline.createInterface({
 input: process.stdin,
output: process.stdout
});

 

 // Custom error handler
 
 const errHandler = (req,res,next) => {
     
     
     throw new Error();
     next(err);
 }
 
// Error handling middleware

const errHandlerMiddleware = (err,req,res,next) => {

  return res.status(404).send(`<!DOCTYPE HTML>

<html>
    
  <head>
 <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    </head>
    <body>
 <span style="color: red;font-size: 1.2rem;"><b>Please enter a valid url!</b></span>
 </body>
 </html>`)
  
}



// Event handler for the "second" event

Emitter.on("second", () => {
    
 // Check if a default directory was set
 
 try {
     
 
 const defaultInt = decryptData(atob(process.env.NETINTERFACE.toString()), Buffer.from(process.env.NETINTERFACEENCRYPTIONKEY, "hex"), Buffer.from(process.env.NETINTERFACEINITIALIZATIONVECTOR, "hex"));

if(!defaultInt || (defaultInt.toString().trim() == "none")) {
     
    askForInterface();
 } else {
     
     
  const proxyNetInt = parseInt(defaultInt.toString());
  
  if(proxyNetInt == 1) {
   
  // Gets the ip address 
      
 const {wlan0} = os.networkInterfaces();
       
   if(!wlan0) {
   console.log(`\n>    Please Connect to a Wi-fi network to use your default network interface.`);
   
   netInt = "localhost";
   
   console.log(`Your network interface is "${netInt}".`);
  
 
  
   } else {
   
   netInt = "WLAN";
   
 console.log(`\n>    Your default network interface "${netInt}" is been used. Leave the network interface input in the configuration file blank if you don't want to use `);
   }
 
 } else if(proxyNetInt == 2) {
     
     netInt = "localhost";
     
    console.log(`\n>    Your default network interface "${netInt}" is been used. Leave the network interface input in the configuration file blank if you don't want to use `);
    
 } else {
     
      netInt = "localhost";
     
    console.log(`\n>    Your default network interface "${netInt}" is been used. Leave the network interface input in the configuration file blank if you don't want to use `);
    
 }
 
  
  if(netInt == "localhost") {
     
   domainName = "127.0.0.1";
   
 } else if(netInt == "WLAN") {
     
     domainName = os.networkInterfaces().wlan0[1].address;
 }

  
  
     Emitter.emit("third");
 }

} catch (err) {
    
    askForInterface();
}

})

     
// Event handler for the "third" event 
  
Emitter.on("third", async () => {
    
    try {
   const defaultDir = decryptData(atob(process.env.ROOTDIRECTORY.toString()), Buffer.from(process.env.ROOTDIRECTORYENCRYPTIONKEY, "hex"), Buffer.from(process.env.ROOTDIRECTORYINITIALIZATIONVECTOR, "hex"));   
 
  
let dirExists = fs.existsSync(`${defaultDir}`);

if(!dirExists) {
   
  throw new Error ("Not Found");
  
}
     
if(!defaultDir || (defaultDir.toString().trim() == "")) {
     
    askForDirectory();
 } else {
     
    rootDir = defaultDir;
   
    console.log(`\n>    Your default root directory "${rootDir}" is being used. Leave the root directory input in the configuration file blank if you don't want to use it.\n`)
    
 details.close("temporary");
 startServer();
  
  
 }
        
  } catch (err) {
  
  if(err.message == "Not Found") {
    
    console.log('\n>    The root directory you provided in the configuration file does not exist.\n');
    
  }
 
    askForDirectory();
    
  }
})
 
 
 // Validates the input port number 
    
  function checkPort(port) {
  
  const portNum = parseInt(port);
  
  if((portNum < 1024) || (portNum > 65535) || (portNum.toString() == "NaN")) {
      
    console.log(`\n${port} is not a valid port number.`)
    return 6543;
  } else {
      return portNum;
  }
     
 }
 
 // Validates the input network interface 
 
 function checkInterface(int) {
     
  const netInt = parseInt(int);
  
  if(netInt == 1) {
   
  // Gets the ip address 
      
 const {wlan0} = os.networkInterfaces();
       
   if(!wlan0) {
   console.log(`\nPlease Connect to a Wi-fi network to use this interface.`);
  return "localhost";
   } 
   
   return "WLAN";
 
 } else if(netInt == 2) {
     
     return "localhost";
 } else {
     
     return "localhost";
 }
 
 
 }
 
  
 // Asks the user for the port number 
 
 function askForPort() {
 
 details.question(`\nWhat Port number do you want your server to run in:\nPort number must be between "1024" and "65535" - `, port => {
     
 //  assigns the answer to the PORT variable
 
   PORT =  checkPort(port);
   
   // sets the configVal to false
   
   configVal = false;
   
   
   console.log(`\n>    Your port number is ${PORT}`)
 Emitter.emit("second");
 })
 
 }
 
 
  // Asks the user for the network interface 
   
 function askForInterface() {
       
   details.question(`\nThe Network Interface:\n(1) WLAN - You can view your files from other devices that are connected to the same Wi-fi network.\n(2) Localhost - You can only view your files in this device.\nChoose "1" or "2".\n`, int => {
       
   // assigns the answer to the netInt variable
    
  netInt =  checkInterface(int);
  
     
   // sets the configVal to false
   
   configVal = false;
   
   
   
  // assigns the domainName variable
   
  if(netInt == "localhost") {
     
   domainName = "127.0.0.1";
   
 } else if(netInt == "WLAN") {
     
     domainName = os.networkInterfaces().wlan0[1].address;
 }
 
 
  console.log(`\n>    Your network interface is "${netInt}".`);
  
 Emitter.emit("third");
   })
   }
   
   
   // Asks the user for the root directory
   
  function askForDirectory() {
       
       
  details.question("\nThe root directory:\nAll the files and folders inside this directory will be accessible - \n", (dir) => {
      
   // assigns the rootDir variable to the answer
   
   
    rootDir = dir;
    
       
   // sets the configVal to false
   
   configVal = false;
   
   
 console.log(`\n>    Your root directory is "${dir}"`);
 
 // Closes the readline interface 
 
 details.close()
      
  });
  
   }
 

// Check if a default port number was set

try {

const defaultPort = decryptData(atob(process.env.PORT), Buffer.from(process.env.PORTENCRYPTIONKEY, "hex"), Buffer.from(process.env.PORTINITIALIZATIONVECTOR, "hex"));
 
 if(!defaultPort || (defaultPort.toString().trim() == "")) {
     
    askForPort();
 } else {
   
   PORT = parseInt(defaultPort);
   
  
  console.log(`\n>    Your default Port number "${PORT}" is being used. Leave the Port number input in the configuration file blank if you don't want to use it.`)
  
 Emitter.emit("second");
 }
 
} catch (err) {
 
    askForPort();
}

// Checks if a password is set for authentication

try {

app.locals.password = decryptData(atob(process.env.CONNECTIONPASSWORD.toString()), Buffer.from(process.env.CONNECTIONPASSWORDENCRYPTIONKEY, "hex"), Buffer.from(process.env.CONNECTIONPASSWORDINITIALIZATIONVECTOR, "hex"));

} catch (err) {
    
   app.locals.password = "";
}


// For the authentication 

authenticationFile =  authenticationFile.toString(). replace("{{%URL%}}", `http://${domainName}:${PORT}/login`).replace("{{%SERVERNAME%}}", `${app.locals.serverName}`).replace("{{%EVENTURL%}}", `http://${domainName}:${PORT}/confirmConnection`).replace("{{%ICON%}}", `http://${domainName}:${PORT}/Icon.png`).replaceAll("{{DETAILSURL}}", `http://${domainName}:${PORT}/details`);

// For the confirmation

confirmationFile = confirmationFile.toString().replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`).replaceAll("{{DETAILSURL}}", `http://${domainName}:${PORT}/details`);

  
  


// Event handler for the interface close event

details.on("close", (val) => {
   
  if(val == "temporary") {
    
   return;
   
  } else {

    
  // Middleware for Configuration file 
 
 app.use("/config", configRouter);
 
 
// Middleware for denied list

app.use((req,res,next) => {
    
 let clientIp = req.ip || req.socket.remoteAddress;
  
  
  if(!req.app.locals.confirmConnection && (req.app.locals.confirmConnection.toString() != "")) {
    
    next();
      
  } else if(req.app.locals.deniedList.has(clientIp)) {
    
 return res.status(403).send(`<!DOCTYPE HTML>

<html>
    
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    
    </head>
    <body>
    <span><b style="color: red; font-size: 1.2rem;"> You were denied access to the server.</b></span>
    </body>
    </html>`)
      
  } else {
      
   next();
  }
    
})

 // middleware for connection limit
 
 app.use((req,res, next) => {
     
    let clientIp = req.ip || req.socket.remoteAddress;
  
  
     
  if (req.app.locals.connectionLimit && (req.app.locals.connectionLimit.toString() != "")) { 
   
 if(clientIp.toString() == domainName.toString()) {
    
    next(); 
     
 } else if (parseInt(req.app.locals.connectionList.size) == parseInt(req.app.locals.connectionLimit) ) {
  
  if(req.app.locals.connectionList.has(clientIp)) {
      
  next();
      
  } else {
      
  return res.status(429).send(`<!DOCTYPE HTML>

<html>
    
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    </head>
  <body>
 <span style="color:red;font-size: 1.2rem;"><b> You are unable to connect as the maximum number of connections has been reached. </b></span>
 
 </body>
 </html>`);
  
}

} else {
  
  next();
}
     
 } else {
     
   next();
   
 }
 });
 
 
 
 // Middleware for authentication 
 
 app.use((req,res,next) => {
      
   let clientIp = req.ip || req.socket.remoteAddress;
   if (req.app.locals.whiteList.has(clientIp)) {
     
      next();
      
    } else if(req.app.locals.password && (req.app.locals.password.toString() != "")) {
        
 
 if (domainName.toString() == req.ip.toString()) {

  
authenticationFile =  authenticationFile.toString().replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);
   
 } else {
     
   
authenticationFile =  authenticationFile.toString().replace("{{%OWNER%}}", false);  
     
 }
 
 
 return res.status(511).send(`${authenticationFile}`);
   
 
  }  else {
      
    next();
  }
  
  });
  
 
 // Middleware for confirmation

app.use((req,res,next) => {
  
 let clientIp = req.ip || req.socket.remoteAddress;
    
  if(req.app.locals.confirmedList.has(clientIp)) {
     
    next();
    
 } else if (req.ip.toString() == domainName.toString()) {
     
 req.app.locals.confirmedList.add(clientIp); 

 next();
   }  else if(req.app.locals.confirmConnection && (req.app.locals.confirmConnection.toString() != "")) {
      
      res.send(`${confirmationFile}`);
  } else {
      
     next();
  }
    
})
  
 
 // Adds the ip address to the connection list

 app.use((req,res,next) => {
     
let clientIp = req.ip || req.socket.remoteAddress;

let userAgent = req.get("user-agent");
  
  if (clientIp.toString() === domainName.toString()) {
      

  req.app.locals.ownerConnected = true;  
   
  } else if(!(req.app.locals.connectionList.has(clientIp))) {
 
 
 Emitter.emit("newip", userAgent, clientIp);
 
 }
 
 req.app.locals.connectionList.add(clientIp);
 
 next();
   
 
 })

  // Handles file operations 
  
 app.use("/fileOperations", fileOperationsRouter);


// checks for invalid characters

app.use((req,res,next) => {
    
 let url = req.url.toString();

    try {
    
  url = decodeURIComponent(req.url).toString().replace("/files/", "");

   } catch (err) {
  
 let path = url.split("/");

 let invalidCharacters =  path.map(el => {
     
  let invalidCharacter =  el.toString().match(/\%[^\dABCDEFabcdef]+/);
  
  if(invalidCharacter) {
 
 let index = invalidCharacter.index;
 
 let otherPath = el.slice(0, index);
 
 let wrongCharacter = el.slice(index);
 
 
 let encodedCharacter = encodeURIComponent(wrongCharacter);
 
 return `${otherPath}${encodedCharacter}`; 
  } else {
      
      return el;
  }
 
 
})

req.url = invalidCharacters.join("/");


  } 


    next();
})

  // Handle all files


 app.use("/files/", express.static(`${rootDir}`, {index:false, dotfiles: "allow"}));
 
  
 
 // Handle the folders 
  
 app.use("/", FilesRouter);
 

 // Custom error middleware
 app.use(errHandler)
 
 
 // Error handling middleware 

app.use(errHandlerMiddleware)


  // Starts the server and listen for requests
  
let server = app.listen(PORT, `${domainName}`, (err) => {
   
     if(err) {
      

 console.log(`\nServer Error: ${err}.\nType in "rs" to restart the server.`)
 process.exit(0);
     }
     
     
 if(domainName == "127.0.0.1") {
     
  serverText = `Enter the address below to a web browser on this device to access your files. You can also scan the qrcode below to see the url.`
 } else {
     
     serverText = `Enter the address below to a web browser on any  device on the same network to access your files. You can also scan the qrcode below to see the url.`
 }
 
 console.log(`\n${serverText}`);
 
 console.log(`\nURL - `, `http://${domainName}:${PORT}/files/\n`);
 
 
 if(configVal == false) {
 
console.warn(`It's advisable you configure your server appropriately for better experience and also for security reasons. Click on the icon at the bottom right corner of the web pages to view the configuration file or enter the url below in a browser.\n\nConfig URL - http://${domainName}:${2005}/config\n`)

}

 
 const options = {
     
     type: "terminal",
    errorCorrectionLevel: "l",
   /* version: 1,
     margin: 2,
     width: 350
    
     */
 }
 
 /*
QRcode.toString(`http://${domainName}:${PORT}/files/`, options, (err, url) => {
    
    if(err) {
        
    }
    
   console.log("\n")
   
   console.log(url);
})
  
 */

 })
  
server.on("error", () => {
    
    
   if(domainName == "127.0.0.1") {
       
 console.log(`\n>    Your server has been disconnected because an unknown error occurred.\nType in "rs" to restart your server and view your files.\n`);
 process.exit(0);
   } else {
       
      console.log(`\n>    Your server has been disconnected because the Wi-fi connection was switched off.\nConnect to a Wi-fi connection and type in "rs" to restart your server and view your files.\n`);
  process.exit(0)
   }
 return;
   
})
    
}
 

})


 
 Emitter.on("newip",  (ag, ip) => {
     


if(isMainThread) {
  

let filePath = path.join(process.env.PWD, "Workers/connectionWorker.js");

 const worker = new Worker(`${filePath}`, {
   
   workerData: {userAgent: ag, ip}

 });
 
worker.on("message", (data) => {
    
let deviceName = `${data.device.brand} ${data.device.model}`;

if(deviceName.trim() == "") {
    
    deviceName = "Not Detected"
}
  
let clientText = `\n(${clientId + 1}) A new device connected to your server\n    Device Name: ${deviceName}\n    Ip Address: ${ip}\n`;

console.log("\x1b[32m", `${clientText}`, "\x1b[0m")
})

worker.on("error", (err) => {
   return;
})

worker.on("exit", () => {
    return;
})
    
}  
   
 })
 
 // Function called after the third event 
  
 function startServer() {
    
  // Middleware for Configuration file 
 
 app.use("/config", configRouter);
 
 
// Middleware for denied list

app.use((req,res,next) => {
    
 let clientIp = req.ip || req.socket.remoteAddress;
  
  
  if(!req.app.locals.confirmConnection && (req.app.locals.confirmConnection.toString() != "")) {
    
    next();
      
  } else if(req.app.locals.deniedList.has(clientIp)) {
    
 return res.status(403).send(`<!DOCTYPE HTML>

<html>
    
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    
    </head>
    <body>
    <span><b style="color: red; font-size: 1.2rem;"> You were denied access to the server.</b></span>
    </body>
    </html>`)
      
  } else {
      
   next();
  }
    
})

 // middleware for connection limit
 
 app.use((req,res, next) => {
     
    let clientIp = req.ip || req.socket.remoteAddress;
  
  
     
  if (req.app.locals.connectionLimit && (req.app.locals.connectionLimit.toString() != "")) { 
   
 if(clientIp.toString() == domainName.toString()) {
    
    next(); 
     
 } else if (parseInt(req.app.locals.connectionList.size) == parseInt(req.app.locals.connectionLimit) ) {
  
  if(req.app.locals.connectionList.has(clientIp)) {
      
  next();
      
  } else {
      
  return res.status(429).send(`<!DOCTYPE HTML>

<html>
    
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="The Godfather">
    <title>File Server</title>
    </head>
  <body>
 <span style="color:red;font-size: 1.2rem;"><b> You are unable to connect as the maximum number of connections has been reached. </b></span>
 
 </body>
 </html>`);
  
}

} else {
  
  next();
}
     
 } else {
     
   next();
   
 }
 });
 
 
 
 // Middleware for authentication 
 
 app.use((req,res,next) => {
      
   let clientIp = req.ip || req.socket.remoteAddress;
   if (req.app.locals.whiteList.has(clientIp)) {
     
      next();
      
    } else if(req.app.locals.password && (req.app.locals.password.toString() != "")) {
        
 
 if (domainName.toString() == req.ip.toString()) {

  
authenticationFile =  authenticationFile.toString().replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);
   
 } else {
     
   
authenticationFile =  authenticationFile.toString().replace("{{%OWNER%}}", false);  
     
 }
 
 
 return res.status(511).send(`${authenticationFile}`);
   
 
  }  else {
      
    next();
  }
  
  });
  
 
 // Middleware for confirmation

app.use((req,res,next) => {
  
 let clientIp = req.ip || req.socket.remoteAddress;
    
  if(req.app.locals.confirmedList.has(clientIp)) {
     
    next();
    
 } else if (req.ip.toString() == domainName.toString()) {
     
 req.app.locals.confirmedList.add(clientIp); 

 next();
   }  else if(req.app.locals.confirmConnection && (req.app.locals.confirmConnection.toString() != "")) {
      
      res.send(`${confirmationFile}`);
  } else {
      
     next();
  }
    
})
  
 
 // Adds the ip address to the connection list

 app.use((req,res,next) => {
     
let clientIp = req.ip || req.socket.remoteAddress;

let userAgent = req.get("user-agent");
  
  if (clientIp.toString() === domainName.toString()) {
      

  req.app.locals.ownerConnected = true;  
   
  } else if(!(req.app.locals.connectionList.has(clientIp))) {
 
 
 Emitter.emit("newip", userAgent, clientIp);
 
 }
 
 req.app.locals.connectionList.add(clientIp);
 
 next();
   
 
 })

  // Handles file operations 
  
 app.use("/fileOperations", fileOperationsRouter);


// checks for invalid characters

app.use((req,res,next) => {
    
 let url = req.url.toString();

    try {
    
  url = decodeURIComponent(req.url).toString().replace("/files/", "");

   } catch (err) {
  
 let path = url.split("/");

 let invalidCharacters =  path.map(el => {
     
  let invalidCharacter =  el.toString().match(/\%[^\dABCDEFabcdef]+/);
  
  if(invalidCharacter) {
 
 let index = invalidCharacter.index;
 
 let otherPath = el.slice(0, index);
 
 let wrongCharacter = el.slice(index);
 
 
 let encodedCharacter = encodeURIComponent(wrongCharacter);
 
 return `${otherPath}${encodedCharacter}`; 
  } else {
      
      return el;
  }
 
 
})

req.url = invalidCharacters.join("/");


  } 


    next();
})

  // Handle all files


 app.use("/files/", express.static(`${rootDir}`, {index:false, dotfiles: "allow"}));
 
  
 
 // Handle the folders 
  
 app.use("/", FilesRouter);
 

 // Custom error middleware
 app.use(errHandler)
 
 
 // Error handling middleware 

app.use(errHandlerMiddleware)


  // Starts the server and listen for requests
  
let server = app.listen(PORT, `${domainName}`, (err) => {
   
     if(err) {
      

 console.log(`\nServer Error: ${err}.\nType in "rs" to restart the server.`)
 process.exit(0);
     }
     
     
 if(domainName == "127.0.0.1") {
     
  serverText = `Enter the address below to a web browser on this device to access your files. You can also scan the qrcode below to see the url.`
 } else {
     
     serverText = `Enter the address below to a web browser on any  device on the same network to access your files. You can also scan the qrcode below to see the url.`
 }
 
 console.log(`\n${serverText}`);
 
 console.log(`\nURL - `, `http://${domainName}:${PORT}/files/\n`);
 
 
 if(configVal == false) {
 
console.warn(`It's advisable you configure your server appropriately for better experience and also for security reasons. Click on the icon at the bottom right corner of the web pages to view the configuration file or enter the url below in a browser.\n\nConfig URL - http://${domainName}:${2005}/config\n`)

}

 
 const options = {
     
     type: "terminal",
    errorCorrectionLevel: "l",
   /* version: 1,
     margin: 2,
     width: 350
    
     */
 }
 
 /*
QRcode.toString(`http://${domainName}:${PORT}/files/`, options, (err, url) => {
    
    if(err) {
        
    }
    
   console.log("\n")
   
   console.log(url);
})
  
 */

 })
  
server.on("error", () => {
    
    
   if(domainName == "127.0.0.1") {
       
 console.log(`\n>    Your server has been disconnected because an unknown error occurred.\nType in "rs" to restart your server and view your files.\n`);
 process.exit(0);
   } else {
       
      console.log(`\n>    Your server has been disconnected because the Wi-fi connection was switched off.\nConnect to a Wi-fi connection and type in "rs" to restart your server and view your files.\n`);
  process.exit(0)
   }
 return;
   
})
    
}
 
 
 /* process.on("uncaughtException", (err) => {
    
   if(domainName == "127.0.0.1") {
       
 console.error(`\nYour server has been disconnected because of an unknown error occurred.\nType in "rs" to restart your server and view your files.\n`);
 process.exit(0);
   } else {
       
      console.error(`\nYour server has been disconnected because the Wi-fi connection was switched off.\nConnect to a Wi-fi connection and type in "rs" to restart your server and view your files.\n`);
  process.exit(0)
   }
   
       
 })
 */