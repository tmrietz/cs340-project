module.exports = function(){
    var express = require("express");
    var router = express.Router();
    
    function getSystems(res, mysql, context, complete){
        mysql.pool.query("select id, name, url from system", function(err,results,fields){
            context.systems = results;
            complete();
        });
    }
    
    
    router.get('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var callbacks = 0;
        var context = {};
        context.scripts = ["deleteSystem.js"];
        getSystems(res,mysql,context,complete);
        function complete(){
            callbacks++;
            if(callbacks >= 1){
                res.render('system',context);
            }
        }
    });


    router.get('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "select id,name,url from system where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql,inserts, function(err,results,fields){
            if(err){
                res.end();
            } else {
                var context = {};
                context.scripts = ["updateSystem.js"];
                context.system = results[0];
                //res.send(context);
                res.render('update-system', context);
            }
        });
    });


    router.post('/', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "insert into system (name, url) values (?,?)";
        var inserts = [req.body.name, req.body.url];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.redirect('/system');
        });
    });


    router.put('/:id', function(req,res,next){
        var mysql = req.app.get('mysql');
        var sql = "update system set name=?, url=? where id=?";
        var inserts = [req.body.name, req.body.url, req.params.id];
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
        var sql = "delete from system where id = ?";
        var inserts = [req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            res.status(202).end();
        });
    })


    return router;
}();
