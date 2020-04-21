const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const api = express();

api.use(cors());

api.use(express.json());
api.use(routes);

api.listen(3040);