

// Core Modules



// Third party Modules


import express from "express";

// Local Modules

import * as controller from "../Controllers/confirmConnectionController.js"
 

const Router = express.Router();


Router.route("/")
      .get(controller.getConfirmation)
      .post(controller.enableAccess)
      .patch(controller.changeAccess)
      
 
export default Router;
 
 
