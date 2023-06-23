const express = require("express");
const { createUser, signIn, updateUser, deleteUser, readUser } = require("../controllers/userController");
const authentication = require("../middleware/authentication");
const routes = express.Router();

routes.post("/sign-up",createUser);
routes.post("/sign-in",signIn);
routes.put("/update-user",authentication,updateUser);
routes.delete("/delete-user",authentication,deleteUser);
routes.get("/get-user",authentication,readUser);

module.exports = routes;