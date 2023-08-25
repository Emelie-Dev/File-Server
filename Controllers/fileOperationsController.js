



// Core Modules

import path from "path";

import fs from "fs";

// Third party Modules


import multer from "multer";

import archiver from "archiver";

// Local Modules





////////////////////

 import { rootDir } from "./../server.js";

 
 const storage = multer.diskStorage({
     
  destination: (req,file,cb) => {
      
  let location = req.get("location");
  
   try {
    
  location = decodeURIComponent(location);

   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  
  location = decodeURIComponent(location);
  } 


 let index = location.toString().indexOf("/files");
 
 let uploadLocation = location.toString().slice((index + 6));
 

  cb(null, `${path.join(rootDir, uploadLocation)}`);
  },
  
  filename: (req,file,cb) => {
      
  cb(null, file.originalname);
  },
  
  limits: {
   
   fileSize: 5 * (1024**3)
  }
  
  
 });
 
 const upload = multer({storage}).array("uploaded-files");
 
 // For checking file operations password 

export const checkPassword = async (req,res) => {
    
  let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "text/plain") {
      
  if(req.app.locals.fileOperations != "") {
     
   if(req.app.locals.fileOperationsPassword.toString() != "") {
       
    
   let password = req.body.toString();
   
   if(password != req.app.locals.fileOperationsPassword.toString()) {
     
      return res.status(401).send(" The password you provided is incorrect.");
   
     
   } else {
       
     return res.status(200).send("Successful");
     
       
   }
    
       
   } else {
       
    return res.status(200).send("Successful");
   }
      
      
  } else {
      
     return res.status(403).send("You are not allowed to upload files.");
  }
      

      
  } else {
      
     return res.status(400).send("Invalid request.");
     
  }
 
}

// For creating new directory 

export const createDirectory = async (req,res) => {
  
    let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {
      
         
  if(req.app.locals.fileOperations != "") {
     
 let { directoryName, location } = req.body;
 
 let param = directoryName.toString().match(/[^\w\d\s\-\.\(\)\[\]\&\#\@\$\+\%\=\!\{\}\~\,\']/) ? true : false;
 
 if((directoryName.toString() == "") || param) {
     
     
 return res.status(400).send("Please enter a valid folder name.");
 
 
     
 } else if (directoryName.toString().length > 100) {
     
   return res.status(400).send("Folder name must be less than '100' characters.");
 
 } else {
     
     
     
    try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);

     
  } 


 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
 
 let folderPath = path.join(rootDir, folderLocation);

let folderExist = await new Promise ((resolve, reject) => {
    
  fs.stat(`${path.join(folderPath, directoryName.toString())}`, (err, stats) => {
  
   if(err) {
       
    resolve(false)   
   } else {
    
    resolve(true);   
       
   }  
   
  })
    
});

 if(folderExist) {
  
  return res.status(409).send("This folder name already exists");
  
     
 } else {
 
   fs.mkdir(`${path.join(folderPath, directoryName.toString())}`, {recursive: true }, (err) => {
       
    if(err) {
        
        
   return res.status(500).send("An unknown error occurred.");
    }
       
   return res.status(201).send("The Folder was created successfully");
       
   })
   
 }
     
 }
  
  } else {
      
    return res.status(403).send("You are not allowed to upload files.");
  }
      
  } else {
      
   return res.status(400).send("Invalid request.");
         
  }
    
    
}


// For uploading files 

export const uploadFiles = async (req,res, next) => {
    
 let contentType = req.get("Content-Type").toString().toLowerCase();

 if(contentType.includes("multipart/form-data")) {
     
       
  if(req.app.locals.fileOperations != "") {
  
next();

  } else {
      
 return res.status(403).send("You are not allowed to upload files.");
      
  }  

 } else {
     
  return res.status(400).send("Invalid request.");
     
 }
      
 
}

export const finishUpload = async (req,res) => {
    
      
  if(req.app.locals.fileOperations != "") {
  
    
   upload(req,res, (err) => {
    
    if(err instanceof multer.MulterError) {
        
     return res.status(500).send("An unknown error occurred.")
    
    } else if (err) {
        
      return res.status(500).send("An unknown error occurred.")
     
    }
    
 
 return res.status(201).send("The file(s) were uploaded successfully.");
     
   })
    
} else {
    
       
 return res.status(403).send("You are not allowed to upload files.");
  
}



}

// For deleting files


