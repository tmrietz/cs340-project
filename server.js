var mysql = require('./dbcon.js');
var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var app = express();
app.set('port', 8912);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);




app.use('/line', require('./routes/lines.js'));
app.use('/platform', require('./routes/platforms.js'));
app.use('/line_station', require('./routes/line_stations.js'));
app.use('/system', require('./routes/systems.js'));
app.use('/station', require('./routes/stations.js'));
app.use('/transit_type', require('./routes/transit_types.js'));

app.get('/', function(req,res){
    var context = {};
    res.render('home', context);
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
