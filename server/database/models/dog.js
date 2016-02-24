(function () {
    'use strict';

    var mongoose,
        schema;

    mongoose = require('mongoose');
    schema = require('../schemas/dog');

    module.exports = mongoose.model('Dog', schema);
}());