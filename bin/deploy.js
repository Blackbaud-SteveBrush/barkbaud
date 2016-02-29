var execute = require(__dirname + '/lib/sequence');
var fs = require('fs');
var commands = [];

commands = [
    'bower install',
    'grunt build'
];

console.log("Deployment started...");
execute(commands, function () {
    console.log("Deployment finished.");
    require('../index.js');
});
