var configVars;
var dotenv = require('dotenv').config();
var sequence = require(__dirname + '/lib/sequence');
var fs = require('fs');
var isWindows = /^win/.test(process.platform);
var commands = [];

// Windows.
if (isWindows) {
    commands = [
        'npm install',
        'bower install',
        'grunt build',
        'env.bat'
    ];


// Everything else.
} else {
    configVars = [
        'AUTH_CLIENT_ID=' + process.env.AUTH_CLIENT_ID,
        'AUTH_CLIENT_SECRET=' + process.env.AUTH_CLIENT_SECRET,
        'AUTH_SUBSCRIPTION_KEY=' + process.env.AUTH_SUBSCRIPTION_KEY,
        'AUTH_REDIRECT_URI=' + process.env.AUTH_REDIRECT_URI,
        'DATABASE_URI=' + process.env.DATABASE_URI
    ];
    commands = [
        'npm install --ignore-scripts',
        'bower install',
        'heroku config:set ' + configVars.join(" "),
        'grunt build'
    ];
}


function start() {
    console.log("Setup started (this may take a few minutes)...");
    sequence(commands, function () {
        console.log("Setup finished.");
        process.env.npm_config_build_database = true;
        var app = require('../index.js');
        app.ready(function () {
            console.log("Setup complete!");
        });
    });
}


fs.open('node_modules', 'r', function (error) {
    if (error && error.code === 'ENOENT') {
        start();
    } else {
        var yesno = require('yesno');
        yesno.ask('This process will reset your database to defaults, and overwrite everything in the ui/ folder. Are you sure you want to continue? (Y/n)', true, function (ok) {
            if (ok) {
                start();
            } else {
                console.log("Setup cancelled.");
                process.exit();
            }
        });
    }
});