const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const NodeCache = require("node-cache");

const cache = new NodeCache();

const authentication = async(req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        let data = jwt.verify(token, process.env.SECRET_KEY);
        let user;
        if(cache.has(data.username)){
            user = cache.get(data.username);
        }else{
            user = await Users.findById(data._id);
            cache.set(data.username,user);
        }
        if (!user) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        if (user.email !== data.email) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error." });
    }
}

module.exports = authentication;