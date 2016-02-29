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
        'npm install',
        'bower install',
        'grunt build',
        'env.bat'
    ];
} else {
    waterfall = [
        'npm install',
        'bower install',
        'grunt build',
        'source .env'
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