const express = require('express');
const router = express.Router();
const managerInfo = require('../Schemas/ManagerDetails');

/*
The Schema of the code:
          -> Manager Name
          -> Manager Email
          -> Manager Phone
          -> Manager Department
          -> Manager Team ID

     1.Manager Register API_______✅
     2.Manager Login API_______✅
     3.Get All Managers_______✅
     4.Get a single manager's information based on the mEmail_______✅
 */


router.post("/manager-register", async (req, res) => {
     console.log("📝 Received request body:", req.body);

     const { mName, mEmail, mPhone, mDepartment, mTeamId } = req.body;

     // Log extracted fields for debugging
     console.log("📋 Extracted fields:", { mName, mEmail, mPhone, mDepartment, mTeamId });

     // Validate all the fields with better error messages
     if (!mName || !mEmail || !mPhone || !mDepartment || !mTeamId) {
          console.log("❌ Validation failed - missing fields:", {
               mName: !!mName,
               mEmail: !!mEmail,
               mPhone: !!mPhone,
               mDepartment: !!mDepartment,
               mTeamId: !!mTeamId
          });
          return res.status(400).json({
               message: "Failure: Please fill all the required fields",
               missingFields: {
                    mName: !mName,
                    mEmail: !mEmail,
                    mPhone: !mPhone,
                    mDepartment: !mDepartment,
                    mTeamId: !mTeamId
               }
          });
     }

     try {
          console.log("🔄 Attempting to create new manager...");
          const newManager = new managerInfo({
               mName,
               mEmail,
               mPhone,
               mDepartment,
               mTeamId
          });

          console.log("💾 Attempting to save to database...");
          const savedManager = await newManager.save();

          console.log("✅ Manager registered successfully:", savedManager._id);
          console.log("✅ Manager registered successfully:", savedManager);
          return res.status(201).json({
               message: "Manager registered successfully",
               data: savedManager
          });
     } catch (error) {
          console.error("❌ Database error:", error);
          console.error("❌ Error details:", {
               message: error.message,
               name: error.name,
               code: error.code
          });
          return res.status(500).json({
               message: "Internal server error",
               error: process.env.NODE_ENV === 'development' ? error.message : 'Database operation failed'
          });
     }
});

router.post("/manager-login", async (req, res) => {
     const { mEmail, mTeamId } = req.body;
     // Validating the fields
     if (!mEmail || !mTeamId) {
          return res.status(400).json({
               message: "Failure: Please fill all the required fields",
               missingFields: {
                    mEmail: !mEmail,
                    mTeamId: !mTeamId
               }
          });
     }

     try {
          // Check if the manager exists
          const Newmanager = await managerInfo.findOne({ mEmail, mTeamId });
          if (!Newmanager) {
               return res.status(404).json({
                    message: "Manager not found"
               });
          }

          // If manager is found, return success response
          console.log("✅ Manager logged in successfully:", Newmanager._id);
          console.log("✅ Manager logged in successfully:", Newmanager);
          return res.status(200).json({
               message: "Manager logged in successfully",
               data: Newmanager
          });
     } catch (error) {
          console.error("❌ Database error:", error);
          console.error("❌ Error details:", {
               message: error.message,
               name: error.name,
               code: error.code
          });
          return res.status(500).json({
               message: "Internal server error",
               error: process.env.NODE_ENV === 'development' ? error.message : 'Database operation failed'
          });
     }
});

router.get("/get-all-managers", async (req, res) => {
     try {
          const NewmanagerManagers = await managerInfo.find();
          console.log("✅ All managers retrieved successfully:", NewmanagerManagers);
          return res.status(200).json({
               message: "All managers retrieved successfully",
               data: NewmanagerManagers
          });
     } catch (error) {
          console.error("❌ Database error:", error);
          console.error("❌ Error details:", {
               message: error.message,
               name: error.name,
               code: error.code
          });
          return res.status(500).json({
               message: "Internal server error",
               error: process.env.NODE_ENV === 'development' ? error.message : 'Database operation failed'
          });
     }
});

router.get("/get-manager-email", async (req, res) => {
     const { mEmail } = req.body;
     try {
          const manager = await managerInfo.findOne({ mEmail });
          if (!manager) {
               return res.status(404).json({
                    message: "Manager not found"
               });
          }
          console.log("✅ Manager retrieved successfully:", manager._id);
          return res.status(200).json({
               message: "Manager retrieved successfully",
               data: manager
          });
     } catch (error) {
          console.error("❌ Database error:", error);
          console.error("❌ Error details:", {
               message: error.message,
               name: error.name,
               code: error.code
          });
          return res.status(500).json({
               message: "Internal server error",
               error: process.env.NODE_ENV === 'development' ? error.message : 'Database operation failed'
          });
     }
});

module.exports = router;