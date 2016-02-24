(function () {
    'use strict';

    module.exports = require('mongoose').Schema({
        "bio": String,
        "breed": String,
        "createdAt": String,
        "currentOwner": {
            "__type": String,
            "className": String,
            "objectId": String
        },
        "gender": String,
        "image": {
            "file": String
        },
        "name": String,
        "objectId": String,
        "updatedAt": String
    }, {
        collection : 'Dog'
    });
}());