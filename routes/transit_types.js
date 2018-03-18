module.exports = function(){
    var express = require("express");
    var router = express.Router();
    
    function getTransitTypes(res, mysql, context, complete){
        mysql.pool.query("select id, transit_type from transit_type", function(err,results,fields){
            context.transit_types = results;
            complete();
        });
    }

    function getRelatedLines(res,mysql,context,complete,id){
        mysql.pool.query("select id, name, count(id) as fail_count from line where transit_type_id = ?", function(err,results,fields){
            context.lines = results;
            complete(context,mysql,id);
        });
    }
    
    
    router.get('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deleteTransitType.js"];
        getTransitTypes(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 1){
                res.render('transit_type',context);
            }
        }
    });


    router.get('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "select id, transit_type from transit_type where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql,inserts, function(err,results,fields){
            if(err){
                res.end();
            } else {
                var context = {};
                context.scripts = ["updateTransitType.js"];
                context.transit_type = results[0];
                //res.send(context);
                res.render('update-transit_type', context);
            }
        });
    });


    router.post('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "insert into transit_type (transit_type) value (?)";
        var inserts = [req.body.transit_type];
        mysql.pool.query(sql,inserts, function(err,results,fields){
            if(err){
                res.end();
            } else {
                res.redirect('/transit_type');
            }
        });
    });


    router.put('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "update transit_type set transit_type=? where id=?";
        var inserts = [req.body.transit_type, req.params.id];
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
        var sql = "delete from transit_type where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.status(202).end();
        });
    })

    return router;
}();
