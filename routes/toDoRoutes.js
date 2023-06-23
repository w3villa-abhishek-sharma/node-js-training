const express = require("express");
const { createTask, updateTask, deleteTask, readTask } = require("../controllers/toDoController");
const authentication = require("../middleware/authentication");
const routes = express.Router();

routes.post("/create-task",authentication,createTask);
routes.put("/update-task",authentication,updateTask);
routes.delete("/delete-task",authentication,deleteTask);
routes.get("/get-task",authentication,readTask);

module.exports = routes;