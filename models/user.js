const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String
})

module.exports = mongoose.model('User', userSchema);