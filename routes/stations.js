module.exports = function(){
    var express = require("express");
    var router = express.Router();
    
    function getTransitStations(res, mysql, context, complete){
        mysql.pool.query("select id, name," +
                        "case when underground=1 then 'true' else 'false' end as underground from transit_station", function(err,results,fields){
            context.transit_stations = results;
            complete();
        });
    }

    
    //display all transit stations
    router.get('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deleteStation.js"];
        getTransitStations(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 1){
                res.render('transit_station',context);
            }
        }
    });


    router.get('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "select id, name, underground from transit_station where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            var context={};
            context.scripts = ["updateStation.js"];
            context.id = req.params.id;
            context.name = results[0].name;
            context.underground = results[0].underground; 
            //res.send(context);
            res.render('update_station', context);
        });
    });


    router.post('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "insert into transit_station (name, underground) values (?,?)";
        var underground;
        if(!req.body.underground){
            underground = 0;
        } else {
            underground = 1;
        }
        var inserts = [req.body.name, underground];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.redirect('/station');
        });
    });




    router.put('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "update transit_station set name=?, underground=? where id=?";
        var underground;
        if(!req.body.underground){
            underground = 0;
        } else {
            underground = 1;
        }
        var inserts = [req.body.name, underground, req.params.id];
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
        var sql = "delete from transit_station where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.status(202).end();
        });
    })


    return router;
}();
