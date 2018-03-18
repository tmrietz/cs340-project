module.exports = function(){
    var express = require("express");
    var router = express.Router();
    
    function getLines(res, mysql, context, complete){
        mysql.pool.query("select id, name, transit_type_id, system_id from line", function(err,results,fields){
            if(err){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.lines = results;
            complete();
        });
    }

    function getTransitStations(res, mysql, context, complete){
        mysql.pool.query("select id, name, underground from transit_station", function(err,results,fields){
            context.transit_stations = results;
            complete();
        });
    }

    function getLineStations(res, mysql, context, complete){
        mysql.pool.query( "select line_station.id, line_id, line.name as line_name, station_id, transit_station.name as station_name "+
                         "from line_station join line on line_station.line_id = line.id "+
                         "join transit_station on line_station.station_id = transit_station.id", function(err,results,fields){
            context.line_stations = results;
            complete();
        });
    }

    function getLineStation(res,mysql,context,complete,id){
        var sql = "select line_station.id, line_id, line.name as line_name, station_id, transit_station.name as station_name "+
                  "from line_station join line on line_station.line_id = line.id "+
                  "join transit_station on line_station.station_id = transit_station.id where line_station.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            context.line_station = results[0];
            complete();
        });
    }
    
    
    router.get('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deleteLineStation.js"];
        getLines(res,mysql,context,complete);
        getTransitStations(res,mysql,context,complete);
        getLineStations(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 3){
                res.render('line_station',context);
            }
        }
    });


    router.get('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var inserts = [req.params.id];
        var context = {};
        context.scripts = ["updateLineStations.js","selectStation.js","selectLine.js"];
        var callbacks = 0;
        getLineStation(res,mysql,context,complete, req.params.id);
        getTransitStations(res,mysql,context,complete);
        getLines(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 3){
                //res.send(context);
                res.render('update-line_station',context);
            }
        }
    });


    router.post('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "insert into line_station (line_id, station_id) values (?,?)";
        var inserts = [req.body.line_id, req.body.station_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.redirect('/line_station');
        });
    });


    router.put('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "update line_station set line_id=?, station_id=? where id=?";
        var inserts = [req.body.line_id, req.body.station_id, req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.end();
            }
            res.status(200);
            res.end();
        });
    });


    router.delete('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "delete from line_station where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.status(202).end();
        });
    })

    return router;
}();
