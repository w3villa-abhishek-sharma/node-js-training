const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const loger = require("../loger");

const authentication = async(req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            loger.error({"error":"unauthorized access"});
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        let data = jwt.verify(token, process.env.SECRET_KEY);
        let user = await Users.findById(data._id);
        if (!user) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        if (user.email !== data.email) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        req.user = user;
        next();
    } catch (error) {
        loger.error({"error":error});
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error." });
    }
}

module.exports = authentication;