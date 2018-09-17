const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

let MapSchema = new Schema(
    {
        name: { type: String, default: 'Room map' },
        date: { type: Date, default: Date.now },
        currentDirection: { type: String, enum: ['w', 'a', 's', 'd'] },
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

MapSchema
    .virtual('date_formatted')
    .get(function () {
        return this.date ? moment(this.date).format('DD-MM-YYYY') : '';
    });

module.exports = mongoose.model("map", MapSchema);