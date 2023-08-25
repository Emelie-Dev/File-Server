// Core Modules


import path from "path";

import fs from "fs";

import crypto from "crypto";

import { Readable } from "stream";


import { EventEmitter } from "events";

import readline from "readline";

import { Worker, isMainThread } from "worker_threads";

// Third party Modules

import { config } from "dotenv";

import {  app } from "./../app.js"

config({path: "./.config.env"});


// Local Modules

//import app from "./../app.js"


////////////////////


function encryptData(data, key, iv) {
    
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  
  let encryptedText = cipher.update(data.toString(), "utf-8", "hex");
  
  encryptedText += cipher.final("hex");
  
  return encryptedText;
}


 class myEvents extends EventEmitter {

    constructor() {
        super();
    }
}

const Emitter = new myEvents();


Emitter.setMaxListeners(Infinity);


// The Port number, Domain name and Root Directory

import {
    PORT,
    domainName,
    rootDir
} from "./../server.js";

// Checks if the server name is set


// The Success HTML template

let successPage;

try {


    successPage = fs.readFileSync(`./Assets/success.html`);

} catch (err) {

    console.error("\nA HTML File not found. Make sure the 'success.html' is in the 'Assets' folder and type in 'rs' to restart the server.");
    process.exit(0)
}


// The Error HTML template

let errPage;

