const express = require("express");
const { createUser, signIn, updateUser, deleteUser, getProfile } = require("../controllers/userController");
const authentication = require("../middleware/authentication");
const routes = express.Router();

routes.post("/sign-up",createUser);
routes.post("/sign-in",signIn);
routes.put("/update-user",authentication,updateUser);
routes.delete("/delete-user",authentication,deleteUser);
routes.get("/get-user",authentication,getProfile);

module.exports = routes;