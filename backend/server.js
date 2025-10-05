const express = require('express');
const bodyParser = require('body-parser');
const cors =  require('cors');

const gangPlanDetailRoutes = require('./routes/gangPlanDetailRoute.js')
const voyageNameRoute = require('./routes/voyageNameRoute.js')
const vesselNameRoute = require('./routes/vesselNameRoute.js')
const gangRoute = require('./routes/gangRoute.js')

const app = express();
app.use(bodyParser.json());
app.use(cors());

// API endpoints
app.use('/api/voyagenames', voyageNameRoute);
app.use('/api/vesselnames', vesselNameRoute);
app.use('/api/gangplandetails', gangPlanDetailRoutes);
app.use('/api/gangs', gangRoute);

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Server is running on ${port}`));