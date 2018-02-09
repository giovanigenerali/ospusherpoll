const mongoose = require('mongoose');

const env_vars = require('../scripts/vars');

// Map global promise
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(process.env.MONGODB || env_vars.developemnt.MONGODB)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));