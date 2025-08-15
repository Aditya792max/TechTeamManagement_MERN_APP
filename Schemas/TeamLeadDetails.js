const mongoose = require('mongoose');
const teamDetailsSchema = new mongoose.Schema({
     teamName: { type: String, required: true },
     teamLead: { type: String, required: true },
     teamMembers: { type: [String], required: true },
     teamProject: { type: String, required: true },
     teamSize: { type: Number, required: true }
}, {
     collation: 'teamDetails'
});

const teamDetails = mongoose.model('TeamDetails', teamDetailsSchema);
module.exports = teamDetails;