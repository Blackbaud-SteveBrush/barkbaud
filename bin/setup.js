var exec = require('child_process').exec;
var fs = require('fs');
var isWindows = /^win/.test(process.platform);
var waterfall = [];

function series(commands, callback) {
    function executeNext() {
        exec(commands.shift(), function (error, output, outputLog) {
            if (error) {
                console.log('Error: ' + error);
                return;
            }
            if (output) {
                console.log(output);
            }
            if (outputLog) {
                console.log(outputLog);
            }
            if (commands.length) {
                executeNext();
            } else {
                callback();
            }
        });
    }
    executeNext();
}

if (isWindows) {
    waterfall = [
        'bower install',
        'grunt build',
        'env.bat'
    ];
} else {
    waterfall = [
        './node_modules/bower/bin/bower install',
        'source .env',
        'heroku config:set AUTH_CLIENT_ID=$AUTH_CLIENT_ID AUTH_CLIENT_SECRET=$AUTH_CLIENT_SECRET AUTH_SUBSCRIPTION_KEY=$AUTH_SUBSCRIPTION_KEY AUTH_REDIRECT_URI=$AUTH_REDIRECT_URI DATABASE_URI=$DATABASE_URI',
        'grunt build',
    ];
}

function start() {
    console.log("Setup started... (This may take a few minutes.)");
    series(waterfall, function () {
        console.log("Done!");
        process.env.npm_config_build_database = true;
        require('../index.js');
    });
}
start();

/*
fs.open('node_modules', 'r', function (error) {
    if (error && error.code === 'ENOENT') {
        start();
    } else {
        var yesno = require('yesno');
        yesno.ask('This process will reset your database to defaults, and overwrite everything in the ui/ folder. Are you sure you want to continue?', true, function (ok) {
            if (ok) {
                start();
            } else {
                console.log("Setup cancelled.");
                process.exit();
            }
        });
    }
});
*/