export const deleteFileSystemEntry = async (req,res) => {
    
  
 let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {
      
          
if(req.app.locals.fileOperations != "") {
  
 let { location , entries } = req.body; 
 
  try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);

  
  } 


 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
 
 let folderPath = path.join(rootDir, folderLocation);

let errorState = false;

let failedFiles = new Set();

let failedFolders = new Set();

let deletedFiles = new Set();

let deletedFolders = new Set();

 
  try {
 
let files = await new Promise ((resolve, reject) => {
  
let fileArray = [];  

     
 entries = Array.from(entries);
 
 for (let i = 0; i < entries.length; i++)  {

  fs.stat(`${path.join(folderPath, entries[i].fileName)}`, (err, stats) => {
      
    if(err) {
        
     if(entries[i].isFile) {
        
  deletedFiles.add(entries[i].fileName);
 errorState = true;
  }   
  
    } else {
        
     if(stats.isFile()) {
         
       fileArray.push(entries[i]);
     }
     
        
    }
      
     
   if(i == (entries.length - 1)) {
       
   resolve(fileArray);
   
   }
   

  })
  
    };
    
});


let folders =  await new Promise ((resolve, reject) => {
  
let folderArray = [];  

let folderCount = 0;
      
 entries = Array.from(entries);
 
 for (let i = 0; i < entries.length; i++)  {
     
  fs.stat(`${path.join(folderPath, entries[i].fileName)}`, (err, stats) => {
      
    if(err) {
        
     if(entries[i].isFolder) {
        
  deletedFolders.add(entries[i].fileName);
  errorState = true;
  }   
  
    } else {
        
     if(stats.isDirectory()) {
         
       folderArray.push(entries[i]);
     }
     
        
    }
      
     
   if(i == (entries.length - 1)) {
       
   resolve(folderArray);
   
   }

  })
  
    };
    
});


// Deletes all files
       
 if(files.length != 0) {

let emptyFiles = await new Promise((resolve, reject) => {
  
      
 
 for (let i = 0; i < files.length; i++)  {

  fs.stat(`${path.join(folderPath, files[i].fileName)}`, (err, stats) => {
      
    if(err) {
        
   deletedFiles.add(files[i].fileName);
   errorState = true;
        
    } else {
      
        
  fs.unlink(`${path.join(folderPath, files[i].fileName)}`, (delErr) => {
      
      if(delErr) {
     
    failedFiles.add(files[i].fileName);
   errorState = true;
  
      }
      
    if(i == (files.length - 1)) {
       
      resolve("Done");  
        
    }
  
   
  })
  
    }
    
});

    
};


})

}

// Deletes all folders 

  if (folders.length != 0) {

 let emptyFolders = await new Promise((resolve, reject) => {
    
   for (let i = 0; i < folders.length; i++)  {

  fs.stat(`${path.join(folderPath, folders[i].fileName)}`, (err, stats) => {
      
     if(err) {
         
   deletedFolders.add(folders[i].fileName)
   errorState = true; 
         
  } else {
    
  fs.rm(`${path.join(folderPath, folders[i].fileName)}`, {recursive: true, force: true}, err => {
      
      if(err) {
          
    failedFolders.add(folders[i].fileName);
    errorState = true;
   
      }
      
   if(i == (folders.length - 1)) {
       
    resolve("Done");
    
   }
    
  })
 
  }   
     
})

};

});

}

let deletedFoldersText = "";

let deletedFilesText = "";

let failedFoldersText = "";

let failedFilesText = "";

if(deletedFolders.size != 0) {
    
 let countText = deletedFolders.size == 1 ? "was" : "were";
 
 let count = deletedFolders.size == 1 ? "folder" : "folders";
 
 
 deletedFoldersText = `${deletedFolders.size} ${count} ${countText} not found - ${[...deletedFolders].join(", ")}\n\n`;
    
} else {
    
  deletedFoldersText = "";
}

if(deletedFiles.size != 0) {
     
 let countText = deletedFiles.size == 1 ? "was" : "were";
 
 let count = deletedFiles.size == 1 ? "file" : "files";
 

  deletedFilesText = `${deletedFiles.size} ${count} ${countText} not found - ${[...deletedFiles].join(", ")}\n\n`;

} else {
    
    deletedFilesText = "";
}

if(failedFolders.size != 0) {
    
  
 let countText = failedFolders.size == 1 ? "was" : "were";
 
 let count = failedFolders.size == 1 ? "folder" : "folders";
 
     
  failedFoldersText = `${failedFolders.size} ${count} ${countText} not deleted - ${[...failedFolders].join(", ")}\n\n`;

} else {
    
   failedFoldersText = "";
}

if(failedFiles.size != 0) {
    
  
 let countText = failedFiles.size == 1 ? "was" : "were";
 
 let count = failedFiles.size == 1 ? "file" : "files";
 
  
  failedFilesText = `${failedFiles.size} ${count} ${countText} not deleted - ${[...failedFiles].join(", ")}\n\n`;
 
}  else {
    
  failedFilesText = "";
}

   

let resText = errorState ? "The remaining selected item(s) were deleted successfully." : "The selected item(s) were deleted successfully.";

return res.status(200).send(`${deletedFoldersText}${deletedFilesText}${failedFoldersText}${failedFilesText}${resText}`);


} catch (err) {
    
  return res.status(500).send("An unknown error occurred.");
}

  } else {
      
return res.status(403).send("You are not allowed to delete items.");
  
  }
  
  } else {
      
   return res.status(400).send("Invalid request.");
         
  }
    

}

// For validating the time stamp

export const validateTimestamp = (req, res, next) => {
    
  let { time } = req.query;
  
  let valType = typeof time == "number";
  
  if(valType) {
      
      next();
      
  } else {
      
   throw new Error ();
  }
}

// For downloading files

export const downloadFileSystemEntry =  (req,res) => {
    
 let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {

 
  if(req.app.locals.fileOperations != "") { 
      
  
let { location, entry } = req.body;


 
  try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);
 
 
  } 


 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
  

 let folderPath = path.join(rootDir, folderLocation);

 
let entryUrl = path.join(folderPath, entry);

 fs.stat(`${entryUrl}`, (err, stats) => {
     
   if(err) {
     
  return res.status(404).send(`${entry} could not be downloaded because it wasn't found.`)
  
   } else if (stats.isDirectory()) {
            
  return res.status(404).send(`${entry} could not be downloaded because it wasn't found.`)

   } else {
       
let realLocation = location.endsWith("/") ? location : location.toString() + "/";

realLocation = `${realLocation}${entry}`;
       
     res.status(200).json({
         
      fileLocation: realLocation

     })
    
   }
   
     
 });
 
 
 
  } else {
      
return res.status(403).send("You are not allowed to download files.");
  
}

} else {
    
  return res.status(400).send("Invalid request.");
         
    
}

}



// For compressing items

