const mongoose = require('mongoose');

const devDetailsSchema = new mongoose.Schema({
     devName: { type: String, required: true },
     devEmail: { type: String, required: true, unique: true },
     devTeam: { type: String, required: true },
     devExperience: { type: Number, required: true },
     devProfile: { type: String, required: true },
     devPhone: { type: String, required: true }
}, {
     collection: 'devDetails',
});

const devDetails = mongoose.model('devDetails', devDetailsSchema);

module.exports = devDetails;