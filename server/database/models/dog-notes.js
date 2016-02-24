(function () {
    'use strict';

    var mongoose,
        schema;

    mongoose = require('mongoose');
    schema = require('../schemas/dog-notes');

    module.exports = mongoose.model('DogNotes', schema);
}());