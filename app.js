require('newrelic');
var express = require('express'),
    cors = require('cors'),
    redirect = require("express-redirect"),
    config = require('./config/config'),
    xFrameOptions = require('x-frame-options'),
    request = require('request');
cookieParser = require('cookie-parser');
var app = express();
var helper = require('./helpers.js');
var uuid = require('node-uuid');
var chalk = require('chalk');
var geoip2ws = require('geoip2ws')('107924', 'WQCNsxQLxyPU');
app.use(xFrameOptions());
app.use(cors());
app.use(express.static('public'));
redirect(app);

// The Basic Redirects
app.redirect("/index.html", ".", 301);
app.redirect("/index.php", "/", 301);

// Search Redirects
// app.redirect("/mumbai/fitness", "/mumbai/fitness/all/all/all/all", 301);
// app.redirect("/mumbai/gyms", "/mumbai/gyms/all/all/all/all", 301);
// app.redirect("/mumbai/yoga", "/mumbai/yoga/all/all/all/all", 301);
// app.redirect("/mumbai/pilates", "/mumbai/pilates/all/all/all/all", 301);
// app.redirect("/mumbai/dance", "/mumbai/dance/all/all/all/all", 301);
// app.redirect("/mumbai/zumba", "/mumbai/zumba/all/all/all/all", 301);
// app.redirect("/mumbai/martial-arts", "/mumbai/martial-arts/all/all/all/all", 301);
// app.redirect("/mumbai/kick-boxing", "/mumbai/kick-boxing/all/all/all/all", 301);
// app.redirect("/mumbai/swimming", "/mumbai/swimming/all/all/all/all", 301);
// app.redirect("/mumbai/spinning-and-indoor-cycling", "/mumbai/spinning-and-indoor-cycling/all/all/all/all", 301);
// app.redirect("/mumbai/personal-trainers", "/mumbai/personal-trainers/all/all/all/all", 301);
// app.redirect("/mumbai/dietitians-and-nutritionists", "/mumbai/dietitians-and-nutritionists/all/all/all/all", 301);
// app.redirect("/mumbai/physiotherapists", "/mumbai/physiotherapists/all/all/all/all", 301);
// app.redirect("/mumbai/crossfit", "/mumbai/crossfit/all/all/all/all", 301);
// app.redirect("/mumbai/cross-functional-training", "/mumbai/cross-functional-training/all/all/all/all", 301);
// app.redirect("/mumbai/marathon-training", "/mumbai/marathon-training/all/all/all/all", 301);
// app.redirect("/mumbai/sports", "/mumbai/sports/all/all/all/all", 301);
// app.redirect("/mumbai/healthy-tiffins", "/mumbai/healthy-tiffins/all/all/all/all", 301);
// app.redirect("/mumbai/healthy-snacks-and-beverages", "/mumbai/healthy-snacks-and-beverages/all/all/all/all", 301);
// app.redirect("/pune/fitness", "/pune/fitness/all/all/all/all", 301);
// app.redirect("/pune/gyms", "/pune/gyms/all/all/all/all", 301);
// app.redirect("/pune/yoga", "/pune/yoga/all/all/all/all", 301);
// app.redirect("/pune/pilates", "/pune/pilates/all/all/all/all", 301);
// app.redirect("/pune/dance", "/pune/dance/all/all/all/all", 301);
// app.redirect("/pune/zumba", "/pune/zumba/all/all/all/all", 301);
// app.redirect("/pune/martial-arts", "/pune/martial-arts/all/all/all/all", 301);
// app.redirect("/pune/kick-boxing", "/pune/kick-boxing/all/all/all/all", 301);
// app.redirect("/pune/spinning-and-indoor-cycling", "/pune/spinning-and-indoor-cycling/all/all/all/all", 301);
// app.redirect("/pune/cross-functional-training", "/pune/cross-functional-training/all/all/all/all", 301);
// app.redirect("/pune/crossfit", "/pune/crossfit/all/all/all/all", 301);
// app.redirect("/bangalore/swimming", "/bangalore/swimming/all/all/all/all", 301);
// app.redirect("/bangalore/pilates", "/bangalore/pilates/all/all/all/all", 301);
// app.redirect("/bangalore/gyms-studios", "/bangalore/gyms-studios/all/all/all/all", 301);
// app.redirect("/bangalore/gyms", "/bangalore/gyms/all/all/all/all", 301);
// app.redirect("/bangalore/yoga", "/bangalore/yoga/all/all/all/all", 301);
// app.redirect("/bangalore/dance", "/bangalore/dance/all/all/all/all", 301);
// app.redirect("/bangalore/martial-arts", "/bangalore/martial-arts/all/all/all/all", 301);
// app.redirect("/bangalore/zumba", "/bangalore/zumba/all/all/all/all", 301);
// app.redirect("/bangalore/kick-boxing", "/bangalore/kick-boxing/all/all/all/all", 301);
// app.redirect("/bangalore/spinning-and-indoor-cycling", "/bangalore/spinning-and-indoor-cycling/all/all/all/all", 301);
// app.redirect("/bangalore/crossfit", "/bangalore/crossfit/all/all/all/all", 301);
// app.redirect("/bangalore/cross-functional-training", "/bangalore/cross-functional-training/all/all/all/all", 301);
// app.redirect("/bangalore/healthy-tiffins", "/bangalore/healthy-tiffins/all/all/all/all", 301);
// app.redirect("/bangalore/physiotherapists", "/bangalore/physiotherapists/all/all/all/all", 301);
// app.redirect("/bangalore/sports", "/bangalore/sports/all/all/all/all", 301);
// app.redirect("/bangalore/personal-trainers", "/bangalore/personal-trainers/all/all/all/all", 301);
// app.redirect("/bangalore/marathon-training", "/bangalore/marathon-training/all/all/all/all", 301);
// app.redirect("/bangalore/aerobics", "/bangalore/aerobics/all/all/all/all", 301);
// app.redirect("/bangalore/dietitians-and-nutritionists", "/bangalore/dietitians-and-nutritionists/all/all/all/all", 301);
// app.redirect("/bangalore/fitness-studios", "/bangalore/fitness-studios/all/all/all/all", 301);

