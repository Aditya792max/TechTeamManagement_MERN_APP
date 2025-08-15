const express = require('express');
const router = express.Router();
const Team = require('../Schemas/TeamDetails');

/*
     This one is the file for team-related routes
          1.'/team-create' for creating the teams
          2.'/team-list' for retrieving all teams
          3.'/team-listArr' for retrieving all team names as an array
          4.'/team-find' for finding specific teams based on teamId
*/

router.post('/team-create', async (req, res) => {
     const { teamId, teamName, teamLead, teamMembers, teamProject, teamSize } = req.body;

     // Validation
     if (!teamId || !teamName || !teamLead || !teamProject || !teamSize || !Array.isArray(teamMembers) || teamMembers.length === 0) {
          return res.status(400).json({ message: 'All fields are required and teamMembers must be a non-empty array' });
     }

     try {
          const newTeam = new Team({
               teamId,
               teamName,
               teamLead,
               teamMembers,
               teamProject,
               teamSize
          });

          await newTeam.save();
          console.log("Team created successfully", req.body);

          res.status(201).json({ message: 'Team created successfully', team: newTeam });
     } catch (error) {
          console.error("Error creating team:", error);
          res.status(500).json({ message: 'Error creating team', error: error.message });
     }
});

// Get all teams
router.get('/team-list', async (req, res) => {
     try {
          const teams = await Team.find(); // Fetch all documents
          console.log(teams);
          res.status(200).json({ message: 'Teams retrieved successfully', teams });
     } catch (error) {
          console.error("Error retrieving teams:", error);
          res.status(500).json({ message: 'Error retrieving teams', error: error.message });
     }
});

router.get('/team-listArr', async (req, res) => {
     try {
          const teams = await Team.find({}, 'teamName'); // Only get teamName field
          const teamNames = teams.map(team => team.teamName); // Extract just the names

          res.status(200).json({
               message: 'Team names retrieved successfully',
               teamNames: teamNames
          });
          console.log("Team names retrieved successfully", teamNames);
     } catch (error) {
          console.error("Error retrieving team names:", error);
          res.status(500).json({ message: 'Error retrieving team names', error: error.message });
     }
});


// We are gonna do this one later..............

// Find a specific team by teamId
// router.get('/team-find', async (req, res) => {
//      try {
//           const { teamId } = req.query; // Get teamId from query parameters
//           const teams = await Team.find({}, 'teamId');
//           const team = await Team.findOne({ teamId: teamId });
//           if (!teamId) {
//                return res.status(400).json({ message: 'teamId is required' });
//           }


//           if (!team) {
//                return res.status(404).json({ message: `No team found with teamId: ${teamId}` });
//           }

//           res.status(200).json({
//                message: 'Team retrieved successfully',
//                team
//           });
//           console.log("Team retrieved successfully", team);
//      } catch (error) {
//           console.error("Error finding team:", error);
//           res.status(500).json({ message: 'Error finding team', error: error.message });
//      }
// });






module.exports = router;
