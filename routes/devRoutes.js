
const express = require('express');
const router = express.Router();
const dev = require('../Schemas/devDetails');

// Developer Registration API
router.post("/dev-register", async (req, res) => {
     const { devName, devEmail, devTeam, devExperience, devProfile, devPhone } = req.body;
     // Validate the required fields
     if (!devName || !devEmail || !devTeam || !devExperience || !devProfile || !devPhone) {
          return res.status(400).json({ status: "Error", error: "All fields are required" });
     }
     try {
          const newDev = await dev.create({
               devName: devName,
               devEmail: devEmail,
               devTeam: devTeam,
               devExperience: devExperience,
               devProfile: devProfile,
               devPhone: devPhone,
          });
          console.log("Dev Account created Successfully");
          console.log(req.body);
          return res.status(201).json({ status: "Success", data: newDev });
     } catch (error) {
          console.error("Error creating developer:", error);
          return res.status(500).json({ status: "Error", error: "Internal Server Error" });
     }
});

// Developer Login API
router.post("/dev-login", async (req, res) => {
     const { devEmail, devPhone } = req.body;
     // Validate the required fields
     if (!devEmail || !devPhone) {
          return res.status(400).json({ status: "Error", error: "Email and phone are required" });
     }
     try {
          const developer = await dev.findOne({
               devEmail: devEmail,
               devPhone: devPhone
          });

          if (!developer) {
               return res.status(404).json({ status: "Error", error: "Developer not found with provided credentials" });
          }

          console.log("Dev Login Successful");
          return res.status(200).json({
               status: "Success",
               message: "Login successful",
               data: {
                    devName: developer.devName,
                    devEmail: developer.devEmail,
                    devTeam: developer.devTeam,
                    devExperience: developer.devExperience,
                    devProfile: developer.devProfile
               }
          });
     } catch (error) {
          console.error("Error during login:", error);
          return res.status(500).json({ status: "Error", error: "Internal Server Error" });
     }
});

module.exports = router;

// we also gotta craete a GET Deleveloper API in which the user provides the email 
//And gets the status of the developer 
router.post("/get-dev-info", async (req, res) => {
     try {
          const { devEmail } = req.body;

          if (!devEmail) {
               return res.status(400).json({ status: "Error", error: "Email is required" });
          }

          const user = await dev.findOne({ devEmail });
          if (user) {
               console.log("User found:", user);
               return res.status(200).json({ status: "Success", data: user });
          } else {
               return res.status(404).json({ status: "Error", error: "Developer not found" });
          }
     } catch (error) {
          console.error("Error fetching user:", error);
          return res.status(500).json({ status: "Error", error: "Internal Server Error" });
     }

});