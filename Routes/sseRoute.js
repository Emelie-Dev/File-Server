

// Core Modules



// Third party Modules


import express from "express";

// Local Modules

import * as controller from "../Controllers/sseController.js"
 

const Router = express.Router();


Router.route("/")
      .get(controller.sendEvent)
      
      
Router.route("/client")
      .get(controller.clientEvent)
      
    
Router.route("/change")
      .get(controller.changeEvent)
      
      
 
export default Router;
 
 
