const express = require('express');
const router = express.Router();
const teamLead = require('../Schemas/TeamDetails');



/* this is the code that I am going to implement the CRUD operations for team leads
     1. Register a new team lead
     2. Login for a team lead
     3. Get all team leads
     4. Get a single team lead by their teamId
*/


router.post("/team-leadregister", async (req, res) => {
     const { teamId, teamName, teamLeadName, teamSize } = req.body;
     // Validate all the fields
     if (!teamId || !teamName || !teamLeadName || !teamSize) {
          return res.status(400).json({ message: "Please fill all the fields" });
     }
     try {
          const newTeamLead = await teamLead.create({
               teamId: teamId,
               teamName: teamName,
               teamLeadName: teamLead,
               teamSize: teamSize
          });
          console.log("Team Lead Registered Successfully");
          return res.status(201).json({ status: "Success", data: newTeamLead });
     } catch (error) {
          console.error("Error registering team lead:", error);
          return res.status(500).json({ status: "Error", error: "Sorry Internal Server Error" });
     }
});

module.exports = router;


