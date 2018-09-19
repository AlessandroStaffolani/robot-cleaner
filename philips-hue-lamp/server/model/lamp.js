const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let LampSchema = new Schema(
    {
        name: {type: String},
        value: {type: Boolean, default: false},
        color: {type: String},
        code: {type: String, required: true, unique: true}
    }
);

//Export model
module.exports = mongoose.model("Lamp", LampSchema);