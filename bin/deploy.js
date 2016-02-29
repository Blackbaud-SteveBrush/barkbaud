var sequence = require(__dirname + '/lib/sequence');
var fs = require('fs');
var commands = [];

commands = [
    'bower install',
    'grunt build'
];

sequence(commands, function () {
    //require('../index.js');
});
