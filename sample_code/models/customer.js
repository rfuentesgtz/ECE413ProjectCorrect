const db = require("../db");

const deviceSchema = new db.Schema({
    deviceName: String,
    deviceID: String
});

const bpmSchema = new db.Schema({
    bpmEntry: Number,
    timeData: Date
});

const oxSchema = new db.Schema({
    oxEntry: Number,
    timeData: Date
});

//Customer schema, allows for each customer to have save their settings, as well as an array of devices, BPM data, and Oxygen data
const customerSchema = new db.Schema({
    email:      String,
    passwordHash:   String,
    lastAccess:     { type: Date, default: Date.now },
    measurementFrequency: { type: Number, min: 5, max: 480, default: 30 },
    startHour: { type: Number, min: 0, max: 23, default: 6 },
    startMinute: { type: Number, min: 0, max: 59, default: 0 },
    endHour: { type: Number, min: 0, max: 23, default: 20 },
    endMinute: { type: Number, min: 0, max: 59, default: 0 },
    devices: [deviceSchema],
    BPMData: [bpmSchema],
    OXData: [oxSchema]
 });

const Customer = db.model("Customer", customerSchema);

module.exports = Customer;