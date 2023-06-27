const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        let data = jwt.verify(token, process.env.SECRET_KEY);
        let user = global.users[data.username];
        if (!user) {
            return res.status(401).json({ status: false, msg: "unauthorized access" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ status: false, msg: "unauthorized access" });
    }
}

module.exports = authentication;