const db = require("../db");

const deviceSchema = new db.Schema({
    name:      String,
 });

const Device = db.model("Device", deviceSchema);

module.exports = Device;