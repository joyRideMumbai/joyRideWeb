// View Map sections
var getBudgetFilterVal = function(key) {
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
        case '1000-25000':
            value = 'two';
            break;
    }
    return value;
};

if (window.innerWidth > 768) {

    var map = L.map('mapresults');
    var googleLayer = new L.Google('ROADMAP');
    map.addLayer(googleLayer);
}

$(function() {
    // Going back in time
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
    window.meta = JSON.parse($('#metasearch').attr('data-meta'));
    window.query.regions = window.query.regions.concat(window.meta.locationfilters);
    window.query.category = window.query.category.concat(window.meta.categoryfilters);

    //
    //

    // Building new query
    window.newquery = {};
    var searchcats = [];
    var temp = "";

    // Get city base categories
    var cc = window.query.city.toLowerCase();
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
        window.newquery.category = $('input:checkbox:checked.category').map(function() {
            return this.value;
        }).get();
        window.newquery.regions = $('input:checkbox:checked.location').map(function() {
            return this.value;
        }).get();
        window.newquery.facilities = $('input:checkbox:checked.primary').map(function() {
            return this.value;
        }).get();
        // Getting secondary filters
        window.newquery.offerings = $('input:checkbox:checked.secondary').map(function() {
            return this.value;
        }).get();
        // Getting budgets
        window.newquery.budget = $('input:checkbox:checked.budgetitem').map(function() {
            var value = getBudgetFilterVal(this.value);
            return value;
        }).get();
        var city = 'mumbai';
        var location = city;

        kyu1.pushevent('keywordsearch', { what: 'keywordsearch', dataobject: 'vendor', type: 'finder', page: 'keyword', city: window.newquery.location.city, location: window.newquery.regions, category: window.newquery.category });
        if (window.newquery.regions.length !== 0) {

            location = window.newquery.regions[window.newquery.regions.length - 1];
            location = location.replace(/-/g, ' ').capitalize();

        }

        // Take regions
        var buildregions = rengineer(window.newquery.regions);
        var buildfacilities = rengineer(window.newquery.facilities);
        var buildofferings = rengineer(window.newquery.offerings);
        var buildbudget = rengineer(window.newquery.budget);
        var data = {};
        data = {
            key: window.query.key,
            category: window.newquery.category,
            budget: window.newquery.budget,
            offerings: window.newquery.offerings,
            facilities: window.newquery.facilities,
            regions: window.newquery.regions,
            city: cc,
            from: window.newquery.offset === undefined ? 0 : window.newquery.offset,
            sort: window.newquery.sort,
            trialdays: window.newquery.trialdays
        };

        $.ajax({
            type: 'POST',
            url: 'https://a1.fitternity.com/keywordsearchwebv1',
            data: JSON.stringify(data)
        }).done(function(resp) {

            // Dealing with the meta info & building pagination
            window.searchmeta = resp.meta;
            console.log(window.searchmeta, 'searchmeta');
            // Clean all children

            $('.pagination').empty();
            $('.pagination').append('<div id="paginationstatus"><a href="#" data-action="first" class="first disabled"><span class="fa fa-chevron-left"></span><span class="fa fa-chevron-left"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="previous" class="previous disabled"><span class="fa fa-chevron-left"></span></a><input type="text"><a href="#" data-action="next" class="next"><span class="fa fa-chevron-right"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="last" class="last"><span class="fa fa-chevron-right"></span><span class="fa fa-chevron-right"></span></a></div>');

            $('.pagination').jqPagination({
                current_page: window.searchmeta.total_records === 0 ? 0: (window.searchmeta
                    .from === 0) ? 1 : Math.ceil(window.searchmeta.from / 10) + 1,
                max_page: Math.ceil(window.searchmeta.total_records / 10),
                page_string: 'Showing page {current_page} of {max_page}',
                paged: function(page) {

                    window.newquery.offset.from = page * 10;
                    _.debouce(window.makerequest(), 200);
                    // do something with the page variable
                }
            });
            $('#results').empty();

            if (resp.results.resultlist.length > 0) {
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
                    window.makerequest();
                });

                //destory locations  filters

                $('.locations').empty();
                //build location filters here
                $.each(resp.results.aggregationlist.locationcluster, function(key, cluster) {
                    var tmp = '';
                    $.each(cluster.regions, function(key, region) {

                        //check the already checked input

                        var bool = false;
                        $.each(data.regions, function(k, v) {
                            if (v === region.key) {
                                bool = true;
                            }
                        });
                        if (bool) {
                            tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input checked type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + region.count + ')</span></label></div></li>');
                        } else {
                            tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + region.count + ')</span></label></div></li>');
                        }
                    });
                    var bool1 = false;
                    _.each(window.newquery.clusters, function(z) {
                        if (z.toLowerCase() === cluster.key.toLowerCase()) {
                            bool1 = true;
                        }
                    });
                    if (bool1) {

                        temp = '<li ><div class="mui-checkbox"><div class="mui-row"><div class="mui-col-md-10"><label><input checked type="checkbox" class="cluster" value="' + cluster.key + '">' + cluster.key + '<span class="count">(' + cluster.count + ')</span></label></div><div class="mui-col-md-2 togglist"><span id="icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '" class="fa fa-chevron-down pointer"></span></div></div></div><ul id=' + cluster.key.toLowerCase().replace(/ /g, '-') + ' class="list">' + tmp + '</ul></li>';
                    } else {
                        temp = '<li ><div class="mui-checkbox"><div class="mui-row"><div class="mui-col-md-10"><label><input type="checkbox" class="cluster" value="' + cluster.key + '">' + cluster.key + '<span class="count">(' + cluster.count + ')</span></label></div><div class="mui-col-md-2 togglist"><span id="icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '" class="fa fa-chevron-down pointer"></span></div></div></div><ul id=' + cluster.key.toLowerCase().replace(/ /g, '-') + ' class="list">' + tmp + '</ul></li>';
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

                //attached on check event listener

                $('.locations input:checkbox').on('change', function() {
                    var clus;
                    if ($(this).attr("class") === 'cluster') {
                        var i = window.newquery.clusters.indexOf($(this).val());
                        var l = $(this).val();

                        if (i !== -1) {
                            window.newquery.clusters.splice(i, 1);
                            var cluster_data = _.find(window.params.locationcluster, function(y) {
                                return y.key.toLowerCase() === l.toLowerCase();
                            });
                            clus = cluster_data.key;
                            var id = "#" + l.toLowerCase().replace(/ /g, '-') + "";


                            $(id + ':checkbox.location').prop('checked', false);
                        }
                    } else if (($(this).attr("class") === 'location') && (true)) {
                        clus = $(this).attr('id').replace(/-/g, " ").capitalize();

                        var il = window.newquery.clusters.indexOf(clus);

                        if (il > -1) {
                            $("[value='" + clus.capitalize() + "'").prop('checked', false);
                        }
                    }

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
                    window.makerequest();
                });

                // destory secondary filters here

                $('.secondaryfilters').empty();


                // build secondary filters here

                $('#secondaryheading').html('secondary_filters');
                $.each(resp.results.aggregationlist.offerings.splice(0, 10), function(key, offering) {

                    var bool = false;
                    $.each(data.offerings, function(k, v) {
                        if (v === offering.key) {
                            bool = true;
                        }
                    });
                    if (bool) {
                        temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" checked class="secondary" value="' + offering.key + '">' + offering.key + '<span class="count">(' + offering.count + ')</span></label></div></li>';
                    } else {
                        temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="secondary" value="' + offering.key + '">' + offering.key + '<span class="count">(' + offering.count + ')</span></label></div></li>';
                    }

                    $('.secondaryfilters').append(temp);
                });


                //attach on check event listener

                $('.secondaryfilters input:checkbox').on('change', function() {
                    var qu = $('input:checkbox:checked.secondary').map(function() {
                        return this.value;
                    }).get();
                    window.newquery.offerings = qu;
                    //
                    window.makerequest();
                });

                //build all the checkbox cehcked from the request;



                buildFilterCheck(data);

                // Iterate through results
                $.each(resp.results.resultlist, function(key, result) {
                    var galcon = "";
                    var gal = "";
                    var tags = "";
                    //
                    var vendor = result.object;
                    // Include marker sir
                    L.marker([vendor.geolocation.lat, vendor.geolocation.long]).addTo(map).bindPopup('<strong>' + vendor.title.capitalize() + '</strong><br>' + vendor.location.capitalize()).openPopup();
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
                    var tag = "";
                    $.each(vendor.categorytags, function(key, tag1) {
                        var ttemp = '<div class="tag"><span class="fa fa-check"></span><span>' + tag1 + '</span></div>';
                        tag = tag.concat(ttemp);
                    });

                    // handle hide address logic here
                    var addressBlockHtml = '';

                    if ((vendor.category !== 'personal trainers') && (vendor.category !== 'healthy tiffins') && (vendor.category !== 'healthy snacks and beverages')) {
                            var strippedaddress = vendor.contact.address.replace(/(<([^>]+)>)/ig," ").replace(/&nbsp;/gi,' ');
                        addressBlockHtml = '<div class="mui--text-body1 address"><p>' + strippedaddress + '</p></div>';
                    }
                    //handle locations logic here

                    var locationBlockHtml = '';

                    if (vendor.locationtags.length > 2) {
                        locationBlockHtml = '<span class="fa fa-map-marker"></span><span>Available in Multiple Locations</span>';
                    } else {
                        $.each(vendor.locationtags, function(key, loc) {
                            locationBlockHtml = locationBlockHtml + '<span class="fa fa-map-marker"></span><span> ' + loc + '</span>';
                        });
                    }
                    // Handle book trial logic'
                    var tmp1 = '';
                    if (vendor.commercial_type !== 0 && vendor.category !== 'healthy tiffins' && vendor.category !== 'healthy snacks and beverages' && vendor.category !== 'swimming' && vendor.category !== 'sports' && vendor.category !== 'sport nutrition supliment stores') {
                         if(vendor.facilities.indexOf('free trial') > -1){
                            buttonClick = '<a onclick="openTrial(&quot;'+'freeTrial'+'&quot;,&quot;'+vendor.slug+'&quot;,&quot;'+vendor.servicelist+'&quot;,&quot;'+vendor.category+'&quot;)" class="mui-btn mui-btn--small mui-btn--danger">BOOK a Free TRIAL</a>';
                        }
                        else{
                            buttonClick = '<a onclick="openTrial(&quot;'+'noFreeTrial'+'&quot;,&quot;'+vendor.slug+'&quot;,&quot;'+vendor.servicelist+'&quot;,&quot;'+vendor.category+'&quot;)" class="mui-btn mui-btn--small mui-btn--danger">BOOK a Free TRIAL</a>';
                        }
                        tmp1 = '<div class="result mui--z1 mui-panel"><div class="mui-row"><div style="min-height: 151px; background: linear-gradient(rgba(0, 0, 0, 0.65098), rgba(0, 0, 0, 0.65098)), url(https://b.fitn.in/f/c/' + vendor.coverimage + ');background-repeat:no-repeat;" class="mui-col-md-4 cover">' + galcon + '</div><div class="mui-col-md-8 content"><div class="gallery">' + gal + '</div><div class="mui-row"><div class="mui-col-md-9 mui-col-xs-9"><a id="vendorclick' + vendor.slug + '" href="/' + vendor.slug + '"><div class="mui--text-headline title capitalize">' + vendor.title + '</div></a><div class="mui--text-subhead location capitalize">' + locationBlockHtml + '</div>' + addressBlockHtml + '</div><div class="mui-col-md-3 mui-col-xs-3 mui--text-center">' + rat + '</div></div><div class="mui-row"><div class="mui-col-md-12 categorytags">' + tag + '</div></div><div class="mui-row actions"><div class="mui-col-md-12 mui--text-right">'+buttonClick+'</div></div></div></div></div>';
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
                    // Creating pagination

                    $('#vendorclick' + vendor.slug).on('click', function() {
                        kyu1.pushevent('vendorclick', { vendor: vendor.slug, position: 0 });
                    });
                });

                // history.pushState({}, '', path);
            } else {

            }
        }).fail(function(err) {

        });
        //
    };

    // Fill categories
    $.each(window.params.category, function(key, category) {
        var checked = '';
        if (category.key !== '') {

            if (_.intersection(window.query.category, [category.key]).length > 0) {
                checked = 'checked';
            }
            temp = '<li><div class="mui-radio"><label><input class="category"' + checked + ' type="checkbox" name="category" value="' + category.key + '">' + category.key.capitalize() + '<span class="count">(' + category.count + ')</span></label></div></li>';
            $('.categories').append(temp);
        }
    });

    // Listen to the category changes
    $('.categories input:checkbox').on('change', function() {
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
            if (bool) {
                tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input checked id="' + cluster.key.toLowerCase() + '" type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + region.count + ')</span></label></div></li>');
            } else {
                tmp = tmp.concat('<li class="capitalize"><div class="mui-checkbox"><label><input id="' + cluster.key.toLowerCase() + '" type="checkbox" class="location" value="' + region.key + '">' + region.key + '<span class="count">(' + region.count + ')</span></label></div></li>');
            }
        });
        temp = temp = '<li ><div class="mui-checkbox"><div class="mui-row"><div class="mui-col-md-10"><label><input type="checkbox" class="cluster" value="' + cluster.key + '">' + cluster.key + '<span class="count">(' + cluster.count + ')</span></label></div><div class="mui-col-md-2 togglist"><span id="icon-' + cluster.key.toLowerCase().replace(/ /g, '-') + '" class="fa fa-chevron-down pointer"></span></div></div></div><ul id=' + cluster.key.toLowerCase().replace(/ /g, '-') + ' class="list">' + tmp + '</ul></li>';
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
        window.makerequest();
    });

    // Fill filters
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

    if (window.params.trialdays !== undefined) {
        $.each(window.params.trialdays, function(key, filter) {
            //
            temp = '<li><div class="mui-checkbox"><label class="capitalize"><input type="checkbox" class="trial" value="' + filter.key + '">' + filter.key + '<span class="count">(' + filter.count + ')</span></label></div></li>';
            $('.trialdays').append(temp);
        });
    }

    // Listen to the filter related changes
    $('.primaryfilters input:checkbox').on('change', function() {
        window.makerequest();
    });

    //fill the right side bar of recently searched in the ul
    var recentSearches = JSON.parse(fitternity.fitLocalStorage.getlocal('recentsearch'));

    if (recentSearches !== undefined && recentSearches.length > 0) {
        $.each(recentSearches, function(k, r) {
            temp = '<li><a href="' + r.slug + '"><span class="fa fa-link"></span><span>' + r.category + ' in ' + r.location + '</span></a></li>';
            //
            $('#recentsearchlinks').append(temp);
        });
    } else {
        $("#recentlysearched").hide();
    }
    var recentViewed = JSON.parse(fitternity.fitLocalStorage.getlocal('recentviewed'));
    $.each(recentViewed, function(k, r) {
        temp = '<li><a href="/' + r.slug + '"><span class="fa fa-link"></span><span>' + r.title + ' in ' + r.location + '</span></a></li>';
        //
        $('#recentviewedlinks').append(temp);
    });

    // Get all amenities based on city and category
    var data = {
        category: window.query.category,
        location: cc
    };

    $('#sortlistid li').on('click', function(ev) {
        var text = $(this).text();

        switch (text.toLowerCase()) {
            case 'popularity(high to low)':
                window.newquery.sort.order = 'desc';
                window.newquery.sort.sortfield = 'popularity';
                break;
            case 'popularity(low to high)':
                window.newquery.sort.order = 'asc';
                window.newquery.sort.sortfield = 'popularity';
                break;
            case 'budget(low to high)':
                window.newquery.sort.order = 'asc';
                window.newquery.sort.sortfield = 'budget';
                break;
            case 'budget(high to low)':
                window.newquery.sort.order = 'desc';
                window.newquery.sort.sortfield = 'budget';
                break;
            case 'average_rating(low to high)':
                window.newquery.sort.order = 'asc';
                window.newquery.sort.sortfield = 'average_rating';
                break;
            case 'average_rating(high to low)':
                window.newquery.sort.order = 'desc';
                window.newquery.sort.sortfield = 'average_rating';
                break;
        }
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
    // Listen to the budget related changes
    $('.budget input:checkbox').on('change', function() {
        window.makerequest();
    });

    $('.trialdays input:checkbox').on('change', function() {
        var qu = $('input:checkbox:checked.trial').map(function() {
            return this.value;
        }).get();
        window.newquery.trialdays = qu;
        window.makerequest();

    });

    // Get Location, Offset & Sort
    window.newquery.location = {
        city: window.query.city
    };

    window.newquery.offset = window.query.from;
    window.newquery.size = window.query.size;
    window.newquery.sort = window.query.sort;


    // Filling the information

    //
    if (window.query !== undefined) {
        // Next Select the location
        $.each(window.query.regions, function(key, region) {
            $('.locations input:checkbox[value="' + region + '"]').prop('checked', true);
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

    $('.viewgallery').on('click', function() {

        $(this).parent().parent().parent().find('.gallery a:first-child').click();

    });


    var weekDays = [{ label: 'Mon', value: 'monday' }, { label: 'Tue', value: 'tuesday' }, { label: 'Wed', value: 'wednesday' }, { label: 'Thur', value: 'thursday' }, { label: 'Fri', value: 'friday' }, { label: 'Sat', value: 'saturday' }, { label: 'Sun', value: 'sunday' }];

    $.each(weekDays, function(key, day) {

        var tmp = '<li class="daylabel">' + day.label + '</li>';

        $('#weekCal').append(tmp);
    });


    window.searchmeta = JSON.parse($('#metasearch').attr('data-meta'));
    console.log(searchmeta, window.params, 'window params');
    if((searchmeta.categoryfilters.length === 0)||(window.params.offerings.length ===0)){
        $('.secondaryseperator').hide();
        $('#secoptions').hide();
    }
    else{
        $('.secondaryseperator').show();
    }
    // Creating pagination
    $('.pagination').append('<div id="paginationstatus"><a href="#" data-action="first" class="first disabled"><span class="fa fa-chevron-left"></span><span class="fa fa-chevron-left"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="previous" class="previous disabled"><span class="fa fa-chevron-left"></span></a><input type="text"><a href="#" data-action="next" class="next"><span class="fa fa-chevron-right"></span>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href="#" data-action="last" class="last"><span class="fa fa-chevron-right"></span><span class="fa fa-chevron-right"></span></a></div>');
    $('.pagination').jqPagination({
        current_page: window.searchmeta.total_records === 0 ? 0 :(window.searchmeta.from === 0) ? 1 : Math.ceil(window.searchmeta.from / 10),
        max_page: Math.ceil(window.searchmeta.total_records / 10),
        page_string: 'Showing page {current_page} of {max_page}',
        paged: function(page) {
            
            window.newquery.offset = (page - 1) * 10;
            $('html, body').scrollTop(0);
            _.debouce(window.makerequest(), 200);
            // do something with the page variable
        }
    });

    function buildFilterCheck(data) {

    }
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

$(".optsecs").on("click", function(e){  
    if (window.innerWidth > 768) {
        if($(this).height() === 30){
            $(this).css( "height","auto");
            $(this).css( "overflow-y","auto");
            $(this).find(".chevron-icon").removeClass("fa-chevron-down");
            $(this).find(".chevron-icon").addClass("fa-chevron-up");
        }else{
            $(this).find(".chevron-icon").removeClass("fa-chevron-up");
            $(this).find(".chevron-icon").addClass("fa-chevron-down");
              $(this).css( "overflow-y","");
            $(this).css( "height","40px");
        }
    }
});
$("#catoptions").click();