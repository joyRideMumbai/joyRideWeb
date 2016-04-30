var express = require('express'),
    router = express.Router(),
    request = require('request'),
    lodash = require('lodash');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/keywordsearch/:city/:keyword/:category?/:regions?/:facilities?/:offerings?/:price_range?', function(req, res, next) {
    // JSON.stringify(req.params);
    console.log('keyword search');
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);

    req.app.setcurrentcity(res, req, req.params.city, function(curcity) {

        var query = { regions: [], category: [] };
        query.key = req.params.keyword.replace(/-/g, ' ');
        query.city = curcity.name.toLowerCase();
        if (req.params.category !== undefined) {
            query.category.push(req.params.category.replace(/-/g, ' '));
        }
        if (req.params.regions !== undefined) {
            query.regions = query.regions.concat(splitandReplace(req.params.regions));
        }
        query.from = 0;
        query.size = 10;
        var options = {
            url: 'https://a1.fitternity.com/keywordsearchwebv1',
            'method': 'POST',
            'body': JSON.stringify(query)
        };
        var query1 = {};
        if ((req.params.category === undefined)||(req.params.category === "fitness")) {
            query1.category = "fitness studios";
        } else {
            query1.category = req.params.category.replace(/-/g,' ');
        }
        console.log(query);
        var metadata1 = 'Find Gyms, Yoga, Pilates, Zumba and Fitness Classes in ' + query.city.toUpperCase() + ' - ' + query.key.toUpperCase();
        var footerpath = 'https://a1.fitternity.com/footer/' + curcity.slug;
        var options2 = {
            url: 'https://a1.fitternity.com/getsearchmetadata',
            'method': 'POST',
            'body': JSON.stringify(query1)
        };
        request(options, function(error, response, body) {

            if (!error && response.statusCode == 200) {
                var searchresults = JSON.parse(body);
                var footerpath = 'https://a1.fitternity.com/footer/' + curcity.slug;
                console.log('body here');
                request(footerpath, function(error, response, body1) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body1);
                        console.log(data);
                        request(options2, function(err, resp, bod) {
                            if (!err) {
                                var metadata = JSON.parse(bod);                               
                                var metadata1 = "";
                                var metadata2 = "";
                                if ((metadata.meta_title !== null) && (metadata.meta_description !== null)) {
                                    metadata1 = metadata.meta_title.replace(/Mumbai/g, '');
                                    metadata2 = metadata.meta_description.replace(/Mumbai/g, '');
                                    if ((query.regions !== undefined) && (query.regions.length !== 0)) {
                                        metadata1 = metadata1 + ' and ' + query.regions.join(',') + ' and' + req.params.city;
                                        metadata2 = metadata2 + ' and ' + query.regions.join(',') + ' and' + req.params.city;
                                    }
                                }
                                console.log(metadata1, metadata2, 'meta');
                                res.render('./search/searchresults', {
                                    title: metadata1,
                                    description: metadata2,
                                    results: searchresults.results.resultlist,
                                    aggs: JSON.stringify(searchresults.results.aggregationlist),
                                    query: JSON.stringify(query),
                                    currentcity: curcity,
                                    metasearch: JSON.stringify(searchresults.meta)
                                });


                            }
                        });
                    }
                });
            }
        });
    });
});

function replaceCommon(field) {
    field = field.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ",");
    field = field.replace(/-/g, ' ');
    return field;
}

function splitandReplace(field) {
    field = field.split('+');
    var chosen = [];
    lodash.each(field, function(item) {
        chosen.push(item.replace(/-/g, ' '));
    });
    return chosen;
}

