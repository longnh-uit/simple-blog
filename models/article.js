const mongoose = require("mongoose");
const { Schema } = mongoose;

const articleSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    markdown: { type: String },
    author: String,
    comments: [{
        user: { type: String },
        comment: { type: String},
        date: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);