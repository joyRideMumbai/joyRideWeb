var express = require('express'),
    router = express.Router();
request = require('request');
async = require('async');
module.exports = function(app) {
    app.use('/', router);
};

router.get('/membership-success/:id?', function(req, res) {
	captureid = req.params.id;
	console.log(captureid);
	 var path = 'https://a1.fitternity.com/getcapturedetail/'+captureid;
        var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
        async.parallel({
            capturedata: function(callback){
                request(path, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        console.log(order);
                        callback(null, order);
                    }
                    else{
                    	console.log(error);
                    	callback(error, null);
                    }
                })
            },
            collectiondata: function(callback){
                request(collectionpath, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        callback(null, order);
                    }
                    else{
                    	callback(error, null);
                    }
                })
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(404).render('404');
            } else {
            	res.render('successpage/membership-success', {
					title: 'Membership Success | Fitternity',
					collections: result.collectiondata.collections,
					order: result.capturedata.capture,
					type: "fakebuy"
				})
            }
        })
});

router.get('/membershipcod-success/:id?', function(req, res) {
	orderid = req.params.id;
	console.log(orderid);
	 var path = 'https://a1.fitternity.com/orderdetail/'+orderid;
        var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
        async.parallel({
            orderdata: function(callback){
                request(path, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        console.log(order);
                        callback(null, order);
                    }
                    else{
                    	console.log(error);
                    	callback(error, null);
                    }
                })
            },
            collectiondata: function(callback){
                request(collectionpath, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        callback(null, order);
                    }
                    else{
                    	callback(error, null);
                    }
                })
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(404).render('404');
            } else {
            	res.render('successpage/membership-success', {
					title: 'Membership Success | Fitternity',
					collections: result.collectiondata.collections,
					order: result.orderdata.orderdata,
					type: "cod"
				})
            }
        })
});

// router.get('/paymentsuccess', function(req, res, next) {
//         var order = req.body;
//         // var path = 'https://a1.fitternity.com/orderdetail/'+order.txnid.substr(3)
//         var path = 'https://a1.fitternity.com/orderdetail/20819';
//         var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
//         async.parallel({
//             orderdata: function(callback){
//                 request(path, function(error, response, body) {
//                     if (!error && response.statusCode == 200) {
//                         var order = JSON.parse(body);
//                         console.log(order);
//                         callback(null, order);
//                     }
//                 })
//             },
//             collectiondata: function(callback){
//                 request(collectionpath, function(error, response, body) {
//                     if (!error && response.statusCode == 200) {
//                         var order = JSON.parse(body);
//                         callback(null, order);
//                     }
//                 })
//             }
//         }, function(err, result) {
//             if (err) {
//                 console.log(err);
//                 res.status(404).render('404');
//             } else {
//                 res.render("successpage/paymentsuccess", {
//                     response: {
//                         status: order.status
//                             // status: "fail"
//                     },
//                     order: result.orderdata.orderdata,
//                     collections: result.collectiondata.collections
//                 })
//             }
//         })
//     })


