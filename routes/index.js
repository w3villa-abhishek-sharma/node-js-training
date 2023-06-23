const express = require("express");
const routes = express.Router();

const userRoutes = require("./userRoutes");
const toDoRoutes = require("./toDoRoutes");

routes.use("/user",userRoutes);
routes.use("/tasks",toDoRoutes);


module.exports = routes;