var app,
    dbPath,
    express,
    http,
    mongoose;


http = require('http');
mongoose = require("mongoose");
express = require('express');
app = express();


dbPath = 'mongodb://stevebrush:steve883@ds011308.mongolab.com:11308/barkbaud';


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/ui'));
app.get('/', function (req, res) {
    res.status(200).send('I dream of being a web site.');
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


mongoose.connect(dbPath, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + dbPath + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + dbPath);
    }
});