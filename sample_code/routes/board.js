var express = require('express');
var router = express.Router();
const jwt = require("jwt-simple");
//const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();


// CRUD implementation

router.post('/workinghours', function(req, res){
    startHour = Math.floor(Math.random() * 24);
    endHour = Math.floor(Math.random() * 24);
    startMinute = Math.floor(Math.random() * 60);
    endMinute = Math.floor(Math.random() * 60);

    const returnTimes = {
        startH: startHour, 
        startM: startMinute, 
        endH: endHour, 
        endM : endMinute
    }

    console.log(returnTimes);
    res.status(201).json(returnTimes);
});

router.post('/bpmdata', function(req, res){
    if(req.body.data){
       // document.getElementById("boardVal").value = req.body.data;
        console.log("Data has been set");
	    console.log(req.body.data);
        messageStr = "Data set succesfullly";
        res.status(201).json({message: messageStr});
    }

    else {
        console.log("Incorrect JSON format");
        messageStr = "Data not set";
        res.status(402).json({message: messageStr});
    }
});

router.post('/requesttoken', function(req, res){
    if(req.body.coreid){
        console.log("Token will be sent to ID:", req.body.coreid);
        const token = jwt.encode({ deviceid: req.body.coreid }, secret);
        //console.log(token);
        res.status(201).json({ success: true, token: token, msg: "Login success" });
    }

    else {
        console.log("No id found");
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
    console.log("Verifying token...");
    try {
        const decoded = jwt.decode(token, secret);
        console.log("Token verified!");
        res.status(201).json({ success: true, msg: "Token verified!" });
    }
    catch (ex) {
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }

})

module.exports = router;
