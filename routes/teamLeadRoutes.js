const express = require('express');
const router = express.Router();
const teamLead = require('../Schemas/TeamLeadDetails');



/* this is the code that I am going to implement the CRUD operations for team leads
     1. Register a new team lead-----✅
     2. Login for a team lead-----✅
     3. Get all team leads-----✅
     4. Get a single team lead by their teamId-----✅
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
               teamLeadName: teamLeadName,
               teamSize: teamSize
          });
          console.log("Team Lead Registered Successfully");
          console.log(req.body);
          return res.status(201).json({ status: "Success", data: newTeamLead });
     } catch (error) {
          console.error("Error registering team lead:", error);
          return res.status(500).json({ status: "Error", error: "Sorry Internal Server Error" });
     }
});

router.post("/team-leadlogin", async (req, res) => {
     const { teamId, teamLeadName } = req.body;
     // Validate the required fields
     if (!teamId || !teamLeadName) {
          return res.status(400).json({ status: "Error", error: "Team ID and Team Lead Name are required" });
     }
     try {
          const team_Lead = await teamLead.findOne({ teamId, teamLeadName });
          if (!team_Lead) {
               return res.status(404).json({ status: "Error", error: "Team Lead not found" });
          }
          console.log("Team Lead Login Successful");
          console.log(req.body);
          return res.status(200).json({ status: "Success", data: team_Lead });
     } catch (error) {
          console.error("Error logging in team lead:", error);
          return res.status(500).json({ status: "Error", error: "Sorry Internal Server Error" });
     }
});



router.get("/team-getTeamLeads", async (req, res) => {
     try {
          const team_leads = await teamLead.find(); // Fetch all team leads
          console.log("Retrieved all team leads successfully");
          console.log(team_leads);
          return res.status(200).json({ status: "Success", data: team_leads });
     } catch (error) {
          console.error("Error retrieving team leads:", error);
          res.status(500).json({ message: 'Error retrieving team leads', error: error.message });
     }
});

router.get("/team-findTeamLead", async (req, res) => {
     const { teamId } = req.body;
     if (!teamId) {
          return res.status(400).json({ status: "Error", error: "Team ID is required" });
     } try {
          team_leads = await teamLead.findOne({ teamId: teamId });
          if (!team_leads) {
               return res.status(404).json({ status: "Error", error: "Team Lead not found" });
          }
          console.log("Team Lead found successfully");
          console.log(team_leads);
          return res.status(200).json({ status: "Success", data: team_leads });
     } catch (error) {
          console.error("Error finding team lead:", error);
          return res.status(500).json({ status: "Error", error: "Sorry Internal Server Error" });
     }
});



module.exports = router;


