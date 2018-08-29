const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ExecutorActionSchema = new Schema(
    {
        command: { type: String, required: true, unique: true },
        name: { type: String },
        description: { type: String }
    }
);

module.exports = mongoose.model("ExecutorAction", ExecutorActionSchema);