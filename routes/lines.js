module.exports = function(){
    var express = require("express");
    var router = express.Router();
    
    function getTransitTypes(res, mysql, context, complete){
        mysql.pool.query("select id, transit_type from transit_type", function(err,results,fields){
            context.transit_types = results;
            complete();
        });
    }
    
    function getSystems(res, mysql, context, complete){
        mysql.pool.query("select id, name from system", function(err,results,fields){
            context.systems = results;
            complete();
        });
    }


    function getLines(res, mysql, context, complete){
        mysql.pool.query("select line.id, line.name, transit_type.transit_type, system.name as system_name from line "+
                         "join transit_type on line.transit_type_id = transit_type.id "+
                         "join system on system.id = line.system_id", function(err,results,fields){
            context.lines = results;
            complete();
        });
    }


    function getLine(res, mysql, context, complete, id){
        var sql =   "select line.id, line.name, transit_type.transit_type, line.transit_type_id, system.name as system_name, line.system_id from line "+
                    "join transit_type on line.transit_type_id = transit_type.id "+
                    "join system on system.id = line.system_id where line.id=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(err,results,fields){
            context.line = results[0];
            complete();
        });
    }
    
    
    router.get('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deleteLine.js"]
        getLines(res,mysql,context,complete);
        getTransitTypes(res,mysql,context,complete);
        getSystems(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 3){
                res.render('line',context);
            }
        }
    });


    router.get('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["updateLine.js", "selectSystem.js", "selectTransitType.js"];
        getLine(res,mysql,context,complete, req.params.id);
        getTransitTypes(res,mysql,context,complete);
        getSystems(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 3){
                //res.send(context);
                res.render('update-line',context);
            }
        }
    });


    router.post('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "insert into line (name, transit_type_id, system_id) values (?,?,?)";
        var inserts = [req.body.name, req.body.transit_type_id, req.body.system_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.redirect('/line');
        });
    });


    router.put('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "update line set name=?, transit_type_id=?, system_id=? where id=?";
        var inserts = [req.body.name, req.body.transit_type_id, req.body.system_id, req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.end();
            }
            //res.send(inserts);
            res.status(200);
            res.end();
        });
    });


    router.delete('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "delete from line where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.status(202).end();
        });
    })

    return router;
}();
