const pgp = require('pg-promise')(/*options*/);
if(typeof process.env.DATABASE_URL === 'string') pgp.pg.defaults.ssl = true;
const cn = process.env.DATABASE_URL || 'postgres://railroad_admin:abc123@localhost:5432/railroad';
const db = pgp(cn);

module.exports = db;
