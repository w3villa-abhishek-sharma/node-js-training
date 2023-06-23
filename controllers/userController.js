const jwt = require("jsonwebtoken");

global.users = {};

// Sign Up a user
const createUser = (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        if (global.users[username]) {
            return res.json({ status: false, msg: "User already exist with this username." });
        }

        global.users[username] = { id: global.id, username, password, email };
        let token = jwt.sign({ username, email }, process.env.SECRET_KEY);
        global.id += 1;
        return res.json({ status: true, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Update user profile --> Login Required
const updateUser = (req, res) => {
    try {
        const { username } = req.user;
        const { password, email } = req.body;
        if (!username) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        if (!global.users[username]) {
            return res.json({ status: false, msg: "User not exist." });
        }
        global.users[username] = { username, password, email };
        let user = global.users[username];
        return res.json({ status: true, msg: "update your profile successfully.", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Delete user account --> Login Required
const deleteUser = (req, res) => {
    try {
        const { username } = req.user;
        if (!username) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        if (!global.users[username]) {
            return res.json({ status: false, msg: "User not exist." });
        }
        delete global.users[username];
        return res.json({ status: true, msg: "your account delete successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Get user our profile --> Login Required
const readUser = (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        if (!global.users[username]) {
            return res.json({ status: false, msg: "User not exist." });
        }
        let user = global.users[username];
        return res.json({ status: true, user: { username: user.username, email: user.email } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}
const signIn = (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        if (!global.users[username]) {
            return res.json({ status: false, msg: "User not register." });
        }
        let user = global.users[username];
        if (password !== user.password) {
            return res.json({ status: false, msg: "username/password is invalid." });
        }
        let token = jwt.sign({ username: user.username, email: user.email }, process.env.SECRET_KEY);
        return res.json({ status: true, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

module.exports = { createUser, updateUser, deleteUser, readUser, signIn };