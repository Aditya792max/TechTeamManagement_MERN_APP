// const mongoose = require('mongoose');
// const teamDetailsSchema = new mongoose.Schema({
//      teamName: { type: String, required: true },
//      teamLead: { type: String, required: true },
//      teamMembers: { type: [String], required: true },
//      teamProject: { type: String, required: true },
//      teamSize: { type: Number, required: true }
// }, {
//      collation: 'teamDetails'
// });

// const teamDetails = mongoose.model('TeamDetails', teamDetailsSchema);
// / module.exports = teamDetails;

// We have created the teamLeadDetails schema and model.node

const mongoose = require('mongoose');
const teamLeadSchema = new mongoose.Schema({
     teamId: { type: String, required: true },
     teamName: { type: String, required: true },
     teamLeadName: { type: String, required: true },
     teamSize: { type: Number, required: true }
}, {
     collection: 'teamLeadDetails'
});

const teamLeadDetails = mongoose.model('teamLeadDetails', teamLeadSchema);
module.exports = teamLeadDetails;

