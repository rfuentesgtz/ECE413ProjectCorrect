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

// example of authentication
// register a new customer

// please fiil in the blanks
// see javascript/signup.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.post("/signUp", function (req, res) {
    let emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

    Customer.findOne({ email: req.body.email }, function (err, customer) {
        if (err) res.status(401).json({ success: false, err: err });
        else if (customer) {
            res.status(401).json({ success: false, msg: "This email already used" });
        }
        else if (!emailFormat.test(req.body.email)) { //check if follows email pattern
            res.status(401).json({ success: false, msg: "Invalid email" });
        }
        else {
            //check for strong password
            let inputPassword = req.body.password;
            let containsDigit = false;
            let containsUpper = false;
            let containsLower = false;
            for (let i = 0; i < inputPassword.length; i++) {
                let char = inputPassword.charCodeAt(i);      
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
            if (inputPassword.length < 10 || inputPassword.length > 20) {
                res.status(401).json({ success: false, msg: "Invalid password, must be 10-20 characters long" });
            }
            else if (containsDigit != true) {
                res.status(401).json({ success: false, msg: "Invalid password, must contain digit" });
            }
            else if (containsLower != true) {
                res.status(401).json({ success: false, msg: "Invalid password, must contain lower case letter" });
            }
            else if (containsUpper != true) {
                res.status(401).json({ success: false, msg: "Invalid password, must contain upper case letter" });
            }
            else {
                const passwordHash = bcrypt.hashSync(inputPassword, 10);
                const newCustomer = new Customer({
                   email: req.body.email,
                   passwordHash: passwordHash
                });
    
                newCustomer.save(function (err, customer) {
                    if (err) {
                       res.status(400).json({ success: false, err: err });
                    }
                    else {
                        const token = jwt.encode({ email: customer.email }, secret);
                        //update user's last access time
                        customer.lastAccess = new Date();
                        customer.save((err, customer) => {
                            console.log("User's LastAccess has been update.");
                        });
                        let msgStr = `Customer (${req.body.email}) account has been created.`;
                        res.status(201).json({ success: true, token: token, message: msgStr });
                        console.log(msgStr);
                    }
                });
            }
        }
    });
});



// please fiil in the blanks
// see javascript/login.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.post("/logIn", function (req, res) {
   if (!req.body.email || !req.body.password) {
       res.status(401).json({ error: "Missing email and/or password" });
       return;
   }
   // Get user from the database
   Customer.findOne({ email: req.body.email }, function (err, customer) {
       if (err) {
           res.status(400).send(err);
       }
       else if (!customer) {
           // Username not in the database
           res.status(401).json({ error: "User email does not exist." });
       }
       else {
           if (bcrypt.compareSync(req.body.password, customer.passwordHash)) {
               const token = jwt.encode({ email: customer.email }, secret);
               //update user's last access time
               customer.lastAccess = new Date();
               customer.save((err, customer) => {
                   console.log("User's LastAccess has been update.");
               });
               // Send back a token that contains the user's username
               res.status(201).json({ success: true, token: token, msg: "Login success" });
           }
           else {
               res.status(401).json({ success: false, msg: "Email or password invalid." });
           }
       }
   });
});



// please fiil in the blanks
// see javascript/account.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.get("/status", function (req, res) {
   // See if the X-Auth header is set
   if (!req.headers["x-auth"]) {
       return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
   }

   // X-Auth should contain the token 
   const token = req.headers["x-auth"];
   try {
       const decoded = jwt.decode(token, secret);
       // Send back email and last access
       Customer.find({ email: decoded.email }, "email lastAccess measurementFrequency startHour startMinute endHour endMinute devices BPMData", function (err, users) {
           if (err) {
               res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
           }
           else {
               res.status(200).json(users);
           }
       });
   }
   catch (ex) {
       res.status(401).json({ success: false, message: "Invalid JWT" });
   }
});



module.exports = router;