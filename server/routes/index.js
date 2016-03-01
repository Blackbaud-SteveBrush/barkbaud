(function () {
    'use strict';

    var routes;

    routes = {
        api: {}
    };

    routes.index = function (req, res) {
        res.status(200).json({
            data: []
        });
    };

    routes.auth = require('./auth');
    routes.api.sky = require('./api/sky');
    routes.api.dog = require('./api/dog')(routes.api.sky);

    module.exports = routes;
}());