export const compressEntry = async (req,res) => {
    
        
 let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {
          
if(req.app.locals.fileOperations != "") {
 
let deleteItems = req.get("Data-Delete").toString().toLowerCase();


 let { location , entries , option , value } = req.body; 
 
  try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);
 
  } 

 
 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
 
 let folderPath = path.join(rootDir, folderLocation);

let errorState = false;

let compressErrorState = false;

let currentIndex = 0;

let currentFileIndex = 0;

let currentFolderIndex = 0;

let deletedFiles = new Set();

let deletedFolders = new Set();

let deniedFiles = new Set();

let deniedFolders = new Set();

let otherFiles = new Set();

let otherFolders = new Set();


entries = Array.from(entries);


let files = await new Promise ((resolve, reject) => {
    
let fileArray = [];
 
for(let i = 0; i < entries.length; i++) {
    
  fs.stat(`${path.join(folderPath, entries[i].fileName)}`, (err, stats) => {
      
    if(err) {
     
   if(entries[i].isFile) {
       
     deletedFiles.add(entries[i].fileName);
     errorState = true;
   }
     
    } else {
        
   if(stats.isFile()) {
       
    fileArray.push(entries[i])
   }
    
    }
    
         
   if(i == (entries.length - 1)) {
       
   resolve(fileArray);
   
   }

      
  })
    
}
    
})
  
let folders =   await new Promise ((resolve, reject) => {
    
let folderArray = [];
 
for(let i = 0; i < entries.length; i++) {
    
  fs.stat(`${path.join(folderPath, entries[i].fileName)}`, (err, stats) => {
      
    if(err) {
     
   if(entries[i].isFolder) {
       
     deletedFolders.add(entries[i].fileName);
     errorState = true;
   }
     
    } else {
        
   if(stats.isDirectory()) {
       
    folderArray.push(entries[i])
   }
    
    }
    
         
   if(i == (entries.length - 1)) {
       
   resolve(folderArray);
   
   }

      
  })
    
}
    
})


  if(option == 0) {
    
 
 if (value == "") {
     
  return res.status(400).send("Please provide a name for the compressed file.");
  
   
 }
 
 if (value.match(/\W/)) {
  
  return res.status(400).send("The compressed file name must contain only alphanumeric characters.");
   
 }
 
 
const outputFile = `${path.join(folderPath, value)}.zip`;

let fileExist = await new Promise ((resolve, reject) => {
       
   fs.stat(`${outputFile}`, (err, stats) => {
       
    if(err) {
        
    resolve(false);  
    
    } else {
      
   resolve(true);
   
    }
       
   })
    
})


 if(fileExist) {
    
  return res.status(409).send("This file name already exists.");
  
 }
 

const outputStream = fs.createWriteStream(outputFile);

const archive = archiver('zip', {
    
   zlib: { level: 9 }
    
});

// Handles the close event 
 
outputStream.on("close", async () => {
 
if(errorState) {
    
let deletedFilesText = "";

let deletedFoldersText = "";

 if(deletedFiles.size != 0) {
  
let deletedFilesCount = deletedFiles.size == 1 ? "was"  : "were";

let deletedFilesCountText = deletedFiles.size == 1 ? "file"  : "files";

deletedFilesText = `${deletedFiles.size} ${deletedFilesCountText} ${deletedFilesCount} not found:  ${[...deletedFiles].join(", ")}.\n\n`;

}


 if(deletedFolders.size != 0) {
  
let deletedFoldersCount = deletedFolders.size == 1 ? "was"  : "were";

let deletedFoldersCountText = deletedFolders.size == 1 ? "folder"  : "folders";

deletedFoldersText = `${deletedFolders.size} ${deletedFoldersCountText} ${deletedFoldersCount} not found:  ${[...deletedFolders].join(", ")}.\n\n`;

}

  if(deleteItems.toString().toLowerCase() == "true") {
  
if(files.length != 0) {
  
let rawFilesDeletion = await new Promise ((resolve, reject) => {
    
 for(let i = 0; i < files.length; i++) {

   fs.unlink(`${path.join(folderPath, files[i].fileName)}`, (err) => {
    
   if(err) {
       
  
    
   } 
   
  if(i == (files.length - 1)) {
      
     resolve();
     
  }
       
   })
       
   }
    
})

}

 
if(folders.length != 0) {
  
let rawFoldersDeletion = await new Promise ((resolve, reject) => {
    
 for (let i = 0; i < folders.length; i++) {
     
   fs.rm(`${path.join(folderPath, folders[i].fileName)}`, {recursive: true, force: true}, (err) => {
       
     if(err) {
     
    
     
 }
 
 if(i == (folders.length - 1)) {
     
   resolve();
   
 }
       
   })
   
   
 }
    
})
  
 }

}

return res.status(201).send(`${deletedFilesText}${deletedFoldersText}The remaining selected item(s) were compressed successfully.`);
  
} else {
    
 if(deleteItems.toString().toLowerCase() == "true") {
  
   
if(files.length != 0) {
  
  
let rawFilesDeletion = await new Promise ((resolve, reject) => {
    
 for(let i = 0; i < files.length; i++) {

   fs.unlink(`${path.join(folderPath, files[i].fileName)}`, (err) => {
    
   if(err) {
       
  
    
   } 
   
  if(i == (files.length - 1)) {
      
     resolve();
     
  }
       
   })
       
   }
    
})

}

   
if(folders.length != 0) {
  
let rawFoldersDeletion = await new Promise ((resolve, reject) => {
    
 for (let i = 0; i < folders.length; i++) {
     
   fs.rm(`${path.join(folderPath, folders[i].fileName)}`, {recursive: true, force: true}, (err) => {
       
     if(err) {
     
   
     
 }
 
 if(i == (folders.length - 1)) {
     
   resolve();
   
 }
       
   })
   
   
 }
    
})
  
 }

}

return res.status(201).send(`The selected item(s) were compressed successfully.`);
  
}
    
});

 // Handles the Error event
 
archive.on("error", async (err) => {
 
currentIndex += 1;

if(currentIndex == 1) {
 
 let errorFileExist = await new Promise ((resolve, reject) => {
       
   fs.stat(`${outputFile}`, (err, stats) => {
       
    if(err) {
        
    resolve(false);  
    
    } else {
      
   resolve(true);
   
    }
       
   })
    
});

 if(errorFileExist) {
 
let deleteErrorFile = await new Promise ((resolve, reject) => {
    
  fs.unlink(`${outputFile}`, err => {
      
    if(err) {
  
  
  res.status(500).send("An unknown error occurred."); 
  
     resolve();
     
     return;
    }
    
    resolve();
    
   });
      
  })  
     
 }
 

 if(err.code == "EACCES") {
     
return res.status(500).send(`The selected item(s) could not be compressed due to permission denial from some files or folders.`); 
       
        
 } else {
     
 return res.status(500).send("The selected items could not be compressed due to an unknown error."); 
  
 }
 
 
} 

})

// Pipes the data to the output stream

archive.pipe(outputStream);

// compresses all files


if(files.length != 0) {
    
  for (let i = 0; i < files.length; i++) {
      
   archive.file(`${path.join(folderPath, files[i].fileName)}`);
   
  }
}

// compresses all folders


if(folders.length != 0) {
    
 for (let i = 0; i < folders.length; i++) {
      
   archive.directory(`${path.join(folderPath, folders[i].fileName)}`);
   
  }
}



archive.finalize();
 
 
 
} else if (option == 1) {
    
 
 if (value == "") {
     
  return res.status(400).send("Please provide a name for the folder.");
  
   
 }
 
 if (value.match(/\W/)) {
  
  return res.status(400).send("The folder name must contain only alphanumeric characters.");
   
 }
 
 let outputFolder = "";
 
let folderExist = await new Promise ((resolve, reject) => {

 outputFolder = `${path.join(folderPath, value)}`;
       
   fs.stat(`${outputFolder}`, (err, stats) => {
       
    if(err) {
        
    resolve(false);  
    
    } else {
      
   resolve(true);
   
    }
       
   })
    
})

 if(folderExist) {
    
  return res.status(409).send("This folder name already exists.");
  
 }
 
 
 outputFolder = `${path.join(folderPath, value)}`;
       
let folderCreation = await new Promise ((resolve, reject) => {
     
 fs.mkdir(`${outputFolder}`, {recursive: true}, (err) => {
     
      if(err) {
        
        
   return res.status(500).send("An unknown error occurred.");
    }
    
    resolve();
       
 })
 
 });
    

// For the files 
    
  if(files.length != 0) {
      
let filesFinished = await new Promise ((resolve, reject) => {
  

  for(let i = 0; i < files.length; i++) {

let ext = path.extname(files[i].fileName);

const outputFile = `${path.join(outputFolder, path.basename(files[i].fileName, ext))}.zip`;

const outputStream = fs.createWriteStream(`${outputFile}`);
 
   
const archive = archiver('zip', {
    
   zlib: { level: 9 }
    
});


// Handles the close event

outputStream.on("close", () => {
     
   currentFileIndex += 1;
  
  if(currentFileIndex == files.length) {
      
   resolve();
  }
       
})

// Handles the Error event

archive.on("error", (err) => {
      
   currentFileIndex += 1;
   
 if(err.code == "EACCES") {
     
  deniedFiles.add(files[i].fileName);
  
} else {
    
    
  otherFiles.add(files[i].fileName);
  
}

   errorState = true;
      
  if(currentFileIndex == files.length) {
      
   resolve();
  }
       
})


archive.pipe(outputStream);


 archive.file(`${path.join(folderPath, files[i].fileName)}`);
 
 
archive.finalize();

  }
      
    
});

  }
  
  
// For the folders
  
  if(folders.length != 0) {
      
 let foldersFinished = await new Promise ((resolve, reject) => {
     
 
  for(let i = 0; i < folders.length; i++) {

const outputFile = `${path.join(outputFolder, folders[i].fileName)}.zip`;

const outputStream = fs.createWriteStream(`${outputFile}`);
 
   
const archive = archiver('zip', {
    
   zlib: { level: 9 }
    
});


// Handles the close event

outputStream.on("close", () => {
    
   currentFolderIndex += 1;
  
  if(currentFolderIndex == folders.length) {
      
   resolve();
  }
    
})

// Handles the Error event

archive.on("error", (err) => {
    
 currentFolderIndex += 1;
    
 if(err.code == "EACCES") {

  deniedFolders.add(folders[i].fileName);
  
} else {
    
  otherFolders.add(folders[i].fileName);
  
    
}
  errorState = true;
  

  if(currentFolderIndex == folders.length) {
      
   resolve();
  }
    
    
})

archive.pipe(outputStream);


 archive.directory(`${path.join(folderPath, folders[i].fileName)}`);
 
 
archive.finalize();
  }
      
 })
 
  }
  
  
if(errorState) {
    
let deletedFilesText = "";

let deletedFoldersText = "";

let deniedFilesText = "";

let deniedFoldersText = "";

let otherFilesText = "";

let otherFoldersText = "";


 if(deletedFiles.size != 0) {
  
let deletedFilesCount = deletedFiles.size == 1 ? "was"  : "were";

let deletedFilesCountText = deletedFiles.size == 1 ? "file"  : "files";

deletedFilesText = `${deletedFiles.size} ${deletedFilesCountText} ${deletedFilesCount} not found:  ${[...deletedFiles].join(", ")}.\n\n`;

}


 if(deletedFolders.size != 0) {
  
let deletedFoldersCount = deletedFolders.size == 1 ? "was"  : "were";

let deletedFoldersCountText = deletedFolders.size == 1 ? "folder"  : "folders";

deletedFoldersText = `${deletedFolders.size} ${deletedFoldersCountText} ${deletedFoldersCount} not found:  ${[...deletedFolders].join(", ")}.\n\n`;

}


 if (deniedFiles.size != 0) {
    
    
let deniedFilesCount = deniedFiles.size == 1 ? "was"  : "were";

let deniedFilesCountText = deniedFiles.size == 1 ? "file"  : "files";

deniedFilesText = `${deniedFiles.size} ${deniedFilesCountText} ${deniedFilesCount} not compressed ("Permission Error") :  ${[...deniedFiles].join(", ")}.\n\n`;

 // Delete failed files 
 
 
  let fileDeletion = await new Promise ((resolve, reject) => {
 
 let failedFilesArray = [...deniedFiles];
 
for(let fileIndex = 0; fileIndex < failedFilesArray.length; fileIndex++) {
    
 fs.unlink(`${path.join(outputFolder,failedFilesArray[fileIndex])}.zip`, fileErr => {
      
     if(fileErr) {
   
     
     }
     
  if(fileIndex == (failedFilesArray.length - 1)) {
     
   resolve(); 
   
  }
      })
       
   }
 
  });
  


}


 if (deniedFolders.size != 0) {
     
     
let deniedFoldersCount = deniedFolders.size == 1 ? "was"  : "were";

let deniedFoldersCountText = deniedFolders.size == 1 ? "folder"  : "folders";

deniedFoldersText = `${deniedFolders.size} ${deniedFoldersCountText} ${deniedFoldersCount} not compressed ("Permission Error") :  ${[...deniedFolders].join(", ")}.\n\n`;



  // Delete failed folders
  
  let folderDeletion = await new Promise ((resolve, reject) => {
 
 let failedFoldersArray = [...deniedFolders];
 
for(let folderIndex = 0; folderIndex < failedFoldersArray.length; folderIndex++) {
    
 fs.unlink(`${path.join(outputFolder,failedFoldersArray[folderIndex])}.zip`, fileErr => {
      
     if(fileErr) {
         
 
     
     }
     
  if(folderIndex == (failedFoldersArray.length - 1)) {
     
   resolve(); 
   
  }
      })
       
   }
 
  });
  
 }
  

 if (otherFiles.size != 0) {
    
    
let otherFilesCount = otherFiles.size == 1 ? "was"  : "were";

let otherFilesCountText = otherFiles.size == 1 ? "file"  : "files";

otherFilesText = `${otherFiles.size} ${otherFilesCountText} ${otherFilesCount} not compressed ("Unknown Error") :  ${[...otherFiles].join(", ")}.\n\n`;

 // Delete failed files 
 
 
  let fileDeletion = await new Promise ((resolve, reject) => {
 
 let failedFilesArray = [...otherFiles];
 
for(let fileIndex = 0; fileIndex < failedFilesArray.length; fileIndex++) {
    
 fs.unlink(`${path.join(outputFolder,failedFilesArray[fileIndex])}.zip`, fileErr => {
      
     if(fileErr) {
         
  
     
     }
     
  if(fileIndex == (failedFilesArray.length - 1)) {
     
   resolve(); 
   
  }
      })
       
   }
 
  });
  


}


 if (otherFolders.size != 0) {
     
     
let otherFoldersCount = otherFolders.size == 1 ? "was"  : "were";

let otherFoldersCountText = otherFolders.size == 1 ? "folder"  : "folders";

otherFoldersText = `${otherFolders.size} ${otherFoldersCountText} ${otherFoldersCount} not compressed ("Unknown Error") :  ${[...otherFolders].join(", ")}.\n\n`;



  // Delete failed folders
  
  let folderDeletion = await new Promise ((resolve, reject) => {
 
 let failedFoldersArray = [...otherFolders];
 
for(let folderIndex = 0; folderIndex < failedFoldersArray.length; folderIndex++) {
    
 fs.unlink(`${path.join(outputFolder,failedFoldersArray[folderIndex])}.zip`, fileErr => {
      
     if(fileErr) {
         
  
     
     }
     
  if(folderIndex == (failedFoldersArray.length - 1)) {
     
   resolve(); 
   
  }
      })
       
   }
 
  });
  
 }
 
 
  if(deleteItems.toString().toLowerCase() == "true") {
  
  
if(files.length != 0) {
  
  
let failedFilesArray = [...deniedFiles, ...otherFiles];

 let deleteArray = [];
 
 for (let i = 0; i < files.length; i++) {
   
  if(!(failedFilesArray.includes(files[i].fileName))) {
      
    deleteArray.push(files[i].fileName);
  } 
     
 }
 
 if(deleteArray.length != 0) {
   
let rawFilesDeletion = await new Promise ((resolve, reject) => {
    
 for(let i = 0; i < deleteArray.length; i++) {

   fs.unlink(`${path.join(folderPath, deleteArray[i])}`, (err) => {
    
   if(err) {
       
   
    
   } 
   
  if(i == (deleteArray.length - 1)) {
      
     resolve();
     
  }
       
   })
       
   }
    
})

}
}

   
if(folders.length != 0) {
  
  
let failedFoldersArray = [...deniedFolders, ...otherFolders];

 let deleteArray = [];
 
 
 for (let i = 0; i < folders.length; i++) {
   
  if(!(failedFoldersArray.includes(folders[i].fileName))) {
      
    deleteArray.push(folders[i].fileName);
  } 
     
 }
  
  if(deleteArray.length != 0) { 
 
let rawFoldersDeletion = await new Promise ((resolve, reject) => {
    
 for (let i = 0; i < deleteArray.length; i++) {
     
   fs.rm(`${path.join(folderPath, deleteArray[i])}`, {recursive: true, force: true}, (err) => {
       
     if(err) {
     
   
     
 }
 
 if(i == (deleteArray.length - 1)) {
     
   resolve();
   
 }
       
   })
   
   
 }
    
})

  }
  
}

 }

let totalFailedItems = [...deletedFolders, ...deletedFiles, ...deniedFolders, ...deniedFiles, ...otherFolders, ...otherFiles];

let entryLength = entries.length - totalFailedItems.length;

 
 if(entryLength != 0) {
 
return res.status(201).send(`${deletedFilesText}${deletedFoldersText}${deniedFilesText}${deniedFoldersText}${otherFilesText}${otherFoldersText}The remaining selected item(s) were compressed successfully.`);
  
} else {
     
let folderExist = await new Promise ((resolve, reject) => {
       
 fs.stat(`${outputFolder}`, (err, stats) => {
       
    if(err) {
        
    resolve(false);  
    
    } else {
      
   resolve(true);
   
    }
       
   })
    
})

   if(folderExist) {

 let deleteEmptyFolder = await new Promise ((resolve, reject) => {
     
     
  fs.rm(`${outputFolder}`, {recursive: true, force: true}, (err) => {
       
     if(err) {
     
     }
     
     resolve();
     
  })
  
  });
  
}

return res.status(201).send(`${deletedFilesText}${deletedFoldersText}${deniedFilesText}${deniedFoldersText}${otherFilesText}${otherFoldersText}`);
     
}

} else {
  
  
  
  if(deleteItems.toString().toLowerCase() == "true") {
    
if(files.length != 0) {
  
let rawFilesDeletion = await new Promise ((resolve, reject) => {
    
 for(let i = 0; i < files.length; i++) {

   fs.unlink(`${path.join(folderPath, files[i].fileName)}`, (err) => {
    
   if(err) {
       
  
    
   } 
   
  if(i == (files.length - 1)) {
      
     resolve();
     
  }
       
   })
       
   }
    
})

}

   
if(folders.length != 0) {
  
let rawFoldersDeletion = await new Promise ((resolve, reject) => {
    
 for (let i = 0; i < folders.length; i++) {
     
  fs.rm(`${path.join(folderPath, folders[i].fileName)}`, {recursive: true, force: true}, (err) => {
       
     if(err) {
     
    
     
 }
 
 if(i == (folders.length - 1)) {
     
   resolve();
   
 }
       
   })
   
   
 }
    
})
  
 }

}

  
    
    return res.status(201).send(`The selected item(s) were compressed successfully.`);
  
}

  
} else {
    
  return res.status(400).send("Invalid request.");
}



} else {
     
return res.status(403).send("You are not allowed to compress items.");
     
    
}


  } else {
      
  return res.status(400).send("Invalid request.");
         
  } 
  
  
}

