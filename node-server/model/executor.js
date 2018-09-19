const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ExecutorSchema = new Schema(
    {
        category: {
            type: String,
            enum: [
                'virtualRobot',
                'realRobot'
            ]
        },
        name: { type: String, unique: true, required: true },
        state: { type: Boolean, default: true },
        code: { type: Number, unique: true, required: true },
        actions: [{ type: Schema.Types.ObjectId, ref: 'ExecutorAction' }],
        last_action: { type: Schema.Types.ObjectId, ref: 'ExecutorAction'},
        description: { type: String },
        actuators: [{ type: Schema.Types.ObjectId, ref: 'Actuator' }],
        sensors: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }]
    }
);

module.exports = mongoose.model("Executor", ExecutorSchema);