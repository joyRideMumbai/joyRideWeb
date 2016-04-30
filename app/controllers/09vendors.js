var express = require('express'),
    router = express.Router(),
    request = require('request'),
    chalk = require('chalk');
lodash = require('lodash');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/:slug/:booktrialid?', function(req, res) {
    // res.send(req.params.slug);
    var path = 'https://a1.fitternity.com/finderdetail/' + req.params.slug;
    // res.get('X-Frame-Options');
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    request(path, function(error, response, body) {
        // Getting Status of the Resource
        if (!error && response.statusCode == 200) {
            var vendor = JSON.parse(body);        
            var recentVendorData = {
                slug : vendor.finder.slug,
                location : vendor.finder.location,
                title : vendor.finder.title                
            };
            if (vendor.statusfinder == 404) {
                if (req.params.booktrialid == undefined) {
                    res.redirect(301, '/' + vendor.finder);
                } else {
                    res.redirect(302, '/' + vendor.finder + '/' + req.params.booktrialid);
                }
            } else {
                req.app.setcurrentcity(res, req, vendor.finder.city.slug, function(city) {
                    var type = "gym";
                    // The Types of vendor pages are as follow
                    // 1. Gyms
                    // 2. Studions ( Group Classes )
                    // 3. Individuals
                    // 4. Channel Partners
                    // 5. Healthy Food
                    var cat = vendor.finder.category._id;
                    switch (cat) {
                        case 5:
                            type = "gym";
                            break;
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                            type = "studio";
                            break;
                        case 10:
                            type = "swimming";
                            break;
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                            type = "studio";
                            break;
                        case 25:
                        case 26:
                            type = "individual";
                            break;
                        case 32:
                        case 35:
                        case 36:
                            type = "studio";
                            break;
                        case 40:
                            // type = "partner";
                            type = "swimming";
                            break;
                        case 41:
                            type = "individual";
                            break;
                        case 42:
                            type = "healthyfood";
                            break;
                        case 43:
                            type = "studio";
                            break;
                        case 44:
                            type = "gym";
                            break;
                        case 45:
                            type = "healthyfood";
                            break;
                        case 46:
                            type = "store";
                            break;    
                        default:
                            type = "gym";
                            break;
                    };

                    // Inbuilt Facilities
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
                    lodash.forEach(vendor.finder.facilities, function(data) {
                        facilities.push(data.slug);
                    });

                    // Check if ratecard should exist
                    // var numberofservices = 0;
                    // vendor.finder.ratecardservice = [];
                    // while (numberofservices < vendor.finder.services.length) {
                    //     var trialobj = lodash.where(vendor.finder.services[numberofservices].serviceratecard, {
                    //         'type': 'trial'
                    //     })
                    //     if (vendor.finder.services[numberofservices].serviceratecard.length > 0) {
                    //         vendor.finder.ratecardservice.push(vendor.finder.services[numberofservices]);
                    //     }
                    //     // console.log("ksdhfkshfkhskfhksfhksf",vendor.finder.ratecardservice);
                    //     if (trialobj.length > 0) {
                    //         lodash.remove(vendor.finder.services[numberofservices].serviceratecard, function(n) {
                    //             return n.type == 'trial';
                    //         })
                    //         trialobj[0].duration = '1 Trial Session';
                    //         vendor.finder.services[numberofservices].serviceratecard.unshift(trialobj[0]);
                    //         // console.log(trialobj);
                    //     }
                    //     numberofservices++;
                    // }

                    var today = new Date();
                    var schedulepath = 'https://a1.fitternity.com/gettrialschedule/' + vendor.finder._id + '/' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
                    request(schedulepath, function(error, response, body) {
                        var schedules = JSON.parse(body);
                        var d = new Date();
                        var hour = d.getHours();
                        var minute = d.getMinutes();
                        var time = hour + ":" + minute;
                        res.render('vendor/vendor', {
                            vendor: vendor.finder,
                            nearby_same: vendor.nearby_same_category,
                            nearby_other: vendor.nearby_other_category,
                            type: type,
                            fixedfacilities: fixedfacilities,
                            facilities: facilities,
                            schedules: schedules,
                            definations: vendor.defination,
                            recentVendorSlug: vendor.finder.slug,
                             recentVendorTitle: vendor.finder.title,
                              recentVendorLocation: vendor.finder.location.name,
                              time:time
                        });
                    });
                });
            }

        } else {
            res.redirect(404);
        }
    });
});