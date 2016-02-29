var exec = require('child_process').exec;
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
    waterfall.push('env.bat');
} else {
    waterfall.push('source .env');
}

series(waterfall, function () {
    require('../index.js');
});