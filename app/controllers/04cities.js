var express = require('express'),
	cors = require('cors'),
	router = express.Router(),
	request = require('request');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var moment = require('moment');
async = require('async');
chalk = require('chalk');

module.exports = function(app) {
	app.use(cors());
	app.use('/', router);
};

// Mumbai Page
router.get('/mumbai', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.setcurrentcity(res, req, 'mumbai', function(city) {
		var path = 'https://a1.fitternity.com/homev3/' + city.slug;
		var footerpath = 'https://a1.fitternity.com/footer/' + city.slug;
		async.parallel({
				homepage: function(callback) {
					request(path, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var homedata = JSON.parse(body);
							callback(null, homedata);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				},
				footer: function(callback) {
					request(footerpath, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var data = JSON.parse(body);
							callback(null, data);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				}
			},
			function(err, results) {
				if (err) {
					console.log(err);
					res.status(404).render('404');
				} else {
					var footerData = results.footer;
					var homepageData = results.homepage;
					res.get('X-Frame-Options');
					res.cookie('showcitypop', false);
					res.render('home', {
						title: 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes ' + city.name + ' | Fitternity',
						metadesc: 'Discover gyms, yoga, pilates, zumba, martial arts, personal trainers, fitness classes. buy memberships, fitness products and read fitness articles from celebrity fitness trainers',
						city: city.slug,
						popular_finders: homepageData.popular_finders,
						blogs: homepageData.recent_blogs,
						collections: homepageData.collections,
						footer: footerData
					})
				}
			});
	});
});

// Pune
router.get('/pune', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.setcurrentcity(res, req, 'pune', function(city) {

		var path = 'https://a1.fitternity.com/homev3/' + city.slug;
		var footerpath = 'https://a1.fitternity.com/footer/' + city.slug;
		async.parallel({
				homepage: function(callback) {
					request(path, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var homedata = JSON.parse(body);
							callback(null, homedata);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				},
				footer: function(callback) {
					request(footerpath, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var data = JSON.parse(body);
							callback(null, data);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				}
			},
			function(err, results) {
				if (err) {
					console.log(err);
					res.status(404).render('404');
				} else {
					var footerData = results.footer;
					var homepageData = results.homepage;
					res.get('X-Frame-Options');
					res.cookie('showcitypop', false);
					res.render('home', {
						title: 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes ' + city.name + ' | Fitternity',
						metadesc: 'Discover gyms, yoga, pilates, zumba, martial arts, personal trainers, fitness classes. buy memberships, fitness products and read fitness articles from celebrity fitness trainers',
						city: city.slug,
						popular_finders: homepageData.popular_finders,
						blogs: homepageData.recent_blogs,
						collections: homepageData.collections,
						footer: footerData
					})
				}
			});
	});
});

// Bangalore / Begaluru
router.get('/bangalore', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.setcurrentcity(res, req, 'bangalore', function(city) {
		var path = 'https://a1.fitternity.com/homev3/' + city.slug;
		var footerpath = 'https://a1.fitternity.com/footer/' + city.slug;
		async.parallel({
				homepage: function(callback) {
					request(path, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var homedata = JSON.parse(body);
							callback(null, homedata);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				},
				footer: function(callback) {
					request(footerpath, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var data = JSON.parse(body);
							callback(null, data);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				}
			},
			function(err, results) {
				if (err) {
					console.log(err);
					res.status(404).render('404');
				} else {
					var footerData = results.footer;
					var homepageData = results.homepage;
					res.get('X-Frame-Options');
					res.cookie('showcitypop', false);
					res.render('home', {
						title: 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes ' + city.name + ' | Fitternity',
						metadesc: 'Discover gyms, yoga, pilates, zumba, martial arts, personal trainers, fitness classes. buy memberships, fitness products and read fitness articles from celebrity fitness trainers',
						city: city.slug,
						popular_finders: homepageData.popular_finders,
						blogs: homepageData.recent_blogs,
						collections: homepageData.collections,
						footer: footerData
					})
				}
			});
	});
});

// Delhi
router.get('/delhi', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.setcurrentcity(res, req, 'delhi', function(city) {
		var path = 'https://a1.fitternity.com/homev3/' + city.slug;
		var footerpath = 'https://a1.fitternity.com/footer/' + city.slug;
		async.parallel({
				homepage: function(callback) {
					request(path, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var homedata = JSON.parse(body);
							callback(null, homedata);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				},
				footer: function(callback) {
					request(footerpath, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var data = JSON.parse(body);
							callback(null, data);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				}
			},
			function(err, results) {
				if (err) {
					console.log(err);
					res.status(404).render('404');
				} else {
					var footerData = results.footer;
					var homepageData = results.homepage;
					res.get('X-Frame-Options');
					res.cookie('showcitypop', false);
					res.render('home', {
						title: 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes ' + city.name + ' | Fitternity',
						metadesc: 'Discover gyms, yoga, pilates, zumba, martial arts, personal trainers, fitness classes. buy memberships, fitness products and read fitness articles from celebrity fitness trainers',
						city: city.slug,
						popular_finders: homepageData.popular_finders,
						blogs: homepageData.recent_blogs,
						collections: homepageData.collections,
						footer: footerData
					})
				}
			});
	});
});

// gurgaon
router.get('/gurgaon', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.setcurrentcity(res, req, 'gurgaon', function(city) {
		var path = 'https://a1.fitternity.com/homev3/' + city.slug;
		var footerpath = 'https://a1.fitternity.com/footer/' + city.slug;
		async.parallel({
				homepage: function(callback) {
					request(path, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var homedata = JSON.parse(body);
							callback(null, homedata);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				},
				footer: function(callback) {
					request(footerpath, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var data = JSON.parse(body);
							callback(null, data);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				}
			},
			function(err, results) {
				if (err) {
					console.log(err);
					res.status(404).render('404');
				} else {
					var footerData = results.footer;
					var homepageData = results.homepage;
					res.get('X-Frame-Options');
					res.cookie('showcitypop', false);
					res.render('home', {
						title: 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes ' + city.name + ' | Fitternity',
						metadesc: 'Discover gyms, yoga, pilates, zumba, martial arts, personal trainers, fitness classes. buy memberships, fitness products and read fitness articles from celebrity fitness trainers',
						city: city.slug,
						popular_finders: homepageData.popular_finders,
						blogs: homepageData.recent_blogs,
						collections: homepageData.collections,
						footer: footerData
					})
				}
			});
	});
});