const generateToken = require("../config/generateToken");
const User = require("../models/UserModel");

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, pic } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Please fill all details" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email address already exists!" });
        }
        const user = User.create({
            firstName,
            lastName,
            email,
            password,
            pic
        })
        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Failed to create user!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// /api/user?search=value
const allUsers = async (req, res) => {
    // $or operator to specify an "OR" condition, find documents where either of the conditions met:
    //The $regex operator is used to perform a regular expression search, and $options: "i" ensures that the search is case-insensitive.
    const keyword = req.query.search ? {
        $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    try {
        //searches the database for users matching the keyword, and excludes the currently authenticated user from the search results before sending the results to the client as a response.
        //the $ne operator is used in query operations to check if a field's value is not equal to a specified value. It stands for "not equal."
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists && (await userExists.matchPassword(password))) {
            return res.status(200).json({
                _id: userExists._id,
                firstName: userExists.firstName,
                lastName: userExists.lastName,
                email: userExists.email,
                pic: userExists.pic,
                token: generateToken(userExists._id),
            });
        }
        return res.status(401).json({ message: "Invalid Email or Password" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { registerUser, allUsers, authUser }