// For renaming items

export const renameEntry = async (req,res) => {
    
  let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {
          
 if(req.app.locals.fileOperations != "") {
 
 
 let { location , entries } = req.body; 
 
 
  try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);
 
  } 

 
 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
 
 let folderPath = path.join(rootDir, folderLocation);
 
 
let errorState = false;

let failedFiles = new Set();

let failedFolders = new Set();

let deletedFiles = new Set();

let deletedFolders = new Set();


let [entryFiles, entryFolders] = entries;

let files = [];

let folders  = [];

let deletedFilesText = "";

let deletedFoldersText = "";

let failedFilesText = "";

let failedFoldersText = "";


if((entryFiles.length + entryFolders.length) > 1000) {
    
  return res.status(413).send("You can only rename '1000' items at once.");
    
}


 
 // checks for invalid file name

let totalEntry = [...entryFiles, ...entryFolders];

let newNameArray  = [];
 
 for (let i = 0; i < totalEntry.length; i++) {
    
 let param = totalEntry[i].newName.match(/[^\w\d\s\-\.\(\)\[\]\&\#\@\$\+\%\=\!\{\}\~\,\']/) ? true : false;
  
 
 if((totalEntry[i].newName == "") || (totalEntry[i].newName == ".") || param) {
     
 res.send(`Please provide a valid name for "${totalEntry[i].oldName}".`);

 
  return;

}

 if(newNameArray.includes(totalEntry[i].newName)) {
     
 let index = newNameArray.indexOf(totalEntry[i].newName);
 
     
res.status(409).send(`You set the same new name value for:\n\n(i) ${totalEntry[index].oldName}.\n\n(ii) ${totalEntry[i].oldName}.\n\nPlease change one of them.`);
     
   return;
 }
 
  newNameArray.push(totalEntry[i].newName);   
     
 let fileExists = await new Promise ((resolve, reject) => {
  
  fs.stat(`${path.join(folderPath, totalEntry[i].newName)}`, (err, stats) => {
    
  if(err) {
   
  resolve(false);   
    
  }  else {
      
   if(stats.isFile()) {
       
      resolve("file");  
   }
   
   if(stats.isDirectory()) {
      
    resolve("folder");
  }
  
  }
      
  })
     
 });
 
 if(fileExists == "file")  {
  
   
 return res.status(409).send(`A file with the new name value you set for '${totalEntry[i].oldName}' already exists.`);  
     
 }
 
 
 if(fileExists == "folder")  {
  
   
 return res.status(409).send(`A folder with the new name value you set for '${totalEntry[i].oldName}' already exists.`);  
     
 }
 

}


if(entryFiles.length != 0) {

 files = await new Promise ((resolve, reject) => {
    
 let fileArray = [];
 
  for (let i = 0; i < entryFiles.length; i++) {
   
 fs.stat(`${path.join(folderPath, entryFiles[i].oldName)}`, (err, stats) => {
        
     if(err) {
         
    deletedFiles.add(entryFiles[i].oldName);
    
    errorState = true;
    
     } else {
         
     fileArray.push(entryFiles[i]);
     
     }
     
 if(i == (entryFiles.length - 1)) {
     
   resolve(fileArray);
   
 }
        
    })
      
  }
    
})

}

 if (entryFolders.length != 0) {
     
 
 folders  = await new Promise ((resolve, reject) => {
    
 let folderArray = [];
 
  for (let i = 0; i < entryFolders.length; i++) {
   
 fs.stat(`${path.join(folderPath, entryFolders[i].oldName)}`, (err, stats) => {
        
     if(err) {
         
    deletedFolders.add(entryFolders[i].oldName);
    
    errorState = true;
    
     } else {
         
     folderArray.push(entryFolders[i]);
     
     }
     
 if(i == (entryFolders.length - 1)) {
     
   resolve(folderArray);
   
 }
        
    })
      
  }
    
})

}

 
 if(files.length != 0) {

let renameFiles = await new Promise ( async (resolve, reject) => {
    
  for (let i = 0; i < files.length; i++) {
  
 let fileProm = await new Promise ((resolve, reject) => {   
      
 fs.rename(`${path.join(folderPath, files[i].oldName)}`, `${path.join(folderPath, files[i].newName)}`, (err) => {
     
  if(err) {
   
  failedFiles.add(files[i].oldName);   
   errorState = true;
   resolve();
  }
  
  resolve();
  
 })
 
 })
 
  if(i == (files.length - 1)) {
      
   resolve();
   
  }
     
 }
   
  })
    


}


 if(folders.length != 0) { 
     
let renameFolders  = await new Promise ( async (resolve, reject) => {
  
 for (let i = 0; i < folders.length; i++) {
   
let folderProm = await new Promise ((resolve, reject)  => {
    
  fs.rename(`${path.join(folderPath, folders[i].oldName)}`, `${path.join(folderPath, folders[i].newName)}`, err => {
     
   if(err) {
       
    failedFolders.add(folders[i].oldName);
    errorState = true;
  
  resolve();
    
   }
   
 resolve();
 
    })
})

    
 if (i == (folders.length - 1)) {
   
   resolve();
   
 }
   
 }
   
 }) 
    

}


 if(errorState) {
     
if(deletedFolders.size != 0) {
    
 let countText = deletedFolders.size == 1 ? "was" : "were";
 
 let count = deletedFolders.size == 1 ? "folder" : "folders";
 
 
 deletedFoldersText = `${deletedFolders.size} ${count} ${countText} not found - ${[...deletedFolders].join(", ")}\n\n`;
    
} else {
    
  deletedFoldersText = "";
}


if(deletedFiles.size != 0) {
     
 let countText = deletedFiles.size == 1 ? "was" : "were";
 
 let count = deletedFiles.size == 1 ? "file" : "files";
 

  deletedFilesText = `${deletedFiles.size} ${count} ${countText} not found - ${[...deletedFiles].join(", ")}\n\n`;

} else {
    
    deletedFilesText = "";
}



if(failedFolders.size != 0) {
   
  
 let count = failedFolders.size == 1 ? "folder" : "folders";
 
     
  failedFoldersText = `${failedFolders.size} ${count} could not be renamed - ${[...failedFolders].join(", ")}\n\n`;

} else {
    
   failedFoldersText = "";
}



if(failedFiles.size != 0) {
  
 let count = failedFiles.size == 1 ? "file" : "files";
 
  
  failedFilesText = `${failedFiles.size} ${count} could not be renamed  - ${[...failedFiles].join(", ")}\n\n`;
 
}  else {
    
  failedFilesText = "";
}

  
let failedLength = failedFiles.size + failedFolders.size + deletedFolders.size + deletedFiles.size;



let resText = failedLength == (entryFiles.length + entryFolders.length) ? "" : "The remaining selected item(s) were renamed successfully.";

return res.status(200).send(`${deletedFoldersText}${deletedFilesText}${failedFoldersText}${failedFilesText}${resText}`);


     
 } else {
     
  return res.status(200).send("The selected item(s) were renamed successfully.");
   
 }

} else {
    
  return res.status(403).send("You are not allowed to rename items.");
     
}


} else {
    
return res.status(400).send("Invalid request.");

}

}


