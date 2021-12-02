const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
    email: { type: String, unique: true },
    message: String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);