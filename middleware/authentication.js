const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const logger = require("../logger");

const authentication = async(req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            logger.log({
                level: 'info',
                message: "Unauthorized access",
                ipAddress: req.ip
              });
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
        logger.log({
            level: 'error',
            message: error,
            ipAddress: req.ip
          });
        console.log(error);
        return res.status(500).json({ status: false, msg: "Internal server error." });
    }
}

module.exports = authentication;