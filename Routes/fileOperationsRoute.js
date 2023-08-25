

// Core Modules



// Third party Modules


import express from "express"



// Local Modules

import * as controller from "../Controllers/fileOperationsController.js"
 
 
 ////////////////
 
 
 const Router = express.Router();
 
 
 Router.route("/directory")
       .post(controller.createDirectory)
         
 Router.route("/upload")
       .post(controller.uploadFiles, controller.finishUpload);
 
 Router.route("/download")
       .post(/*controller.validateTimestamp,*/controller.downloadFileSystemEntry)
       
Router.route("/compress")
      .post(controller.compressEntry)
      
Router.route("/details")
      .post(controller.getEntryDetails)
   
Router.route("/share")
      .post(controller.shareFileSystemEntry)
         

 Router.route("/")
        .post(controller.checkPassword)
        .delete(controller.deleteFileSystemEntry)
        .patch(controller.renameEntry)
        
   
        
export default Router;