router.get('/:city/:category/:regions?/:facilities?/:offerings?/:price_range?/:from?/:sortfield?/:order?', function(req, res, next) {
    var ses = req.app.getsessionid(res, req);
    var ref = req.app.getreferer(res, req, ses);
    // curcity = req.app.setcurrentcity(res, req, req.params.city);
    if (req.params.city == "components") {

    } else {
        req.app.setcurrentcity(res, req, req.params.city, function(curcity) {
            // Building query
            var query = {};

            // Category Handler
            query.category = (req.params.category === "fitness") ? "" : replaceCommon(req.params.category);

            // Regional Handler
            query.regions = ((req.params.regions !== "all") && (req.params.regions !== undefined)) ? splitandReplace(req.params.regions) : undefined;

            // Budget Handler
            query.budget = ((req.params.price_range !== "all") && (req.params.price_range !== undefined)) ? req.params.price_range.split('+') : undefined;

            // Budget Handler
            query.offerings = ((req.params.offerings !== "all") && (req.params.offerings !== undefined)) ? splitandReplace(req.params.offerings) : undefined;

            // Budget Handler
            query.facilities = ((req.params.facilities !== "all") && (req.params.facilities !== undefined)) ? splitandReplace(req.params.facilities) : undefined;

            // Offset Handler
            query.offset = {
                from: (req.params.from !== undefined) ? req.params.from : 0,
                number_of_records: 10
            };

            query.location = {
                city: curcity.name
            }

            // Sort Handler
            query.sort = {
                sortfield: (req.params.sortfield !== undefined) ? req.params.sortfield : 'popularity',
                order: (req.params.order !== undefined) ? req.params.order : 'desc'
            };
            var offeringHeader = getOfferingHeading(query.category.toLowerCase());
            var options1 = {
                url: 'https://a1.fitternity.com/search/getfinderresultsv2',
                'method': 'POST',
                'body': JSON.stringify(query),
                'dataType': 'json'
            };
            request(options1, function(error, response, body) {
                if (!error) {

                    var searchresults = JSON.parse(body);
                    console.log({ category: query.category });
                    var query1 = {};
                    if (req.params.category === "fitness") {
                        query1.category = "fitness studios";
                    } else {
                        query1.category = req.params.category;
                    }
                    var path = 'https://a1.fitternity.com/getsearchmetadata';
                    var options2 = {
                        url: 'https://a1.fitternity.com/getsearchmetadata',
                        'method': 'POST',
                        'body': JSON.stringify(query1)
                    };
                    request(options2, function(err, resp, bod) {
                        if (!err) {
                            var metadata = JSON.parse(bod);
                            console.log(metadata);
                            var metadata1 = "";
                            var metadata2 = "";
                            if ((metadata.meta_title !== null) && (metadata.meta_description !== null)) {
                                metadata1 = metadata.meta_title.replace(/Mumbai/g, '');
                                metadata2 = metadata.meta_description.replace(/Mumbai/g, '');
                                if ((query.regions !== undefined) && (query.regions.length !== 0)) {
                                    metadata1 = metadata1 + ' and ' + query.regions.join(',') + ' and' + query.location.city;
                                    metadata2 = metadata2 + ' and ' + query.regions.join(',') + ' and' + query.location.city;
                                }
                            }

                            res.render('mainsearch/searchresults', {
                                title: metadata1,
                                description: metadata2,
                                results: searchresults.results.resultlist,
                                aggs: JSON.stringify(searchresults.results.aggregationlist),
                                query: JSON.stringify(query),
                                currentcity: curcity,
                                metasearch: JSON.stringify(searchresults.meta),
                                offeringHead: offeringHeader
                            });
                        } else {
                            res.status(body.status || 500);
                            res.send(body.message);
                        }
                    });
                } else {
                    res.status(body.status || 500);
                    res.send(body.message);
                }
            });
        });
    }
});


var getOfferingHeading = function(cat) {
    var heading = "";
    switch (cat.toLowerCase()) {
        case 'gyms':
            heading = "Amenties";
            break;
        case 'yoga':
            heading = "Types of Yoga";
            break;
        case 'zumba':
            heading = "Types of Zumba";
            break;
        case 'cross functional training':
            heading = "Types of Functional Training";
            break;
        case 'dance':
            heading = "Types of Dance";
            break;
        case 'fitness studios':
            heading = "";
            break;
        case 'crossfit':
            heading = "Amenties";
            break;
        case 'kick boxing':
            heading = "";
            break;
        case 'pilates':
            heading = "Types of Pilates";
            break;
        case 'mma and kick boxing':
            heading = "Types of Martial Arts";
            break;
        case 'healthy tiffins':
        case 'healthy snacks and beverages':
            heading = "Offerings";
            break;
        case 'marathon training':
            heading = "Types of Marathon Training";
            break;
        case 'swimming':
            heading = "Amenties";
            break;
        case 'dietitians and nutritionists':
            heading = "Types of Diet Consulting";
            break;
        case 'spinning and indoor cycling':
            heading = "";
            break;
        case 'personal trainers':
            heading = "Personal Training Services";
            break;
        case 'sport nutrition supliment stores':
            heading = 'Offerings';
            break;

    }
    return heading;
}
