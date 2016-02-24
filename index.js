/*jslint node: true, es5: true, nomen: true*/
(function () {
    "use strict";

    var app,
        bodyParser,
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
    bodyParser = require('body-parser');
    timeout = require('connect-timeout');
    https = require('https');
    http = require('http');
    cors = require('cors');
    fs = require('fs');

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
    }

    // Connect to the database.
    db = new Database({
        uri: process.env.DATABASE_URI || '',
        service: mongoose
    });
    db.connect();

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
    app.use(express.static(__dirname + '/ui'));

    // Register routes.
    app.get('/', routes.index);
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
    app.post('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.dog.postNotes);

    // Create the server.
    if (environment === 'production') {
        server = http.createServer(app);
    } else {
        server = https.createServer({
            key: fs.readFileSync('./server/sslcerts/server.key', 'utf8'),
            cert: fs.readFileSync('./server/sslcerts/server.crt', 'utf8')
        }, app);
    }
    server.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
}());