// Payment Success
router.post('/paymentsuccess', function(req, res, next) {
        var order = req.body;
        console.log("*****************"+order+"**************");
        var path = 'https://a1.fitternity.com/orderdetail/'+order.txnid.substr(3)
        // var path = 'https://a1.fitternity.com/orderdetail/20819';
        var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
        async.parallel({
            orderdata: function(callback){
                request(path, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var orderbody = JSON.parse(body);
                        console.log(orderbody);
                        var orderdata1 = {
                            "order_id" : order.txnid.substr(3),
                            "status" : order.status,
                            "customer_name" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_name,
                            "customer_email" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_email,
                            "customer_phone" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_phone,
                            "error_Message" : "",
                            "finder_id" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.finder_id,
                            "service_name" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.service_name,
                            "amount": orderbody.orderdata == undefined ? "" : orderbody.orderdata.amount
                        }
                        console.log(orderdata1);
                        var options = {
                            url: 'https://a1.fitternity.com/capturepayment',
                            'method': 'POST',
                            'body': JSON.stringify(orderdata1)
                        };
                        if(order.status == "success"){
                            request(options, function(error, response, body) {
                                callback(null, orderbody);
                            })
                        }else{
                            callback(null, orderbody);
                        }
                    }
                })
            },
            collectiondata: function(callback){
                request(collectionpath, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        callback(null, order);
                    }
                })
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(404).render('404');
            } else {
                res.render("successpage/paymentsuccess", {
                    response: {
                        status: order.status,
                            // status: "fail"
                    },
                    order: result.orderdata.orderdata,
                    collections: result.collectiondata.collections,
                })
            }
        })
    })


    // Paid Trial success
    router.post('/paymentsuccesstrial', function(req, res, next) {
        var order = req.body;
        var path = 'https://a1.fitternity.com/orderdetail/'+order.txnid.substr(3)
        // var path = 'https://a1.fitternity.com/orderdetail/20819';
        var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
        async.parallel({
            orderdata: function(callback){
                request(path, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var orderbody = JSON.parse(body);
                        console.log(orderbody);
                        var orderdata1 = {
                            "order_id" : order.txnid.substr(3),
                            "status" : order.status,
                            "customer_name" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_name,
                            "customer_email" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_email,
                            "customer_phone" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_phone,
                            "customer_id" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_id == undefined ? "" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_id,
                            "customer_location" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.customer_location,
                            "device_id": null,
                            "error_Message" : "",
                            "finder_id" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.finder_id,
                            "premium_session": true,
                            "service_name" : orderbody.orderdata == undefined ? "" : orderbody.orderdata.service_name,
                            "schedule_date": orderbody.orderdata == undefined ? "" : orderbody.orderdata.schedule_date,
                            "schedule_slot": orderbody.orderdata == undefined ? "" : orderbody.orderdata.schedule_slot,
                            "amount": orderbody.orderdata == undefined ? "" : orderbody.orderdata.amount
                        }
                        console.log(orderdata1);
                        var options = {
                            url: 'https://a1.fitternity.com/storebooktrial',
                            'method': 'POST',
                            'body': JSON.stringify(orderdata1)
                        };
                        if(order.status == "success"){
                            request(options, function(error, response, body) {
                                console.log(body);
                                callback(null, orderbody);
                            })
                        }else{
                            callback(null, orderbody);
                        }
                    }
                })
            },
            collectiondata: function(callback){
                request(collectionpath, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        callback(null, order);
                    }
                })
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(404).render('404');
            } else {
                res.render("successpage/payment-trial-success", {
                    response: {
                        status: order.status
                            // status: "fail"
                    },
                    order: result.orderdata.orderdata,
                    collections: result.collectiondata.collections
                })
            }
        })
    })



    // Auto trial
    router.get('/autobooktrial-success/:id?', function(req, res) {
    captureid = req.params.id;
    console.log(captureid);
     var path = 'https://a1.fitternity.com/booktrialdetail/'+captureid;
        var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
        async.parallel({
            capturedata: function(callback){
                request(path, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        console.log(order);
                        callback(null, order);
                    }
                    else{
                        console.log(error);
                        callback(error, null);
                    }
                })
            },
            collectiondata: function(callback){
                request(collectionpath, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        callback(null, order);
                    }
                    else{
                        callback(error, null);
                    }
                })
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(404).render('404');
            } else {
                res.render('successpage/trial-success', {
                    title: 'Membership Success | Fitternity',
                    collections: result.collectiondata.collections,
                    order: result.capturedata.booktrial,
                    type: "auto"
                })
            }
        })
});

    // Manual trial
    router.get('/booktrial-success/:id?', function(req, res) {
    captureid = req.params.id;
    console.log(captureid);
     var path = 'https://a1.fitternity.com/booktrialdetail/'+captureid;
        var collectionpath = 'https://a1.fitternity.com/getcollecitonnames/mumbai';
        async.parallel({
            capturedata: function(callback){
                request(path, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        console.log(order);
                        callback(null, order);
                    }
                    else{
                        console.log(error);
                        callback(error, null);
                    }
                })
            },
            collectiondata: function(callback){
                request(collectionpath, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var order = JSON.parse(body);
                        callback(null, order);
                    }
                    else{
                        callback(error, null);
                    }
                })
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(404).render('404');
            } else {
                res.render('successpage/trial-success', {
                    title: 'Membership Success | Fitternity',
                    collections: result.collectiondata.collections,
                    order: result.capturedata.booktrial,
                    type: "manual"
                })
            }
        })
});