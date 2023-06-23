const jwt = require("jsonwebtoken");
const Users = require("../models/User");


// Sign Up a user
const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        let user = await Users.findOne({ username });
        if (user) {
            return res.json({ status: false, msg: "User already exist with this username." });
        }

        user = await Users.create({ username, password, email });
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
        const { _id } = req.user;
        const { password, email } = req.body;
        if (!_id) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        let user = await Users.findByIdAndUpdate(_id, { password, email }, { new: true });
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
        const { _id } = req.user;
        let profile = await Users.findById(_id).select("-password");
        return res.json({ status: true, profile });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}
const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({ status: false, msg: "Provide the valid data." });
        }
        let user = await Users.findOne({ username });
        if (password !== user.password) {
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