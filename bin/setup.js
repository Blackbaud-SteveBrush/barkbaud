/*global require, __dirname, process, console*/
(function () {
    'use strict';

    var colors,
        commands,
        configVars,
        dotenv,
        fs,
        //isWindows,
        sequence;

    colors = require('colors');
    sequence = require(__dirname + '/lib/sequence');
    fs = require('fs');

    //isWindows = /^win/.test(process.platform);
    commands = [
        'npm install --ignore-scripts',
        'bower install'
    ];

    function start() {
        console.log("Setup started (this may take a few minutes)...".cyan);

        sequence(commands, function () {

            commands = [];
            dotenv = require('dotenv').config();

            if (process.env.npm_config_heroku) {
                configVars = [
                    'AUTH_CLIENT_ID=' + process.env.AUTH_CLIENT_ID,
                    'AUTH_CLIENT_SECRET=' + process.env.AUTH_CLIENT_SECRET,
                    'AUTH_SUBSCRIPTION_KEY=' + process.env.AUTH_SUBSCRIPTION_KEY,
                    'AUTH_REDIRECT_URI=' + process.env.AUTH_REDIRECT_URI,
                    'DATABASE_URI=' + process.env.DATABASE_URI
                ];
                commands.push('heroku config:set ' + configVars.join(" "));
            }

            commands.push('grunt build');

            sequence(commands, function () {
                process.env.npm_config_build_database = true;
                require('../index.js').ready(function () {
                    console.log("Setup complete!".cyan);
                });
            });
        });
    }

    fs.open('node_modules', 'r', function (error) {
        if (error && error.code === 'ENOENT') {
            start();
        } else {
            require('yesno').ask(
                'This process will reset your database to defaults, and overwrite everything in the ui/ folder.' +
                colors.yellow('\nAre you sure you want to continue? (y/n)'), true, function (ok) {
                if (ok) {
                    start();
                } else {
                    console.log("Setup cancelled.".grey);
                    process.exit();
                }
            });
        }
    });
}());
