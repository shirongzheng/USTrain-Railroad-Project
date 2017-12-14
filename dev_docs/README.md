# Setting up

+ `npm install` -- once (or every time new packages are added by someone)
+ `npm start` -- to start the server
    + or `node index.js`
+ Default URL to test on browser: `localhost:9001`

# Module documentation links

+ Express.js : <http://expressjs.com/en/4x/api.html>
+ EJS : <http://ejs.co/>
+ Body-parser : <https://github.com/expressjs/body-parser>
+ Validator: <https://www.npmjs.com/package/validator>
+ Pg-promise : <https://github.com/vitaly-t/pg-promise>

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

Other useful commands from promt:

    \dt
    \d
    \dt+
    \conninfo
