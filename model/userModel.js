var mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    user_name: String,
    email: String,
    mobile_number: String,
    password: String,
    access_token: String
}, {
    timestamps: true
});

exports.UserModel = mongoose.model("User", userSchema);