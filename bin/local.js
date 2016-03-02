(function () {
    'use strict';

    var app,
        dotenv,
        spawn;

    dotenv = require('dotenv').config();
    app = require('../index.js');
    spawn = require('child_process').spawn

    spawn('open', ['https://localhost:' + process.env.PORT]);

}());