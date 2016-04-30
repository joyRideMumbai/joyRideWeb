$(document).ready(function() {

    
    $('div.image').lazyload({
        effect: 'fadeIn',
    });

    $('.card .image').lazyload({
        effect: 'fadeIn'
    });

    // $('.mui-panel .image').lazyload({
    //  effect: 'fadeIn'
    // });

    $('.card .card-image').lazyload({
        effect: 'fadeIn'
    });

    $('card a img').lazyload({
        effect: 'fadeIn'
    });

    $('img').lazyload({
        effect: 'fadeIn'
    });

    $('.topbar').scrollToFixed();

    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-top messenger-on-center',
        theme: 'future'
    };

    isotip.init({
        html: false, // set to true to always interpret content as HTML
        placement: 'top', // default placement of tooltips
        // container: 'body', // default containing element for the tooltip
        // scrollContainer: '.scroll-container', // default container for scroll watching
        template: '<div class="tooltip" data-tooltip-target="tooltip"></div>', // default template for the tooltip shell
        removalDelay: 200, // default number of ms before the tooltip is removed
        tooltipOffset: 10, // default number of px the tooltip is offset from the trigger element
        windowPadding: { // window bounds for tooltip repositioning
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
    });
    // Global Search
    var curcity = fitternity.fitCookie.getCookie('chosencity');
    
    var options = {
        url: function(phrase) {
            return "https://a1.fitternity.com/search/getautosuggestresults1";
        },
        listLocation: "results",
        getValue: function(element) {
           
            return element.keyword;
        },
        template: {
            type: "custom",
            method: function(value, item) {
                console.log(value, item, 'this is autocompplete');
                var key = item.keyword === undefined ? "" : item.keyword.substring(0, 45).capitalize();
                var detail = window.searchtag[item.object_type] === undefined ? "" : window.searchtag[item.object_type];
                return "<a ><div class='mui-row'><div class='mui-col-md-8 mui-col-xs-7 restitle'>" + key + "</div><div class='mui-col-md-4 mui-col-xs-5 restype'>" + detail + "</div></div></a>";
            }
        },
        ajaxSettings: {
            method: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: 'JSON',
            data: {},
            success: function(data) {
                if (data.results.length === 0) {
                    data.results = [{
                        "title": "No results found",
                        "baselocation": ""
                    }];
                } else {
                    console.log(data);
                    if (data.results !== undefined) {
                        for (var i = 0; i < data.results.length; i++) {
                            data.results[i].keyword = data.results[i].keyword;
                        }
                    }
                }
            }
        },
        preparePostData: function(data) {
            var from = 0;
            var city = curcity;
            var key = $('#global-search-input').val();
            var query = {
                'keyword': (key === undefined || key === '') ? '' : key.toLowerCase(),
                'location': {
                    'city': (city === undefined || city === '') ? 'mumbai' : city
                },
                'offset': {
                    'from': (from === undefined || from === '') ? 0 : from,
                    'number_of_records': 10
                }
            };
            return JSON.stringify(query);
        },
        list: {
            // match: {
            //     enabled: true
            // },
            showAnimation: {
                type: "fade",
                time: 100,
                callback: function() {}
            },
            onChooseEvent: function() {
                var value = $('#global-search-input').getSelectedItemData();               
                 var path = window.location.origin;
                 var urlPath;
                if(value.object_type === 'vendor'){
                    urlPath = path + '/' + value.object.slug;
                }
               else {    
                    var category = value.object.category;   
                    console.log(value.object); 
                   
                    if((value.object.category.indexOf('classes') > -1)||(value.object.category.indexOf('sessions') > -1)){
                        category = value.object.category.split(' ')[0];
                        console.log(category);
                    }                                                       
                    urlPath = path + '/keywordsearch' + '/' + value.object.location.city + '/' + value.keyword.replace(/\s+/g, "-").toLowerCase() +'/'+ category + '/' + value.object.location.area.replace(/ /g, "-") ;
                    console.log(urlPath);                   
                }
                window.location.href = urlPath;
            },
            hideAnimation: {
                type: "slide", //normal|slide|fade
                time: 200,
                callback: function() {}
            }
        },
        requestDelay: 200
    };
    $('#global-search-input').easyAutocomplete(options);
    $('#global-search-input').on('keydown', function(event){
        if(event.which == 13){
            console.log('inside autocompplete');
            var key = $(this).val();
            console.log(key);
            var path = window.location.origin;
             var city = curcity === null || curcity === undefined ? 'mumbai' : curcity;
             window.location.href = path + '/' + 'keywordsearch' + '/' + city.toLowerCase() + '/' + key.toLowerCase().replace(/ /g,'-');
            // window.location.href = path + '/' 
        }
    });

    // Toggling search
    $('.mobile-search').on('click', function() {
        console.log('toggled');
        $('#globalSearchContainer').css('margin-top','-60px').removeClass('slideOutUp').addClass('animated slideInDown');
    });
    $('.close-search').on('click',function(){
        console.log('closing it');
        $('#globalSearchContainer').removeClass('slideInDown').addClass('slideOutUp').css('margin-top','-120px');
    });

    // Sliding the left drawer
    var homesidebar = $('#sidebar').slideReveal({
        width: 250,
        // zindex: 1000,
        // top: 0,
        push: false,
        overlay: true,
        position: 'left',
        trigger: $("#showsidebar")
    });
    // Safari Fix
    $("#sidebar").css({'left': '-'+250+'px'});


    $('#closehomesidebar').on('click',function(){
        homesidebar.slideReveal("hide");
    });
});

function landingpagerequest(user,capturetype,formId){
    user.capture_type = capturetype;
    $.ajax({
        type: 'POST',
        url: window.baseuri.url+'/landingpage/callback',
        data: user,
        dataType: "json"
    }).done(function(resp) {
        console.log(resp);
        $(formId).hide();
        $(formId+"thanks").removeClass('hide');
    }).fail(function(err) {
        console.log(err);
    });
}