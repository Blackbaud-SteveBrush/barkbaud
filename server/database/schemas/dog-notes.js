(function () {
    'use strict';

    module.exports = require('mongoose').Schema({
        description: String
    }, {
        collection : 'DogNotes'
    });
}());