/*jslint node: true, es5: true, nomen: true*/
(function () {
    "use strict";

    var app,
        bodyParser,
        callbacks,
        cors,
        Database,
        db,
        environment,
        express,
        fs,
        http,
        https,
        mongoose,
        port,
        RedisStore,
        routes,
        server,
        session,
        sessionConfig,
        timeout;

    routes = require('./server/routes');
    express = require('express');
    session = require('express-session');
    Database = require('./server/database');
    mongoose = require('mongoose');
    RedisStore = require('connect-redis')(session);
    var MongoStore = require('connect-mongo')(session);
    bodyParser = require('body-parser');
    timeout = require('connect-timeout');
    https = require('https');
    http = require('http');
    cors = require('cors');
    fs = require('fs');

    callbacks = [];
    environment = process.env.NODE_ENV || 'development';
    port = process.env.PORT || 5000;
    sessionConfig = {
        resave: false,
        saveUninitialized: true,
        secret: '+rEchas&-wub24dR'
    };

    if (environment === 'production') {
        sessionConfig.store = new RedisStore({
            url: process.env.REDIS_URL
        });
/*
        sessionConfig.store = new MongoStore({
            url: process.env.DATABASE_URI
        });
*/
    }

    // Connect to the database.
    db = new Database({
        uri: process.env.DATABASE_URI || '',
        service: mongoose
    });

    // Create the app.
    app = express();
    app.set('port', port);
    app.use(bodyParser.json());
    app.use(timeout('60s'));
    app.use(session(sessionConfig));
    app.use(cors({
        credentials: true,
        origin: [
            'http://localhost:5000',
            'http://localhost:8080'
        ]
    }));
    app.use('/', express.static(__dirname + '/ui'));

    // Register routes.
    app.get('/auth/authenticated', routes.auth.getAuthenticated);
    app.get('/auth/login', routes.auth.getLogin);
    app.get('/auth/callback', routes.auth.getCallback);
    app.get('/auth/logout', routes.auth.getLogout);
    app.get('/api/dogs', routes.auth.checkSession, routes.api.dog.getDogs);
    app.get('/api/dogs/:dogId', routes.auth.checkSession, routes.api.dog.getDog);
    app.get('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.dog.getNotes);
    app.get('/api/dogs/:dogId/photo', routes.auth.checkSession, routes.api.dog.getPhoto);
    app.get('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.dog.getCurrentHome);
    app.get('/api/dogs/:dogId/previoushomes', routes.auth.checkSession, routes.api.dog.getPreviousHomes);
    app.get('/api/dogs/:dogId/findhome', routes.auth.checkSession, routes.api.dog.getFindHome);
    app.post('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.dog.postCurrentHome);
    app.post('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.dog.postNotes)

    // Connect to the database.
    db.connect(function () {

        // If we're building the database, we don't need to run the server.
        if (process.env.npm_config_build_database) {

            db.setup(function () {
                if (callbacks.length > 0) {
                    callbacks.forEach(function (callback) {
                        callback();
                    });
                }
                process.exit();
            });

        } else {

            // Create the server.
            if (environment === 'production') {
                server = http.createServer(app);
            } else {
                server = https.createServer({
                    key: fs.readFileSync('./server/sslcerts/server.key', 'utf8'),
                    cert: fs.readFileSync('./server/sslcerts/server.crt', 'utf8')
                }, app);
            }

            // Listen to the port.
            server.listen(app.get('port'), function () {
                console.log('Node app is running on port', app.get('port'));
            });
        }

    });

    module.exports = {
        ready: function (callback) {
            callbacks.push(callback);
        }
    };

}());