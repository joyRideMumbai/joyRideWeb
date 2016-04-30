// View Map sections
var getBudgetFilterVal = function(key) {
    if(key !== undefined){
        switch (key.toLowerCase()) {
            case '7500-15000':
                value = 'five';
                break;
            case '5000-7500':
                value = 'four';
                break;
            case 'less than 1000':
                value = 'one';
                break;
            case '15000 & above':
                value = 'six';
                break;
            case '2500-5000':
                value = 'three';
                break;
            case '1000-2500':
                value = 'two';
                break;
        }
        return value;
    }
    return "";
};

if (window.innerWidth > 768) {

    var map = L.map('mapresults');
    var googleLayer = new L.Google('ROADMAP');
    map.addLayer(googleLayer);
}

// Mobile Filter Menu
$(function() {
    if (window.innerWidth < 768) {
        $('#filters').show();
        // The Click Options capture
        $('.filtermenu').on('click', 'li', function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            var ob = '#' + $(this).attr('data-sec');
            $('.optsecs').hide();
            $(ob).show();
        });

        var sidebar = $('#filters').slideReveal({
            width: '100%',
            zindex: 1000,
            top: 0,
            push: false,
            overlay: true,
            trigger: $("#toggfilters")
        });

        $('#closesidebar').on('click', function() {
            sidebar.slideReveal("hide");
        });
    }
});

