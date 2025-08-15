const mongoose = require('mongoose');
const teamDetailsSchema = new mongoose.Schema({
     teamId: { type: String, required: true, unique: true },
     teamName: { type: String, required: true },
     teamLead: { type: String, required: true },
     teamMembers: { type: [String], required: true },
     teamProject: { type: String, required: true },
     teamSize: { type: Number, required: true }
}, {
     collection: 'teamDetails',
});

const teamDetails = mongoose.model('teamDetails', teamDetailsSchema);
module.exports = teamDetails;