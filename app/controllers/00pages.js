var express = require('express'),
	cors    = require('cors'),
	request = require('request'),
	jwt 	= require('jsonwebtoken'),
	crypto  = require('crypto'),
	moment  = require('moment'),
	async 	= require('async'),
	chalk 	= require('chalk'),
	lodash 	= require('lodash');

var router  = express.Router();
	
module.exports = function(app) {
	app.use(cors());
	app.use('/', router);
};

// This is the very homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JoyRide' });
});

/*router.get('/', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.getcurrentcity(res, req, function(city) {
		
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
*/

// 404 Page
router.get('/404', function(req, res) {
	res.render('404', {
		title: 'Sorry Page Not Found!'
	});
});

// User profile
router.get('/profile/:email/:id?', function(req, res) {
	var ses = req.app.getsessionid(res, req);
	var ref = req.app.getreferer(res, req, ses);
	req.app.getcurrentcity(res, req, function(city) {
		var collection = "";
		var theid = "";
		if (req.params.id != undefined) {
			if (req.params.id.charAt(0) == "t") {
				collection = "trial";
				theid = req.params.id.substring(1);
			} else if (req.params.id.charAt(0) == "o") {
				collection = "order";
				theid = req.params.id.substring(1);
			}
		}
		res.render('profile/profile', {
			title: 'Profile',
			emailid: req.params.email,
			id: theid,
			collection: collection
		});
	});
});

// Book Trial
router.get('/booktrial/:slug', function(req, res) {
	req.app.getcurrentcity(res, req, function(city) {
		var path = 'https://a1.fitternity.com/finderdetail/' + req.params.slug;
		request(path, function(error, response, body) {
			if (!error) {
				var vendor = JSON.parse(body);
				res.render('trial/trial', {
					title: 'Book Trial',
					metadesc: 'Book trial at',
					vendor: vendor.finder,
					type: 'booktrial'
				});
			} else {
				res.status(body.status || 500);
				res.send(body.message);
			}
		});
	});
});

// Workout session
router.get('/workoutsession/:slug', function(req, res) {
	req.app.getcurrentcity(res, req, function(city) {
		var path = 'https://a1.fitternity.com/finderdetail/' + req.params.slug;
		request(path, function(error, response, body) {
			if (!error) {
				var vendor = JSON.parse(body);
				res.render('trial/trial', {
					title: 'Book Trial',
					metadesc: 'Book trial at',
					vendor: vendor.finder,
					type: 'workout'
				});
			} else {
				res.status(body.status || 500);
				res.send(body.message);
			}
		});
	});
});

// Purchase Page
router.get('/buy/:slug/:service/:ratecard', function(req, res) {
	var city = req.app.getcurrentcity(res, req, function(city) {
		var path = 'https://a1.fitternity.com/finderdetail/' + req.params.slug;
		var path1 = 'https://a1.fitternity.com/servicedetail/' + req.params.service;
		async.parallel({
				vendor: function(callback) {
					request(path, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var finder = JSON.parse(body);
							callback(null, finder);
						} else {
							callback({
								statusCode: 404
							});
						}
					});
				},
				service: function(callback) {
					request(path1, function(error, response, body) {
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
					var vendor = results.vendor.finder;
					// var service = results.service.service;
					var service = lodash.find(vendor.services, function(o) { return o._id == req.params.service; });
					if(service != undefined){
						var ratecard = lodash.find(service.serviceratecard, function(o) { return o._id == req.params.ratecard; });
						if(ratecard == undefined){
							callback({
								statusCode: 404
							});
						}
					}else{
						callback({
								statusCode: 404
							});
					}
					
					console.log(service);
					res.get('X-Frame-Options');
					res.render('buy/buy', {
						title: 'Buy',
						metadesc: 'Buy membership',
						city: city,
						vendor: vendor,
						service: service,
						ratecard_id: req.params.ratecard,
						ratecard: ratecard
					});
				}
			});
	});
});