// For entry details

/*
 function readFolder(filePath) {
   
 let size = 0;
 
 
 return new Promise ((resolve, reject) => {
     
  fs.readdir(`${filePath}`, async (err, files) => {
  
 
    if(err) {
        
      size = 0;
   
      resolve(size);
      
    }  else {
        
  for (let i = 0; i < files.length; i++) {
   
 let sizeProm =  await new Promise ((resolve, reject) => {

let fileSize = 0;

   fs.stat(`${path.join(filePath, files[i])}`, async (statErr, stats) => {
       
    if(statErr) {
       
         
    fileSize = 0;
    
    resolve(fileSize);
    
    } else {
    
     
     
    if(stats.isFile()) { 
        
       fileSize = stats.size;
       
       resolve(fileSize);
    }
    
    if(stats.isDirectory()) {
     
 resolve(await readFolder(`${path.join(filePath, files[i])}`));  
    }
   
    }
    
   })
     
 })
  
    size += sizeProm;
   
    
    }
    
    resolve(size);
    
    }
        
    })
    
 })
  
 
} 
*/


   function readFolder(filePath) {
   
 let size = 0;
 
 let itemLength = 0;
 
 return  new Promise ((resolve, reject) => {
     
  fs.readdir(`${filePath}`, async (err, files) => {
  
 
    if(err) {
        
      size = 0;
   
      resolve({size, itemLength});
      
    }  else {
      
      try {
        
   itemLength  = files.length;
        
      } catch (err)  {
          
     itemLength  = 0; 
     
      }
      
      
  for (let i = 0; i < files.length; i++) {
   
 let sizeProm =  await new Promise ((resolve, reject) => {

let fileSize = 0;

   fs.stat(`${path.join(filePath, files[i])}`, async (statErr, stats) => {
       
    if(statErr) {
       
         
    fileSize = 0;
    
    resolve(fileSize);
    
    } else {
    
     
     
    if(stats.isFile()) { 
        
       fileSize = stats.size;
       
       resolve(fileSize);
    }
    
    if(stats.isDirectory()) {
     
 resolve((await readFolder(`${path.join(filePath, files[i])}`)).size);  
    }
   
    }
    
   })
     
 })
  
    size += sizeProm;
   
    
    }
    
    resolve({size, itemLength});
    
    }
        
    })
    
 })
 
 
  
 
} 



