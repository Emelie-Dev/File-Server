// Core Modules



// Third party Modules


import express from "express";

// Local Modules

import * as controller from "../Controllers/FilesController.js"
 

const Router = express.Router();

// Param middleware for the text parameter

Router.param("text", (req,res,next, value) => {
    
 
  if(value.toString() != "files") {
      
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
  
  } else {
     
     
     
      next();
  }
})


// Route for the Home url

Router.route("/")
      .get(controller.fileHome)
      
      
// Route for the Files Home

Router.route("/:text")
      .get(controller.getFiles)
      
 // Route for other directories 

Router.route(/files\/.+/)
     .get(controller.getFilesFromDir)



  
export default Router; 