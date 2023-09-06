const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);

            //If the token is successfully decoded, it uses the User model to find a user with the id extracted from the decoded token. The -password projection ensures that the user's password is not included in the retrieved user data.
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
};

module.exports = { protect };