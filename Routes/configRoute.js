

// Core Modules



// Third party Modules


import express from "express";

// Local Modules

import * as controller from "../Controllers/configController.js"
 
 // Router for the config request 

const Router = express.Router();



Router.route("/")
      .get(controller.getConfigurationFile)
      .post(controller.logIn)
      .put(controller.updateConfiguration)

Router.route("/clients")
      .post(controller.getClientsDetails)
  
export default Router; 