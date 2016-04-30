var express = require('express'),
    router = express.Router();

module.exports = function(app) {
    app.use('/', router);
};

// Fitness Guide
router.get('/fitness-guide', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('landingpages/fitness-guides', {
            title: 'Download Fitness Guides 2015'
        });
    });
});

// Terms of user
router.get('/terms-of-use', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/terms-of-use', {
            title: 'Terms of Use'
        });
    });
});

// Careers
router.get('/careers', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/landing-careers', {
            title: 'Careers | Fitternity'
        });
    });
});

// Privacy Policy
router.get('/privacy-policy', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/privacy-policy', {
            title: 'Privacy Policy | Fitternity'
        });
    });
});

// Current Openings
router.get('/current-openings', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/careers', {
            title: 'Current Openings | Fitternity'
        });
    });
});

// Terms & Conditions
router.get('/terms-&-conditions', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/terms-&-conditions', {
            title: 'Terms And Conditions | Fitternity'
        });
    });
});

// Store Policy
router.get('/store-policy', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/store-policy', {
            title: 'Store Policy | Fitternity'
        });
    });
});

// Media Page
router.get('/media', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/media', {
            title: 'Mentions | Fitternity'
        });
    });
});

// Partner with us
router.get('/list-your-business', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/listbiz', {
            title: 'Get Listed on Fittenity | Fitternity'
        });
    });
});

// Contact us
router.get('/contact-us', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/contact', {
            title: 'Contact Us | Fitternity'
        });
    });
});

// Sitemap
router.get('/sitemap', function(req, res) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    var curcity = req.app.getcurrentcity(res, req, function(city){
        res.render('static/sitemap', {
            title: 'Sitemap | Fitternity'
        });
    });
});