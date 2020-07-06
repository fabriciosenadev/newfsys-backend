const knex = require('knex');
const configuration = require('../../knexfile');

// database connection
const connection = knex(configuration.development);

module.exports = connection;