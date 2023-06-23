global.tasks = {};
global.id = 1;

// Create a task for particular user  --> Login is required
const createTask = (req, res) => {
    try {
        const { taskName, taskDescription } = req.body;
        if (!taskName || !taskDescription) {
            return res.json({ status: false, msg: "Provide the valid data." })
        }
        let task = { id: global.id, taskName, taskDescription, createdAt: new Date(), updatedAt: new Date() };
        let tasks = global.tasks[req.user.username];
        if (tasks) {
            tasks.push(task);
        } else {
            tasks = [task];
        }
        global.id += 1;
        global.tasks[req.user.username] = tasks;
        return res.json({ status: true, msg: "your task create successfully.", task });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Update a task of particular user  --> Login is required
const updateTask = (req, res) => {
    try {
        const { id } = req.query;
        const { taskName, taskDescription } = req.body;
        if (!id || !taskName || !taskDescription) {
            return res.json({ status: false, msg: "Provide the valid data." })
        }
        let tasks = global.tasks[req.user.username];
        let taskUpdated = false;
        if (tasks) {
            tasks = tasks.filter((element) => {
                if (id == element.id) {
                    taskUpdated = true;
                    element.taskName = taskName;
                    element.taskDescription = taskDescription;
                    element.updatedAt = new Date();
                    return element
                }
                return element
            })
            if (!taskUpdated) {
                return res.json({ status: false, msg: "Task not exist." });
            }
        } else {
            return res.json({ status: false, msg: "You have not task." });
        }
        global.tasks[req.user.username] = tasks;
        return res.json({ status: true, msg: "your task Updated successfully.", });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}


// Delete a particular task of particular user  --> Login is required
const deleteTask = (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        let tasks = global.tasks[req.user.username];
        let length = tasks.length;
        if (tasks) {
            tasks = tasks.filter((element) => {
                if (id != element.id) {
                    return element;
                }
            })
            if (tasks.length == length) {
                return res.json({ status: false, msg: "Task not exist." });
            }
        } else {
            return res.json({ status: false, msg: "You have no any tasks." });
        }
        global.tasks[req.user.username] = tasks;
        return res.json({ status: true, msg: "your task deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Read all tasks of particular user  --> Login is required
const readTask = (req, res) => {
    try {
        let tasks = global.tasks[req.user.username];
        if (!tasks) {
            return res.json({ status: false, msg: "You have no tasks." });
        }
        return res.json({ status: true, tasks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

module.exports = { readTask, createTask, updateTask, deleteTask };