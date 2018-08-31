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
        name: { type: String, unique: true, required: true },
        value: { type: Schema.Types.Mixed },
        code: { type: Number, unique: true, required: true },
        description: { type: String }
    }
);

module.exports = mongoose.model("Actuator", ActuatorSchema);