const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ActuatorSchema = new Schema(
    {
        category: {
            type: String,
            enum: [
                'leds'
            ]
        },
        name: { type: String },
        value: { type: Schema.Types.Mixed },
        code: { type: Number, unique: true, required: true }
    }
);

module.exports = mongoose.model("Actuator", ActuatorSchema);