var sequence = require(__dirname + '/lib/sequence');
var fs = require('fs');
var commands = [];

commands = [
    //'npm install bower --ignore-scripts',
    //'npm install grunt-cli --ignore-scripts',
    //'bower install',
    //'grunt build'
];

sequence(commands, function () {
    //require('../index.js');
});
