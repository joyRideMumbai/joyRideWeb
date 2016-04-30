$(function() {
    // Vendor Membership Accordions
    if ($('.address').height() > 100) {
        console.log("popup time");
        $('.address').css('height', 30);
        $('.address').css('overflow', 'hidden');
        $('.address').css('text-overflow', 'ellipsis');
        $('.address').css('white-space', 'nowrap');
        $('.address').after("<button class='mui-btn address-more', id='moreaddresspopup'>View Address</button>");
        // $(".truncate-address").css("display","inline");
    } else {
        console.log("mast hai");
    }
    $('.address-more').on("click", function() {
        $.magnificPopup.open({
            items: {
                src: '#moreaddress-modal',
                type: 'inline'
            }
        });
    });
    $('.accordion').accordion({
        "transitionSpeed": 400
    });

    $('.breadcrumb').scrollToFixed({
        marginTop: 60
    });

    $('#writereviewtrig').on('click', function(e) {
        e.preventDefault();
        $(window).scrollTop($('#scrollhere').offset().top - 200);
    });

    $('.ratecard .accordion:first-child .heading').click();

    /*
    kyu event for ratecard accordian navigation
    */

    // $('#serviceid').on('click', function(e) {
    //     console.log($(this).attr('data-card-title'));
    //     var titleAccordian = $(this).attr('seq');
    //     kyu1.pushevent('accordianclicked', { title: titleAccordian, vendor: 'vendor' });
    // });

    // Folding overflown content
    console.log($('.about-content').height());
    if ($('.about-content').height() < 200) {
        $('.gradientback').css('visibility', 'hidden');
    }
    $('.about-content').readmore({
        afterToggle: function(trigger, element, expanded) {
            if (!expanded) { // The "Close" link was clicked
                $('.gradientback').css('visibility', 'visible');
            } else {
                $('.gradientback').css('visibility', 'hidden');
            }
        }
    });
    $('.review-content').readmore();
    $('.timings .content').readmore();
    // $('.address').readmore({
    //     // kyu1.pushevent('addressreadmore', { vendor: 'kyu' });
    //     collapsedHeight: 20,
    //     beforeToggle: function() {
    //         if ($('.cover').height() === 400) {
    //             $('.cover').css('height', 200);
    //         } else {
    //             $('.cover').css('height', 400);
    //         }
    //     }
    // });

    var recentVendorSlug = $('#recentVendorSlug').attr('data-slug');
    var recentVendorTitle = $('#recentVendorTitle').attr('data-title');
    var recentVendorLocation = $('#recentVendorLocation').attr('data-location');
    console.log('window vendore data', recentVendorSlug);
    var recentVendors = JSON.parse(fitternity.fitLocalStorage.getlocal('recentviewed')) === null ? [] : JSON.parse(fitternity.fitLocalStorage.getlocal('recentviewed'));
    console.log(recentVendors, 'recentviewed');
    var xyz = _.find(recentVendors, function(x) {
        return x.slug === recentVendorSlug;
    });
    console.log(xyz, 'xyz here');
    if (xyz === undefined) {
        recentVendors.unshift({
            title: recentVendorTitle.capitalize(),
            location: recentVendorLocation.capitalize(),
            slug: recentVendorSlug
        });
        recentVendors = recentVendors.slice(0, 5);
    }
    console.log(recentVendors, ' recent vendors here');
    fitternity.fitLocalStorage.setlocal('recentviewed', JSON.stringify(recentVendors));
    // Main rating on the cover section of vendor
    var main = $('.mainrating');
    main.rateYo({
        rating: main.attr("data-rating"),
        starWidth: "20px",
        readOnly: true
    });

    // Custom rating at rating block
    var newrating = $('.newrating');
    newrating.rateYo({
        starWidth: "40px",
        fullStar: true
    }).on('rateyo.set', function(e, data) {
        console.log('starts');
        if(window.user === null){
            $("#triglogin").click();
        }else{
            kyu1.pushevent('ratingstars', {
                vendor: 'vendor'
            });
            $('.writereview').removeClass('mui--hide');
            $('.writereview textarea').focus();
        }
    });

    var detail0 = $('.detail0');
    var detail1 = $('.detail1');
    var detail2 = $('.detail2');
    var detail3 = $('.detail3');
    var detail4 = $('.detail4');
    detail0.rateYo({
        starWidth: "30px",
        fullStar: true
    });
    detail1.rateYo({
        starWidth: "30px",
        fullStar: true
    });
    detail2.rateYo({
        starWidth: "30px",
        fullStar: true
    });
    detail3.rateYo({
        starWidth: "30px",
        fullStar: true
    });
    detail4.rateYo({
        starWidth: "30px",
        fullStar: true
    });

    // Each review rating
    $.each($('.reviewrate'), function() {
        $(this).rateYo({
            rating: $(this).attr("data-rating"),
            starWidth: "20px",
            readOnly: true,
        });
    });

    // Submitting Review
    $('#submitreview').on('click', function() {
        var desc = $('.writereview textarea').val();
        if (desc === "") {
            alert('please input description');
            return;
        }
        data = {
            finder_id: $('.vendor').attr('data-vendor-id'),
            customer_id: window.user === undefined ? "" : window.user._id,
            rating: $('.newrating').rateYo('rating'),
            detail_rating: [detail0.rateYo('rating'), detail1.rateYo('rating'), detail2.rateYo('rating'), detail3.rateYo('rating'), detail4.rateYo('rating')],
            description: desc
        };
        kyu1.pushevent('reviewsubmit', {
            data: data
        });
        // console.log(data);
        $('.reviewspin').show();
        $.ajax({
            type: "POST",
            url: 'https://a1.fitternity.com/addreview',
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                console.log(data);
                $('.reviewspin').hide();
                $('.writereview').hide();
                location.reload();
            },
            error: function(err) {
                console.log(err);
                $('.reviewspin').hide();
            }
        });
    });

    // Vendor Gallery
    $('.gallery').each(function() { // the containers for all your galleries
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });

    // Utkarsh see more timings on 14th April 2016
    $('#seemoretimings').click(function() {
        kyu1.pushevent('seemoretimings', {
            vendor: 'vendor'
        });
        $('.allday').toggle(500);
        console.log($('#seemoretimings').text());
        if ($('#seemoretimings').text() == '(See More +)') {
            $('#seemoretimings').text('(See Less -)');
        } else {
            $('#seemoretimings').text('(See More +)');
        }
    });

    // Adding open/close
    var gymopentime, gymclosetime;
    if ($("#gymopenat") !== undefined && $("#gymopenat").text() !== "") {
        gymopentime = ConvertTimeformat("24", $("#gymopenat").text());
    }
    if ($("#gymcloseat") !== undefined && $("#gymcloseat").text() !== "") {
        gymclosetime = ConvertTimeformat("24", $("#gymcloseat").text());
    }
    console.log('$(".timenow").text()', $(".timenow").text());
    if(gymopentime !== undefined && gymclosetime !== undefined){
        var nowtime = $(".timenow").text();
        compareTimings(nowtime,gymopentime,gymclosetime);
    }

    function compareTimings(now,open,close){
        nowarray = now.split(":");
        openarray = open.split(":");
        closearray = close.split(":");
        if(parseInt(closearray[0]) === 0){
            closearray[0] = 24;
        }
        nowarray[0] = parseInt(nowarray[0])+5;
        if(parseInt(openarray[0]) < parseInt(nowarray[0]) && parseInt(nowarray[0]) < parseInt(closearray[0])){
            console.log("open");
            $(".lblopen").show();
        }else{
            $(".lblclosed").show();
            // if(parseInt(openarray[0]) === parseInt(nowarray[0]) + 1){
            //     console.log("opening Soon");
            //     return;
            // }
            // if(parseInt(closearray[0]) === parseInt(nowarray[0])){
            //     console.log("closing Soon");  
            //     return;
            // }
            console.log("closed");  
        }

    }
    function ConvertTimeformat(format, str) {
        var time = str;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return sHours + ":" + sMinutes;
    }

    // Adding manual trial Utkarsh on 15th April
    var selectedFinderDetails = {};
    $("#manualtrial").on('click', function(e) {
        kyu1.pushevent('manualtrialButton', {
            vendor: finder_name,
            vendor_id: finder_id,
            premium_session: premium_session
        });
        var title = $(this).attr('data-vendor');
        var type = $(this).attr('data-typeofvendor');
        if (type != "individual") {
            $('.booksessionwith').text("Book a session at " + title);
        } else {
            $('.booksessionwith').text("Book a session with " + title);
        }
        var finder_name = $(this).attr('data-vendor');
        var finder_id = $(this).attr('data-vendor-id');
        var city_id = $(this).attr('data-city-id');
        var premium_session = $(this).attr('data-session-type');
        kyu1.pushevent('manualtrialButton', {
            vendor: finder_name,
            vendor_id: finder_id,
            premium_session: premium_session
        });
        selectedFinderDetails = {
            finder_name: finder_name,
            finder_id: finder_id,
            city_id: city_id,
            premium_session: premium_session
        };
        $.magnificPopup.open({
            items: {
                src: '#manualtrial-modal',
                type: 'inline'
            }
        });
    });
    $("#backstepfortrainer").on("click", function(e) {
        $('.firststep').show();
        $('.nextstep').hide();
        $('#backstepfortrainer').hide();
        $('#generateotp').hide();
        $('#nextstepfortrainer').show();
    });
    // First submit
    // Initializing manual trial object
    var manualtrial, manualtrialtype;
    $('#manualfirstform').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            var fullname = $('#manualfirstform input#fullname').val();
            var email = $('#manualfirstform input#email').val();
            var mobile = $('#manualfirstform input#mobile').val();
            var preferred_time = $('#manualfirstform select#time').val();
            var preferred_day = $('#manualfirstform select#day').val();
            manualtrial = {
                customer_name: fullname,
                customer_email: email,
                customer_phone: mobile,
                preferred_day: preferred_day,
                preferred_time: preferred_time,
                finder_name: selectedFinderDetails.finder_name,
                finder_id: selectedFinderDetails.finder_id,
                city_id: selectedFinderDetails.city_id,
                premium_session: selectedFinderDetails.premium_session
            };
            kyu1.pushevent('manaultrialfirstform', {
                customer_name: fullname,
                customer_email: email,
                customer_phone: mobile,
                preferred_day: preferred_day,
                preferred_time: preferred_time,
                finder_name: selectedFinderDetails.finder_name,
                finder_id: selectedFinderDetails.finder_id,
                city_id: selectedFinderDetails.city_id,
                premium_session: selectedFinderDetails.premium_session
            });
            if (manualtrialtype != "normal") {
                $('.firststep').hide();
                $('.nextstep').show();
                $('#backstepfortrainer').show();
                $('#generateotp').show();
                $('#nextstepfortrainer').hide();
            } else {
                generateotp();
            }
        }
    });
    $('#manualnextform').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            // Gotta send these details fullname,email,phone,preferred_time,vendor,finder_id,city_id
            // Edited by Utkarsh to support trial functionalities 14th April
            var flat = $('#manualnextform input#flat').val();
            var city = $('#manualnextform input#city').val();
            var street = $('#manualnextform input#street').val();
            var pincode = $('#manualnextform input#pincode').val();
            var address = {
                line1: $('#manualnextform input#flat').val(),
                line2: $('#manualnextform input#street').val(),
                line3: $('#manualnextform input#city').val(),
                pincode: $('#manualnextform input#pincode').val()
            };
            manualtrial.customer_address = address;

            kyu1.pushevent('manualnextform', {
                flat: flat,
                city: city,
                street: street,
                pincode: pincode,
                address: address
            });
            generateotp();
        },
        onError: function() {
            console.log('wrong form');
        }
    });
    // Send OTP message
    var otp;
    var retry = 0;

    function generateotp() {
        otp = Math.floor(Math.random() * 90000) + 10000;
        console.log(manualtrial);
        var data = {
            mobile: manualtrial.customer_phone,
            message: "Your Fitternity verification code is " + otp
        };
        $.ajax({
            type: 'POST',
            url: '/generatesms',
            data: data,
            dataType: "json"
        }).done(function(resp) {
            console.log(resp);
            $(".sms-loading").removeClass("hide");
            $.magnificPopup.open({
                items: {
                    src: '#generateotp-modal',
                    type: 'inline'
                }
            });
            setInterval(function() {
                $('.regenerate').css('visibility', 'visible');
            }, 3000 * retry);
            // $.magnificPopup.close();
            // Msgs('success', "Thanks for requesting a callback. We'll get back to you soon.", true);
        }).fail(function(err) {
            console.log(err.responseText);
        });
    }
    $('.regenerate').on('click', function() {
        kyu1.pushevent('regenerateotp', {
            vendor: 'vendor'
        });
        $(".sms-loading").addClass("hide");
        if (retry >= 3) {
            $("#verifyotp").hide();
            $("#proceed-without-otp").show();
        } else {
            $('.regenerate').css('visibility', 'hidden');
            retry++;
            generateotp();
        }

    });
    $('#proceed-without-otp').on('click', function(e) {
        kyu1.pushevent('proceed-without-otp', {
            vendor: 'vendor'
        });
        bookthistrial(manualtrial);
    });
    $("#verifyotp").on('click', function(e) {
        e.preventDefault();
        var enteredOtp = $("#otpform input#otp").val();
        console.log(enteredOtp, otp);
        if (otp !== undefined && otp === parseInt(enteredOtp)) {
            console.log("matched");
            bookthistrial(manualtrial);
        } else {
            $('#otpform .message').show();
        }
    });
    $("#generateotp").on("click", function(e) {
        manualtrialtype = "normal";
    });

    function bookthistrial(data) {
        console.log(data);
        kyu1.pushevent('manualbooktrial', {
            requestData: data
        });
        $.ajax({
            type: 'POST',
            url: baseuri.url + '/manualbooktrial',
            data: JSON.stringify(data),
            dataType: "json"
        }).done(function(resp) {
            console.log(resp);
            $.magnificPopup.close();
            window.location.href = '/booktrial-success/' + resp.booktrial._id;
            // Msgs('success', "Thanks for requesting a callback. We'll get back to you soon.", true);
        }).fail(function(err) {
            console.log(err.responseText);
        });
    }



});
var ratecardBuy = function(vendor_slug, service_name, ratecard_duration) {
    kyu1.pushevent('ratecardclick', {
        vendor: vendor_slug,
        service: service_name,
        duration: ratecard_duration
    });
};
