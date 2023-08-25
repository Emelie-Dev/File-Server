
// Core Modules



// Third party Modules


import express from "express";

// Local Modules

import * as controller from "../Controllers/detailsController.js"
 
 
 /////////////////////
 
 
 const Router = express.Router();
 
 // Route for the get details request
 
   Router.route("/:ip?")
         .get(controller.getDetails)


export default Router;