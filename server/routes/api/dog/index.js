/*jshint node: true */

/**
 *
 * @constructor
 * @param {Object} apiNxt
 * @returns {Object}
 *  {@link getApi}
 */
module.exports = function (apiNxt) {
    'use strict';

    var async,
        Dog,
        https,
        mongoose;

    async = require('async');
    https = require('request');
    mongoose = require('mongoose');
    Dog = require('../../../database/models/dog');

    /**
     * Gets an array of all dogs sorted ascending by name.
     * @name getDogs
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    function getDogs(request, response) {
        Dog.find({}).sort({
            'name': 'ascending'
        }).exec(function (error, docs) {
            if (error) {
                return onParseError(response, error);
            }
            response.json({
                data: docs
            });
        });
    }


    /**
     * Gets basic info for a specific dog.
     * @name getDogs
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDog(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, doc) {
            if (error) {
                return onParseError(response, error);
            }
            response.json({
                data: doc
            });
        });
    }


    /**
     * Gets all notes for a specific dog.
     * @name getNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getNotes(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            if (error) {
                return onParseError(response, error);
            }
            response.json({
                data: dog.notes
            });
        });
    }

    /**
     * Gets the photo for a specific dog.
     * This method alleviates mixed-content warnings since Parse stores files via http.
     * @name getPhoto
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Data} Binary photo data
     */
    function getPhoto(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            if (error) {
                var img = new Buffer('/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAyADIAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t6KMUtACZooxRQAUZpaSgAozRiloASijFGKADNFLRigBM0UUtACUUtJigAopaKAE5oopaAEo5paKAEoopaAE5opaKAEooooAWkoooAMUUUUAFFFFABRRRQAUUUUAGKKKKACiiigApaSigAooooAWkoooAKWkooAKKKKAClpKWgBKKKKACiiloASiiigAop8UTzyLHGrSOxwqqMkmvTPCnwpXYl1rJJY8i0Q8D/eP9B+dAHnVjpl3qcvl2ltLcv6RoWx9fSumsvhXr10AZI4bUH/AJ7Sc/kua9ltLO3sIRDbQxwRDokahR+QqagDyL/hTmp7f+P20z6Zb/CqV58KddtgTGkF0PSKTB/8exXtVFAHzff6Re6VJsvLWW2bt5ikA/Q96qV9LXNrDeRGKeJJ426pIoYH8DXnvir4UxTK9zox8qXqbVj8p/3T2+h/SgDyujFSTwSWszwzRtHKh2sjDBBqOgApaSigAoo7UUAFFFFAC0UlFABRRiigAooooAKKKKAClUFmAAJJ4AApK7r4V+GxqmqNqE6hoLQjaD/FIen5dfyoA634f+B00G2W9vEDajIMgN/yxB7D39fyrtKKSgApaKKACkopaACikxRQByXjzwTF4jtGubdAmpRD5WHHmD+6f6GvFJEeJ2R1KOpwVYYIPpX0zXkvxY8NLZXseqwKFiuDslAHR8dfxA/T3oA8+oxR0ooAKKMUYoAMUUUYoAKKMUUAFGaKM0AFFFFABR3oooAK978CaUNJ8L2MW3bJIgmf/ebn9BgfhXhFtF59zFGP43C/ma+lY0EaKi8KoAFADqKKKAEpaSloAKSlpKACloooASsjxdpY1nw5fW23LmMsn+8OR+orXpTyKAPmSlqzq1uLTVLyAcCKZ0GfZiKq0AFHNFFABS0mKKACiiigAoopaAEo60UUAFFFHegCxp8giv7Zz0SVSfzFfSdfMoPOa+ivD+oDVdEsbsHPmxKT7HHI/PNAGhSUtFABRRRQAlFLRQAlFGaWgBKKWqup3y6bp1zdv92GNnP4DNAHz74gkEuvalIOjXMpH4uaoU53MjszcliSTSUAJRS0lABRS0UAJiiiigAooxRQAUUUfpQAUUUUAFerfCLXlms59KlceZEfMhB7qeoH0PP415TirekapPouowXts22WJsj0I7g+xFAH0hSdqzvD+u2/iLTYry2PDDDoTyjdwa0aAClpOlFAC0lLSUALRSUv4UAJXBfFrXls9Jj02Jx51yQzgdRGP8Tj8jXYa1rFtoWnS3l022NBwO7HsB714Drusz6/qk97cH55DwoPCr2AoAodaKMUUAFFFFABRRRQAUUdaKACiiigAo6UUUAFFFFABiiiigDY8M+J7vwvfefbNujbiWFj8rj/AB969q8O+KrDxNbCS1l2ygfPA5w6fh3HvXkfhz4f6p4hCyiMWtqf+W8wxkf7I6n+XvXpnh74d6X4fkjnCvc3aciaQ4wfYDgfrQB1FFFLQAn50UtJQAtZWv8AiWw8N2pmu5sMR8kSnLv9B/WtWuY8R/D3TPEUjzsJLe7brNG2cn3B4/lQB5P4q8WXfiq88yb93bpnyoFPCj+p96w66bxH8P8AVPDwaUoLq0H/AC3hGcf7w6j+XvXMmgAooooAMUUGjNABRiiigAoozRQAUUUUAFFFFABRRUkEEl1OkMKNJK7BVRRkkntQAW9vLdzJDDG0srkKqKMkmvWPB3wyg00Jd6qq3F31WA8pH9fU/pWl4G8DxeGrYT3CrJqTj5n6iMf3V/qa6ygAAAAAHFHaiigA6UUUUALSUUtACUClpM0ABGRgjg1wPjH4ZQ6isl3pSrb3fVoOiSfT0P6V39FAHzRcW8tpO8M0bRSodrIwwQajr27xz4Hh8S2xnt1WPUox8r9BIP7rf0NeKzwSWs8kMyNHKjFWRhggjtQBHRRRQAUUUUAFFFFABRRRQAUUUdaACvWvhh4PFjbrq12n+kSr+4Vh9xD/ABfU/wAvrXF+AfDX/CR64gkUmzt8STeh9F/E/pmvdAAowOAOMUAKaSiloAKKTNHagApaSjNAC0lAooAMUtJmgUAFGMUUZ4oAWvPvif4PF9bPq9omLiEfv0UffQfxfUfy+legZoIDAg8g8YoA+ZaK6Xx94a/4RzW3Ea4s7jMkJ7D1X8D+mK5qgAooooAKKKKACiiigAoorZ8IaR/bniKytSu6Ivvk/wB0cn+WPxoA9c+HugjQ/DkO9dtzcDzpT9eg/AY/WumpOg7YooAXrSUtJQAUtJS0AJRRRQAuaKKSgBaKSloAKKSigBc0UUlAHNfELQRrvhyfYu64tx50R+nUfiM/jivCq+miOtfP3i/SP7D8RXtqBtjD74/91uR/PH4UAY1FFFABRRRQAUUUd6ACvSPg3p2+6v74j7irCp+pyf5D8683r2n4UWf2bwmsuMGeZ5Py+X/2WgDsqDQaKACij8KSgBaO1JS/hQAUUlFACikpfwooAM0Cij8KAEpe1FFABRRRQAV5Z8ZNO2XWn3yj76GFj9OR/M/lXqdcb8VrMXPhN5MZMEySD8fl/wDZqAPFqKKKACiiigAooooAK9+8DweR4R0tfWEP+fP9aKKAN2iiigApKKKACloooASloooAKSiigApaKKAEooooAXFJRRQAVh+OYPtHhLVF64hL/wDfPP8ASiigDwGiiigAooooA//Z', 'base64');
                response.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });
                response.end(img);
            }
            https(dog.image.file).pipe(response);
        });
    }

    /**
     * Gets the current home for a specific dog.
     * @name getCurrentHome
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getCurrentHome(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            var currentOwner;

            if (error) {
                return onParseError(response, error);
            }

            // Get the current owner.
            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive) {
                        currentOwner = owner;
                        return;
                    }
                });
            }

            if (currentOwner) {
                apiNxt.getConstituent(request, currentOwner.constituentId, function (constituent) {
                    response.json({
                        data: (function (temp) {
                            temp.constituent = constituent;
                            return temp;
                        }(currentOwner.toObject()))
                    });
                });
            } else {
                response.json({
                    data: []
                });
            }
        });
    }

    /**
     * Gets the previous homes for a specific dog, excluding the current home.
     * @name getPreviousHomes
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getPreviousHomes(request, response) {
        Dog.aggregate([
            { $match: {
                '_id': mongoose.Types.ObjectId(request.params.dogId)
            } },
            { $unwind: "$owners" },
            { $project: {
                _id: '$owners._id',
                constituentId: '$owners.constituentId',
                fromDate: '$owners.fromDate',
                toDate: '$owners.toDate',
                isActive: '$owners.isActive'
            } },
            { $match: {
                isActive: false
            } },
            { $sort: {
                fromDate: -1
            } }
        ], function (error, owners) {

            var waterfall;

            if (error) {
                console.log(error);
                return;
            }

            waterfall = [];

            function fetchConstituent(index, callback) {
                apiNxt.getConstituent(request, owners[index].constituentId, function (constituent) {
                    owners[index].constituent = constituent;
                    if (typeof callback === "function") {
                        callback(null, ++index);
                    }
                });
            }

            owners.forEach(function (owner, i) {
                if (i === 0) {
                    waterfall.push(async.apply(fetchConstituent, i));
                } else {
                    waterfall.push(fetchConstituent);
                }
            });

            async.waterfall(waterfall, function (error, result) {
                if (error) {
                    return onParseError(response, error);
                }
                response.json({
                    data: owners
                });
            });
        });
    }

    function getFindHome(request, response) {
        apiNxt.getConstituentSearch(request, request.query.searchText, function (results) {
            response.json(results);
        });
    }

    /**
     * Sets the current home of the specified dog.
     * Sets the toDate of the previous currentHome first.
     * @name postCurrentHome
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.body.id
     */
    function postCurrentHome(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            var currentDate,
                currentOwner;

            if (error) {
                return onParseError(response, error);
            }

            currentDate = new Date();

            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive === true) {
                        owner.toDate = currentDate;
                        owner.isActive = false;
                    }
                });
            }

            dog.owners.push({
                constituentId: request.body.id,
                fromDate: currentDate,
                isActive: true
            });

            dog.save(function (error) {
                if (error) {
                    return onParseError(response, error);
                }
                response.json({
                    data: dog.toObject()
                });
            });
        });
    }

    /**
     * Posts a note for a specific dog.
     * @name postNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.body.constituentId
     * @param {string} request.body.title
     * @param {string} request.body.description
     * @param {string} request.body.addToOwner
     * @returns {Object}
     */
    function postNotes(request, response) {
        Dog.findOne({
            _id: request.params.dogId
        }).exec(function (error, dog) {

            var currentDate,
                currentOwner,
                dogNote;

            if (error) {
                return onParseError(response, error);
            }

            // Get the current owner.
            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive) {
                        currentOwner = owner;
                        return;
                    }
                });
            }

            currentDate = new Date();

            // Validate current owner if requesting to addConstituentNote
            if (request.body.addConstituentNote && !currentOwner) {
                return onParseError(response, {
                    message: 'Dog does not have a current owner to save the note to.'
                });

            } else if (!request.body.title || !request.body.description || request.body.title === '' || request.body.description === '') {
                return onParseError(response, {
                    message: 'Title and description are required'
                });

            } else {
                dogNote = dog.notes.push({
                    date: currentDate,
                    title: request.body.title,
                    description: request.body.description
                });

                dog.save(function (error) {

                    if (error) {
                        return onParseError(response, error);
                    }

                    if (request.body.addConstituentNote) {
                        apiNxt.postNotes(request, currentOwner.constituentId, {
                            type: 'Barkbaud',
                            date: {
                                y: currentDate.getFullYear(),
                                m: currentDate.getMonth() + 1,
                                d: currentDate.getDate()
                            },
                            summary: request.body.title,
                            text: request.body.description
                        }, function (note) {
                            response.json({
                                data: note
                            });
                        });
                    } else {
                        response.json({
                            data: dogNote
                        });
                    }
                });
            }
        });
    }

    /**
     * Handles parse errors
     * @internal
     * @name handleError
     * @param {Object} response
     * @param {Object} error
    */
    function onParseError(response, error) {
        response.status(500).json({
            error: error
        });
    }

    // Expose any methods from our module
    return {
        getCurrentHome: getCurrentHome,
        getDog: getDog,
        getDogs: getDogs,
        getFindHome: getFindHome,
        getNotes: getNotes,
        getPhoto: getPhoto,
        getPreviousHomes: getPreviousHomes,
        postCurrentHome: postCurrentHome,
        postNotes: postNotes
    };
};