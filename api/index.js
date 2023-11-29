// app.js (or index.js)

const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');

const PlanApiHandler = require('./PlanApiHandler');
const DefaultApiHandler = require('./DefaultApiHandler');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const planApiHandler = new PlanApiHandler();
const defaultApiHandler = new DefaultApiHandler();

// Plan API route
app.post('/api/plan', (req, res) => planApiHandler.post(req, res));

// Default API route
app.get('/api/default', (req, res) => defaultApiHandler.get(req, res));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
