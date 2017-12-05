/** This is the starting point for the whole application */

const express = require('express');
const app = express();

// Setting delimeter for ejs module to '?' instead of '%'
require('ejs').delimiter = '?';

// Set view engine to ejs and set directory to look up ejs file to ./views/
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// A simple debugging middleware that prints requested path
app.use((req, res, next) =>
{
    console.info('\nURL requested:', req.url);
    next();
});

// Serves requested files if found in ./static_files folder
app.use(express.static(__dirname + '/static_files'));

// A middleware to have access to POST sent data (ex: req.body.some_data) :
// For content type : application/x-www-form-urlencoded (default for all POST or GET)
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json()); // For parsing application/json content type

// Automatically add/"use" all files in ./routes/ directory
{

    let fs = require('fs');

    fs.readdirSync('./routes/')
    .forEach((module_name) =>
    {
        if(!fs.statSync('./routes/' + module_name).isDirectory())
            app.use(require('./routes/' + module_name));
    });

    // 404.js added last as to serve 404 NOT FOUND message only if no other
    // router can handle the request
    app.use(require('./routes/special_modules/404.js'));
}

// Start server on port 9001 on localhost or on PORT variable from
// custom environmental config
const server = app.listen('9001' || process.env.PORT, () =>
{
    console.log('Express server started listening on', server.address());
});
