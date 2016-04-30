fitternity.fithome = {
    initialize: function() {

        fitternity.createCarousel('featured-1', 'featured-1-controls', '', false);
        fitternity.createCarousel('featured-2', 'featured-2-controls', '', false);
        fitternity.createCarousel('featured-3', 'featured-3-controls', '', false);
        fitternity.createCarousel('saying-carousel', 'sayings-controls', '', true);
        fitternity.createMobileCarousel('saying-carousel', 'sayings-controls', '', true);

        setTimeout(function() {
            $('#loc').removeClass('disNone');
            $('#cat').removeClass('disNone');
            $('#search-btn').removeClass('disNone');
            fitternity.fithome.createSearches();
        }, 1000);
    },

    createSearches: function() {
        // Location Options
        var defaultlocs = [];
        var cc = window.getCookie("chosencity").toLowerCase();
        switch (cc) {
            case 'mumbai':
                defaultlocs = [{
                    name: 'All Mumbai',
                    slug: 'all',
                    location_group: 'top'
                }];
                break;
            case 'pune':
                defaultlocs = [{
                    name: 'All Pune',
                    slug: 'all',
                    location_group: 'top'
                }];
                break;
            case 'bangalore':
                defaultlocs = [{
                    name: 'All Bangalore',
                    slug: 'all',
                    location_group: 'top'
                }];
                break;
            case 'delhi':
                defaultlocs = [{
                    name: 'All Delhi',
                    slug: 'all',
                    location_group: 'top'
                }];
                break;
            case 'gurgaon':
                defaultlocs = [{
                    name: 'All Gurgaon',
                    slug: 'all',
                    location_group: 'top'
                }];
                break;
        }

        // Load Locations for the city
        $('#loc').selectize({
            maxItems: 1,
            valueField: 'slug',
            labelField: 'name',
            searchField: 'slug',
            create: false,
            preload: true,
            placeholder: 'Pick a Location',
            optgroups: [{
                value: 'popular',
                label: 'Popular'
            }, {
                value: 'general',
                label: 'All'
            }, {
                value: 'top',
                label: 'All'
            }, {
                value: 'recent',
                label: 'Recent',
            }],
            optgroupField: 'location_group',
            optgroupOrder: ['recent', 'top', 'popular', 'general'],
            render: {
                option: function(item) {
                    return "<div class='capitalize'>" + item.name + "</div>";
                }
            },
            load: function(query, callback) {
                // if (!query.length) return callback();
                $.ajax({
                    url: 'https://a1.fitternity.com/getlocations/' + cc,
                    type: 'GET',
                    error: function() {
                        callback();
                    },
                    success: function(res) {
                        // callback(res.repositories.slice(0, 10));
                        var fin = defaultlocs.concat(res.locations);
                        callback(fin);
                        $('.sectionsearch').show();
                    },
                    async: true
                });
            },
            onItemAdd: function(event) {
                var $d = $('#cat').selectize();
                $d[0].selectize.open();
            }
        });

        var catoption = [];
        switch (cc) {
            case 'mumbai':
                catoption = window.mumbaicatfeature;
                break;
            case 'pune':
                catoption = window.punecatfeature;
                break;
            case 'bangalore':
                catoption = window.bangcatfeature;
                break;
            case 'delhi':
                catoption = window.delhicatfeature;
                break;
            case 'gurgaon':
                catoption = window.gurgaoncatfeature;
                break;
        }
        // Load categories for the city
        $('#cat').selectize({
            maxItems: 1,
            valueField: 'id',
            labelField: 'title',
            searchField: 'title',
            create: false,
            preload: true,
            placeholder: 'Pick a Fitness Option',
            optgroups: [{
                value: 'featured',
                label: 'Featured Categories'
            }, {
                value: 'all',
                label: 'All'
            }],
            optgroupField: 'cat_group',
            optgroupOrder: ['all', 'featured'],
            render: {
                option: function(item) {
                    return "<div><span class='" + item.icon + "'></span><span class='capitalize title'>" + item.title + "</span></div>";
                }
            },
            load: function(query, callback) {
                callback(catoption);
            },
            onItemAdd: function(event) {
                $('#search-btn').click();
            }
        });

        $('.mobile-search').find('#cat').selectize();
        // Search Button
        $('#search-btn').on('click', function() {

            $('#search-btn .fa').removeClass('fa-search').addClass('fa-circle-o-notch fa-spin');
            var cc = window.getCookie("chosencity") !== undefined ? window.getCookie("chosencity").toLowerCase() : 'mumbai';
            var $l = $('#loc').selectize();
            var $c = $('#cat').selectize();
            var selectedloc = $l[0].selectize.getValue();
            var selectedcat = $c[0].selectize.getValue();
            var localRecent = JSON.parse(fitternity.fitLocalStorage.getlocal('recentsearch'));
            if (localRecent === null) {
                localRecent = [];
            }
           
            //get current city from the search

            var city = cc;
            var location = city;
            kyu1.pushevent('findersearch', { what: 'findersearch', dataobject: 'vendor', type: 'finder', page: 'homepage', city: cc, location: selectedloc.toLowerCase(), category: selectedcat.toLowerCase() });
            var path = "";
            selectedcat = (selectedcat === "") ? "fitness" : selectedcat;
            // replacing spaces with hyphen '-' for cleaner urls
            selectedloc = selectedloc.replace(' ', '-');
            if (selectedloc === "all" || selectedloc === "") {
                path = "/" + cc + "/" + selectedcat + "/all/all/all/all/0/popularity/desc";
            } else {
                path = "/" + cc + "/" + selectedcat + "/" + selectedloc + "/all/all/all/0/popularity/desc";
            }
            console.log(selectedloc, 'selectedloc');
            var localObject = { category: selectedcat, location: selectedloc === "" ? cc.toLowerCase() : selectedloc, slug: path, key: selectedcat + selectedloc };
             if (_.find(localRecent, function(x) {
                    return x.key === cat + location;
                }) === undefined) {
                localRecent.unshift(localObject);
                localRecent = localRecent.slice(0, 5);
                fitternity.fitLocalStorage.setlocal('recentsearch', JSON.stringify(localRecent));
            }
            window.location.href = path;
             console.log(path);
        });
    }
};

$(function() {
    fitternity.fithome.initialize();
    $('.testimonials').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true
    });
});

var categorySearch = function(cat) {
    var cc = window.getCookie("chosencity") !== undefined ? window.getCookie("chosencity").toLowerCase() : 'mumbai';
    kyu1.pushevent('HomePagecategoryclick', { what: 'category', dataobject: 'category', type: 'finder', page: 'homepage', city: cc, category: cat });
};

var featuredclick = function(vendor, pos, _id, type) {

    var cc = window.getCookie("chosencity") !== undefined ? window.getCookie("chosencity").toLowerCase() : 'mumbai';
    console.log(vendor, pos, _id, cc);
    kyu1.pushevent('homepagefeatured', { what: 'click', dataobject: 'vendor', type: type, page: 'homepage', city: cc, vendor: vendor, position: pos, vendor_id: _id });
};

var selectionclick = function(value, pos) {
    var cc = window.getCookie("chosencity") !== undefined ? window.getCookie("chosencity").toLowerCase() : 'mumbai';
    kyu1.pushevent('selectionclick', { what: 'click', dataobject: 'collections', type: 'introducingselections', position: pos, value: value, city: cc, page: 'homepage' });
};
