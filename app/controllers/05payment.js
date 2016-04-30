var express = require('express'),
    router = express.Router();
request = require('request');
payu = require('payuexpress');
async = require('async');
module.exports = function(app) {
    app.use('/', router);
};

router.post('/payment', function(req, res, next) {
    var user = req.body;
    // Live Settings
    var payucred = {
            'key': "l80gyM",
            'salt': "QBl78dtK"
        }
        // Test Settings
    // var payucred = {
    //     'key': "gtKFFx",
    //     'salt': "eCwWELxi"
    // }
    var order = {
        'firstname': user.firstname,
        'lastname': "",
        'key': payucred.key,
        'txnid': user.txnid,
        'orderid': user.orderid,
        'phone': user.phone,
        'productinfo': user.productinfo,
        'amount': user.amount,
        'successurl': user.successurl,
        'cancelurl': user.cancelurl,
        'failurl': user.successurl,
        'city': user.city == undefined ? '' : user.city,
        'email': user.email,
        'udf1': user.service_name == undefined ? "" : user.service_name,
        'udf2': user.schedule_date == undefined ? "" : user.schedule_date,
        'udf3': user.schedule_slot == undefined ? "" : user.schedule_slot,
        'udf4': user.finderid = undefined ? "" : user.finderid,
        'udf5': user.cloc = undefined ? "" : user.cloc,
        'salt': payucred.salt
    };
    var hash = payu.createHash(order.key, order.txnid, order.amount, order.productinfo, order.firstname, order.email, order.udf1, order.udf2, order.udf3, order.udf4, order.udf5, order.salt);
    console.log("order and hash", order);
    res.render('payment/payment', {
        card: order,
        secret: hash
    });
});

//  IOS
router.post('/mobilemembershipsuccess', function(req, res, next) {
    console.log(req.body);
    res.render('paymentpages/mobilemembershipsuccess', {
        response: req.body
    });
})
router.post('/mobilebooktrialpaymentsuccess', function(req, res, next) {
    console.log(req.body);
    res.render('paymentpages/mobilebooktrialpaymentsuccess', {
        response: req.body
    });
})
router.get('/mobilepayment/:name/:phone/:email/:city/:productinfo/:service/:amount/:txnid/:orderid/:successurls/:duration?/:schedule_date?/:schedule_slot?/:finderid?/:cloc?', function(req, res, next) {
    // Live settings
    var payucred = {
            'key': "l80gyM",
            'salt': "QBl78dtK"
        }
        // Test Settings
        // var payucred = {
        //     'key': "gtKFFx",
        //     'salt': "eCwWELxi"
        // }
    var order = {
        'firstname': req.param('name'),
        'lastname': "",
        'key': payucred.key,
        'txnid': req.param('txnid'),
        'orderid': req.param('orderid'),
        'phone': req.param('phone'),
        'productinfo': req.param('productinfo') + req.param('duration'),
        'amount': req.param('amount'),
        'successurl': req.param('successurls') == 'membership' ? 'http://www.fitternity.com/mobilemembershipsuccess' : 'http://www.fitternity.com/mobilebooktrialpaymentsuccess',
        'cancelurl': req.param('successurls') == 'membership' ? 'http://www.fitternity.com/mobilemembershipsuccess' : 'http://www.fitternity.com/mobilebooktrialpaymentsuccess',
        'failurl': req.param('successurls') == 'membership' ? 'http://www.fitternity.com/mobilemembershipsuccess' : 'http://www.fitternity.com/mobilebooktrialpaymentsuccess',
        'city': req.param('city'),
        'email': req.param('email'),
        'udf1': req.param('productinfo') == undefined ? "" : req.param('productinfo'),
        'udf2': req.param('schedule_date') == undefined ? "" : req.param('schedule_date'),
        'udf3': req.param('schedule_slot') == undefined ? "" : req.param('schedule_slot'),
        'udf4': req.param('finderid') == undefined ? "" : req.param('finderid'),
        'udf5': req.param('cloc') == undefined ? "" : req.param('cloc'),
        'salt': payucred.salt
    };
    var hash = payu.createHash(order.key, order.txnid, order.amount, order.productinfo, order.firstname, order.email, order.udf1, order.udf2, order.udf3, order.udf4, order.udf5, order.salt);
    console.log("yo", order);
    res.render('paymentpages/mobilepayment', {
        card: order,
        secret: hash
    });
});

router.get('/paymentlink/:orderid', function(req, res, next) {
    console.log(req.body);
    var id = req.param('orderid');
    var path = 'https://a1.fitternity.com/orderdetail/' + id;
    // Live Settings
    var payucred = {
        'key': "l80gyM",
        'salt': "QBl78dtK"
    }
    var successpath = "https://www.fitternity.com/paymentsuccess";
    // var successpath = "http://localhost:3000/paymentsuccess";
    // var successpath = "http://apistg.fitn.in:8020/paymentsuccess";
    // var payucred = {
    //     'key': "gtKFFx",
    //     'salt': "eCwWELxi"
    // }

    request(path, function(error, response, body) {
        var resp = JSON.parse(body);
        var order = resp.orderdata;
        var y = '{ "trial": "payonline", "finder": "' + order.finder_name.replace(/'/g, "") + '", "category": 1, "address": "' + order.finder_address.replace(/'/g, "") + '", "membership": " ' + order.service_name_purchase.replace(/'/g, "") + ' " }';
        req.app.set("membership");
        res.cookie('membership', y);
        console.log(resp, y);
        var order = {
            'firstname': order.customer_name,
            'lastname': "",
            'key': payucred.key,
            'txnid': 'Fit' + id,
            'orderid': id,
            'phone': order.customer_phone,
            'productinfo': order.service_name_purchase + " - " + order.finder_name,
            'amount': order.amount,
            'successurl': successpath,
            'cancelurl': successpath,
            'failurl': successpath,
            'city': order.city_id == undefined ? '' : order.city_id,
            'email': order.customer_email,
            'udf1': order.service_name == undefined ? "" : order.service_name,
            'udf2': order.schedule_date == undefined ? "" : order.schedule_date,
            'udf3': order.schedule_slot == undefined ? "" : order.schedule_slot,
            'udf4': order.finder_id = undefined ? "" : order.finderid,
            'udf5': order.address = undefined ? "" : order.address,
            'salt': payucred.salt
        };
        var hash = payu.createHash(order.key, order.txnid, order.amount, order.productinfo, order.firstname, order.email, order.udf1, order.udf2, order.udf3, order.udf4, order.udf5, order.salt);
        console.log("order and hash", order);
        res.render('payment/payment', {
            card: order,
            secret: hash
        });
    })

});