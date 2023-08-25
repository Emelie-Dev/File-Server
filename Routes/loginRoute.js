// Core Modules



// Third party Modules


import express from "express";

// Local Modules

import * as controller from "../Controllers/loginController.js"
 

// Creates a router

const Router = express.Router();

// Route handler for the authentication

Router.route("/")
      .post(controller.logIn);
      
 
 export default Router;