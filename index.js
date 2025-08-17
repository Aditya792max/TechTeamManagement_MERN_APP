const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
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


// Import routes
const devRoutes = require('./routes/devRoutes.js');
const teamRoutes = require('./routes/teamRoutes.js');
const teamLeadRoutes = require('./routes/teamLeadRoutes.js');
const managerRoutes = require('./routes/managerRoutes.js');
// Use routes
app.use('/', devRoutes);
app.use('/', teamRoutes);
app.use('/', teamLeadRoutes);
app.use('/', managerRoutes);

