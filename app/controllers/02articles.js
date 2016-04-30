var express = require('express'),
    router = express.Router(),
    request = require('request');

module.exports = function(app) {
    app.use('/', router);
};

// List all experts
router.get('/experts', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    // var curcity = req.app.getcurrentcity(res, req);
    var path = 'https://a1.fitternity.com/experts';
    req.app.getcurrentcity(res, req, function(city) {
        request(path, function(error, response, body) {
            if (!error) {
                res.render('static/experts', {
                    experts: JSON.parse(body)
                });
            } else {
                res.status(body.status || 500);
                res.send(body.message);
            }
        })
    })
});

// Get an Expert
router.get('/expert/:username', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var path = 'https://a1.fitternity.com/expert/' + req.params.username;
    request(path, function(error, response, body) {
        if (!error) {
            res.render('static/expert', {
                expert: JSON.parse(body)
            });
        } else {
            res.status(body.status || 500);
            res.send(body.message);
        }
    });
});

// Get a Author
router.get('/author/:username', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var path = 'https://a1.fitternity.com/expert/' + req.params.username;
    request(path, function(error, response, body) {
        if (!error) {
            res.render('static/expert', {
                expert: JSON.parse(body)
            });
        } else {
            res.status(body.status || 500);
            res.send(body.message);
        }
    });
});

// Get all articles
router.get('/articles/:category?', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    if (req.params.category == undefined) {
        var path = 'https://a1.fitternity.com/blogs/0/500';
        var cat = 'all';
    } else {
        var path = 'https://a1.fitternity.com/blogs/' + req.params.category;
        var cat = req.params.category;
    }
    request(path, function(error, response, body) {
        if (!error) {
            res.render('articles/list', {
                blogs: JSON.parse(body),
                category: cat
            });
        } else {
            res.status(body.status || 500);
            res.send(body.message);
        }
    });
});

// Get a Article
router.get('/article/:slug', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var path = 'https://a1.fitternity.com/blogdetail/' + req.params.slug;
    request(path, function(error, response, body) {
        if (!error) {
            var bl = JSON.parse(body);
            var twitterMeta = 'Health, Fitness, Workout, Diet &amp; Lifestyle articles validated by experts '+bl.blog.title;
            console.log(twitterMeta);
            twitterMeta = twitterMeta.substring(0, 100 - req.url.length);
            console.log(req.url);
            res.render('articles/article', {
                blog: bl.blog,
                related: bl.related,
                popular: bl.popular,
                twitterMeta: twitterMeta
            });
        } else {
            res.status(body.status || 500);
            res.send(body.message);
        }
    });
});
