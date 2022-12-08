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

// router.get("/updateVisual", function(req, res) {
//     Customer.findOne({email: req.body.user}, function (err, customer) {
//         if (err) {
//             res.status(400).send(err);
//         }
//         else if (!customer) {
//             res.status(401).json({success: false, error: "Somehow you are logged in but not in the database." });
//         }
//         else {
            
//         }
// });

//adding new device

//changing password
router.post("/changePassword", function(req, res) {
    //inputs will be old password and new password
    inNewPas = req.body.new;
    inOldPas = req.body.old;

    let containsDigit = false;
    let containsUpper = false;
    let containsLower = false;
    for (let i = 0; i < inNewPas.length; i++) {
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

    //check if old password matches current password
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
                const newPasswordHash = bcrypt.hashSync(inNewPas, 10);
                Customer.updateOne({ email: req.body.user}, {passwordHash: newPasswordHash}, function (err, customer) {
                    res.status(201).json({success: true, msg: "Current password changed to the new password"});
                });
            }
        }
   });
});

module.exports = router;