export const getEntryDetails = async (req,res) => {
   
   
 
  let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {
          
 if(req.app.locals.fileOperations != "") {
     
  
 let { location , entries, timestamp } = req.body; 


  try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);
 
  } 

 
 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
 
 let folderPath = path.join(rootDir, folderLocation);
 
 let responseArray = [];
 
 let files = [];
 
 let folders = [];
 
if(entries.length > 1000) {
    
  return res.status(413).send("You can only view the details of '1000' items at once.");
}

  try {

 for (let i = 0; i < entries.length; i++) {
 
 let entry = {};
 
let entryProm = await new Promise ( (resolve, reject) => {
    
  fs.stat(`${path.join(folderPath, entries[i])}`, async (err, stats) => {
  
   if(err) {
      
    entry.errorState = true;
    
    entry.entryName = `${entries[i]}`;
  
    resolve(entry);
    
   }  else {
       
  
  if(stats.isFile()) {
      
       entry.type = "file";
    
   entry.fileName = `${entries[i]}`;
      
   entry.size = stats.size;
  }
  
  if(stats.isDirectory()) {
    entry.type = "folder";
           
    entry.folderName = `${entries[i]}`;  

 
   entry.size = (await readFolder(`${path.join(folderPath, entries[i])}`)).size;
   
   entry.itemLength = (await readFolder(`${path.join(folderPath, entries[i])}`)).itemLength;
     
  }
  
  
  entry.lastModifiedTime = stats.mtimeMs;
  
  
 entry.readable = await new Promise ((resolve, reject) => {
     
  fs.access(`${path.join(folderPath, entries[i])}`, fs.constants.R_OK, accErr => {
     
  if(accErr) {
      
     resolve(false);
   }
   
   resolve(true);
     
 })
 
 })
 
 
 entry.writable = await new Promise ((resolve, reject) => {
     
  fs.access(`${path.join(folderPath, entries[i])}`, fs.constants.W_OK, accErr => {
     
  if(accErr) {
        
     resolve (false);
   }
   
   resolve(true);
     
 })
 
 })
 
 resolve(entry);
  
   }
      
  })
    
});

 responseArray.push(entryProm);
  
 }
 
 
  } catch (err)  {
      
    return res.status(500).json({
        
     status: "error",
     data: {
         
       message: "An unknown error occurred.",
       resTime: timestamp
         
     }
    });
  
  }
  
  return res.status(200).json({
      
      status: "success",
      data: {
    
       details: responseArray,
       resTime: timestamp
      
      
      }
  });

 } else {
     
  return res.status(403).send("You are not allowed to view item(s) details.");
      
 }
 
  } else {
      
return res.status(400).send("Invalid request.");

  }
  
  
 
 
 
    
}



 // for sharing files
 
 
