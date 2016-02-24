(function () {
    'use strict';

    var mongoose,
        schema;

    mongoose = require('mongoose');
    schema = require('../schemas/dog-owner-history');

    module.exports = mongoose.model('DogOwnerHistory', schema);
}());