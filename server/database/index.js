(function () {
    'use strict';

    var fs;

    fs = require('fs');

    function setup() {
        var Dog,
            imageBasePath;

        if (process.env.npm_config_build_database) {

            Dog = require('./models/dog');
            imageBasePath = './server/database/backups/images/';

            // Convert images to Base64.
            fs.readdir(imageBasePath, function (error, files) {

                if (error) {
                    console.log(error);
                    return;
                }

                files.forEach(function (file) {

                    var bitmap,
                        encoded;

                    if (file === '.DS_Store') {
                        return;
                    }

                    bitmap = fs.readFileSync(imageBasePath + file);
                    encoded = new Buffer(bitmap).toString('base64');

                    // Search dog until you find the one with the same file name
                    Dog.findOne({
                        'image.file': file
                    }, function (error, dog) {
                        if (error) {
                            console.log("Error:", error);
                        }
                        dog.get('image').data = encoded;
                        dog.markModified('image');
                        dog.save(function (err, result) {
                            if (err) {
                                console.error('Error saving file ' + file, err);
                            }
                            console.log(file + " converted to Base64 and saved.");
                        });
                    });
                });
            });
        }
    }

    function Database(options) {
        var service,
            uri;

        uri = options.uri;
        service = options.service;

        this.connect = function () {
            service.connect(uri);
            setup();
        };
        return this;
    }

    module.exports = Database;
}());