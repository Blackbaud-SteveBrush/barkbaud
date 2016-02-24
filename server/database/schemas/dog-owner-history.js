(function () {
    'use strict';

    module.exports = require('mongoose').Schema({
        "constituentId": String,
        "createdAt": String,
        "fromDate": {
            "__type": String,
            "iso": String
        },
        "objectId": String,
        "toDate": {
            "__type": String,
            "iso": String
        },
        "updatedAt": String
    }, {
        collection : 'DogOwnerHistory'
    });
}());