module.exports = function(){
    var express = require("express");
    var router = express.Router();
    
    function getTransitStations(res, mysql, context, complete){
        mysql.pool.query("select id, name, underground from transit_station", function(err,results,fields){
            context.transit_stations = results;
            complete();
        });
    }


    function getPlatforms(res, mysql, context, complete){
        mysql.pool.query("select platform.id, platform.name, case when station_id is NULL then -1 else station_id end as station_id, "+
                         "case when transit_station.name is NULL then 'NULL' else transit_station.name end as station_name "+
                         "from platform left join transit_station on platform.station_id = transit_station.id", function(err,results,fields){
            context.platforms = results;
            complete();
        });
    }


    function getFilteredPlatforms(res, mysql, context, complete, platName, stationName){
        var sql =   "select platform.id, platform.name, case when station_id is NULL then -1 else station_id end as station_id, "+
                    "case when transit_station.name is NULL then 'NULL' else transit_station.name end as station_name "+
                    "from platform left join transit_station on platform.station_id = transit_station.id "+
                    "where platform.name like "+mysql.pool.escape('%'+platName+'%');

        if(stationName == "null" || stationName == "Null" || stationName == "NULL"){
            sql = sql + " and transit_station.name is NULL";
        } else {
            sql = sql + " and transit_station.name like "+mysql.pool.escape('%'+stationName+'%');
        }

        mysql.pool.query(sql, function(err,results,fields){
            if(err){
                console.log(err);
            }
            context.platforms = results;
            complete();
        });
    }


    function getPlatform(res,mysql,context,complete,id){
        var inserts = [id];
        var sql = "select id, name, case when station_id is NULL then -1 else station_id end as station_id from platform where id=?";
        mysql.pool.query(sql, inserts, function(err,results,fields){
            if(err){
                res.end();
            } else {
                context.platform = results[0];
                complete();
            }
        });
    }
    
    
    router.get('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deletePlatform.js"];
        getTransitStations(res,mysql,context,complete);
        getPlatforms(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 2){
                res.render('platform',context);
            }
        }
            //res.render('line', context);
    });


    router.get('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["updatePlatform.js","selectStation.js"]
        getPlatform(res,mysql,context,complete, req.params.id);
        getTransitStations(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 2){
                res.render('update-platform',context);
            }
        }
    });


    router.post('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "insert into platform (name, station_id) values (?,?)";
        var station_id;
        if(req.body.station_id == -1){
            station_id = null;
        } else {
            station_id = req.body.station_id;
        }
        var inserts = [req.body.name, station_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.redirect('/platform');
        });
    });


    router.post('/filter', function(req,res,next){
        //res.send(req.body);
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deletePlatform.js"];
        getTransitStations(res,mysql,context,complete);
        getFilteredPlatforms(res,mysql,context,complete, req.body.platName, req.body.stationName);
        function complete(){
            callbacks++;
            if(callbacks >= 2){
                res.render('platform', context);
            }
        }
    });


    router.put('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "update platform set name=?, station_id=? where id=?";
        var station_id;
        if(req.body.station_id == -1){
            station_id = null;
        } else {
            station_id = req.body.station_id;
        }
        var inserts = [req.body.name, station_id, req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.end();
            }
            res.send(inserts);
            res.status(200);
            res.end();
        });
    });


    router.delete('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "delete from platform where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.status(202).end();
        });
    })

    return router;
}();
