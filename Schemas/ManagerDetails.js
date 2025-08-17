const mongoose = require('mongoose');
const managerDetailsSchema = new mongoose.Schema({
     mName: { type: String, required: true },
     mEmail: { type: String, required: true },
     mPhone: { type: String, required: true },
     mDepartment: { type: String, required: true },
     mTeamId: { type: String, required: true }
}, {
     collection: 'managerDetails'
});
const managerDetails = mongoose.model('managerDetails', managerDetailsSchema);

module.exports = managerDetails;