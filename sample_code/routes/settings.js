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

//change freq
router.post("/changeFreq", function(req, res) {
    inFreq = req.body.freq;

    //find the user that is trying to change their frequency value
    Customer.findOne({email: req.body.user}, function (err, customer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!customer) {   // Username not in the database
           res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
        }
        else if (isNaN(inFreq)) { //check if number
            res.status(401).json({success: false, error: "Frequency value is not a number." });
        }
        else if (!(inFreq >= 5 && inFreq <= 480)) { //min: 5, max: 480
            res.status(401).json({success: false, error: "Frequency value not in range." });
        }
        else if (inFreq % 1 != 0) { //must be a whole number
            res.status(401).json({success: false, error: "Frequency value not a whole number." });
        }
        else { //update the users frequency value
            Customer.updateOne({ email: req.body.user}, {measurementFrequency: inFreq}, function (err, customer) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).json({success: true, msg: "Frequency updated"});
                }
            });
        }
   });
});

//changing start time
router.post("/changeStart", function(req, res) {
    inHour = req.body.sHour;
    inMin = req.body.sMin;

    //find the user that is trying to change their start time
    Customer.findOne({email: req.body.user}, function (err, customer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!customer) {   // Username not in the database
           res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
        }
        else if (isNaN(inHour) || isNaN(inHour)) { //check if number
            res.status(401).json({success: false, error: "Input time is not a number." });
        }
        else if (!(inHour >= 0 && inHour <= 23)) { //check in range
            res.status(401).json({success: false, error: "Input time is not in hour range." });
        }
        else if (!(inMin >= 0 && inMin <= 59)) { //check in range
            res.status(401).json({success: false, error: "Input time is not in minute range." });
        }
        else if (inHour % 1 != 0) { //must be a whole number
            res.status(401).json({success: false, error: "Input hour is not a whole number." });
        }
        else if (inMin % 1 != 0) { //must be a whole number
            res.status(401).json({success: false, error: "Input minute is not a whole number." });
        }
        else { //update users start time
            Customer.updateOne({ email: req.body.user}, {startHour: inHour, startMinute: inMin}, function (err, customer) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).json({success: true, msg: "Start time updated"});
                }
            });
        }
   });
});

//changing end time
router.post("/changeEnd", function(req, res) {
    inHour = req.body.eHour;
    inMin = req.body.eMin;

    //find the user that is trying to change their end time
    Customer.findOne({email: req.body.user}, function (err, customer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!customer) {   // Username not in the database
           res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
        }
        else if (isNaN(inHour) || isNaN(inHour)) { //check if number
            res.status(401).json({success: false, error: "Input time is not a number." });
        }
        else if (!(inHour >= 0 && inHour <= 23)) { //check in range
            res.status(401).json({success: false, error: "Input time is not in hour range." });
        }
        else if (!(inMin >= 0 && inMin <= 59)) { //check in range
            res.status(401).json({success: false, error: "Input time is not in minute range." });
        }
        else if (inHour % 1 != 0) { //must be a whole number
            res.status(401).json({success: false, error: "Input hour is not a whole number." });
        }
        else if (inMin % 1 != 0) { //must be a whole number
            res.status(401).json({success: false, error: "Input minute is not a whole number." });
        }
        else { //update users end time
            Customer.updateOne({ email: req.body.user}, {endHour: inHour, endMinute: inMin}, function (err, customer) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).json({success: true, msg: "End time updated"});
                }
            });
        }
   });
});

//ADD A NEW DEVICE
router.post("/newDevice", function(req, res) {
    let newDeviceData = {
        deviceName: req.body.newName,
        deviceID: req.body.newID
    }
    
    //find user that is trying to add a new device
    Customer.findOne({email: req.body.user}, function (err, customer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!customer) {   // Username not in the database
           res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
        }
        else {  //update the users device array
            Customer.updateOne({ email: req.body.user}, {"$push": {devices: newDeviceData}}, function (err, customer) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).json({success: true, msg: "New device added"});
                }
            });
        }
   });
});

//DELETE A DEVICE
router.post("/deleteDevice", function(req, res) {
    let deviceData = {
        deviceName: req.body.deviceName,
        deviceID: req.body.deviceID
    }
    
    //find user that is trying to delete a device
    Customer.findOne({email: req.body.user}, function (err, customer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (!customer) {   // Username not in the database
           res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
        }
        else {  //update the users device array
            Customer.updateOne({ email: req.body.user}, {"$pull": {devices: deviceData}}, function (err, customer) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).json({success: true, msg: "Device deleted!"});
                }
            });
        }
   });
});

//changing password
router.post("/changePassword", function(req, res) {
    //inputs will be old password and new password
    inNewPas = req.body.new;
    inOldPas = req.body.old;

    let containsDigit = false;
    let containsUpper = false;
    let containsLower = false;
    for (let i = 0; i < inNewPas.length; i++) { //check if the new password follows the password requirments
        let char = inNewPas.charCodeAt(i);      
        if (char >= 48 && char <= 57) {
            containsDigit = true;
        }
        if (char >= 65 && char <= 90) {
            containsUpper = true;
        }
        if (char >= 97 && char <= 122) {
            containsLower = true;
        }
    }

    //find user that is trying to change their password
    Customer.findOne({email: req.body.user}, function (err, customer) {
       if (err) {
           res.status(400).send(err);
       }
       else if (!customer) {
           // Username not in the database
           res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
       }
       else {
            //check if new password is the same as old password
            if(inNewPas == inOldPas) {
                res.status(401).json({success: false, msg: "Old password is same as new password"});
            }

            //check if old password matches current password
            else if(!bcrypt.compareSync(inOldPas, customer.passwordHash)) {
                res.status(401).json({ success: false, msg: "Current password does not match entered password" });
            }

            //check if new password fits password critera                
            else if (inNewPas.length < 10 || inNewPas.length > 20) {
                res.status(401).json({ success: false, msg: "Invalid new password, must be 10-20 characters long" });
            }
            else if (containsDigit != true) {
                res.status(401).json({ success: false, msg: "Invalid new password, must contain digit" });
            }
            else if (containsLower != true) {
                res.status(401).json({ success: false, msg: "Invalid new password, must contain lower case letter" });
            }
            else if (containsUpper != true) {
                res.status(401).json({ success: false, msg: "Invalid new password, must contain upper case letter" });
            }

            //change current password to new password
            else {
                //encrypt new password
                const newPasswordHash = bcrypt.hashSync(inNewPas, 10);
                //find user and update their passwordHash to the new value
                Customer.updateOne({ email: req.body.user}, {passwordHash: newPasswordHash}, function (err, customer) {
                    res.status(201).json({success: true, msg: "Current password changed to the new password"});
                });
            }
        }
   });
});

module.exports = router;