var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// For encoding/decoding JWT
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();


// CRUD implementation

router.post('/refreshBPM', function(req, res){
    //Verify token works
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }
    
    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    //console.log("Verifying token...");
    try {
        const decoded = jwt.decode(token, secret);
        //console.log("Token verified!");
        Customer.findOne({devices: {"$elemMatch": {deviceID : req.body.coreid}}}, "measurementFrequency startHour startMinute endHour endMinute", function (err, users) {
            if (err) {
                res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
            }
            else {
                res.status(200).json(users);
            }
        });
    }
    catch (ex) {
        //console.log("Invalid token!");
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }
    
});

router.post('/publishBPM', function(req, res){
    //Verify token works
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }
    
    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    console.log("Verifying token...");
    try {
        const decoded = jwt.decode(token, secret);
        console.log("Token verified!");
        let newBPMData = JSON.parse(req.body);
        //console.log(req.body);
        console.log(newBPMData.BPM, newBPMData.time);
        Customer.findOne({devices: {"$elemMatch": {deviceID : req.body.coreid}}}, function (err, users) {
            if (err) {
                res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
            }
            else if (!users){
                console.log("error message that shouldnt happen");
                res.status(400).json({ success: false, message: "No user was found!" });
            }
            else {
                Customer.updateOne({devices: {"$elemMatch": {deviceID : req.body.coreid}}}, {"$push": {BPMData: newBPMData}}, function (err, customer) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        res.status(201).json({success: true, msg: "New BPM data added!"});
                    }
                });
                
            }
        });
    }
    catch (ex) {
        console.log("Invalid token!");
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }
});

router.post('/requesttoken', function(req, res){
    if(req.body.coreid){
        //console.log("Checking if any user has added this device", req.body.coreid);
        
        Customer.findOne({devices: {"$elemMatch": {deviceID : req.body.coreid}}}, function (err, customer) {
            if (err) {
                res.status(400).send(err);
            }
            else if (!customer) {   // Username not in the database
               res.status(401).json({success: false, error: "This device is not registered by any customer" });
            }
            else {
                const token = jwt.encode({ deviceid: req.body.coreid }, secret);
                //console.log("Customer found!", customer.devices);
                res.status(201).json({ success: true, token: token, msg: "Token generation success!" });
            }
            //console.log(customer);
        });
    }

    else {
        console.log("No id found was given.");
        res.status(400);
    }
})

router.post('/verifytoken', function (req, res){
    // See if the X-Auth header is set
   if (!req.headers["x-auth"]) {
    return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }

    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    //console.log("Verifying token...");
    try {
        const decoded = jwt.decode(token, secret);
        //console.log("Token verified!");
        res.status(201).json({ success: true, msg: "Token verified!" });
    }
    catch (ex) {
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }

})

module.exports = router;