export const shareFileSystemEntry = async (req,res) => {
    
    
 
  let contentType = req.get("Content-Type").toString().toLowerCase();
  
  if(contentType == "application/json") {  
          
 if(req.app.locals.fileOperations != "") {
   
   
   
 let { location , entries } = req.body; 


  try {
    
  location = decodeURIComponent(location);


   } catch (err) {
  
 let path = location.split("/");

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

location = invalidCharacters.join("/");

  location = decodeURIComponent(location);
 
  } 

 
 let index = location.toString().indexOf("/files");
 
 let folderLocation = location.toString().slice((index + 6));
 
 let folderPath = path.join(rootDir, folderLocation);
 
 let failedFiles  = new Set();
 
 let responseArray  = [];
 
  
if(entries.length > 10) {
    
  return res.status(413).send("You can only share '10' files at once.");
}

 
 try {
 
for (let i = 0; i < entries.length; i++)  {
  
 let fileProm = await new Promise ((resolve, reject) => {
    
  fs.stat(`${path.join(folderPath, entries[i])}`, (err, stats)  => {
      
    if(err) {
     
     failedFiles.add(entries[i]);
     
     resolve();
        
    }  else {
      
    if(stats.isDirectory()) {
        
       
     failedFiles.add(entries[i]);
     
     resolve(); 
        
    }  
    
    if(stats.isFile()) {
      
        
    responseArray.push(entries[i]);
     
     resolve();  
        
    }
        
    }
      
  })
     
 })
    
}


} catch (err)  {
    
  return res.status(500).send("An unknown error occurred.");
  
}


  return res.status(200).json({
   
   status: "success",
   data : {
     
    responseArray,
   failedFiles:  [...failedFiles]
     
   }
      
  });
 
 
 
 } else {
     
  return res.status(403).send("You are not allowed to share files.");
 }
   
}  else {
    
   return res.status(400).send("Invalid request.");
}


}