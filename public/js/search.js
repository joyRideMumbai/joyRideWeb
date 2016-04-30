/*Some Global Variables*/

function openMappopup(){
	
}

fitternity.fitSearch = {

	/*search Variables*/
	device: fitternity.detectdevice(),
	category: '',
	busy: false,
	firstload: false,
	showmap: false,
	from: 0,
	isGlobal: false,
	/*search Objects*/
	currentSearchCity: {
		name: 'Mumbai',
		id: '1',
		slug: 'mumbai'
	},

	searchquery: {   
		category: '',
		budget: [],
		offerings: [],
		facilities: [],
		regions: [],
		location: {       
			"city": "",
			"lat": "",
			"long": ""   
		},
		offset: {       
			from: 0,
			number_of_records: 10   
		},
		sort: {       
			sortfield: "popularity",
			order: "desc"   
		}
	},

	globalsearchquery: {
		"key": "",
		"city": "",
		"from": 0,
		"size": 10
	},

	searchterms: {
		category: '',
		total: 0,
		no_Records: 0,
		from: 0,
		sortfield: '',
		sortorder: '',
		page: 0,
		regions: [],
		facilities: [],
		offerings: [],
		budgets: []
	},

	/*Arrays*/
	searchResults: [],
	regionat: [],
	budgetat: [],
	locat: [],
	facat: [],
	offat: [],
	searchCardsArray: [],
	recentfindersearch: [],

	storage:$.localStorage,
	session:$.sessionStorage,
	cookie :$.cookieStorage,

	initialize: function() {
		var vthis = this;
		$('#global-search-input').css('visibility', 'hidden').addClass('disNone');
		vthis.firstload = vthis.checkSearchIsFirsTime();
		vthis.isGlobal  = vthis.checkIsGlobalSearch();
		vthis.setCurrentSearchQuery(vthis.firstload, vthis.isGlobal);
		if (vthis.firstload === true) {
			vthis.loadinitialSearch();
		} else {
			vthis.loadSearch();
		}
		vthis.setCurrentSearchTerms(vthis.searchResults);

		fitternity.initSideDrawers('filterdrawer', 'open-filter-menu', 'filterdrawer-toggle');
		//createSideDrawer('filterdrawer', 'open-sort-menu', 'filterdrawer-toggle');
		$('#filtersWorkSec').niceScroll({
			cursorcolor: "orange"
		});
		vthis.popstate();
	},

	checkSearchIsFirsTime: function() {
		var vthis = this;
		if (vthis.storage.isSet('firstload')) {
			if(vthis.storage.get('firstload') === true) {
				vthis.storage.set('firstload',false);
			}
		} else {
			vthis.storage.set('firstload',true);
		}
		return vthis.storage.get('firstload');
	},

	checkIsGlobalSearch: function() {
		var arr = (window.location.pathname).split("/");
		var isGlob = (arr[1] == "keywordsearch") ? true : false;
		return isGlob;
	},

	setCurrentSearchQuery: function(prepareFromUrl, isGlobal) {
		this.searchquery = (prepareFromUrl) ? this.createQueryFromUrl(isGlobal) : this.createQueryFromSeacrhParams(isGlobal);
		fitternity.fitLocalStorage.setlocal('current-searchterms', JSON.stringify(this.searchterms));
	},

	createQueryFromUrl: function(isGlobal) {
		var temp = this;
		var arr = (window.location.pathname).split("/");
		var urlquery = {};

		if (!isGlobal) {
			urlquery = {       
				'category': arr[2],
				'budget': temp.checkarray(arr[6]),
				'offerings': temp.checkarray(arr[5]),
				'facilities': temp.checkarray(arr[4]),
				'regions': temp.checkarray(arr[3]),
				'location': {
					'city': arr[1]
				},
				'offset': {
					'from': arr[7],
					'number_of_records': 10
				},
				'sort': {       
					sortfield: arr[8],
					order: arr[9]   
				}
			};
		} else {
			urlquery = {
				"key": arr[3],
				"city": arr[2],
				"from": 0,
				"size": 10
			};
		}
		temp.category = arr[2];
		return urlquery;
	},

	createQueryFromSeacrhParams: function(isGlobal) {
		var temp = this;
		var arr = (window.location.pathname).split("/");
		var q = {};

		if (!isGlobal) {
			q = temp.searchquery;
			if (temp.searchterms.category !== undefined && temp.searchterms.category !== '') {
				q.category = temp.searchterms.category;
			} else {
				q.category = arr[2];
			}

			if (temp.searchterms.regions !== undefined && temp.searchterms.regions !== []) {
				$(temp.searchterms.regions).each(function(r) {
					q.regions.push(temp.searchterms.regions[r].key);
				});
			} else {
				q.regions = arr[3];
			}

			if (temp.searchterms.facilities !== undefined && temp.searchterms.facilities !== []) {
				$(temp.searchterms.facilities).each(function(r) {
					q.facilities.push(temp.searchterms.facilities[r].key);
				});
			} else {
				q.facilities = arr[4];
			}

			if (temp.searchterms.offerings !== undefined && temp.searchterms.offerings !== []) {
				$(temp.searchterms.offerings).each(function(r) {
					q.offerings.push(temp.searchterms.offerings[r].key);
				});
			} else {
				q.offerings = arr[5];
			}

			if (temp.searchterms.budgets !== undefined && temp.searchterms.budgets !== []) {
				$(temp.searchterms.budgets).each(function(r) {
					q.budget.push(temp.searchterms.budgets[r].key);
				});
			} else {
				q.budget = arr[6];
			}

			q.location = {
				city: fitternity.fitLocalStorage.getlocal('currentCity') || 'mumbai'
			};
			q.offset = {
				from: arr[7],
				number_of_records: 10
			};
			q.sort = {
				sortfield: arr[8],
				order: arr[9]
			};
			category = q.category;
		} else {
			q = temp.globalsearchquery;
			q.key = arr[3];
			q.city = arr[2];
			q.from = 0;
			q.size = 1;
		}
		return q;
	},

	loadinitialSearch: function() {
		var vthis = this;
		vthis.searchResults = [];
		vthis.searchResults.push(JSON.parse($(document).find('input#searchresults').val()));
		vthis.currentSearchCity = JSON.parse($('#currentCity').val());
		var serverSearchterms = JSON.parse($('#searchterms').val());
		$('#searchresults').val('');
		vthis.category = (serverSearchterms.category === '') ? 'fitness' : serverSearchterms.category;
		vthis.createSearchLayout(vthis.searchResults);
	},

	loadSearch: function() {
		var vthis = this;
		var q = vthis.searchquery;
		vthis.currentSearchCity = JSON.parse($('#currentCity').val());
		vthis.category = (q.category === '') ? 'fitness' : q.category;
		vthis.searchResults = [];
		vthis.searchResults.push(vthis.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		vthis.createSearchLayout(vthis.searchResults);
	},

	setCurrentSearchTerms: function(fetchedresults) {
		var vthis = this;
		var metas, results;

		if (typeof fetchedresults !== 'undefined') {
			vthis.searchterms.category = vthis.category;

			if (typeof fetchedresults[0].searchresults !== 'undefined') {
				metas = fetchedresults[0].searchresults.meta;
				aggregates = fetchedresults[0].searchresults.results.aggregationlist;
			}

			if (typeof metas !== 'undefined') {
				vthis.searchterms.total = metas.total_records;
				vthis.searchterms.no_Records = metas.number_of_records;
				vthis.searchterms.from = metas.from;
				vthis.searchterms.sortfield = metas.sortfield;
				vthis.searchterms.sortorder = metas.sortorder;
			}
			vthis.searchterms.page = 1;
			if (typeof aggregates !== 'undefined') {
				vthis.searchterms.regions = aggregates.locationcluster;
				vthis.searchterms.facilities = aggregates.filters;
				vthis.searchterms.offerings = aggregates.offerings;
				vthis.searchterms.budgets = aggregates.budget;
			}
			fitternity.fitLocalStorage.setlocal('current-searchterms', JSON.stringify(vthis.searchterms));
		}
	},

	popstate: function() {
		var vthis = this;
		window.onpopstate = function(event) {
			var params = [];
			params = window.location.toString().split('/');
			vthis.searchterms.category = params[2];
			vthis.searchterms.city = params[1];
			params[3] = params[3].replace(/[+]/g, ',');
			vthis.searchterms.regions = params[3].replace(/-/g, ' ');
			params[4] = params[4].replace(/[+]/g, ',');
			vthis.searchterms.facilities = params[4].replace(/-/g, ' ');
			params[5] = params[5].replace(/[+]/g, ',');
			vthis.searchterms.offerings = params[5].replace(/-/g, ' ');
			params[6] = params[6].replace(/[+]/g, ',');
			vthis.searchterms.budgets = params[6].replace(/-/g, ' ');
			vthis.searchterms.from = params[7];
			vthis.searchterms.sortfield = params[8];
			vthis.searchterms.sortorder = params[9];
			vthis.loadSearch();
		};
	},

	//initial search method called on page reload from url or from home page
	initGallery: function(elem) {
		$(elem).closest('.vendor-gallery').magnificPopup({
			delegate: 'a',
			type: 'image',
			tLoading: 'Loading...',
			gallery: {
				enabled: true
			}
		}).magnificPopup('open');
	},

	checkarray: function(value) {
		var res = [];
		if (value === 'all' || value === undefined) {
			res = [];
		} else {
			value = value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ",");
			value = value.replace(/-/g, " ");
			res.push(value.split('+'));
		}
		return res;
	},

	createSearchLayout: function(results) {
		var vthis = this;
		vthis.setCurrentSearchTerms(results);
		vthis.showloader();

		setTimeout(function() {
			fitternity.fitDebounce(vthis.wipeOutAndRender(results), 300, true);
		}, 2000);

		vthis.pushhistory((vthis.isGlobal ? vthis.globalsearchquery : vthis.searchquery));
	},

	wipeOutAndRender: function(finalResults) {
		var vthis = this;
		var categories = vthis.getCategories(vthis.currentSearchCity.id);
		var amenities = vthis.getOfferings(vthis.category, vthis.currentSearchCity.name);

		var metas 		= (!vthis.firstload) ? finalResults[0].meta                     : finalResults[0].searchresults.meta;
		var aggregates  = (!vthis.firstload) ? finalResults[0].results.aggregationlist  : finalResults[0].searchresults.results.aggregationlist;
		var results     = (!vthis.firstload) ? finalResults[0].results.resultlist       : finalResults[0].searchresults.results.resultlist;

		if (!vthis.isGlobal) {
			vthis.makeCategoryFilter(categories, vthis.searchterms.category);
			vthis.makeAmenities(aggregates.offerings,vthis.searchterms.offerings);
		}
		vthis.makeLocationFilter(aggregates.locationcluster,vthis.searchterms.regions);
		vthis.makeFilters(aggregates.filters, vthis.searchterms.facilities);
		vthis.makebudget(aggregates.budget, vthis.searchterms.budgets);
		if (vthis.firstload) {
			vthis.createSearchCards(results);
		} else {
			this.imagesLoadMore();
		}
		vthis.createCounts(metas.total_records, metas.number_of_records, metas.sortfield, metas.sortorder);
		vthis.createPagination(finalResults[0], metas.total_records, metas.number_of_records, parseInt(metas.from));
		vthis.makeSearchSort(metas.sortfield,metas.sortorder);
		vthis.bindFilterClicks();
		vthis.hideLoader();
	},

	makeCategoryFilter: function(categories, currentCategory) {
		var cat = '';
		var isAll = (currentCategory === '' || currentCategory == 'fitness') ? 'checked' : '';

		var catIcon = '';
		if (categories.length > 0) {

			catIcon = fitternity.mapCityWiseCategoryIcons('fitness');
			cat += '<li class="capital"><div class="mui-radio filtercheckbox catfiltcheckbox">';
			cat += '<label title="All Fitness Options">' + catIcon + '<input ' + isAll + ' onchange="fitternity.fitSearch.applyCategoryFilters(this)" class="disNone" type="radio" name="categories" id="catradio9999" data-id="9999" data-name="" data-slug="fitness">All Fitness Options</label></div></li>';
			$(categories).each(function(i) {
				catIcon = fitternity.mapCityWiseCategoryIcons(categories[i].name);
				cat += '<li class="capital">';
				cat += '<div class="mui-radio filtercheckbox catfiltcheckbox">';
				if (currentCategory !== '' && currentCategory == categories[i].name) {
					cat += '<label title="' + categories[i].name + '">' + catIcon + '<input onchange="fitternity.fitSearch.applyCategoryFilters(this)" class="disNone" checked type="radio" name="categories" id="catradio' + i + '" data-id="' + categories[i]._id + '" data-name="' + categories[i].name + '" data-slug="' + categories[i].slug + '">' + categories[i].name + '</label>';
				} else {
					cat += '<label title="' + categories[i].name + '">' + catIcon + '<input onchange="fitternity.fitSearch.applyCategoryFilters(this)" class="disNone" type="radio" name="categories" id="catradio' + i + '" data-id="' + categories[i]._id + '" data-name="' + categories[i].name + '" data-slug="' + categories[i].slug + '">' + categories[i].name + '</label>';
				}
				cat += '</div>';
				cat += '</li>';
			});
			if ($(document).find('#filterBarMobile').is(':visible')) {
				$(document).find('.mobilebox.categories').html(cat);
			} else {
				$('#filtersSection').find('.filterbox.categories').find('.filterList').html(cat);
			}
		}
	},

	applyCategoryFilters: function(elem) {
		var selectedCategory = $(elem).attr('data-name');
		this.category = selectedCategory;
		this.searchquery.category = this.category;
		var q = this.searchquery;
		this.searchResults.push(this.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		this.createSearchLayout(this.searchResults);
	},

	makeLocationFilter: function(locations, currentLocations) {
		var cat = '';
		if (locations.length > 0) {
			$(locations).each(function(i) {
				cat += '<ul class=" mui-list--unstyled no-mar innerListLocationBox">';
				cat += '<li class="capital">';
				cat += '<div style="width:80%;display:inline-block" class="mui-checkbox innerlistBoxHeader">';
				if (currentLocations.length > 0) {
					var isMark = ($.inArray(locations[i].key, currentLocations) != -1) ? 'checked' : '';
					cat += '<label title="' + locations[i].key + '"  class="bold"><input ' + isMark + ' type="checkbox" id="locCheck' + i + '" value="' + JSON.stringify(locations[i]) + '">' + locations[i].key + ' (' + locations[i].count + ')</label>';
				} else {
					cat += '<label title="' + locations[i].key + '"  class="bold"><input type="checkbox" id="locCheck' + i + '" value="' + JSON.stringify(locations[i]) + '">' + locations[i].key + ' (' + locations[i].count + ')</label>';
				}
				cat += '</div>';
				cat += '<span style="width:20%;display:inline-block;vertical-align:top">';
				cat += '<button class="mui-btn mui-btn--flat no-pad no-mar toggleLocs"><i class="fa fa-chevron-down"></i></button>';
				cat += '</span>';
				cat += '<ul class="mui-list--unstyled sublocationList">';
				$(locations[i].regions).each(function(j) {
					cat += '<li class="capital">';
					cat += '<div class="mui-checkbox filtercheckbox locationCheckbox">';
					if (currentLocations.length > 0) {
						var isMarkInner = ($.inArray(locations[i].regions[j].key, currentLocations) != -1) ? 'checked' : '';
						cat += '<label title="' + locations[i].regions[j].key + '"><input ' + isMarkInner + ' onchange="fitternity.fitSearch.applyLocationFilters(this,false)" checked type="checkbox" id="locCheck' + i + '" data-key="' + locations[i].regions[j].key + '" data-count="' + locations[i].regions[j].count + '">' + locations[i].regions[j].key + ' (' + locations[i].regions[j].count + ')</label>';
					} else {
						cat += '<label title="' + locations[i].regions[j].key + '"><input onchange="fitternity.fitSearch.applyLocationFilters(this,false)" type="checkbox" id="locCheck' + i + '" data-key="' + locations[i].regions[j].key + '" data-count="' + locations[i].regions[j].count + '">' + locations[i].regions[j].key + ' (' + locations[i].regions[j].count + ')</label>';
					}
					cat += '</div>';
					cat += '</li>';
				});
				cat += '</ul>';
				cat += '</li>';
				cat += '</ul>';
			});
			if ($(document).find('#filterBarMobile').is(':visible')) {
				$(document).find('.mobilebox.locations').html(cat);
			} else {
				$('#filtersSection').find('.filterbox.locations').find('.filterList').html(cat);
			}
		}
	},

	applyLocationFilters: function(elem, isParent) {
		var selectedlocations = [];
		if (!isParent) {
			$('.innerListLocationBox').each(function(inn) {
				$(this).find('ul.sublocationList').find('li').each(function(lo) {
					var chk = $(this).find('input');
					if ($(chk).is(':checked')) {
						selectedlocations.push($(chk).attr('data-key'));
					}
				});
			});
		} else {

		}

		this.searchquery.regions = this.locat = selectedlocations;
		var q = this.searchquery;
		this.searchResults = [];
		this.searchResults.push(this.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		this.createSearchLayout(this.searchResults);
	},

	makeFilters: function(filters, currentFilters) {
		var cat = '';
		if (filters.length > 0) {
			$(filters).each(function(i) {
				cat += '<li class="capital">';
				cat += '<div class="mui-checkbox filtercheckbox filtcheckbox">';
				if (currentFilters.length > 0) {
					var isMark = ($.inArray(filters[i].key, currentFilters) != -1) ? 'checked' : '';
					cat += '<label title="' + filters[i].key + '" ><input ' + isMark + ' onchange="fitternity.fitSearch.applyFacilitiesFilter()" type="checkbox" id="filtradio' + i + '" data-key="' + filters[i].key + '" data-count="' + filters[i].count + '">' + filters[i].key + ' (' + filters[i].count + ')</label>';
				} else {
					cat += '<label title="' + filters[i].key + '"><input onchange="fitternity.fitSearch.applyFacilitiesFilter()" type="checkbox" id="filtradio' + i + '" data-key="' + filters[i].key + '" data-count="' + filters[i].count + '">' + filters[i].key + ' (' + filters[i].count + ')</label>';
				}
				cat += '</div>';
				cat += '</li>';
			});
			if ($(document).find('#filterBarMobile').is(':visible')) {
				$(document).find('.mobilebox.filters').html(cat);
			} else {
				$('#filtersSection').find('.filterbox.filters').find('.filterList').html(cat);
			}
		}
	},

	applyFacilitiesFilter: function() {
		var selectedFacilities = [];
		$('.filterbox.filters').find('ul.filterList').find('li').each(function(j) {
			var chk = $(this).find('input');
			if ($(chk).is(':checked')) {
				selectedFacilities.push($(chk).attr('data-key'));
			}
		});

		this.searchquery.facilities = this.facat = selectedFacilities;
		var q = this.searchquery;
		this.searchResults = [];
		this.searchResults.push(this.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		this.createSearchLayout(this.searchResults);
	},

	makeAmenities: function(offerings, currentOfferings) {
		var cat = '';
		if (offerings.length > 0) {
			$(offerings).each(function(i) {
				cat += '<li class="capital">';
				cat += '<div class="mui-checkbox filtercheckbox filtcheckbox">';
				if (currentOfferings.length > 0) {
					var isMark = ($.inArray(offerings[i].key, currentOfferings) != -1) ? 'checked' : '';
					cat += '<label title="' + offerings[i].key + '"><input onchange="fitternity.fitSearch.applyAmenitiesFilter()" ' + isMark + ' type="checkbox" id="filtradio' + i + '" data-key="' + offerings[i].key + '" data-count="' + offerings[i].count + '">' + offerings[i].key + ' (' + offerings[i].count + ')</label>';
				} else {
					cat += '<label title="' + offerings[i].key + '"><input onchange="fitternity.fitSearch.applyAmenitiesFilter()" type="checkbox" id="filtradio' + i + '" data-key="' + offerings[i].key + '" data-count="' + offerings[i].count + '">' + offerings[i].key + ' (' + offerings[i].count + ')</label>';
				}
				cat += '</div>';
				cat += '</li>';
			});
			if ($(document).find('#filterBarMobile').is(':visible')) {
				$(document).find('.mobilebox.amenities').html(cat);
			} else {
				$('#filtersSection').find('.filterbox.amenities').find('.filterList').html(cat);
			}
		}
	},

	applyAmenitiesFilter: function() {
		var selectedAmenities = [];
		$('.filterbox.amenities').find('ul.filterList').find('li').each(function(j) {
			var chk = $(this).find('input');
			if ($(chk).is(':checked')) {
				selectedAmenities.push($(chk).attr('data-key'));
			}
		});

		this.searchquery.offerings = this.offat = selectedAmenities;
		var q = this.searchquery;
		this.searchResults = [];
		this.searchResults.push(this.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		this.createSearchLayout(this.searchResults);
	},

	makebudget: function(budgets, currentBudgets) {
		var cat = '';
		if (budgets.length > 0) {
			$(budgets).each(function(i) {
				cat += '<li class="capital">';
				cat += '<div class="mui-checkbox filtercheckbox filtcheckbox">';
				if (currentBudgets.length > 0) {
					var isMark = ($.inArray(budgets[i].key, currentBudgets) != -1) ? 'checked' : '';
					cat += '<label title="' + budgets[i].key + '" ><input class="disNone" onchange="fitternity.fitSearch.applyBudgetFilter()" ' + isMark + ' type="checkbox" id="filtradio' + i + '" data-key="' + budgets[i].key + '" data-count="' + budgets[i].count + '"><i class="fa fa-rupee"></i>  ' + budgets[i].key + ' (' + budgets[i].count + ')</label>';
				} else {
					cat += '<label title="' + budgets[i].key + '" ><input class="disNone" onchange="fitternity.fitSearch.applyBudgetFilter()" type="checkbox" id="filtradio' + i + '" data-key="' + budgets[i].key + '" data-count="' + budgets[i].count + '"><i class="fa fa-rupee"></i>  ' + budgets[i].key + ' (' + budgets[i].count + ')</label>';
				}
				cat += '</div>';
				cat += '</li>';
			});
			if ($(document).find('#filterBarMobile').is(':visible')) {
				$(document).find('.mobilebox.budget').html(cat);
			} else {
				$('#filtersSection').find('.filterbox.budget').find('.filterList').html(cat);
			}
		}
	},

	applyBudgetFilter: function() {
		var selectedBudgets = [];
		$('.filterbox.budget').find('ul.filterList').find('li').each(function(j) {
			var chk = $(this).find('input');
			if ($(chk).is(':checked')) {
				selectedBudgets.push($(chk).attr('data-key'));
			}
		});
		this.searchquery.budget = selectedBudgets;
		var q = this.searchquery;
		this.searchResults = [];
		this.searchResults.push(this.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		this.createSearchLayout(this.searchResults);
	},

	createSearchCards: function(results) {

		this.searchCardsArray = results;
		var currentViewMode = $('.viewMode').find('button.activeView').attr('data-view');

		if (currentViewMode == 'list') {
			this.createListView(results);
		} else if (currentViewMode == 'grid') {
			this.createGridView(results);
		} else {
			this.createMapView(results);
		}
	},

	changeResultsView: function(viewMode) {
		var results = this.searchCardsArray;
		if (viewMode == 1) {
			this.createListView(results);
		} else if (viewMode == 2) {
			this.createGridView(results);
		} else {
			this.createMapView(results);
		}

		$('.viewMode').find('button:nth-child(' + viewMode + ')').addClass('activeView').attr('data-active', 'active');
		$('.viewMode').find('button:nth-child(' + viewMode + ')').siblings().removeClass('activeView').attr('data-active', 'inactive');
	},

	createListView: function(results) {

		var cat = '<div class="mui-row">'; //parent-row starts
		var rating_nomenclature = ['not-rated', 'foul', 'forgettable', 'fair', 'faultless', 'fabulous'];
		if (results.length > 0) {
			$(results).each(function(i) {
				//container col starts
				cat += '<div class="mui-col-md-12 mui-col-lg-12 mui-col-xs-12 mui-col-sm-12">';
				//searchcard starts
				cat += '<div class="mui-panel searchcard mui--z3">';

				//searchcard row-1 starts
				cat += '<div class="mui-row">';

				cat += '<div class="mui-col-md-3 mui-col-lg-3 mui-col-xs-3 mui-col-sm-3">';
				cat += '<div class="image" data-original="https://b.fitn.in/f/c/' + results[i].object.coverimage + '" style="background-image:url(https://b.fitn.in/f/c/' + results[i].object.coverimage + ');height:90px;width:100%;background-position:center center;background-size:cover;background-repeat:no-repeat;"></div>';
				cat += '</div>';

				cat += '<div class="mui-col-md-9 mui-col-lg-9 mui-col-xs-9 mui-col-sm-9">';
				var rateclass = rating_nomenclature[Math.ceil(results[i].object.average_rating)];
				cat += '<h2 class="no-mar no-pad capital bold orange"> ' + results[i].object.title + ' <span style="font-size:.7em;min-width:35px;line-height:20px" class="rating ' + rateclass + '">' + results[i].object.average_rating + '</span></h2>';
				cat += '<h5 class="uppercase mui--text-subhead">';
				cat += '<div>';
				cat += '<meta itemprop="addressRegion" content="' + results[i].object.city + '"/>';
				cat += '</div>';
				cat += '<div  itemprop="geo" itemscope="itemscope" itemtype="http://schema.org/GeoCoordinates" itemref="geo">';
				cat += '<meta itemprop="latitude" content="' + results[i].object.geolocation.lat + '" id="geo"/>';
				cat += '<meta itemprop="longitude" content="' + results[i].object.geolocation.lon + '" id="geo"/>';
				cat += '<span itemprop="addressLocality" class="icon-geo iconx"></span>' + results[i].object.location;
				cat += '</div>';
				cat += '</h5>';
				cat += '</div>';
				cat += '</div>'; //searchcard row-1 ends

				//searchcard row-2 starts
				cat += '<div style="padding:1rem 2rem .1rem" class="mui-row">';
				cat += '<div class="mui-col-md-3 mui-col-lg-3 mui-col-xs-3 mui-col-sm-3 mui--text-right"><p class="mui--text-subhead mui--text-dark-secondary">Address : </p></div>';
				cat += '<div class="mui-col-md-9 mui-col-lg-9 mui-col-xs-9 mui-col-sm-9 no-pad">';
				cat += '<span class="mui--text-subhead">' + results[i].object.contact.address + '</span>';
				cat += '</div></div>'; //searchcard row-2 ends

				//searchcard row-3 starts
				cat += '<div style="padding:0 2rem" class="mui-row">';
				cat += '<div class="mui-col-md-3 mui-col-lg-3 mui-col-xs-3 mui-col-sm-3 mui--text-right"><p class="mui--text-subhead mui--text-dark-secondary">Phone No :</p> </div>';
				cat += '<div class="mui-col-md-9 mui-col-lg-9 mui-col-xs-9 mui-col-sm-9 no-pad">';
				cat += '<p class="mui--text-subhead">' + results[i].object.fitternityno + '</p>';
				cat += '</div></div>'; //searchcard row-3 ends

				//searchcard row-4 starts
				cat += '<div style="padding:0 2rem" class="mui-row">';
				cat += '<div class="mui-col-md-3 mui-col-lg-3 mui-col-xs-3 mui-col-sm-3 mui--text-right"><p class="mui--text-subhead mui--text-dark-secondary">Featured In : </p></div>';
				cat += '<div class="mui-col-md-9 mui-col-lg-9 mui-col-xs-9 mui-col-sm-9 no-pad">';
				$(results[i].object.categorytags).each(function(c) {
					cat += '<span class="chips capital">' + results[i].object.categorytags[c] + '</span>';
				});
				cat += '</div></div>'; //searchcard row-4 ends

				//searchcard row-5 starts
				cat += '<div style="padding:0rem 2rem" class="mui-row">';
				cat += '<div class="mui-col-md-3 mui-col-lg-3 mui-col-xs-3 mui-col-sm-3 mui--text-right"><p class="mui--text-subhead mui--text-dark-secondary">Photos : </p></div>';
				cat += '<div class="mui-col-md-9 mui-col-lg-9 mui-col-xs-9 mui-col-sm-9 no-pad mui--text-left">';
				cat += '<div class="mui--text-right vendor-gallery">';
				if (results[i].object.photos.length > 0) {
					cat += '<ul style="height:40px !important" class="mui-list--unstyled mui-list--inline no-mar mui--pull-left">';
					$(results[i].object.photos).each(function(p) {
						cat += '<li><a href="https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + '">';
						cat += '<div class="image" data-original="https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + '" style="background-image:url(https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + ');height:36px;width:36px;background-position:center center;background-size:cover;background-repeat:no-repeat;" class="mini-img"></div>';
						cat += '</a></li>';
					});
					cat += '</ul>';
				}
				cat += '</div></div></div>'; //searchcard row-5 ends

				//searchcard row-6 starts
				cat += '<div class="mui-row">';
				cat += '<div class="mui-col-md-12 mui-col-lg-12 mui-col-xs-12 mui-col-sm-12">';
				if (results[i].object.facilities.indexOf('free trial') == -1) {
					cat += '<button href="#bookmodal" onclick="" class="popup-modal mui-btn mui-btn--small mui-btn--accent mui--pull-right">Book A Free Trial</button>';
				} else if (results[i].object.facilities.indexOf('free trial') >= 0) {
					cat += '<button href="#animatedModal" onclick="" class="trialmobile mui-btn mui-btn--small mui-btn--accent mui--pull-right">Book A Free Trial</button>';
				}
				cat += '</div>'; //searchcard row-6 ends

				cat += '</div>';
				cat += '</div>'; //searchcard ends
				cat += '</div>'; //container col ends
			});
			cat += '</div>'; //parent-row ends
			$('#resultsSection').html(cat);
			this.imagesLoadMore();
		}
	},

	createGridView: function(results) {

		var rating_nomenclature = ['not-rated', 'foul', 'forgettable', 'fair', 'faultless', 'fabulous'];
		var cat = ''; //parent-row starts
		if (results.length > 0) {
			$(results).each(function(i) {
				cat += '<div class="mui-col-md-6 mui-col-xs-6 mui-col-sm-6 mui-col-lg-6">';
				cat += '<div class="mui-panel searchcard mui--z4 no-pad">';
				cat += '<div class="image" style="background-image:linear-gradient(rgba(0, 0, 0, 0.10),rgba(0, 0, 0, 0.90)), url(https://b.fitn.in/f/c/' + results[i].object.coverimage + ');min-height:175px;max-height:150px;background-position:center center;background-size:cover;background-repeat:no-repeat;">';
				cat += '<div class="inner-content" style="z-index:100;width: 100%;position:relative;bottom: 0;left: 0;color: #FFF;top:80px;padding:2rem;">';
				cat += '<div class="mui-row">';
				cat += '<div class="mui-col-md-9 mui-col-xs-9 mui-col-sm-9 mui-col-lg-9">';
				cat += '<h4 class="mui--text-header orange capital">' + results[i].object.title + '</h4>';
				cat += '<div class="location mui--text-caption capitalize">' + results[i].object.city + '</div>';
				cat += '</div>';
				cat += '<div class="mui-col-md-3 mui-col-xs-3 mui-col-sm-3 mui-col-lg-3">';
				var rateclass = rating_nomenclature[Math.ceil(results[i].object.average_rating)];
				cat += '<span style="font-size:1.5rem;min-width:35px;line-height:20px" class="rating ' + rateclass + '">' + results[i].object.average_rating + '</span>';
				cat += '</div>';
				cat += '</div>';
				cat += '</div>';
				cat += '</div>';
				cat += '<div class="infoSection" style="padding:2rem;">';
				cat += '<div class="mui-row">';
				cat += '<div id="address" class="no-pad mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p class="mui--text-right"><i class="fa fa-map-marker fa-lg orange"></i></p>';
				cat += '</div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				cat += results[i].object.contact.address;
				cat += '</div>';
				cat += '</div>';
				cat += '<div class="mui-row">';
				cat += '<div id="phone" class="no-pad mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p class="mui--text-right"><i class="fa fa-phone fa-lg orange"></i></p>';
				cat += '</div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				cat += '<p>' + results[i].object.fitternityno + '</p>';
				cat += '</div>';
				cat += '</div>';
				cat += '<div class="mui-row">';
				cat += '<div id="tags" class="no-pad mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p class="mui--text-right"><i class="fa fa-tag fa-lg orange"></i></p>';
				cat += '</div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				$(results[i].object.categorytags).each(function(c) {
					cat += '<span class="chips capital">' + results[i].object.categorytags[c] + '</span>';
				});
				cat += '</div></div>';
				cat += '<div class="mui-row">';
				cat += '<div class="mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p><i class="fa fa-picture-o fa-lg orange"></i></p></div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				cat += '<div class="mui--text-right vendor-gallery">';
				if (results[i].object.photos.length > 0) {
					cat += '<ul style="height:40px !important" class="mui-list--unstyled mui-list--inline no-mar mui--pull-left">';
					$(results[i].object.photos).each(function(p) {
						cat += '<li><a href="https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + '">';
						cat += '<div class="image" data-original="https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + '" style="background-image:url(https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + ');height:36px;width:36px;background-position:center center;background-size:cover;background-repeat:no-repeat;" class="mini-img"></div>';
						cat += '</a></li>';
					});
					cat += '</ul>';
				}
				cat += '</div>';
				cat += '</div></div>';
				cat += '<div style="margin-top:1rem" class="mui-row">';
				cat += '<div class="mui-col-md-12 mui-col-lg-12 mui-col-xs-12 mui-col-sm-12 mui--text-center">';
				if (results[i].object.facilities.indexOf('free trial') == -1) {
					cat += '<button href="#bookmodal" onclick="" class="popup-modal mui-btn mui-btn--small mui-btn--accent">Book A Free Trial</button>';
				} else if (results[i].object.facilities.indexOf('free trial') >= 0) {
					cat += '<button href="#animatedModal" onclick="" class="trialmobile mui-btn mui-btn--small mui-btn--accent">Book A Free Trial</button>';
				}
				cat += '</div>';
				cat += '</div></div></div></div>';
			});
		}

		$('#resultsSection').html(cat);
		this.imagesLoadMore();
		var $span = $('#resultsSection div.mui-col-md-6.mui-col-xs-6.mui-col-sm-6.mui-col-lg-6');
		for (var i = 0; i < $span.length; i += 2) {
			var $div = $("<div/>", {
				class: 'mui-row'
			});
			$span.slice(i, i + 2).wrapAll($div);
		}

		$($span).each(function(s) {
			$(this).find('div#address').html('<p class="mui--text-right"><i class="fa fa-map-marker fa-lg orange"></i></p>');
			$(this).find('div#phone').html('<p class="mui--text-right"><i class="fa fa-phone fa-lg orange"></i></p>');
			$(this).find('div#tags').html('<p class="mui--text-right"><i class="fa fa-tag fa-lg orange"></i></p>');
		});
	},

	createMapView: function(results) {
		var vthis = this;
		var maps = '<div id="mapPlayArea" class="mui-row">';
		maps += '<div style="width:100%" id="actualMap">';
		maps += '<div class="mui-col-md-12 mui-col-lg-12 mui-col-sm-12 mui-col-xs-12">';
		maps += '<div style="width:100%;min-height:500px" class="mui-panel" id="Fitmap"></div>';
		maps += '</div>';
		maps += '<div style="width:10%;position:absolute;float:right;background:rgba(97, 97, 97, 0.61);padding:2rem" id="actualMapCards">';
		maps += '<div class="mui-col-md-12 mui-col-lg-12 mui-col-sm-12 mui-col-xs-12"></div>';
		maps += '</div>';
		maps += '</div>';
		$('#resultsSection').html(maps);
		var map = L.map('Fitmap', {
			center: [51.505, -0.09],
			zoom: 13,
			dragging: true,
			touchZoom: true
		});

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		if (results.length > 0) {
			$(results).each(function(i) {
				L.marker([results[i].object.geolocation.lat, results[i].object.geolocation.long])
					.addTo(map)
					.bindPopup(results[i].object.title)
					.openPopup();
			});
		}

		map.on('popupopen', function() {  
		  vthis.openMapCarousel(map,results);
		});
	},

	openMapCarousel:function(map,results){

		var rating_nomenclature = ['not-rated', 'foul', 'forgettable', 'fair', 'faultless', 'fabulous'];
		var cat = ''; //parent-row starts
		if (results.length > 0) {
			$(results).each(function(i) {
				cat += '<div data-lat="'+results[i].object.geolocation.lat+'" data-long="'+results[i].object.geolocation.long+'" class="mui-col-md-12 mui-col-xs-12 mui-col-sm-12 mui-col-lg-12">';
				cat += '<div class="mui-panel searchcard mui--z4 no-pad">';
				cat += '<div class="image" style="background-image:linear-gradient(rgba(0, 0, 0, 0.10),rgba(0, 0, 0, 0.90)), url(https://b.fitn.in/f/c/' + results[i].object.coverimage + ');min-height:175px;max-height:150px;background-position:center center;background-size:cover;background-repeat:no-repeat;">';
				cat += '<div class="inner-content" style="z-index:100;width: 100%;position:relative;bottom: 0;left: 0;color: #FFF;top:80px;padding:2rem;">';
				cat += '<div class="mui-row">';
				cat += '<div class="mui-col-md-9 mui-col-xs-9 mui-col-sm-9 mui-col-lg-9">';
				cat += '<h4 class="mui--text-header orange capital">' + results[i].object.title + '</h4>';
				cat += '<div class="location mui--text-caption capitalize">' + results[i].object.city + '</div>';
				cat += '</div>';
				cat += '<div class="mui-col-md-3 mui-col-xs-3 mui-col-sm-3 mui-col-lg-3">';
				var rateclass = rating_nomenclature[Math.ceil(results[i].object.average_rating)];
				cat += '<span style="font-size:1.5rem;min-width:35px;line-height:20px" class="rating ' + rateclass + '">' + results[i].object.average_rating + '</span>';
				cat += '</div>';
				cat += '</div>';
				cat += '</div>';
				cat += '</div>';
				cat += '<div class="infoSection" style="padding:2rem;">';
				cat += '<div class="mui-row">';
				cat += '<div id="address" class="no-pad mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p class="mui--text-right"><i class="fa fa-map-marker fa-lg orange"></i></p>';
				cat += '</div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				cat += results[i].object.contact.address;
				cat += '</div>';
				cat += '</div>';
				cat += '<div class="mui-row">';
				cat += '<div id="phone" class="no-pad mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p class="mui--text-right"><i class="fa fa-phone fa-lg orange"></i></p>';
				cat += '</div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				cat += '<p>' + results[i].object.fitternityno + '</p>';
				cat += '</div>';
				cat += '</div>';
				cat += '<div class="mui-row">';
				cat += '<div id="tags" class="no-pad mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p class="mui--text-right"><i class="fa fa-tag fa-lg orange"></i></p>';
				cat += '</div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				$(results[i].object.categorytags).each(function(c) {
					cat += '<span class="chips capital">' + results[i].object.categorytags[c] + '</span>';
				});
				cat += '</div></div>';
				cat += '<div class="mui-row">';
				cat += '<div class="mui-col-md-2 mui-col-xs-2 mui-col-sm-2 mui-col-lg-2">';
				cat += '<p><i class="fa fa-picture-o fa-lg orange"></i></p></div>';
				cat += '<div class="mui-col-md-10 mui-col-xs-10 mui-col-sm-10 mui-col-lg-10">';
				cat += '<div class="mui--text-right vendor-gallery">';
				if (results[i].object.photos.length > 0) {
					cat += '<ul style="height:40px !important" class="mui-list--unstyled mui-list--inline no-mar mui--pull-left">';
					$(results[i].object.photos).each(function(p) {
						cat += '<li><a href="https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + '">';
						cat += '<div class="image" data-original="https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + '" style="background-image:url(https://b.fitn.in/f/g/thumbs/' + results[i].object.photos[p] + ');height:36px;width:36px;background-position:center center;background-size:cover;background-repeat:no-repeat;" class="mini-img"></div>';
						cat += '</a></li>';
					});
					cat += '</ul>';
				}
				cat += '</div>';
				cat += '</div></div>';
				cat += '<div style="margin-top:1rem" class="mui-row">';
				cat += '<div class="mui-col-md-12 mui-col-lg-12 mui-col-xs-12 mui-col-sm-12 mui--text-center">';
				if (results[i].object.facilities.indexOf('free trial') == -1) {
					cat += '<button href="#bookmodal" onclick="" class="popup-modal mui-btn mui-btn--small mui-btn--accent">Book A Free Trial</button>';
				} else if (results[i].object.facilities.indexOf('free trial') >= 0) {
					cat += '<button href="#animatedModal" onclick="" class="trialmobile mui-btn mui-btn--small mui-btn--accent">Book A Free Trial</button>';
				}
				cat += '</div>';
				cat += '</div></div></div></div>';
			});
		}
		$('#actualMapCards').children('div').html(cat);
		$('#actualMapCards').css('right',$('#actualMapCards').parent().offset().left - 83).css('height',$('#actualMapCards').siblings().height());
		$('#actualMapCards').animate({width:'400px'}, {duration: 500});
		this.imagesLoadMore();
		
		$('#actualMapCards').children('div').addClass('owl-carousel').owlCarousel({
			responsive: {
				300: {
					items: 1,
					stagePadding: 25
				},
				600: {
					items: 1
				},
				1024: {
					items: 1
				}
			},
			slideBy: 1,
			pagination: true,
			paginationNumbers: false,
			lazyLoad: true,
			autoHeight: true,
			loop: true
		}).on('changed.owl.carousel',function(elem){
		    /*var current = this.currentItem;
		  	var lat =  $(myCardMapDiv).find(".owl-item.active").find('div.mui-col-md-12').attr('data-lat');
			var long = $(myCardMapDiv).find(".owl-item.active").find('div.mui-col-md-12').attr('data-long');
			mapSmall.setView([lat, long], 8, {animation: true});*/
		});

		$('div.owl-item').css('width','325px');

		
		$('span.controls').click(function() {
			if ($(this).hasClass('left')) {
				$('.owl-carousel').trigger('prev.owl.carousel');
			} else {
				$('.owl-carousel').trigger('next.owl.carousel');
			}
		});
	},

	imagesLoadMore: function() {
		/*images load more functinality*/
		$('.searchcard').each(function(card) {
			var imglen = $(this).find('.vendor-gallery').find('ul').find('li').length;
			if (imglen > 3) {
				$(this).find('.vendor-gallery').find('ul').find('li').each(function(p) {
					if (p > 2) {
						$(this).addClass('disNone');
					}
				});
				$(this).find('.vendor-gallery').find('ul').append('<li onclick="fitternity.fitSearch.initGallery(this)" class="loadmoreimages"><span>+ ' + (imglen - 3) + '</span></li>');
			}

			$(this).find('p').each(function(index, item) {
				if ($.trim($(item).text()) === "") {
					$(item).remove();
				}
			});
		});
	},

	createCounts: function(total, number_records, popularity, order) {
		$('#number_of_records').html($('#resultsSection').find('.searchcard').length);
		$('.total_records').html(total);
	},

	createPagination: function(res, total, itemsPerPage, currentPage) {
		var max = 0;
		var temp = this;
		if (parseInt(total / itemsPerPage) === 0) {
			max = max + 1;
		} else {
			max = parseInt(total / itemsPerPage);
		}

		$('.searchPager,.searchPager2').jqPagination({
			current_page: parseInt(currentPage + 1),
			max_page: max,
			paged: function(page) {
				temp.from = (page === 1) ? 0 : (page + itemsPerPage);
				temp.searchquery.offset = {
					from: temp.from,
					number_of_records: 10
				};

				var q = temp.searchquery;
				temp.searchResults = temp.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order);
				temp.createSearchLayout(temp.searchResults);
			}
		});
	},

	bindFilterClicks: function() {
		$('ul.sublocationList').slideUp();
		$('.toggleLocs').click(function() {
			$(this).parent().siblings('ul.sublocationList').slideToggle();
			$(this).find('i').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
		});
		$('#showHideFilterMenubtn').click(function() {

			$('#upperSection').find('div:nth-child(3)').toggleClass('mui-col-md-5 mui-col-lg-5 mui-col-md-7 mui-col-lg-7');
			$('#upperSection').find('div').first().animate({
				width: "toggle"
			});

			$('#filterBarMobile').next().toggleClass('mui-col-md-10 mui-col-lg-10 mui-col-md-7 mui-col-lg-7');
			$('#filtersSection').parent().animate({
				width: "toggle"
			});

			$(this).toggleClass('fa-arrow-left fa-arrow-right');
			$(this).attr('title', ($(this).hasClass('fa-arrow-right') ? 'Show Filters' : 'Hide filters'));
		});
		$("ul.sublocationList").niceScroll({
			cursorcolor: "orange"
		});
		$('.filterList').niceScroll({
			cursorcolor: "orange"
		});
		$(document).ajaxComplete(function(event) {
			$('.toggleLocs').click(function() {
				$(this).parent().siblings('ul.sublocationList.flow-hidden').slideToggle();
				$(this).find('i').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
			});
		});

		var topSearch = '';
		$('.footer').find('ul.links:not(:last)').each(function(l) {
			topSearch += '<li>' + $(this).find('li:nth-child(1)').html() + '</li>';
			topSearch += '<li>' + $(this).find('li:nth-child(2)').html() + '</li>';
		});

		$('#recentSection').find('ul.toplinks').html(topSearch);
		this.createSearchChips();

		$("#filterRating").rateYo({
			//rating: 3,
			starWidth: "20px",
			halfStar: true,
			spacing: "4px",
			onChange: function(rating, rateYoInstance) {
				var cardraTing = 0;
				$('.searchcard').each(function() {
					cardraTing = parseInt($(this).find('span.rating').text());
					if (cardraTing <= rating) {
						$(this).fadeIn();
					} else {
						$(this).fadeOut();
					}

				});
			}
		});
	},

	createSearchChips: function() {
		var chips = [];
		$('.filterbox.categories').find('ul').find('li:not(:first-child)').each(function(i) {
			if ($(this).find('input[name=categories]').is(':checked')) {
				chips.push({
					filterType: 'categories',
					filterparam: $(this).find('label').attr('title')
				});
				return false;
			}
		});

		/*$('.filterbox.locations .filterList').find('ul').each(function(i) {
			if ($(this).children('li').first().find('div').find('input[type=checkbox]').is(':checked')) {
				chips.push({
					filterType: 'locations',
					filterparam: $(this).children('li').first().find('div').find('label').text()
				});
			}
			else{
				var inner = $(this).children('li').first().find('ul.sublocationList');
				$(inner).find('li').each(function(o){
					if ($(this).find('input[type=checkbox]').is(':checked')) {
						chips.push({
							filterType: 'regions',
							filterparam: $(this).find('label').attr('title')
						});
						return false;
					}
				});
			}
		});*/

		$('.filterbox.filters').find('ul').find('li').each(function(i) {
			if ($(this).find('input[name=categories]').is(':checked')) {
				chips.push({
					filterType: 'offerings',
					filterparam: $(this).find('label').attr('title')
				});
				return false;
			}
		});

		$('.filterbox.amenities').find('ul').find('li').each(function(i) {
			if ($(this).find('input[name=categories]').is(':checked')) {
				chips.push({
					filterType: 'facilities',
					filterparam: $(this).find('label').attr('title')
				});
				return false;
			}
		});

		$('.filterbox.budget').find('ul').find('li').each(function(i) {
			if ($(this).find('input[name=categories]').is(':checked')) {
				chips.push({
					filterType: 'budget',
					filterparam: $(this).find('label').attr('title')
				});
				return false;
			}
		});


		if (chips.length > 0) {
			$('.searchChips').html('');
			$(chips).each(function(c) {
				$('.searchChips').append('<li><span data-filterType=' + chips[c].filterType + '>' + chips[c].filterparam + '<i onclick="fitternity.fitSearch.clearFilterViaChip(this)" class="fa fa-times"></i></span></li>');
			});
		}

		if ($('.searchChips li').length > 0) {
			$('.filterbox.searchTerms').show();
		} else {
			$('.filterbox.searchTerms').hide();
		}
	},

	clearFilterViaChip: function(elem) {

		var catType = $(elem).parent().attr('data-filterType');
		$(elem).parent().parent().remove();
		var q = this.searchquery;
		if (catType == 'categories') {
			q.category = '';
			$('.filterbox.categories').find('ul').find('li:first-child').find('label').click();
			return;
		} else if (catType == 'locations') {

		}
		this.searchResults = [];
		this.searchResults.push(this.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		this.createSearchLayout(this.searchResults);
	},

	commatoplus: function(text) {
		return text.replace(/,/g, '+').replace(/ /g, '-');
	},

	/*Push State Logic*/
	pushhistory: function(searchterms) {
		//this.pushsearchhistory(searchterms);
		var regions = '';
		var facilities = '';
		var offerings = '';
		var budget = '';

		if (searchterms.regions === '' || searchterms.regions === undefined) {
			regions = "all";
		} else {
			if ($.isArray(searchterms.regions) && searchterms.regions.length > 0) {
				$(searchterms.regions).each(function(r) {
					regions += searchterms.regions[r] + "+";
				});
			} else {
				regions = "all";
			}
		}

		if (searchterms.facilities === '' || searchterms.facilities === undefined) {
			facilities = "all";
		} else {
			if ($.isArray(searchterms.facilities) && searchterms.facilities.length > 0) {
				$(searchterms.facilities).each(function(r) {
					facilities += searchterms.facilities[r] + "+";
				});
			} else {
				facilities = "all";
			}
		}

		if (searchterms.offerings === '' || searchterms.offerings === undefined) {
			offerings = "all";
		} else {
			if ($.isArray(searchterms.offerings) && searchterms.offerings.length > 0) {
				$(searchterms.offerings).each(function(r) {
					offerings += searchterms.offerings[r] + "+";
				});
			} else {
				offerings = "all";
			}
		}

		if (searchterms.budget === '' || searchterms.budget === undefined) {
			budget = "all";
		} else {
			if ($.isArray(searchterms.budget) && searchterms.budget.length > 0) {
				$(searchterms.budget).each(function(r) {
					budget += searchterms.budget[r] + "+";
				});
			} else {
				budget = "all";
			}
		}

		var category = (searchterms.category === undefined || searchterms.category === 'all fitness options') ? 'fitness' : (searchterms.category);
		var froms = (searchterms.from === undefined || searchterms.from === '') ? 0 : (searchterms.from);
		var sortfield = (searchterms.sortfield === undefined || searchterms.sortfield === '') ? 'popularity' : (searchterms.sortfield);
		var sortorder = (searchterms.sortorder === undefined || searchterms.sortorder === '') ? 'desc' : (searchterms.sortorder);
		var origin = window.location.origin;
		var newUrl = origin + "/" + this.currentSearchCity.name.toLowerCase() + "/" + category + "/" + regions + "/" + facilities + "/" + offerings + "/" + budget + "/" + froms + "/" + sortfield + "/" + sortorder;
		window.history.pushState({
			id: 'searchFinders'
		}, '', newUrl);
	},

	pushsearchhistory: function(search) {
		var vthis = this;
		var regions = '';

		if (search.regions === '' || search.regions === undefined) {
			regions = "all";
		} else {
			if ($.isArray(search.regions) && search.regions.length > 0) {
				$(search.regions).each(function(r) {
					regions += search.regions[r] + "+";
				});
			} else {
				regions = "all";
			}
		}

		var pushsearch = {
			'category': (search.category === undefined || search.category === '' || search.category === 'all' || search.category === 'all fitness options') ? 'fitness' : search.category,
			'regions': regions,
			'city': vthis.currentSearchCity.name.toLowerCase()
		};

		var newRec = [];
		if (fitternity.fitLocalStorage.getlocalJsonFormat('recentfindersearch') === null) {
			newRec.push(pushsearch);
			fitternity.fitLocalStorage.setlocalJsonFormat('recentfindersearch', newRec);
		} else {
			var recent = $(fitternity.fitLocalStorage.getlocalJsonFormat('recentfindersearch')).each(function(e, i) {
				var rec = {};
				if (e[i].category == pushsearch.category && e[i].regions == pushsearch.regions && e[i].city == pushsearch.city) {
					rec = e[i];
					return false;
				}
				return rec;
			});

			if (recent === undefined) {
				// var newRec = [];
				newRec.push(pushsearch);
				newRec.splice(6, 1);
				fitternity.fitLocalStorage.setlocalJsonFormat('recentfindersearch', newRec);
			}
		}
		vthis.recentfindersearch = fitternity.fitLocalStorage.getlocalJsonFormat('recentfindersearch');
	},

	createRecentsViews: function() {
		var vthis = this;
		var sr = '';
		if (vthis.recentfindersearch.length > 0) {
			$(vthis.recentfindersearch).each(function(rc) {
				sr += '<li>';
				var href = '/' + vthis.recentfindersearch[rc].city + '/' + vthis.recentfindersearch[rc].category + '/all/all/all';
				sr += '<a href="' + href + '">' + '' + vthis.recentfindersearch[rc].city + '</a>';
				sr += '</li>';
			});
			$('.recentSearches').html(sr);
		}
	},

	resetAllFilters: function() {
		var vthis = this;
		var q = {       
			'category': 'fitness',
			'budget': [],
			'offerings': [],
			'facilities': [],
			'regions': [],
			'location': {
				'city': vthis.currentSearchCity.name
			},
			'offset': {
				'from': 0,
				'number_of_records': 10
			},
			'sort': {       
				sortfield: 'popularity',
				order: 'desc'  
			}
		};
		vthis.category = 'fitness';
		vthis.searchquery = q;
		vthis.searchResults = [];
		vthis.searchResults.push(vthis.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		vthis.createSearchLayout(vthis.searchResults);
	},

	makeSearchSort: function(sortname, sortorder) {

		var child = (sortname.toUpperCase() == 'POPULARITY') ? 0 : 1;
		var sorticon = (sortorder.toLowerCase() == 'desc') ? '<i class="fa fa-long-arrow-down"></i>' : '<i class="fa fa-long-arrow-up"></i>';

		$('form#sortSec').find('a:nth-child(' + child + ')')
			.attr('data-sortname', sortname)
			.addClass('activeView')
			.siblings('a')
			.removeClass('activeView');

		$('form#sortSec').find('a:nth-child(' + child + ')')
			.find('span.sortorder')
			.removeClass('hide')
			.html(sorticon)
			.siblings('a')
			.find('span.sortorder')
			.addClass('hide')
			.html('');
	},

	sortResults: function(elem) {
		var vthis = this;
		var sortname = $(elem).attr('data-sortname');
		var ordername = $(elem).attr('data-sortorder');

		var selectedSort = (sortname == 'popularity') ? 'popularity' : 'average_rating';
		var selectedOrder = (sortname == 'desc') ? 'asc' : 'desc';
		vthis.showloader();

		vthis.searchquery.sort.sortfield = selectedSort;
		vthis.searchquery.sort.order = selectedOrder;

		var q = vthis.searchquery;
		vthis.searchResults = [];
		vthis.searchResults.push(vthis.getSearches(q.offset.from, q.category, q.location.city, q.offerings, q.regions, q.facilities, q.budget, q.sort.sortfield, q.sort.order));
		vthis.createSearchLayout(vthis.searchResults);

		$(elem).addClass('activeView').siblings().removeClass('activeView');
		if (sortname == 'desc') {
			$(elem).find('.sortorder').html('<i class=>"fa fa-lg fa-long-arrow-up"</i>');
		} else {
			$(elem).find('.sortorder').html('<i class="fa fa-lg fa-long-arrow-down"></i>');
		}
		$(elem).attr('data-sortorder', selectedOrder);
		$(elem).siblings().find('.sortorder').html('');
	},

	showloader: function() {
		$('.loading').waitMe({
			effect: 'bounce',
			text: 'Fetching Results',
			bg: 'rgba(255,255,255,0.7)',
			color: '#000'
		});
	},

	hideLoader: function() {
		$('.loading').waitMe("hide");
	},

	//Ajax calls to call API
	getSearches: function(from, category, city, offerings, regions, facilities, budget, sort, order) {
		if (budget !== undefined && budget.indexOf('?') >= 0) {
			var x = budget.split('?');
			budget = x[0];
		}

		var query = {
			'category': (category === undefined || category === 'fitness' || category === '' || category === 'all fitness options') ? '' : category.toString().replace(/-/g, ' '),
			'budget': (budget === undefined || budget === '' || budget === 'all') ? '' : budget,
			'offerings': (offerings === undefined || offerings === '' || offerings === 'all') ? '' : offerings,
			'facilities': (facilities === undefined || facilities === '' || facilities === 'all') ? '' : facilities,
			'regions': (regions === undefined || regions === '' || regions === 'all') ? '' : regions,
			'location': {
				'city': (city === undefined || city === 'all' || city === '') ? fitternity.fitLocalStorage.getlocal('currentCity') : city
			},
			'offset': {
				'from': (from === undefined || from === '') ? 0 : from,
				'number_of_records': 10
			},
			'sort': {
				'sortfield': (sort === undefined || sort === '') ? 'popularity' : sort,
				'order': (order === undefined || order === '') ? 'desc' : order
			}
		};

		var path = fitternity.baseuri.url + '/search/getfinderresults';
		var result = function() {
			var tmp = null;
			$.ajax({
				"async": false,
				"type": "POST",
				"contentType": "application/json; charset=utf-8",
				"dataType": "json",
				"url": path,
				"data": JSON.stringify(query),
				"encode": true,
				"success": function(data) {
					tmp = data;
				}
			});
			return tmp;
		}();
		return result;
	},

	getLocations: function(city_id) {
		var query = {
			'city': city_id
		};
		var result = function() {
			var tmp = null;
			$.ajax({
				'async': false,
				'type': "GET",
				'dataType': 'json',
				//url: baseuri.url + '/getlocationcluster',
				url: baseuri.url + '/homev2',
				data: JSON.stringify(query),
				'success': function(data) {
					tmp = data;
				}
			});
			return tmp;
		}();
		return result;
	},

	getCategories: function(cityId) {
		var query = {
			'city_id': cityId
		};
		var result = function() {
			var tmp = null;
			$.ajax({
				'async': false,
				'type': "POST",
				'dataType': 'json',
				url: fitternity.baseuri.url + '/getcategories',
				data: JSON.stringify(query),
				'success': function(data) {
					tmp = data;
				}
			});
			return tmp;
		}();
		return result;
	},

	getOfferings: function(category, city) {
		var results = {};
		var query = {
			'category': (category === undefined || category === 'fitness' || category === '' || category === 'all fitness') ? '' : category.toString().replace(/-/g, ' '),
			'location': (city === undefined || city === 'all' || city === '') ? '' : city
		};

		var result = function() {
			var tmp = null;
			$.ajax({
				'async': false,
				'type': "POST",
				'dataType': 'json',
				'contentType': "application/json",
				'url': fitternity.baseuri.url + '/getcategoryofferings',
				'data': JSON.stringify(query),
				'success': function(data) {
					tmp = data;
				}
			});
			return tmp;
		}();
		return result;
	}
};


$(function() {
	fitternity.fitSearch.initialize();
});