$(function() {
    // Going back in time
    // window.onpopstate = function(e) {
    //     e.preventDefault();
    //     window.location.href = window.location.pathname;
    //     console.log("onpopstate");
    // };
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            window.location.href = window.location.pathname;
        }
    }, true);

    function pushSearchState(path) {

        var origin = window.location.origin;
        window.history.pushState("push", "search finders", origin + path);
    }

    // Loading the query on client side
    window.query = JSON.parse($('#query').attr('data-query'));
    window.params = JSON.parse($('#parameters').attr('data-params'));
    window.categoryselected = window.query.category;
    var offeringHeadFromServer = ($('#offeringHeading').attr('data-head'));

    //
    //

    // Building new query
    window.newquery = {};
    var searchcats = [];
    var temp = "";

    // Get city base categories
    var cc = window.query.location.city.toLowerCase();
    //
    switch (cc) {
        case 'mumbai':
            searchcats = window.mumbaiSearchCat;
            if (window.innerWidth > 768) {
                map.setView([19.1069627, 72.9650721], 10);
            }
            break;
        case 'pune':
            searchcats = window.puneSearchCat;
            if (window.innerWidth > 768) {
                map.setView([18.5097805, 73.8667996], 13);
            }
            break;
        case 'bangalore':
            searchcats = window.bangaloreSearchCat;
            if (window.innerWidth > 768) {
                map.setView([12.9985911, 77.6060609], 10);
            }
            break;
        case 'delhi':
            searchcats = window.delhiSearchCat;
            if (window.innerWidth > 768) {
                map.setView([28.5769823, 77.1774037], 13);
            }
            break;
        case 'gurgaon':
            searchcats = window.gurgaoncatfeature;
            if (window.innerWidth > 768) {
                map.setView([28.4595, 77.0266], 13);
            }
            break;
    }

    // Do the markers
    if (window.innerWidth > 768) {
        $.each($('.geofitdata'), function(key, data) {
            //
            // Getting Map Pointer

            L.marker([$(this).attr('data-lat'), $(this).attr('data-lon')]).addTo(map).bindPopup('<strong>' + $(this).attr('data-vendor').capitalize() + '</strong><br>' + $(this).attr('data-location').capitalize()).openPopup();
        });
        // Fitting coverimages to the cards
        $.each($('.result .mui-row'), function() {
            //
            $(this).children('.cover').css('min-height', $(this).height());
        });
    }


    var rengineer = function(payload) {
        var tmp = "";
        _.each(payload, function(data, i) {

            tmp = tmp.concat(data.replace(/ /g, '-'));
            if (i < (payload.length - 1)) {
                tmp = tmp + '+';
            }
        });
        return tmp;
    };

    window.makerequest = function() {
        // Getting checked category
        var cat = $('.categories input[name=category]').filter(':checked').val();
        console.log(cat, 'category here');
        var resetFlag = false;
        if (cat.toLowerCase() !== window.categoryselected.toLowerCase()) {
            resetFlag = true;
        }
       
            window.newquery.category = cat.replace(/ /g, '-').toLowerCase();
            //
            // Getting regions
            window.newquery.regions = $('input:checkbox:checked.location').map(function() {
                return this.value;
            }).get();
            // Getting primary filters
            if(!resetFlag){
                        window.newquery.facilities = $('input:checkbox:checked.primary').map(function() {
                            return this.value;
                        }).get();
                        // Getting secondary filters
                        window.newquery.offerings = $('input:checkbox:checked.secondary').map(function() {
                            return this.value;
                        }).get();}
            else{
                window.newquery.facilities = [];
                window.newquery.offerings = [];
            }
            // Getting budgets
            window.newquery.budget = $('input:checkbox:checked.budgetitem').map(function() {
                var value = getBudgetFilterVal(this.value);
                return value;
            }).get();

            window.newquery.trialdays = $('input:checkbox:checked.trial').map(function() {

                return this.value.toLowerCase();
            }).get();

            // check if any cluster is checked or unchecked

            window.newquery.clusters = $('input:checkbox:checked.cluster').map(function() {
                return this.value;
            }).get();

            if (window.newquery.clusters.length !== 0) {
                $.each(window.params.locationcluster, function(key, value) {
                    $.each(window.newquery.clusters, function(k, v) {
                        if (value.key.toLowerCase() === v.toLowerCase()) {
                            var keys = _.pluck(value.regions, 'key');
                            window.newquery.regions = _.union(window.newquery.regions, keys);
                        }
                    });
                });
            }
        

        var localRecent = JSON.parse(fitternity.fitLocalStorage.getlocal('recentsearch'));
        if (localRecent === null) {
            localRecent = [];
        }
        //get current city from the search

        var city = cc;
        var location = city;

        kyu1.pushevent('findersearch', { what: 'findersearch', dataobject: 'vendor', type: 'finder', page: 'search', city: cc, location: window.newquery.regions, category: window.newquery.category });
        if (window.newquery.regions.length !== 0) {

            location = window.newquery.regions[window.newquery.regions.length - 1];
            city = city.replace(/-/g, ' ').capitalize();

        }
        var catslug = window.newquery.category;

        if (cat.toLowerCase() === 'all fitness options') {
            catslug = 'fitness';
        }

        var slug = '/' + city.toLowerCase() + '/' + catslug + '/' + (location.toLowerCase() === city.toLowerCase() ? 'all' : location.replace(/ /g, '-').toLowerCase()) + '/all/all/all/0/popularity/desc';

        var localObject = { category: cat, location: location, slug: slug, key: cat + location };
        if (_.find(localRecent, function(x) {
                return x.key === cat + location;
            }) === undefined) {
            localRecent.unshift(localObject);
            localRecent = localRecent.slice(0, 5);
            fitternity.fitLocalStorage.setlocal('recentsearch', JSON.stringify(localRecent));
        }
        // Take regions
        var buildregions = rengineer(window.newquery.regions);
        //
        // Take Primary Filter (i.e Facilities)
        var buildfacilities = rengineer(window.newquery.facilities);
        //
        // Take Secondary Filter (i.e Offerings)
        var buildofferings = rengineer(window.newquery.offerings);
        //
        // Take Budget
        var buildbudget = rengineer(window.newquery.budget);


        // Category All check
        var data = {};

        if (window.newquery.category === "all-fitness-options") {
            data = {
                category: "",
                budget: window.newquery.budget,
                offerings: window.newquery.offerings,
                facilities: window.newquery.facilities,
                regions: window.newquery.regions,
                location: {
                    city: cc
                },
                trialfrom: window.newquery.trialfrom,
                trialto: window.newquery.trialto,
                offset: window.newquery.offset,
                sort: window.newquery.sort,
                trialdays: window.newquery.trialdays
            };
            path = "/" + cc + "/fitness/" + ((buildregions !== "") ? buildregions : "all") + "/" + ((buildfacilities !== "") ? buildfacilities : "all") + "/" + ((buildofferings !== "") ? buildofferings : "all") + "/" + ((buildbudget !== "") ? buildbudget : "all") + "/" + window.newquery.offset.from + "/" + window.newquery.sort.sortfield + "/" + window.newquery.sort.order;
        } else {
            data = {
                category: window.newquery.category.replace(/-/g, ' '),
                budget: window.newquery.budget,
                offerings: window.newquery.offerings,
                facilities: window.newquery.facilities,
                regions: window.newquery.regions,
                location: {
                    city: cc
                },
                trialfrom: window.newquery.trialfrom,
                trialto: window.newquery.trialto,
                offset: window.newquery.offset,
                sort: window.newquery.sort,
                trialdays: window.newquery.trialdays
            };
            path = "/" + cc + "/" + window.newquery.category + "/" + ((buildregions !== "") ? buildregions : "all") + "/" + ((buildfacilities !== "") ? buildfacilities : "all") + "/" + ((buildofferings !== "") ? buildofferings : "all") + "/" + ((buildbudget !== "") ? buildbudget : "all") + "/" + window.query.offset.from + "/" + window.newquery.sort.sortfield + "/" + window.newquery.sort.order;
        }

        pushSearchState(path);
        $('#results').empty();
        $('#mapresults').hide();
        $('.loaderdivcss').show();
        $('.pagination').empty();
        $.ajax({
            type: 'POST',
            url: 'https://a1.fitternity.com/search/getfinderresultsv2',
            data: JSON.stringify(data)
        }).done(function(resp) {

            // Dealing with the meta info & building pagination
            window.searchmeta = resp.meta;
            window.query = data;
            window.params = resp.results.aggregationlist;
            window.categoryselected = data.category;
            console.log(window.query, 'window query');
            if ((window.query.category === '') || (window.params.offerings.length === 0)) {

                $('.secondaryseperator').hide();
            } else {
                $('.secondaryseperator').show();
            }
            var offeringHeading = getOfferingHeading(window.query.category);
            // Clean all children
            $('.pagination').empty();
            $('#results').empty();
            $('.pagination').append('<div id="paginationstatus"><a href="#" data-action="first" class="first disabled"><span class="fa fa-chevron-left"></span><span class="fa fa-chevron-left"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="previous" class="previous disabled"><span class="fa fa-chevron-left"></span></a> <input type="text" id="pagination-text"><a href="#" data-action="next" class="next"><span class="fa fa-chevron-right"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="last" class="last"><span class="fa fa-chevron-right"></span><span class="fa fa-chevron-right"></span></a></div>');
            $('.pagination').jqPagination({
                current_page: (parseInt(resp.meta.total_records) === 0) ? 0 : (parseInt(resp.meta.from) === 0) ? 1 : Math.ceil(resp.meta.from / 10) + 1,
                max_page: Math.ceil(resp.meta.total_records / 10),
                page_string: 'Showing page {current_page} of {max_page}',
                paged: function(page) {

                    window.newquery.offset.from = (page - 1) * 10;
                    $('html, body').scrollTop(0);
                    _.debounce(window.makerequest(), 200);
                    // do something with the page variable
                }
            });
            // Dealing with results
            // If there are results
            if (resp.results.resultlist.length === 0) {
                $('#results').hide();
                $('#mapresults').hide();
                $('.loaderdivcss').hide();
                $('.pagination').hide();
                $('#results').html("<h3> No Results found</h3>");
                $('#results').show();
                console.log('results here are 0');
            }
            if (resp.results.resultlist.length > 0) {
                console.log('loader is hidden');
                $('#results').show();
                $('#mapresults').show();
                $('.loaderdivcss').css('display', 'none');
                $('.pagination').show();
                // $('#loaderdiv').show();
                //pagination  on ajax loading


                //build cluster filters to be checked or not checked
                // destroy trial days filters
                $('.trialdays').empty();
                //build trial days filters

                if (resp.results.aggregationlist.trialdays !== undefined) {
                    $.each(resp.results.aggregationlist.trialdays, function(key, filter) {

                        var bool = false;
                        $.each(data.trialdays, function(k, v) {
                            if (v === filter.key) {
                                bool = true;
                            }
                        });
                        if (bool) {
                            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input checked type="checkbox" class="trial" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
                        } else {
                            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="trial" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
                        }
                        $('.trialdays').append(temp);
                    });
                }

                // Listen to the filter related changes
                $('.trialdays input:checkbox').on('change', function() {
                    window.newquery.offset.from = 0;
                    window.makerequest();
                });

                //attach on check event listener


                // destry budget filters

                $('.budget').empty();

                // build budget filters


                $.each(resp.results.aggregationlist.budget, function(key, budget) {

                    var budgetVal = getBudgetFilterVal(budget.key);
                    var bool = false;
                    $.each(data.budget, function(k, v) {

                        if (v === budgetVal) {
                            bool = true;
                        }
                    });
                    if (bool) {

                        temp = '<li><div class="mui-checkbox"><label><input type="checkbox" checked class="budgetitem" value="' + budget.key + '">' + budget.key + '<span class="count">(' + budget.count + ')</span></label></div></li>';
                    } else {
                        temp = '<li><div class="mui-checkbox"><label><input type="checkbox" class="budgetitem" value="' + budget.key + '">' + budget.key + '<span class="count">(' + budget.count + ')</span></label></div></li>';
                    }
                    $('.budget').append(temp);
                });
                // Listen to the budget related changes
                $('.budget input:checkbox').on('change', function() {
                    window.newquery.offset.from = 0;
                    window.makerequest();
                });

                //destory locations  filters

                $('.locations').empty();

                //build location filters here
                $.each(resp.results.aggregationlist.locationcluster, function(key, cluster) {
                    var tmp = '';

                    $.each(cluster.regions, function(key, region) {

                        //check the already checked input

                        var count_key = _.find(resp.results.aggregationlist.locationtags, function(x) {
                            return x.key.toLowerCase() === region.key.toLowerCase();
                        });
                        if (!count_key) {
                            count_key = { count: 0 };
                        }

                        var bool = false;
                        $.each(data.regions, function(k, v) {
                            if (v === region.key) {
                                bool = true;
                            }
                        });
                        if (bool) {
                            tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input id="' + cluster.key.toLowerCase().replace(/ /g, '-') + '" checked type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + count_key.count + ')</span></label></div></li>');
                        } else {
                            tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input id="' + cluster.key.toLowerCase().replace(/ /g, '-') + '" type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + count_key.count + ')</span></label></div></li>');
                        }
                    });
                    var bool1 = false;
                    _.each(window.newquery.clusters, function(z) {
                        if (z.toLowerCase() === cluster.key.toLowerCase()) {
                            bool1 = true;
                        }
                    });
                    if (bool1) {

                        temp = '<li ><div class="mui-checkbox"><div class="mui-row"><div class="mui-col-md-10 mui-col-xs-10"><label><input checked type="checkbox" class="cluster" value="' + cluster.key + '">' + cluster.key + '<span class="count"></span></label></div><div class="mui-col-md-2 mui-col-xs-10 togglist"><span id="icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '" class="fa fa-chevron-down pointer"></span></div></div></div><ul id=' + cluster.key.toLowerCase().replace(/ /g, '-') + ' class="list">' + tmp + '</ul></li>';
                    } else {
                        temp = '<li ><div class="mui-checkbox"><div class="mui-row"><div class="mui-col-md-10 mui-col-xs-10"><label><input type="checkbox" class="cluster" value="' + cluster.key + '">' + cluster.key + '<span class="count"></span></label></div><div class="mui-col-md-2 mui-col-xs-10 togglist"><span id="icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '" class="fa fa-chevron-down pointer"></span></div></div></div><ul id=' + cluster.key.toLowerCase().replace(/ /g, '-') + ' class="list">' + tmp + '</ul></li>';
                    }
                    $('.locations').append(temp);
                    if ((window.newquery.regions === undefined) || (window.newquery.regions.length === 0)) {
                        if (key === 0) {
                            $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').show();
                        } else {
                            $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').hide();
                        }
                    } else {
                        var regions = _.pluck(cluster.regions, 'key');
                        if (_.intersection(regions, window.query.regions).length > 0) {
                            $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').show();
                        } else {
                            $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').hide();
                        }
                    }
                    $('#icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '').on('click', function() {
                        $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').toggle();
                    });
                });
                //attach expand and hide logic here
                //attached on check event listener
                $('.locations input:checkbox').on('change', function() {
                    var clus;
                    window.newquery.offset.from = 0;
                    if ($(this).attr("class") === 'cluster') {
                        var i = window.newquery.clusters.indexOf($(this).val());
                        var l = $(this).val();
                        if (i !== -1) {
                            window.newquery.clusters.splice(i, 1);
                            var cluster_data = _.find(window.params.locationcluster, function(y) {
                                return y.key.toLowerCase() === l.toLowerCase();
                            });

                            var id = "#" + l.toLowerCase().replace(/ /g, '-') + "";
                            clus = cluster_data.key;
                            $('#' + clus).hide();
                            $(id + ':checkbox.location').prop('checked', false);
                        }
                    } else if (($(this).attr("class") === 'location') && (true)) {
                        clus = $(this).attr('id').replace(/-/g, " ").capitalize();
                        $('#' + clus).show();

                        var il = window.newquery.clusters.indexOf(clus);

                        if (il > -1) {
                            $("[value='" + clus.capitalize() + "'").prop('checked', false);
                        }
                    }
                    window.makerequest();
                });

                //clustercheck logic

                $('.cluster input:checkbox').on('change', function() {
                    window.newquery.offset.from = 0;
                    window.makerequest();
                });
                //destroy primary filters here

                $('.primaryfilters').empty();

                // build primary filters here

                $.each(resp.results.aggregationlist.filters, function(key, filter) {
                    //
                    var bool = false;
                    $.each(data.facilities, function(k, v) {
                        if (v === filter.key) {
                            bool = true;
                        }
                    });
                    if (bool) {
                        temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" checked class="primary" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
                    } else {
                        temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="primary" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
                    }

                    $('.primaryfilters').append(temp);
                });

                //attach on check event listener

                $('.primaryfilters input:checkbox').on('change', function() {
                    window.newquery.offset.from = 0;
                    window.makerequest();
                });

                // destory secondary filters here              
                $('.secondaryfilters').empty();
                // build secondary filters here
                if (resp.results.aggregationlist.offerings.length === 0) {
                    $('#secoptions').hide();
                    $(".secondaymobilefilters").hide();
                } else {
                    $('#secoptions').show();
                    $(".secondaymobilefilters").show();
                }
                $('#secondaryheading').html(offeringHeading + ' <span class="chevron-icon fa fa-chevron-down"></span>');

                $('.secondaryheadingmobile').html(offeringHeading);
                console.log('client side aggreagations ', resp.results.aggregationlist);

                $.each(resp.results.aggregationlist.offerings, function(key, offering) {

                    var bool = false;
                    $.each(data.offerings, function(k, v) {
                        if (v === offering.key) {
                            bool = true;
                        }
                    });
                    var z = offering.key;
                    console.log(offering.key, 'mma fix');
                    if (offering.key.toLowerCase() === 'mma & kickboxing') {
                        z = 'MMA & Kickboxing';
                    }
                    if (offering.key !== "") {

                        if (bool) {
                            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" checked class="secondary" value="' + offering.key + '">' + z + '<span class="count">(' + offering.count + ')</span></label></div></li>';
                        } else {
                            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="secondary" value="' + offering.key + '">' + z + '<span class="count">(' + offering.count + ')</span></label></div></li>';
                        }
                        $('.secondaryfilters').append(temp);
                    }
                });


                //attach on check event listener

                $('.secondaryfilters input:checkbox').on('change', function() {
                    var qu = $('input:checkbox:checked.secondary').map(function() {
                        return this.value;
                    }).get();
                    window.newquery.offset.from = 0;
                    window.newquery.offerings = qu;
                    //
                    window.makerequest();
                });
                if (window.query.category === 'fitness studios') {
                    $('#secoptions').hide();
                    $('.secondaryseperator').hide();
                    $('.secondaymobilefilters').css('display', 'none');
                } else {
                    $('#secoptions').show();
                    $('.secondaryseperator').show();
                    $('.secondaymobilefilters').css('display', '');
                }

                if (window.query.category === 'healthy tiffins') {
                    $('#trialoptions').hide();
                    $('#trialoptions1').hide();
                    $('#trialoptinsline').hide();
                    $('#trialoptionsmobile').hide();
                    // $('#secoptions').hide();
                    // $('.secondaryseperator').hide();
                    // $('.secondaymobilefilters').css('display', 'none');
                    $('#locid').html('DELIVERY AREAS <span class="chevron-icon fa fa-chevron-down"></span>');
                    //$('#locid').contents(':contains("Locations")')[0].nodeValue = '"Delivery Areas"';
                    //$('#locid').html('Delivery Areas');
                } else if ((window.query.category !== 'fitness studios')) {
                    //$('#secoptions').show();
                    $('#trialoptions').show();
                    $('#trialoptions1').show();
                    $('#trialoptinsline').show();
                    $('#trialoptionsmobile').show();
                    // $('.secondaryseperator').show();
                    // $('.secondaymobilefilters').css('display', '');
                    $('#locid').html('LOCATIONS <span class="chevron-icon fa fa-chevron-down"></span>');
                }
                //build all the checkbox cehcked from the request;

                // Iterate through results
                $.each(resp.results.resultlist, function(key, result) {
                    var galcon = "";
                    var gal = "";
                    var tags = "";
                    //
                    var vendor = result.object;
                    // Include marker sir
                    if (window.innerWidth > 768) {
                        L.marker([vendor.geolocation.lat, vendor.geolocation.long]).addTo(map).bindPopup('<strong>' + vendor.title.capitalize() + '</strong><br>' + vendor.location.capitalize()).openPopup();
                    }
                    // If gallery exists Iterate through gallery
                    if (vendor.photos.length > 0) {
                        galcon = '<div class="bottom"><button class="viewgallery mui-btn mui-btn--flat mui-btn--primary"> <span>View Gallery </span><span class="fa fa-external-link"></span></button></div>';
                        $.each(vendor.photos, function(key, photo) {
                            var gtemp = '<a href="https://b.fitn.in/f/g/full/' + photo + '" title="' + vendor.title + '" rel="nofollow">#</a>';
                            gal = gal.concat(gtemp);
                        });
                    }
                    // Handling Average Rating
                    var rating_nomenclature = ['not-rated', 'foul', 'forgettable', 'fair', 'faultless', 'fabulous'];
                    var rateclass = rating_nomenclature[Math.ceil(vendor.average_rating)];
                    var rat = "";


                    if (vendor.average_rating > 0) {
                        rat = '<div class="big-rating ' + rateclass + '">' + Math.ceil(vendor.average_rating).toFixed(1) + '</div><span class="count">' + vendor.total_rating_count + ' Reviews</span>';
                    }
                    // Handing the tagged categories
                    var tag = '';
                    $.each(vendor.categorytags, function(key, tag1) {

                        var ttemp = '<div class="tag"><span class="fa fa-check"></span><span>' + tag1 + '</span></div>';
                        tag = tag + ttemp;
                    });

                    // handle hide address logic here
                    var addressBlockHtml = '';

                    if ((vendor.category !== 'personal trainers') && (vendor.category !== 'healthy tiffins') && (vendor.category !== 'healthy snacks and beverages')) {
                        var strippedaddress = vendor.contact.address.replace(/(<([^>]+)>)/ig," ").replace(/&nbsp;/gi,' ');
                        addressBlockHtml = '<div class="mui--text-body1 address">' + strippedaddress + '</div>';
                    }
                    //handle locations logic here

                    var locationBlockHtml = '<span class="fa fa-map-marker"></span>';

                    if (vendor.locationtags.length > 2) {
                        locationBlockHtml = '<span>Available in Multiple Locations</span>';
                    } else {
                        $.each(vendor.locationtags, function(key, loc) {
                            locationBlockHtml = locationBlockHtml + '<span class="multilocation"> ' + loc + '</span>';
                        });
                    }
                    // Handle book trial logic'

                    var tmp1 = '';
                    if (vendor.commercial_type !== 0 && vendor.category !== 'healthy tiffins' && vendor.category !== 'healthy snacks and beverages' && vendor.category !== 'swimming' && vendor.category !== 'sports' && vendor.category !== 'sport nutrition supliment stores') {
                        var buttonClick;

                        if (vendor.facilities.indexOf('free trial') > -1) {
                            buttonClick = '<a onclick="openTrial(&quot;' + 'freeTrial' + '&quot;,&quot;' + vendor.slug + '&quot;,&quot;' + vendor.servicelist + '&quot;,&quot;' + vendor.category + '&quot;)" class="mui-btn mui-btn--small mui-btn--danger">BOOK a Free TRIAL</a>';
                        } else {
                            buttonClick = '<a onclick="openTrial(&quot;' + 'noFreeTrial' + '&quot;,&quot;' + vendor.slug + '&quot;,&quot;' + vendor.servicelist + '&quot;,&quot;' + vendor.category + '&quot;)" class="mui-btn mui-btn--small mui-btn--danger">BOOK a Free TRIAL</a>';
                        }
                        tmp1 = '<div class="result mui--z1 mui-panel"><div class="mui-row"><div style="min-height: 151px; background: linear-gradient(rgba(0, 0, 0, 0.65098), rgba(0, 0, 0, 0.65098)), url(https://b.fitn.in/f/c/' + vendor.coverimage + ');background-repeat:no-repeat;" class="mui-col-md-4 cover">' + galcon + '</div><div class="mui-col-md-8 content"><div class="gallery">' + gal + '</div><div class="mui-row"><div class="mui-col-md-9 mui-col-xs-9"><a id="vendorclick' + vendor.slug + '" href="/' + vendor.slug + '"><div class="mui--text-headline title capitalize">' + vendor.title + '</div></a><div class="mui--text-subhead location capitalize">' + locationBlockHtml + '</div>' + addressBlockHtml + '</div><div class="mui-col-md-3 mui-col-xs-3 mui--text-center">' + rat + '</div></div><div class="mui-row"><div class="mui-col-md-12 categorytags">' + tag + '</div></div><div class="mui-row actions"><div class="mui-col-md-12 mui--text-right">' + buttonClick + '</div></div></div></div></div>';

                    } else {
                        tmp1 = '<div class="result mui--z1 mui-panel"><div class="mui-row"><div style="min-height: 151px; background: linear-gradient(rgba(0, 0, 0, 0.65098), rgba(0, 0, 0, 0.65098)), url(https://b.fitn.in/f/c/' + vendor.coverimage + ');background-repeat:no-repeat;" class="mui-col-md-4 cover">' + galcon + '</div><div class="mui-col-md-8 content"><div class="gallery">' + gal + '</div><div class="mui-row"><div class="mui-col-md-9 mui-col-xs-9"><a id="vendorclick' + vendor.slug + '" href="/' + vendor.slug + '"><div class="mui--text-headline title capitalize">' + vendor.title + '</div></a><div class="mui--text-subhead location capitalize">' + locationBlockHtml + '</div>' + addressBlockHtml + '</div><div class="mui-col-md-3 mui-col-xs-3 mui--text-center">' + rat + '</div></div><div class="mui-row"><div class="mui-col-md-12 categorytags">' + tag + '</div></div><div class="mui-row actions"><div class="mui-col-md-12 mui--text-right"></div></div></div></div></div>';
                    }
                    $('#results').append(tmp1);
                    // Making other things because this is jquery.
                    if (window.innerWidth > 768) {
                        $.each($('.result .mui-row'), function() {
                            //
                            $(this).children('.cover').css('min-height', $(this).height());
                        });
                    } else {
                        $.each($('.result .mui-row'), function() {
                            //
                            $(this).children('.cover').css('height', 200);
                        });
                    }
                    // Gallery for each result
                    $('.gallery').each(function() { // the containers for all your galleries
                        $(this).magnificPopup({
                            delegate: 'a', // the selector for gallery item
                            type: 'image',
                            gallery: {
                                enabled: true
                            }
                        });
                    });
                    // Binding the viewgallery button of new results
                    $('.viewgallery').on('click', function() {
                        $(this).parent().parent().parent().find('.gallery a:first-child').click();
                    });
                    $('#vendorclick' + vendor.slug).on('click', function() {

                        kyu1.pushevent('vendorclick', { vendor: vendor.slug, position: 0 });
                    });
                });
            } else {

            }
        }).fail(function(err) {

        });
        //
    };

    //time range slider here

    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 1440,
        step: 60,
        values: [0, 1440],
        slide: function(e, ui) {
            var hours1 = Math.floor(ui.values[0] / 60);
            var minutes1 = ui.values[0] - (hours1 * 60);

            if (hours1.length == 1) hours1 = '0' + hours1;
            if (minutes1.length == 1) minutes1 = '0' + minutes1;
            if (minutes1 === 0) minutes1 = '00';
            var hours1Total = hours1;
            if (hours1 >= 12) {
                if (hours1 == 12) {
                    hours1 = hours1;
                    minutes1 = minutes1 + " PM";
                } else {
                    hours1 = hours1 - 12;
                    minutes1 = minutes1 + " PM";
                }
            } else {
                hours1 = hours1;
                minutes1 = minutes1 + " AM";
            }
            if (hours1 === 0) {
                hours1 = 12;
                minutes1 = minutes1;
            }

            $('.slider-time').html(hours1 + ':' + minutes1);

            var hours2 = Math.floor(ui.values[1] / 60);
            var minutes2 = ui.values[1] - (hours2 * 60);

            if (hours2.length == 1) hours2 = '0' + hours2;
            if (minutes2.length == 1) minutes2 = '0' + minutes2;
            if (minutes2 === 0) minutes2 = '00';
            var hours2Total = hours2;
            if (hours2 >= 12) {
                if (hours2 == 12) {
                    hours2 = hours2;
                    minutes2 = minutes2 + " PM";
                } else if (hours2 == 24) {
                    hours2 = 11;
                    minutes2 = "59 PM";
                } else {
                    hours2 = hours2 - 12;
                    minutes2 = minutes2 + " PM";
                }
            } else {
                hours2 = hours2;
                minutes2 = minutes2 + " AM";
            }

            $('.slider-time2').html(hours2 + ':' + minutes2);
            window.newquery.trialfrom = hours1Total;
            window.newquery.trialto = hours2Total;
            window.makerequest();
        }
    });

    // Fill categories
    $.each(searchcats, function(key, category) {
        temp = '<li><div class="mui-radio"><label><input type="radio" name="category" value="' + category.title + '">' + category.title + '</label></div></li>';
        $('.categories').append(temp);
    });

    // Listen to the category changes
    $('.categories input:radio').on('change', function() {
        window.newquery.offset.from = 0;
        window.makerequest();
    });

    // Check the categor if is empty
    if (window.query.category === "") {
        $('.categories input:radio[value="All Fitness Options"]').prop('checked', true);
    }

    // Fill Locations
    $.each(window.params.locationcluster, function(key, cluster) {
        var tmp = '';
        $.each(cluster.regions, function(key, region) {
            var bool = false;
            $.each(window.query.regions, function(k, v) {
                if (v === region.key) {
                    bool = true;
                }
            });

            var count_key = _.find(window.params.locationtags, function(x) {
                return x.key.toLowerCase() === region.key.toLowerCase();
            });

            if (!count_key) {
                count_key = { count: 0 };
            }
            if (bool) {
                tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input checked id="' + cluster.key.toLowerCase() + '" type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + count_key.count + ')</span></label></div></li>');
            } else {
                tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input id="' + cluster.key.toLowerCase() + '" type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + count_key.count + ')</span></label></div></li>');
            }
        });

        temp = '<li ><div class="mui-checkbox"><div class="mui-row"><div class="mui-col-md-10 mui-col-xs-10"><label><input type="checkbox" class="cluster" value="' + cluster.key + '">' + cluster.key + '<span class="count"></span></label></div><div class="mui-col-md-2 mui-col-xs-2 togglist"><span id="icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '" class="fa fa-chevron-down pointer"></span></div></div></div><ul id=' + cluster.key.toLowerCase().replace(/ /g, '-') + ' class="list">' + tmp + '</ul></li>';
        $('.locations').append(temp);
        if ((window.query.regions === undefined) || (window.query.regions.length === 0)) {
            if (key === 0) {
                $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').show();
            } else {
                $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').hide();
            }
        } else {
            var regions = _.pluck(cluster.regions, 'key');
            if (_.intersection(regions, window.query.regions).length > 0) {
                $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').show();
            } else {
                $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').hide();
            }
        }
        $('#icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '').on('click', function() {
            $('#' + cluster.key.toLowerCase().replace(/ /g, '-') + '').toggle();
        });
    });

    // Listen to the location related changes
    $('.locations input:checkbox').on('change', function() {
        window.newquery.offset.from = 0;
        window.makerequest();
    });
    $('#loaderdiv').hide();
    if (window.params.offerings.length === 0) {
        //hide hr line
        $('#secoptions').hide();
        $(".secondaymobilefilters").hide();
    } else {
        $('#secoptions').show();
        $(".secondaymobilefilters").show();
    }
    $('#secondaryheading').html(getOfferingHeading(window.query.category) + '<span class="chevron-icon fa fa-chevron-down"></span>');
    $('.secondaryheadingmobile').html(offeringHeading);
    console.log('window param server side', window.params);
    $.each(window.params.offerings, function(key, offering) {

        var bool = false;
        $.each(window.query.offerings, function(k, v) {
            if (v === offering.key) {
                bool = true;
            }
        });
        var z = offering.key;
        console.log(offering.key, 'mma fix');
        if (offering.key.toLowerCase() === 'mma & kickboxing') {
            z = 'MMA & Kickboxing';
        }
        if (offering.key !== "") {
            if (bool) {
                temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" checked class="secondary" value="' + offering.key + '">' + z + '<span class="count">(' + offering.count + ')</span></label></div></li>';
            } else {
                temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="secondary" value="' + offering.key + '">' + z + '<span class="count">(' + offering.count + ')</span></label></div></li>';
            }

            $('.secondaryfilters').append(temp);
        }
    });


    $.each(window.params.filters, function(key, filter) {
        //

        var bool = false;
        $.each(window.query.facilities, function(k, v) {
            if (v === filter.key) {
                bool = true;
            }
        });

        if (bool) {
            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" checked class="primary" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
        } else {
            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="primary" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
        }

        $('.primaryfilters').append(temp);
    });
    $('.primaryfilters input:checkbox').on('change', function() {
        window.newquery.offset.from = 0;
        window.makerequest();
    });

    $.each(window.params.trialdays, function(key, filter) {
        //
        temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="trial" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
        $('.trialdays').append(temp);
    });

    $('.trialdays input:checkbox').on('change', function() {
        window.newquery.offset.from = 0;
        window.makerequest();
    });
    var recentSearches = JSON.parse(fitternity.fitLocalStorage.getlocal('recentsearch'));

    if (recentSearches !== null && recentSearches !== undefined && recentSearches.length > 0) {
        $.each(recentSearches, function(k, r) {
            temp = '<li><a href="' + r.slug + '"><span class="fa fa-link"></span><span>' + r.category + ' in ' + r.location + '</span></a></li>';
            //
            $('#recentsearchlinks').append(temp);
        });
    } else {
        $("#recentlysearched").hide();
    }
    var recentViewed = JSON.parse(fitternity.fitLocalStorage.getlocal('recentviewed'));
    if (recentViewed !== null && recentViewed !== undefined && recentViewed.length > 0) {
        $.each(recentViewed, function(k, r) {
            temp = '<li><a href="/' + r.slug + '"><span class="fa fa-link"></span><span>' + r.title + ' in ' + r.location + '</span></a></li>';
            //
            $('#recentviewedlinks').append(temp);
        });
    } else {
        $("#recentlyviewed").hide();
    }

    // Get all amenities based on city and category
    var data = {
        category: window.query.category,
        location: cc
    };

    $('#sortlistid li').on('click', function(ev) {
        var text = $(this).text();
        var order = $(this).attr('data-order');
        var orderField = $(this).attr('data-orderfield');
        window.newquery.sort.order = order;
        window.newquery.sort.sortfield = orderField;
        window.newquery.offset.from = 0;
        window.newquery.offset.number_of_records = 10;
        window.makerequest();

    });
    // Get Latest Budget Params
    // Fill the budget 
    $.each(window.params.budget, function(key, budget) {


        var budgetVal = getBudgetFilterVal(budget.key);
        var bool = false;
        $.each(window.query.budget, function(k, v) {

            if (v === budgetVal) {
                bool = true;
            }
        });
        if (bool) {
            temp = '<li><div class="mui-checkbox"><label><input checked type="checkbox" class="budgetitem" value="' + budget.key + '">' + budget.key + '<span class="count">(' + budget.count + ')</span></label></div></li>';
        } else {
            temp = '<li><div class="mui-checkbox"><label><input type="checkbox" class="budgetitem" value="' + budget.key + '">' + budget.key + '<span class="count">(' + budget.count + ')</span></label></div></li>';
        }

        $('.budget').append(temp);
    });



    // $('.trialdays input:checkbox').on('change', function() {
    //     // var qu = $('input:checkbox:checked.trial').map(function() {
    //     //     return this.value;
    //     // }).get();
    //     // window.newquery.trialdays = qu;
    //     window.makerequest();
    // });

    // Get Location, Offset & Sort
    window.newquery.location = {
        city: window.query.location.city
    };
    window.newquery.offset = window.query.offset;
    window.newquery.sort = window.query.sort;
    // Filling the information

    //
    if ((window.query.category === '') || (window.params.offerings.length === 0)) {
        $('.secondaryseperator').hide();
    } else {
        $('.secondaryseperator').show();
    }

    if (window.query !== undefined) {
        // First Select the category
        //               
        $('.categories input:radio[value="' + window.query.category.capitalize() + '"]').prop('checked', true);
        // Next Select the location
        $.each(window.query.regions, function(key, region) {
            $('.locations input:checkbox[value="' + region + '"]').prop('checked', true);
        });
    }
    if (window.query.category === 'fitness studios') {
        $('#secoptions').hide();
        $('.secondaryseperator').hide();
        $('.secondaymobilefilters').css('display', 'none');
    }
    if (window.query.category === 'healthy tiffins') {
        var x = $('ul').find("[data-sec=trialoptions]");
        console.log(x, 'x here');
        $("li[data-sec~='filoptions']").hide();
        $('#trialoptions').hide();
        $('#trialoptions1').hide();
        $('#trialoptinsline').hide();
        // $('#secoptions').hide();
        $('#trialoptionsmobile').hide();
        $('#filoptions').hide();
        $('#filoptionssep').hide();
            // $('.secondaymobilefilters').css('display', 'none');
            // $('.secondaryseperator').hide();
        $('#locid').html('DELIVERY AREAS <span class="chevron-icon fa fa-chevron-down"></span>');
        //$('#locid').contents(':contains("Locations")')[0].nodeValue = '"Delivery Areas"';
        //$('#locid').html('Delivery Areas');
    } else {
        $('#locid').html('LOCATIONS <span class="chevron-icon fa fa-chevron-down"></span>');
    }
    // Listen to the budget related changes
    $('.budget input:checkbox').on('change', function() {
        window.newquery.offset.from = 0;
        window.makerequest();
    });
    // Gallery for each result
    $('.gallery').each(function() { // the containers for all your galleries
        $(this).magnificPopup({
            delegate: 'a', // the selector for gallery item
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });

    $('.viewgallery').on('click', function() {

        $(this).parent().parent().parent().find('.gallery a:first-child').click();

    });

    window.searchmeta = JSON.parse($('#metasearch').attr('data-meta'));

    // Creating pagination
    $('.pagination').append('<div id="paginationstatus"><a href="#" data-action="first" class="first disabled"><span class="fa fa-chevron-left"></span><span class="fa fa-chevron-left"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="previous" class="previous disabled"><span class="fa fa-chevron-left"></span></a><input type="text"><a href="#" data-action="next" class="next"><span class="fa fa-chevron-right"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="last" class="last"><span class="fa fa-chevron-right"></span><span class="fa fa-chevron-right"></span></a></div>');
    $('.pagination').jqPagination({
        current_page: (parseInt(window.searchmeta.total_records) === 0) ? 0 : (parseInt(window.searchmeta.from) === 0) ? 1 : Math.ceil(window.searchmeta.from / 10) + 1,
        max_page: Math.ceil(window.searchmeta.total_records / 10),
        page_string: 'Showing page {current_page} of {max_page}',
        paged: function(page) {

            window.newquery.offset.from = (page - 1) * 10;
            $('html, body').scrollTop(0);
            _.debounce(window.makerequest(), 200);
            // do something with the page variable
        }
    });

    function buildFilterCheck(data) {}
});

