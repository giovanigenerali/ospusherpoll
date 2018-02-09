const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// DB config
require('./config/db');

const app = express();

const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname,'public')));

// Body parser middlware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable CORS
app.use(cors());

const port = process.env.PORT || 8080;

app.use('/poll', poll);

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));