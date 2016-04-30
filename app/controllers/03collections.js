var express = require('express'),
    router = express.Router(),
    request = require('request');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/selections/:city/:slug', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    req.app.setcurrentcity(res, req, req.params.city, function(city){
        var path = 'https://a1.fitternity.com/getcollecitonfinders/' + city.slug + '/' + req.params.slug;
        request(path, function(error, response, body) {
            if (!error) {
                var list = JSON.parse(body);
                res.render('collections/collection', {
                    title: list.collection.name + " in " + city.name,
                    info: list.collection,
                    vendors: list.collection_finders
                });
            } else {
                res.status(body.status || 500);
                res.send(body.message);
            }
        })
    });
});
