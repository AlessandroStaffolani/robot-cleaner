const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let MapSchema = new Schema(
    {
        name: { type: String, default: 'Room map' },
        date: { type: Date, default: Date.now },
        boxes: [
            [
                {
                    x: { type: Number },
                    y: { type: Number },
                    content: { type: String, enum: ['1', '0', 'X', 'R'] }
                }
            ]
        ]
    }
);

module.exports = mongoose.model("map", MapSchema);