try {
    errPage = fs.readFileSync(`./Assets/error.html`);

} catch (err) {

    console.error("\nA HTML File not found. Make sure the 'error.html' is in the 'Assets' folder and type in 'rs' in the terminal to restart the server");
}

  function checkExt(directory, file, filePath) {

    let imgUrl = ``;
      
    let fileSize = "0";
    
    let sizeText = ""
    
    let ext = path.extname(path.join(directory, file)).toString().toLowerCase();
    
  let realExt = path.extname(path.join(directory, file));
  
    switch (ext) {


  case ".html":
  case ".htm":

  imgUrl = `http://${domainName}:${PORT}/html.png`;
  break;

  case ".css":

  imgUrl = `http://${domainName}:${PORT}/css.png`;
  break;

  case ".js":

  imgUrl = `http://${domainName}:${PORT}/js.png`;
  break;

  case ".py":

  imgUrl = `http://${domainName}:${PORT}/py.webp`;
  break;

  case ".java":

  imgUrl = `http://${domainName}:${PORT}/java.webp`;
  break;

  case ".jsx":

  imgUrl = `http://${domainName}:${PORT}/jsx.png`;
  break;

  case ".pdf":

  imgUrl = `http://${domainName}:${PORT}/pdf.png`;
  break;

  case ".json":

  imgUrl = `http://${domainName}:${PORT}/json.png`;
   break;

  case ".php":

  imgUrl = `http://${domainName}:${PORT}/php-128.png`;
            break;

  case ".ts":

  imgUrl = `http://${domainName}:${PORT}/ts.png`;
  break;

  case ".txt":

  imgUrl = `http://${domainName}:${PORT}/txt.png`;
  break;


  case ".doc":
  case ".docx":

  imgUrl = `http://${domainName}:${PORT}/doc.png`;
  break;

  case ".cpp":

  imgUrl = `http://${domainName}:${PORT}/c++.png`;
  break;

  case ".swift":

  imgUrl = `http://${domainName}:${PORT}/swift.png`;
  break;

  case ".env":

  imgUrl = `http://${domainName}:${PORT}/env.png`;
  break;

  case ".tif":
  case ".tiff":
  case ".jpg":
  case ".jpeg":
  case ".wpeg":
  case ".webp":
  case ".gif":
  case ".png":
  case ".eps":
  case ".ai":
  case ".bmp":
  case ".ico":
  case ".svg":
  case ".ps":
  case ".psd":

  imgUrl = `http://${domainName}:${PORT}/img.png`;
  break;

  case ".mkv":
  case ".mp4":
  case ".3g2":
  case ".3gp":
  case ".avi":
  case ".flv":
  case ".h264":
  case ".m4v":
  case ".mov":
  case ".mpg":
  case ".mpeg":
  case ".rm":
  case ".swf":
  case ".vob":
  case ".webm":
  case ".wmv":

  imgUrl = `http://${domainName}:${PORT}/video.png`;
  break;

  case ".mp3":
  case ".ogg":
  case ".aif":
  case ".cda":
  case ".mid":
  case ".midi":
  case ".mpa":
  case ".wav":
  case ".wma":
  case ".wpl":
  case ".aac":
 
  imgUrl = `http://${domainName}:${PORT}/audio.png`;
  break;

  case ".7z": 
  case ".arj":
  case ".deb":
  case ".pkg":
  case ".rar":
  case ".rpm":
  case ".gz":                  
  case ".tar.gz":
  case ".tar":
  case ".tgz":
  case ".tar.bz2":
  case ".tbz2":
  case ".tar.xz":
  case ".txz":
  case ".z":
  case ".zip":
  case ".bz2":
  case ".xz":
  case ".lzma":
  case ".Z":
  case ".cab":
  case ".sit":
  case ".lzh":
  case ".lha":
  case ".gzipped":
  case ".zipped":
      
  imgUrl = `http://${domainName}:${PORT}/zip.png`;
  break;

  case ".csv":
  case ".dat":
  case ".db":
  case ".dbf":
  case ".log":
  case ".mdb":
  case ".sav":
  case ".sql":
  case ".tar":
  case ".xml":
                   
  imgUrl = `http://${domainName}:${PORT}/db.png`;
  break;


  case ".srt":
  case ".sub":
  case ".ssa":
  case ".smi":
  case ".vtt":
                  
  imgUrl = `http://${domainName}:${PORT}/sub.png`;
  break;

  default:

  imgUrl = `http://${domainName}:${PORT}/others.png`;
  break;

   }
 
 return new Promise ((resolve, reject)  => {
     
   fs.stat(`${path.join(directory, file)}`, (err, stats) => {
       
       
   if(err) {
       
    fileSize = 0;
   }
   
   fileSize = parseFloat(stats.size);
   
   if(fileSize < 1000) {
     
   sizeText = "B"  
    
   } else if ((fileSize > 1000) && fileSize <= (1000 ** 2)) {
   
  fileSize = (fileSize / (1000)).toFixed(2);
  
  sizeText = "KB";
     
   } else if ((fileSize >= (1000 ** 2)) && (fileSize <= (1000 ** 3))) {
       
     fileSize = (fileSize / (1000 **2)).toFixed(2);
  
  sizeText = "MB";    
      
   } else if ((fileSize >= (1000 ** 3)) && (fileSize <= (1000 ** 4))) {
       
    fileSize = (fileSize / (1000**3)).toFixed(2);
  
  sizeText = "GB";        
       
   } else if ((fileSize >= (1000 ** 4)) && (fileSize <= (1000 ** 5))) {
       
        fileSize = (fileSize / (1000 **4)).toFixed(2);
  
  sizeText = "TB";         
       
   } else {
       
     fileSize = (fileSize / (1000**4)).toFixed(2);
  
  sizeText = "TB";     
  
   }
  
  
  if(filePath.toString().includes("#")) {
      
   //filePath = encodeURIComponent(filePath);   
    filePath = filePath.toString().replace("#", "%23");
  }
 
 resolve (`<div class="files other-files">
 <a class="file-link entries" href="http://${domainName}:${PORT}/files/${filePath}" data-ext="${realExt}" >
 
 <img class="other-img" src="${imgUrl}">

 <span class="file-name"> <span class="specific-name file-entry">${file}</span> <br><div class="items-no">${fileSize} ${sizeText}</div></span>
    </a>

  <span class="check-item" data-checked="false">

 <svg class="tick-svg"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

 <path class="tick-path" d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

   </span>
  </div>`);
   })
  })

    }


 // Function for reading directory in streams


   class directoryStream extends Readable {

 constructor (path, opt) {

     super(opt);

this.fileList = [];

this.path = path;

this.index = 0;
  
  }


 _read = () => {
 
  if (this.index == this.fileList.length) {

  this.push(null)
   
  } else {

  let file = this.fileList[this.index];

  let data = {
 
  el: file
  };

  this.push(data);
  this.index++;
}
    }
  
  pushData = () => {
 
  this.fileList = fs.readdirSync(this.path)
    
   }
   
    }
    
    
  // Route handler for Home Url

 export const fileHome = async (req, res) => {

  return res.status(404).send(`<!DOCTYPE HTML>
    <html>
     <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="author" content="The Godfather">
      <title>File Server</title>
                        <body>
         <span style="color: red;font-size: 1.2rem;"><b>Please enter a valid url!</b></span>
              </body>
             </html>`)
 }

  // Route handler for Files Home

  export const getFiles = async (req, res) => {


  const url = decodeURI(req.url).toString().replace("/files/", "");
    
  // Absolute path of the root directory 
  
  const directory = path.resolve(rootDir);

   // Check whether directory exists

  const state = await new Promise ((resolve, reject) => {
      
 fs.stat(`${directory}`, (statErr, stats) => {
     
     if(statErr) {
         
       resolve(false);   
     } else {
         
     resolve(true);
     }
     
 });
      
  })

  if (!state) {


  return res.status(404).send(`<!DOCTYPE HTML>
      <html>
     <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="author" content="The Godfather">
      <title>File Server</title>
       </head>
      <body>
       <span style="color: red;font-size: 1.2rem;"><b>The root directory was not found!<br>Make sure you type in a correct directory.</b></span>
        </body>
      </html>`)
  }

  // Check whether client have access to the root directory
   
   try {

await new Promise ((resolve, reject) => {
    
  fs.access(`${directory}`, fs.constants.R_OK | fs.constants.W_OK, (accErr) => {
     
   if(accErr) {
       
   reject(false);
   } else {
       
     resolve(true)
   }
     
 });
})

} catch (err) {
    
 return res.status(403).send(`<!DOCTYPE HTML>
     <html>

      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
     <meta name="author" content="The Godfather">
     <title>File Server</title>
     </head>
      <body>
     <span style="color: red;font-size: 1.2rem;"><b>You can't view the files and folders because you don't have access to this directory.</b></span>
       </body>
   </html>`);
 }
 
  // Reading the directory if no error occurred

 fs.readdir(`${directory}`, async (err, files) => {

if (err) {

  return res.status(500).send(`<!DOCTYPE HTML>
 <html>

 <meta name="viewport" content="width=device-width, initial-scale=1">
 <meta name="author" content="The Godfather">
    <title>File Server</title>
   </head>
    <body>
   <span style="color: red;font-size: 1.2rem;"> <b>An error occurred while reading this directory!</b></span>
  </body>
  </html>`);

    
} else if (files.length == 0) {

 // Checks if the root directory is empty

return res.status(200).send(`<!DOCTYPE HTML>
         <html>
         <head>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <meta name="author" content="The Godfather">
 <title>File Server</title>
  </head>
   <body>
   <span style="color: red;"><b>The root directory is Empty.</b></span>
     </body>
     </html>`);

    
} else {

 // Detecting folders and sorting them alphabetically

let folders = await new Promise((resolve, reject) => {
 
 let folderArray = [];
 
      
  for (let i = 0; i < files.length; i++)   {
      
fs.stat(`${path.join(directory, files[i])}`,  (statErr, stats) => {
  
  if(stats.isDirectory()) {
        
   folderArray.push(files[i]);
   
   }
   
   if(i == (files.length - 1)) {
       
   resolve(folderArray);
   
   }
 
  })
    


      
  }

  
  
  
});


// Detecting files and sorting them alphabetically

let docs = await new Promise((resolve, reject) => {
 
 let fileArray = [];

            
  for (let i = 0; i < files.length; i++)   {

 fs.stat(`${path.join(directory, files[i])}`,  (statErr, stats) => {
     
  
  if(stats.isFile()) {
        
   fileArray.push(files[i]);
   
   }
   
   if(i == (files.length - 1)) {
   
   resolve(fileArray);
   
   }
   
  })
    

}
 
  
  
});

      
// Converting each file to a HTML code

let fileDocs;


if(docs.length != 0) {

 fileDocs = await new Promise ( async (resolve, reject) => {
 
 let fileArray = [];
 
  
 for (let i = 0; i < docs.length; i++)  {
     
   
  fileArray.push(await checkExt(directory, docs[i], path.join(url, docs[i])));
     
   if(fileArray.length == docs.length) {
       
    resolve (fileArray)
   }
}


});

} else {
    
    fileDocs = [];
}


// Converting each folder to a HTML code

let folderDocs;


if(folders.length != 0) {

 folderDocs = await new Promise((resolve, reject) => {
  
let totalFiles = [];


let val = "";

let itemsText = "";
    
  
for (let i = 0; i < folders.length; i++)  {
    
    
  let itemsLength = 0;
    
 fs.readdir(`${path.join(directory, folders[i])}`, (indErr, indFiles) => {
  
  if(indErr) {
      
  itemsLength = 0;
  
    
 itemsText = itemsLength == 1 ? "item": "items";
 
 let totalTxt = `${url}${folders[i]}`;
 
 
  val =  `<div class="files">

<a class="entries" href="http://${domainName}:${PORT}/files/${encodeURIComponent(totalTxt)}/">

<img class="img" src="http://${domainName}:${PORT}/download.png">

 <span class="file-name"> <span class="specific-name folder-entry"  data-length="${itemsLength}">${folders[i]}</span> <br><div class="items-no">${itemsLength} ${itemsText}</div></span>
    </a>

<span class="check-item" data-checked="false">

  <svg class="tick-svg"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

 <path class="tick-path" d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

  </svg>

 </span>

  </div>`

  } else {
  
 itemsLength = indFiles.length;   
     
  
 itemsText = itemsLength == 1 ? "item": "items";
 
 let totalTxt = `${url}${folders[i]}`;
 
 
  val =  `<div class="files">

<a class="entries" href="http://${domainName}:${PORT}/files/${encodeURIComponent(totalTxt)}/">

<img class="img" src="http://${domainName}:${PORT}/download.png">

 <span class="file-name"> <span class="specific-name folder-entry"  data-length="${itemsLength}">${folders[i]}</span> <br><div class="items-no">${itemsLength} ${itemsText}</div></span>
    </a>

<span class="check-item" data-checked="false">

  <svg class="tick-svg"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

 <path class="tick-path" d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

  </svg>

 </span>

  </div>`
  
  }
  
  totalFiles.push(val);
  
  
  if(totalFiles.length == folders.length) {
      
    resolve (totalFiles);
  }
  
})


}

});

} else {
    
    
  folderDocs = [];
}

// sorts the folders and files alphabetically 

fileDocs = fileDocs.sort((a,b) =>  a.localeCompare(b));

const folderMap = folderDocs.sort((a,b) =>  a.localeCompare(b));

// Joins the files and folders together

 const fullItem = folderMap.concat(fileDocs).join("");
   
   
  // Replacing the placeholder with the files and folders

 let halfPage;

  if (domainName.toString() == req.ip.toString()) {

halfPage = successPage.toString().replace("{{%Files%}}", `${fullItem}`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName.toString()}`).replace("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%MENUBOX%}}", "flex").replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);

  } else {

halfPage = successPage.toString().replace("{{%Files%}}", `${fullItem}`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName.toString()}`).replace("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%CLIENTBOX%}}", "flex").replace("{{%OWNER%}}", false);
    
    }

 // Replacing the home link placeholder with the home url

   const fullPage = halfPage.toString().replace("{{%HOME%}}", `"http://${domainName}:${PORT}/files/"`).replace("{{%LINKS%}}", "").replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`).replaceAll("{{DETAILSURL}}", `http://${domainName}:${PORT}/details`).replaceAll("{{%%FILEOPERATIONURL%%}}", `http://${domainName}:${PORT}/fileOperations`);;

 // Returning the full Page
 
  return res.status(200).send(`${fullPage}`)
  
 }

  })
 
}

