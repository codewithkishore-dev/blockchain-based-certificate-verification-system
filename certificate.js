const mongoose = require("mongoose");

const certSchema = new mongoose.Schema({
    certId: { type: String, unique: true },
    name: String,
    course: String,
    hash: String
});

module.exports = mongoose.model("Certificate", certSchema);