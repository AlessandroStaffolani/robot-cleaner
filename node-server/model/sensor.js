const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let SensorSchema = new Schema(
    {
        category: {
            type: String,
            enum: [
                'temperature',
                'clock',
                'sonarVirtual',
                'sonarRobot'
            ]
        },
        name: { type: String, unique: true, required: true },
        value: { type: Schema.Types.Mixed },
        unit: { type: String },
        code: { type: Number, unique: true, required: true },
        minValue: { type: Number },
        maxValue: { type: Number },
        description: { type: String }
    }
);

module.exports = mongoose.model("Sensor", SensorSchema);