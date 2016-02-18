var app,
    express;

express = require('express');
app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/ui'));
app.get('/', function (req, res) {
    res.status(200).send('I dream of being a web site.');
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});