// Auth Sign Methods
router.post('/user/signin', function(req, res) {
	var payload = req.body;
	var data = {
		'identity': payload.identity,
		'email': payload.email,
		'password': payload.password
	};
	var options = {
		url: 'https://a1.fitternity.com/customerlogin',
		method: 'POST',
		json: data
	};

	request(options, function(error, resp, body) {
		if (!error) {
			if (body.status != 400) {
				var decoded = jwt.decode(body.token);
				res.send({
					status: body.status,
					message: body.message,
					customer: decoded.customer,
					token: body.token
				});
			} else {
				res.send({
					status: body.status,
					message: body.message
				});
			}
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	})
});

// Auth Signup Methods
router.post('/user/register', function(req, res) {
	var payload = req.body;
	var data = {
		'identity': payload.identity,
		'name': payload.fullname,
		'email': payload.email,
		'password': payload.password,
		'password_confirmation': payload.password
	};
	var options = {
		url: 'https://a1.fitternity.com/customerregister',
		method: 'POST',
		json: data
	};
	request(options, function(error, resp, body) {
		if (!error) {
			if (body.status != 400) {
				var decoded = jwt.decode(body.token);
				res.send({
					status: body.status,
					message: body.message,
					customer: decoded.customer,
					token: body.token
				});
			} else {
				res.send({
					status: body.status,
					message: body.message
				});
			}
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	});
});

router.post('/user/fbsignin', function(req, res) {
	var payload = req.body;
	var data = {
		'identity': payload.identity,
		'facebook_id': payload.id,
		'email': payload.email,
		'name': payload.first_name + payload.last_name
	};
	var options = {
		url: 'https://a1.fitternity.com/customerlogin',
		method: 'POST',
		json: data
	};
	request(options, function(error, resp, body) {
		if (!error) {
			var decoded = jwt.decode(body.token);
			res.send({
				status: body.status,
				message: body.message,
				customer: decoded.customer,
				token: body.token
			});
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	});
});

// 
router.post('/user/gpsignin', function(req, res) {
	var payload = req.body;
	var data = {
		'identity': payload.identity,
		'facebook_id': payload.id,
		'email': payload.email,
		'name': payload.first_name + payload.last_name
	};
	var options = {
		url: 'https://a1.fitternity.com/customerlogin',
		method: 'POST',
		json: data
	};
	request(options, function(error, resp, body) {
		if (!error) {
			var decoded = jwt.decode(body.token);
			res.send({
				status: body.status,
				message: body.message,
				customer: decoded.customer,
				token: body.token
			});
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	});
});

// Verify The Customer
router.post('/user/verify', function(req, res) {
	var payload = req.body;
	jwt.verify(payload.token, 'fitternity', function(err, decoded) {
		if (err) {
			res.send({
				customer: null
			});
		} else {
			res.send({
				customer: decoded.customer
			});
		}
	});
});

// Logout User
router.post('/user/logout', function(req, res) {
	var payload = req.body;
	var options = {
		url: 'https://a1.fitternity.com/customerlogout',
		method: 'GET',
		headers: {
			'Authorization': payload.token
		}
	};
	request(options, function(error, resp, body) {
		if (!error) {
			var decoded = jwt.decode(body.token);
			res.send({
				status: 'success'
			});
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	});
})

// Reset Password
router.post('/user/reset', function(req, res) {
	var payload = req.body;
	var data = {
		'email': payload.email
	};
	var options = {
		url: 'https://a1.fitternity.com/customerforgotpasswordemail',
		method: 'POST',
		json: data
	};
	request(options, function(error, resp, body) {
		if (!error) {
			if (body.status != 400) {
				res.send({
					status: 'done',
					message: 'reset email will be delivered to the email'
				});
			} else {
				res.send({
					status: body.status,
					message: body.message
				});
			}
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	});
})

// Reset Password Page
router.get('/forgot/:key', function(req, res) {
	res.render('resetpass', {
		title: 'Reset your password | Fitternity',
		key: req.params.key
	})
});

// Reset Password form
router.post('/user/resetpass', function(req, res) {
	var payload = req.body;
	var data = {
		'password': payload.password,
		'password_confirmation': payload.password,
		'password_token': payload.token
	};
	var options = {
		url: 'https://a1.fitternity.com/customerforgotpassword',
		method: 'POST',
		json: data
	};
	request(options, function(error, resp, body) {
		if (!error) {
			var decoded = jwt.decode(body.token);
			res.send({
				status: body.status,
				message: body.message,
				customer: decoded.customer,
				token: body.token
			});
		} else {
			res.status(body.status || 500);
			res.send(body.message);
		}
	});
});

// Generate OTP
router.post('/generatesms', function(req, res) {
	var returned = req.body;
	var mobile = returned.mobile;
	var sms_body = returned.message;
	console.log(returned,mobile);
	// var footerpath = 'http://www.kookoo.in/outbound/outbound_sms.php?api_key=KK6cb3903e3d2c428bb60c0cfaa212009e&phone_no=' + mobile + '&message=' + encodeURI(sms_body) + '&senderid=FTRNTY';
	var footerpath = 'http://www.kookoo.in/outbound/outbound_sms.php?api_key=KK33e21df516ab75130faef25c151130c1&phone_no=' + mobile + '&message=' + encodeURI(sms_body) + '&senderid=FTRNTY';
	// var homedata = JSON.parse(body);
	request(footerpath, function(error, response, body) {
		console.log(response);
		if (!error) {
			res.jsonp({
				"message": "success"
			});
			// res.jsonp(response);
		} else {
			res.jsonp({
				"message": "failed"
			});
			// res.jsonp(error);
		}
	});
});

router.get("/crossfit-focus", function(req, res){
	var path = 'https://a1.fitternity.com/campaign/1/crossfit-week';
	request(path, function(error, response, body) {
		var homedata = JSON.parse(body);
		res.render('campaign/crossfit-week', {
			title: 'Crossfit Week | Fitternity',
			services: homedata.services,
			blogs: homedata.blogs,
		})
	})
});
router.get("/crossfit-focus/buy/:service_id", function(req, res){
	var servceid = parseInt(req.params.service_id);
	var path = 'https://a1.fitternity.com/servicedetail/'+servceid;
	request(path, function(error, response, body) {
		var homedata = JSON.parse(body);
		res.render('campaign/campaign-buy', {
			title: 'Crossfit Week | Fitternity',
			service: homedata.service,
		})
	})
});
router.get("/service/:service_id", function(req,res){
	var servceid = parseInt(req.params.service_id);
	var path = 'https://a1.fitternity.com/servicedetail/'+servceid;
	request(path, function(error, response, body) {
		var homedata = JSON.parse(body);
		var path1 = 'https://a1.fitternity.com/finderdetail/'+homedata.service.finder.slug;
		request(path1, function(error, response, body) {
			var homedata1 = JSON.parse(body);
			console.log("homedata.service.finder.slug",homedata.service.finder.slug);
			var fixedfacilities = [{
                    "name": "Locker & Shower Facility",
                    "slug": "locker-and-shower-facility"
                }, {
                    "name": "Free Trial",
                    "slug": "free-trial"
                }, {
                    "name": "Personal Training",
                    "slug": "personal-training"
                }, {
                    "name": "Group Classes",
                    "slug": "group-classes"
                }, {
                    "name": "Sunday Open",
                    "slug": "sunday-open"
                }, {
                    "name": "Parking",
                    "slug": "parking"
                }];
                var facilities = [];
                lodash.forEach(homedata1.finder.facilities, function(data) {
                    facilities.push(data.slug);
                });
                var today = new Date();
                var schedulepath = 'https://a1.fitternity.com/getserviceschedule/' + homedata.service._id + '/' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
                console.log(schedulepath);
                request(schedulepath, function(error, response, body) {
                        var schedules = JSON.parse(body);
                        res.render('campaign/service/service', {
							title: 'Crossfit Week | Fitternity',
							service: homedata.service,
							vendor: homedata1.finder,
							fixedfacilities: fixedfacilities,
							facilities: facilities,
							schedules: schedules
						})
                    })
		})
	})
})

// router.get("/crushfit", function(req, res){
// 	var path = "https://a1.fitternity.com/landingcrushfinders";
// 	var path1 = "https://a1.fitternity.com/landingcrushlocationclusterwise/all";
// 	async.parallel({
// 	finders : function(callback){
// 			request(path, function(error, response, body) {	
// 				var homedata = JSON.parse(body);
// 				callback(homedata);
// 			})
// 	},
// 	clusterwise : function(callback){
// 			request(path1, function(error, response, body) {	
// 				var cluster = JSON.parse(body);
// 				callback(cluster);
// 			})
// 	}
// },function(err, results) {
// 				if (err) {
// 					console.log(err);
// 					res.status(404).render('404');
// 				} else {
// 					var footerData = results.finders;
// 					var homepageData = results.clusterwise;
// 					res.get('X-Frame-Options');
// 					res.render('campaign/crushfit', {
// 							title: 'CRUSHFIT',
// 					        metadesc: 'All Crushfit Branches',
// 					        gallery: homedata
// 						})
// 					res.render('home', {
// 						title: 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes ' + city.name + ' | Fitternity',
// 						metadesc: 'Discover gyms, yoga, pilates, zumba, martial arts, personal trainers, fitness classes. buy memberships, fitness products and read fitness articles from celebrity fitness trainers',
// 						city: city.slug,
// 						popular_finders: homepageData.popular_finders,
// 						blogs: homepageData.recent_blogs,
// 						collections: homepageData.collections,
// 						footer: footerData
// 					})
// 				}
// 			})