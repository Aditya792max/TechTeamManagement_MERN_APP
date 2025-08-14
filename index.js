const mongoose = require('mongoose');
const express = require('express');

const mongo = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});


const mongoURL = process.env.MONGO_URI;
console.log("<<<<<This is an authentic version check Test ^_^ >>>>>");

mongoose.connect(mongoURL)
     .then(() => {
          console.log('✅✅✅ Connected to MongoDB');
     })
     .catch((err) => {
          console.error('❌❌❌Error connecting to MongoDB:', err);
     });


const dev = require('./Schemas/devDetails');

app.post("/dev-register", async (req, res) => {
     const { devName, devEmail, devTeam, devExperience, devPhone } = req.body;
     // Validate the required fields
     if (!devName || !devEmail || !devTeam || !devExperience || !devPhone) {
          return res.status(400).json({ status: "Error", error: "All fields are required" });
     }
     try {
          const newDev = await dev.create({
               devName: devName,
               devEmail: devEmail,
               devTeam: devTeam,
               devExperience: devExperience,
               devPhone: devPhone
          });
          console.log("Dev Account created Successfully");
          console.log(req.body);
          return res.status(201).json({ status: "Success", data: newDev });
     } catch (error) {
          console.error("Error creating developer:", error);
          return res.status(500).json({ status: "Error", error: "Internal Server Error" });
     }
});