var openTrial = function(type, vendorSlug, serviceDays, category) {

    var path = window.location.origin;

    switch (type) {
        case 'freeTrial':
            if (serviceDays.length > 0) {
                window.location.href = path + '/booktrial/' + vendorSlug;
            } else {
                window.location.href = path + '/' + vendorSlug;
            }
            break;
        case 'noFreeTrial':
            window.location.href = path + '/' + vendorSlug;

            break;
    }
};
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
            heading = "amenities";
            break;
        case 'personal trainers':
            heading = "Personal Training Services";
            break;
        case 'sport nutrition supliment stores':
            heading = 'Offerings';
            break;

    }
    return heading;
};

// Filter toggle
$(".optsecs .mui--text-title").on("click", function(e) {

    if (window.innerWidth > 768) {
        if ($(this).closest(".optsecs").height() === 30) {

            $(this).closest(".optsecs").css("height", "auto");
            $(this).closest(".optsecs").css("overflow-y", "auto");
            $(this).find(".chevron-icon").removeClass("fa-chevron-down");
            $(this).find(".chevron-icon").addClass("fa-chevron-up");
        } else {
            $(this).find(".chevron-icon").removeClass("fa-chevron-up");
            $(this).find(".chevron-icon").addClass("fa-chevron-down");
            $(this).closest(".optsecs").css("height", "40px");
            $(this).closest(".optsecs").css("overflow-y", "");
        }
    }
});
$("#catoptions .mui--text-title").click();
$("#toggfilters").on("click", function(e) {
    console.log("yo");
    $("#results").css("overflow", "hidden");
});
$("#closesidebar").on("click", function(e) {
    $("#results").css("overflow", "auto");
});
