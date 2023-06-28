const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Users = require("../models/User");
const NodeCache = require("node-cache");

const cache = new NodeCache();


// Sign Up a user
const createUser = async (req, res) => {
    try {
        let { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        if (cache.has(username)) {
            return res.json({ status: false, msg: "User already exist with this username." });
        }
        let user = await Users.findOne({ username });
        if (user) {
            return res.json({ status: false, msg: "User already exist with this username." });
        }
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        password = bcrypt.hashSync(password, salt);
        user = await Users.create({ username, password, email });
        cache.set(username, user);
        let token = jwt.sign({ username, email, _id: user._id }, process.env.SECRET_KEY);
        return res.json({ status: true, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Update user profile --> Login Required
const updateUser = async (req, res) => {
    try {
        const { _id, username } = req.user;
        let { password, email } = req.body;
        if (!_id) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }

        let user;
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        password = bcrypt.hashSync(password, salt);
        if (cache.has(username)) {
            user = cache.get(username);
            user = await Users.findByIdAndUpdate(_id, { password, email }, { new: true });
            return res.json({ status: true, msg: "update your profile successfully.", user });
        } else {
            user = await Users.findByIdAndUpdate(_id, { password, email }, { new: true });
        }
        return res.json({ status: true, msg: "update your profile successfully.", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Delete user account --> Login Required
const deleteUser = async (req, res) => {
    try {
        const { _id } = req.user;
        if (!_id) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        let user = await Users.findByIdAndDelete(_id);
        return res.json({ status: true, msg: "your account delete successfully.", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

// Get user our profile --> Login Required
const getProfile = async (req, res) => {
    try {
        const { _id, username } = req.user;
        if (cache.has(username)) {
            let profile = cache.get(username);
            return res.json({ status: true, profile });
        }
        let profile = await Users.findById(_id);
        cache.set(username, profile)
        return res.json({ status: true, profile });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}
const signIn = async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        let user;
        if (cache.has(username)) {
            user = cache.get(username);
        } else {
            user = await Users.findOne({ username });
            cache.set(username, user);
        }
        let valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
            return res.json({ status: false, msg: "username/password is invalid." });
        }
        let token = jwt.sign({ username: user.username, email: user.email, _id: user._id }, process.env.SECRET_KEY);
        return res.json({ status: true, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

module.exports = { createUser, updateUser, deleteUser, getProfile, signIn };