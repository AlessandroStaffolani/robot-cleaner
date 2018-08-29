const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ResourceModelSchema = new Schema(
    {
        name: { type: String },
        description: { type: String },
        manufacturer: { type: String },
        mqttHost: { type: String },
        mqttTopic: { type: String },
        sensors: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }],
        actuators: [{ type: Schema.Types.ObjectId, ref: 'Actuator' }],
        executors: [{ type: Schema.Types.ObjectId, ref: 'Executor' }],
    }
);

module.exports = mongoose.model("ResourceModel", ResourceModelSchema);