// The Redirects End
app.locals.moment = require('moment');
require('./config/express')(app, config);
app.listen(config.port);
app.use(cookieParser());
app.set('currentcity', "");
app.set('userid', "");
app.set('setreferer', "");
app.set('referer', "");
app.set('visitsession', "");
app.set('sessioncookie', "");

app.set('citylist', [{
    name: 'Mumbai',
    id: 1,
    slug: 'mumbai'
}, {
    name: 'Pune',
    id: 2,
    slug: 'pune'
}, {
    name: 'Bangalore',
    id: 3,
    slug: 'bangalore'
}, {
    name: 'Delhi',
    id: 4,
    slug: 'delhi'
}, {
    name: 'Gurgaon',
    id: 8,
    slug: 'gurgaon'
}]);

app.set('cities', ['mumbai', 'pune', 'bangalore', 'bengaluru', 'delhi', 'new delhi', 'gurgaon'])

// Get Client Ip Address
app.getClientIp = function(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        // If request was not forwarded
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

// Set City 
app.setcurrentcity = function(res, req, city,callback) {
    console.log(city,callback);
    switch (city) {
        case 'mumbai':
            var y = req.app.get('citylist')[0];
            req.app.set("currentcity");
            res.cookie('chosencity', y.name);
            res.cookie('currentcity', y);
            break;
        case 'pune':
            var y = req.app.get('citylist')[1];
            req.app.set("currentcity");
            res.cookie('chosencity', y.name);
            res.cookie('currentcity', y);
            break;
        case 'bengaluru':
        case 'bangalore':
            var y = req.app.get('citylist')[2];
            req.app.set("currentcity");
            res.cookie('chosencity', y.name);
            res.cookie('currentcity', y);
            break;
        case 'delhi':
        case 'new delhi':
            var y = req.app.get('citylist')[3];
            req.app.set("currentcity");
            res.cookie('chosencity', y.name);
            res.cookie('currentcity', y);
            break;
        case 'gurgaon':
            var y = req.app.get('citylist')[4];
            req.app.set("currentcity");
            res.cookie('chosencity', y.name);
            res.cookie('currentcity', y);
            break;
        // default:
        //     var y = req.app.get('citylist')[0];
        //     req.app.set("currentcity");
        //     res.cookie('chosencity', y.name);
        //     res.cookie('currentcity', y);
    }
    callback(y);
}


// Getting the current city from cookie
app.getcurrentcity = function(res, req, callback) {
    var x = req.cookies;
    if (x.currentcity === undefined) {
        // Find the requester IP address
        var ip = req.app.getClientIp(req);
        // Check if its dev env
        console.log(ip);
        if (ip === "::1") {
            var y = req.app.get('citylist')[0];
            req.app.set("currentcity");
            res.cookie('currentcity', y);
            res.cookie('chosencity', y.name);
            callback(y);
        } else {
            // Our list of cities
            var ourcities = req.app.get('cities');
            // Get geo ip
            req.app.geoip(ip, res, req, function(resp){
                var fetchedcity = resp;
                // Check if its a part of our list
                console.log("ourcities",ourcities," : fetchedcity : ",fetchedcity);
                if (ourcities.indexOf(fetchedcity.toLowerCase()) > -1) {
                    // If yes set the cookies of the requested city
                    req.app.setcurrentcity(res, req, fetchedcity.toLowerCase(), callback);
                } else {
                    // Else set mumbai
                    var y = req.app.get('citylist')[0];
                    req.app.set("currentcity");
                    res.cookie('currentcity', y);
                    res.cookie('chosencity', y.name);
                    res.cookie('showcitypop', true);
                    res.cookie('origincity', fetchedcity);
                    callback(y);
                }
            });
        }
    } else {
        // if the city cookie already exists : return it
        res.cookie('showcitypop', false);
        res.cookie('chosencity', x.currentcity.name);
        console.log(x.currentcity);
        callback(x.currentcity);
    }
}

app.geoip = function(ip, res, req, callback) {
    // Ask for the requester IP
    geoip2ws(ip, function(err, data) {
        if (err) {
            // If Maxmind throws an error. Log it
            console.log("-0-0-0-0-0-");
            console.log(err);
            console.log("-0-0-0-0-0-");
            var y = req.app.get('citylist')[0];
            req.app.set("currentcity");
            res.cookie('chosencity', y.name);
            res.cookie('currentcity', y);
            res.cookie('showcitypop', true);
            callback(y.name);
        } else {
            // If no error is found return the name of the city
            console.log(data);
            var gotcity = data.city != undefined ? data.city.names.en : "mumbai";
            callback(gotcity);
        }
    });
}

// Get the user-id (assigned dynamically - a temporary idetifier)
app.getsessionid = function(res, req) {
    var x = req.cookies;
    if ((x.userid === undefined) && (req.headers['user-agent'].indexOf('bot') === -1)) {
        var y = uuid.v4();
        req.app.set("userid");
        var epochdate = new Date(2020, 6, 26, 0, 0, 0, 0);
        res.cookie('userid', y, { expires: epochdate });
        // res.cookie('city','Mumbai');       
        return y;
    } else {
        return x.userid;
    }
}

// Get who the referrer is
app.getreferer = function(res, req, ses) {
    // Getting all the cookies
    var x = req.cookies;
    if ((x.sessioncookie === undefined) && (req.headers['user-agent'].indexOf('bot') === -1)) {
        var session_id = uuid.v4();
        req.app.set('sessioncookie');
        res.cookie('sessioncookie', {
            setreferer: 'y',
            referer: req.headers.referer,
            visitsession: session_id
        }, {
            maxage: 3600000
        });
        var subdoc = helper.getutmsubdocument((req.headers.referer !== undefined) ? req.headers.referer.toLowerCase() : '', (req.url !== undefined ? req.url.toLowerCase() : ''));
        var sessionobject = {
            event_id: 'sessionstart',
            referer: req.headers.referer,
            userid: ses,
            page: req.url,
            visitsession: session_id,
            utm: subdoc
        };
        var options = {
            headers: { 'content-type': 'application/json' },
            url: 'https://a1.fitternity.com/pushkyuevent',
            method: 'POST',
            body: JSON.stringify(sessionobject)
        };
        request.post(options, function(error, response, body) {});
        return 'y';
    } else {
        return x.sessioncookie;
    }
}

// app._router.stack.forEach(function(r){
//   if (r.route && r.route.path){
//     console.log("r.route.path -------------------",r.route.path", --------------");
//   }
// })
