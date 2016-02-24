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

    routes.auth = require('./auth')();

    routes.api.nxt = require('./api/nxt')(routes.auth);

    routes.api.dog = require('./api/dog')(routes.api.nxt);

    module.exports = routes;
}());