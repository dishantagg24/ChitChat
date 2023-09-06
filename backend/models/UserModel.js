const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://static.thenounproject.com/png/363640-200.png",
    }
}, { timestamps: true })

userSchema.methods.matchPassword = async function (enteredPassword) { //This line defines a new method called matchPassword for the userSchema.
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {  //The pre method is used to define middleware functions that run before a specified event, in this case, before saving a document.

    //This is typically used to prevent unnecessary rehashing of the password when other fields of the user document are updated.

    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
