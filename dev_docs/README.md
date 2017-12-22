# Setting up

+ `npm install` -- once (or every time new packages are added by someone)
+ `npm start` -- to start the server
    + or `node index.js`
+ Default URL to test on browser: `localhost:9001`


# Local database setup example

    sudo -u postgres createuser --interactive
    Enter name of role to add: railroad_admin
    Shall the new role be a superuser? (y/n) y

    sudo -u postgres psql
    ALTER USER railroad_admin WITH PASSWORD 'abc123';
    CREATE DATABASE railroad OWNER railroad_admin;

Then can pipe sql files like so:

    sudo psql -U railroad_admin -d railroad < location/to/sql/file.sql

To reset (delete) everything in db:
    
    sudo psql -U railroad_admin -d railroad
    DROP OWNED BY current_user CASCADE;

To easily add all tables, functions, and initial data run `make` in
[../database/](../database/) folder.

Other useful commands from promt:

    \dt
    \d
    \dt+
    \conninfo

# Module documentation links

+ Express.js : <http://expressjs.com/en/4x/api.html>
+ EJS : <http://ejs.co/>
+ Body-parser : <https://github.com/expressjs/body-parser>
+ Validator: <https://www.npmjs.com/package/validator>
+ Pg-promise : <https://github.com/vitaly-t/pg-promise>
+ Express-session : <https://github.com/expressjs/session>
+ Connect-pg-simple : <https://www.npmjs.com/package/connect-pg-simple>
    + Remember to add session table: `sudo psql -U railroad_admin -d railroad < node_modules/connect-pg-simple/table.sql`