// Route handler for other directories

export const getFilesFromDir = async (req, res) => {

  // The decoded url

let  url = decodeURIComponent(req.url).toString().replace("/files/", "");


  
   if (!(url.endsWith("/"))) {

  url = url + "/";
  }

  // Absolute path of the root directory

  const directory = path.resolve(rootDir);

 // The absolute file path of the directory

  const filePath = path.join(directory, url.toString());

   // Checks if the directory exists

  const state = await new Promise ((resolve, reject) => {
      
 fs.stat(`${filePath}`, (statErr, stats) => {
     
     if(statErr) {
         
       resolve(false);   
     } else {
         
     resolve(true);
     }
     
 });
      
  })

 let halfPage, fullPage;

  // To get all directories in the url

  const links = Array.from(url.split("/"));

  // Deletes the last links element if it's empty

  if (links[links.length - 1] == "") {

 links.pop();
    }

  // converts the directories to HTML links at the top of the page

  const newLinks = links.map(elem => {

 const proxyLink = url.indexOf(`${elem}`);

 const realLink = url.slice(0, (parseInt(proxyLink) + (elem.length)));

 return `<a href="http://${domainName}:${PORT}/files/${realLink}/">&nbsp;<span class="sign">&#8658;</span>&nbsp;${elem}</a>`
      
  }).join('');

if (!state) {

  // Gets the err html file and displays a message

  if (domainName.toString() == req.ip.toString()) {

  halfPage = errPage.toString().replace("{{%Files%}}", `<h1>This resource was not found!<br>Make sure you provide a correct path.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`).replace("{{%PERMISSION%}}", "flex").replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`);

  } else {

  halfPage = errPage.toString().replace("{{%Files%}}", `<h1>This resource was not found!<br>Make sure you provide a correct path.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replace("{{%OWNER%}}", false);
   }
 
  // Replacing the placeholders

  fullPage = halfPage.toString().replace("{{%LINKS%}}", `${newLinks}`).replace("{{%HOME%}}", `"http://${domainName}:${PORT}/files/"`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`);

 return res.status(404).send(fullPage);
}

// Checks if the client has access to the directory

try {

await new Promise ((resolve, reject) => {
    
  fs.access(`${filePath}`, fs.constants.R_OK | fs.constants.W_OK, (accErr) => {
     
   if(accErr) {
       
   reject(false);
   } else {
       
     resolve(true)
   }
     
 });
})

  
} catch (err) {

  // Gets the err html file and displays a message

  if (domainName.toString() == req.ip.toString()) {

  halfPage = errPage.toString().replace("{{%Files%}}", `<h1>You can't view the files and folders because you don't have access to this directory.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%PERMISSION%}}", "flex").replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);
  
   } else {

 halfPage =  errPage.toString().replace("{{%Files%}}", `<h1>You can't view the files and folders because you don't have access to this directory.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replace("{{%OWNER%}}", false);
      }

  // Replacing the placeholders

   fullPage = halfPage.toString().replace("{{%LINKS%}}", `${newLinks}`).replace("{{%HOME%}}", `"http://${domainName}:${PORT}/files/"`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`);

  return res.status(403).send(fullPage);

    
}

 // Reading the directory if no error occurred

fs.readdir(`${filePath}`, async (err, files) => {

   if (err) {

  // Displays an error message

  if (domainName.toString() == req.ip.toString()) {

halfPage = errPage.toString().replace("{{%Files%}}", `<h1>An error occurred while reading this directory.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%PERMISSION%}}", "flex").replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);

  } else {

halfPage = errPage.toString().replace("{{%Files%}}", `<h1>An error occurred while reading this directory.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replace("{{%OWNER%}}", false);

  }

   fullPage = halfPage.toString().replace("{{%LINKS%}}", `${newLinks}`).replace("{{%HOME%}}", `"http://${domainName}:${PORT}/files/"`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`);

  return res.status(500).send(fullPage);

 } else if (files.length == 0) {

  // Displays a message

 if (domainName.toString() == req.ip.toString()) {

halfPage = errPage.toString().replace("{{%Files%}}", `<h1>This directory is Empty.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%MENUBOX%}}", "flex").replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);
/*
halfPage = successPage.toString().replace("{{%Files%}}", `<h1>This directory is Empty.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName.toString()}`).replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%MENUBOX%}}", "flex").replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);
*/
  } else {

  halfPage = errPage.toString().replace("{{%Files%}}", `<h1>This directory is Empty.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName}`).replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%CLIENTBOX%}}", "flex").replace("{{%OWNER%}}", false);
  /*
   halfPage = successPage.toString().replace("{{%Files%}}", `<h1>This directory is Empty.</h1>`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName.toString()}`).replaceAll("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%CLIENTBOX%}}", "flex").replace("{{%OWNER%}}", false);
*/
 }

    // Replacing the placeholders

 fullPage = halfPage.toString().replace("{{%LINKS%}}", `${newLinks}`).replace("{{%HOME%}}", `"http://${domainName}:${PORT}/files/"`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`).replaceAll("{{DETAILSURL}}", `http://${domainName}:${PORT}/details`).replaceAll("{{%%FILEOPERATIONURL%%}}", `http://${domainName}:${PORT}/fileOperations`);

  return res.status(200).send(fullPage);
  
  } else {

  // Gets all folders in the directory 

  let folders = await new Promise((resolve, reject) => {
 
 let folderArray = [];
 
 
 for (let i = 0; i < files.length; i++)  {
      
 fs.stat(`${path.join(filePath, files[i])}`,  (statErr, stats) => {
   
  if(stats.isDirectory()) {
        
   folderArray.push(files[i]);
   
   }
   
   if(i == (files.length - 1)) {
       
   
   resolve(folderArray);
   
   }

  })
    


  };
  
  
});

  
   // Gets all files in the directory 

 let docs = await new Promise((resolve, reject) => {
 
 let fileArray = [];
 
     
 for (let i = 0; i < files.length; i++)  {
   
 fs.stat(`${path.join(filePath, files[i])}`,  (statErr, stats) => {
      
  if(stats.isFile()) {
        
   fileArray.push(files[i]);
   
   }
   
   if(i == (files.length - 1)) {
       
   resolve(fileArray);
   
   }
   
  })
    


  };
  
  
});

  

  
// Converts each file to  HTML code

let fileDocs;


if(docs.length != 0) {

fileDocs = await new Promise ( async (resolve, reject) => {
 
 let fileArray = [];
  
 for (let i = 0; i < docs.length; i++)  {
     
  fileArray.push(await checkExt(filePath, docs[i], path.join(url, docs[i])));
     
   if(fileArray.length == docs.length) {
       
    resolve (fileArray)
   }
   
}
  
});
} else {
    
  fileDocs = [];
}


// Converts each folder to  HTML code

let folderDocs;

if(folders.length != 0) {
    

 folderDocs = await new Promise((resolve, reject) => {
  
let totalFiles = [];


let val = "";

let itemsText = "";
 
 for (let i = 0; i < folders.length; i++)  {
    
  let itemsLength = 0;
    
 fs.readdir(`${path.join(filePath, folders[i])}`, (indErr, indFiles) => {
  
  if(indErr) {
      
  itemsLength = 0;
  
    
 itemsText = itemsLength == 1 ? "item": "items";
 
 let totalTxt = `${url}${folders[i]}`;
 
  val =  `<div class="files">

<a class="entries" href="http://${domainName}:${PORT}/files/${encodeURIComponent(totalTxt)}/">

<img class="img" src="http://${domainName}:${PORT}/download.png">

 <span class="file-name"> <span class="specific-name folder-entry"  data-length="${itemsLength}">${folders[i]}</span> <br><div class="items-no">${itemsLength} ${itemsText}</div></span>
    </a>

<span class="check-item" data-checked="false">

  <svg class="tick-svg"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

 <path class="tick-path" d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

  </svg>

 </span>

  </div>`

  } else {
  
 itemsLength = indFiles.length;   
     
  
 itemsText = itemsLength == 1 ? "item": "items";
 
 
 let totalTxt = `${url}${folders[i]}`;
 
 
  val =  `<div class="files">

<a class="entries" href="http://${domainName}:${PORT}/files/${encodeURIComponent(totalTxt)}/">

<img class="img" src="http://${domainName}:${PORT}/download.png">

 <span class="file-name"> <span class="specific-name folder-entry"  data-length="${itemsLength}">${folders[i]}</span> <br><div class="items-no">${itemsLength} ${itemsText}</div></span>
    </a>

<span class="check-item" data-checked="false">

  <svg class="tick-svg"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

 <path class="tick-path" d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

  </svg>

 </span>

  </div>`
  
  }
  
  totalFiles.push(val);
  
  
  if(totalFiles.length == folders.length) {
      
    resolve (totalFiles);
  }
  
})


};

});

} else {
  
 folderDocs = [];
    
}


fileDocs = fileDocs.sort((a,b) =>  a.localeCompare(b));

const folderMap = folderDocs.sort((a,b) =>  a.localeCompare(b));
 
 // Joins the files and folders


 const fullItem = folderMap.concat(fileDocs).join("");
   
   

 // Repalces the "Files" placeholder
 
 if (domainName.toString() == req.ip.toString()) {

halfPage = successPage.toString().replace("{{%Files%}}", `${fullItem}`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName.toString()}`).replace("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%MENUBOX%}}", "flex").replace("{{%OWNER%}}", true).replaceAll("{{%URLPREFIX%}}", `http://${domainName}:${PORT}`);

 } else {

  halfPage = successPage.toString().replace("{{%Files%}}", `${fullItem}`).replace("{{%SERVERNAME%}}", `${req.app.locals.serverName.toString()}`).replace("{{%URL%}}", `http://${domainName}:${PORT}/config`).replace("{{%CLIENTBOX%}}", "flex").replace("{{%OWNER%}}", false);

 }

 // Repalces the placeholders

  fullPage = halfPage.toString().replace("{{%LINKS%}}", `${newLinks}`).replace("{{%HOME%}}", `"http://${domainName}:${PORT}/files/"`).replace("{{%ICON%}}", `"http://${domainName}:${PORT}/Icon.png"`).replaceAll("{{DETAILSURL}}", `http://${domainName}:${PORT}/details`).replaceAll("{{%%FILEOPERATIONURL%%}}", `http://${domainName}:${PORT}/fileOperations`);
  
 

return res.status(200).send(`${fullPage}`)

 
      

  
  }
  })
  

    
}



