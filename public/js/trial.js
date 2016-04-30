$(function() {
    console.log('trialpage is loaded');
    // Steps in Book Trial
    // Load all the services of the vendor
    // Pick a service and load slots
    // Pick a slot and fill details
    // Enter OTP and confirm the slots
    var baseuri = {
        url: 'https://a1.fitternity.com'
    };
    // Pick the url from page
    var id = $('#trial').attr('data-vendor-id');
    var slug = $('#trial').attr('data-vendor-slug');
    var name = $('#trial').attr('data-vendor-name');
    var trialinfo = {};
    var ispaid = false;

    $('.summary .vendorname').text(name);

    // $('.sharedetails').attr('disabled',true);

    // Get vendor info
    $.ajax({
        method: "GET",
        url: baseuri.url + '/findertopreview/' + slug + '/5'
    }).done(function(resp) {
        console.log(resp);
        $('.summary .pickaddress .address').html(resp.data.finder.contact.address);
        $.each(resp.data.review, function(key, review) {
            var rating = "";
            var tmp = "";
            var ratingtemp = "";
            for (var i = 1; i <= 5; i++) {
                // console.log('yo');
                if (i <= review.rating) {
                    ratingtemp = '<span class="fa fa-star"></span>';
                } else {
                    ratingtemp = '<span class="fa fa-star-o"></span>';
                }
                rating = rating.concat(ratingtemp);
            }
            // console.log(rating);
            tmp = '<div class="review"><div class="mui-row"><div class="mui-col-xs-2"><div style="background-image:url(' + review.customer.picture + ')" class="image"></div></div><div class="mui-col-xs-10"><span class="title">' + review.customer.name + '</span>' + rating + '</div></div><div class="mui-row"><div class="mui-col-xs-12"><div class="description" data-readmore="" aria-expanded="false" id="rmjs-1" style="max-height: none; height: 90px;"><p>' + review.description + '</p></div><a href="#" data-readmore-toggle="" aria-controls="rmjs-1">Read More</a></div></div></div>';
            $('#reviews').append(tmp);
            $('.review .description').readmore({
                collapsedHeight: 90
            });
        });
    });

    // Date & Weeks Management
    // Initializing dates for weeks
    // Add Days 
    Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };

    window.today = new Date();
    // Date an the logic
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    var ddays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Months in a year
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July ', 'August', 'September', 'October', 'November', 'December'];
    window.weeks = [];
    for (var i = 0; i < 7; i++) {
        var smallmod = window.today.addDays(i);
        window.weeks[i] = {
            'full': smallmod.getDate() + '-' + (smallmod.getMonth() + 1) + '-' + smallmod.getFullYear(),
            'date': smallmod.getDate(),
            'day': days[smallmod.getDay()],
            'smallday': ddays[smallmod.getDay()],
            'month': months[smallmod.getMonth()]
        };
    }

    // Generating the date strip
    $.each(window.weeks, function(key, date) {
        console.log(date);
        var temp = '<div class="dateitem" data-day="' + date.full + '"><span class="date">' + date.date + '</span><span class="day">' + date.smallday + '</span></div>';
        $('.pickdate .calendar').append(temp);
    });

    // On selecting the date item
    $('.dateitem').on('click', function() {
        window.pickeddate = $(this).attr('data-day');
        $(this).addClass('active').siblings().removeClass('active');
        $('.services').empty();
        $('.serviceswithnoslots').empty();
        $('#timingdrop .lbl').text(" All Timings ");
        $('#loadingslots').show();
        // console.log(window.pickeddate);
        var typeofsession = $(".typeofsession").text();
        var trialurl = baseuri.url + '/gettrialschedulev1/' + id + '/' + $(this).attr('data-day');
        if (typeofsession == "workout") {
            trialurl = baseuri.url + '/getworkoutsessionschedule/' + id + '/' + $(this).attr('data-day');
        }
        $.ajax({
            method: "GET",
            url: trialurl
        }).done(function(resp) {
            console.log(resp);
            $.each(resp, function(key, service) {
                console.log(service);
                var slots = "";
                var tslot = "";
                var tempwithslots = "";
                var tempwithoutslots = "";
                if (service.slots.length > 0) {
                    $.each(service.slots, function(key, slot) {
                        if (slot.passed === true) {
                            tslot = '<span class="passedslot">' + slot.start_time + '</span>';
                        } 
                        else {
                            if (slot.price > 0) {
                                tslot = '<li data-time="' + slot.start_time_24_hour_format + '" data-tooltip-content="<span class=\'fa fa-rupee\'></span> ' + slot.price + '<br>' + Math.round(slot.end_time_24_hour_format - slot.start_time_24_hour_format) + ' Hour Session" data-slot="' + slot.slot_time + '" data-slot-price="' + slot.price + '" class="tooltip-hover paid">' + slot.start_time + '</li>';
                            } else {
                                tslot = '<li data-time="' + slot.start_time_24_hour_format + '" data-tooltip-content="FREE<br>' + Math.round(slot.end_time_24_hour_format - slot.start_time_24_hour_format) + ' Hour Session" data-slot="' + slot.slot_time + '" data-slot-price="' + slot.price + '" class="tooltip-hover free">' + slot.start_time + '</li>';
                            }
                        }
                        slots = slots.concat(tslot);
                    });
                    tempwithslots = '<div data-service="' + service.name + '", data-serviceid="' + service._id + '" class="mui-row service mui--align-middle"><div class="mui-col-md-3"><div class="mui--text-subhead service-name">' + service.name + '</div></div><div class="mui-col-md-9"><ul class="slots">' + slots + '</ul></div></div>';
                    $('.services').append(tempwithslots);

                    $('.slots li').on('click', function() {
                        window.picked = {
                            vendor: id,
                            service: $(this).parent().parent().parent().attr('data-service'),
                            service_id: $(this).parent().parent().parent().attr('data-serviceid'),
                            slot: $(this).attr('data-slot'),
                            date: window.pickeddate,
                            slot_price: parseInt($(this).attr('data-slot-price'))
                        };
                        console.log(window.picked);
                        if (window.picked.slot_price > 0) {
                            $('#generateotp').hide();
                            $('#paidsession').show();
                            $('.note').show();
                            $(".priceofslot").text("at Rs." + window.picked.slot_price);
                            ispaid = true;
                            console.log(ispaid, window.picked.slot_price);
                        } else {
                            ispaid = false;
                            console.log(ispaid, window.picked.slot_price);
                            $('#generateotp').show();
                            $('#paidsession').hide();
                            $('.note').hide();
                        }
                        console.log(window.picked);
                        mui.tabs.activate('pane-default-2');
                        $('.summary .servicename').text(window.picked.service);
                        $('.summary .picktime .time').text(" " + window.picked.slot);
                        $('.summary .pickdate .date').text(" " + window.picked.date);
                    });
                    $('#loadingslots').hide();
                } else {
                    // Show that no slots exist
                    tempwithoutslots = '<div class="mui-row service mui--align-middle nosession"><div class="mui-col-md-3"><div class="mui--text-subhead">' + service.name + '</div></div><div class="mui-col-md-9 text-center">Sessions not available on this day</div></div>';
                    $('.serviceswithnoslots').append(tempwithoutslots);
                    $('#loadingslots').hide();
                }
            });
        });
    });

    // rating validations
    // Adding Booktrial functionalities done on 15th April by Utkarsh
    $('#trialform').validetta({
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
            console.log('right data');
            var fullname = $('#trialform input#fullname').val();
            var email = $('#trialform input#email').val();
            var mobile = $('#trialform input#mobile').val();
            var gender = $("#trialform #gender input[type='radio']:checked").val();
            var reminder = $("#trialform #reminder input[type='radio']:checked").val();
            var city_id = $(".city").text();
            var address = $(".address").text();
            trialinfo = {
                customer_name: fullname,
                customer_email: email,
                customer_phone: mobile,
                gender: gender,
                reminder: reminder,
                device_id: undefined,
                finder_id: window.picked.vendor,
                finder_name: name,
                finder_address: address,
                premium_session: window.picked.slot_price > 0 ? true : false,
                service_name: window.picked.service,
                service_id: window.picked.service_id,
                schedule_date: window.picked.date,
                schedule_slot: window.picked.slot,
                amount: window.picked.slot_price,
                city_id: city_id,
                type: "booktrials"
            };
            if (ispaid) {
                generateTempOrder(trialinfo);
            } else {
                generateotp();
            }
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
        var data = {
            mobile: trialinfo.customer_phone,
            message: "Your Fitternity verification code is " + otp
        };
        $.ajax({
            type: 'POST',
            url: '/generatesms',
            data: data,
            dataType: "json"
        }).done(function(resp) {
            console.log(resp);
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
    // Temporder for paid sessions
    function generateTempOrder(data) {
        data.customer_identity = "email";
        data.customer_source = "website";
        data.customer_location = "-";
        $.ajax({
            type: 'POST',
            url: baseuri.url + '/generatetmporder',
            data: JSON.stringify(data),
            dataType: "json"
        }).done(function(resp) {
            console.log(resp);
            $("#buyform input#firstname").val(trialinfo.customer_name);
            $("#buyform input#email").val(trialinfo.customer_email);
            $("#buyform input#phone").val(trialinfo.customer_phone);
            $("#buyform input#orderid").val(resp.order._id);
            $("#buyform input#transactionid").val("FIT" + resp.order._id);
            $("#buyform input#product").val(trialinfo.finder_name + " : " + trialinfo.service_name);
            $("#buyform input#amount").val(trialinfo.amount);
            $("#buyform input.confirmpage").val("https://" + window.location.host + "/paymentsuccesstrial");
            $("#buyform input#servicename").val(trialinfo.service_name);
            $("#buyform input#prefdate").val(trialinfo.preferred_starting_date);
            $("#buyform input#vendorid").val(trialinfo.finder_id);
            $("#buyform input#amount").val(trialinfo.amount);
            $("#buyform").submit();
        }).fail(function(err) {
            console.log(err.responseText);
        });
    }


    $('.regenerate').on('click', function() {
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
        bookthistrial(trialinfo);
    });
    $("#verifyotp").on('click', function(e) {
        // e.preventDefault();
        var enteredOtp = $("#otpform input#otp").val();
        if (otp !== undefined && otp === parseInt(enteredOtp)) {
            console.log("matched");
            bookthistrial(trialinfo);
        } else {
            console.log(otp, enteredOtp);
            $('#otpform .message').show();
        }
    });
    // Book this trial
    function bookthistrial(data) {
        console.log(data);
        $.ajax({
            type: 'POST',
            url: baseuri.url + '/booktrial',
            data: JSON.stringify(data),
            dataType: "json"
        }).done(function(resp) {
            console.log(resp);
            $.magnificPopup.close();
            window.location.href = '/autobooktrial-success/' + resp.booktrialid;
            // Msgs('success', "Thanks for requesting a callback. We'll get back to you soon.", true);
        }).fail(function(err) {
            console.log(err.responseText);
        });
    }
    // Timing Filter
    $('.timingdrop li a').on('click', function(e) {
        e.preventDefault();
        var timing = $(this).attr('data-time');
        $('#timingdrop .lbl').text(" " + timing + " ");
        $.each($('.slots li'), function() {
            $(this).css('display', 'inline-block');
        });
        switch (timing) {
            case 'morning':
                console.log('it is morning');
                $.each($('.slots li'), function() {
                    if ($(this).attr('data-time') < 12) {
                        // console.log($(this).attr('data-time'));
                    } else {
                        $(this).css('display', 'none');
                    }
                    // console.log($(this));
                });
                break;
            case 'afternoon':
                console.log('it is noon');
                $.each($('.slots li'), function() {
                    if ($(this).attr('data-time') >= 12 && $(this).attr('data-time') < 17) {
                        // console.log($(this).attr('data-time'));
                    } else {
                        $(this).css('display', 'none');
                    }
                    // console.log($(this));
                });
                break;
            case 'evening':
                console.log('it is evening');
                $.each($('.slots li'), function() {
                    if ($(this).attr('data-time') >= 17 && $(this).attr('data-time') < 19.3) {
                        // console.log($(this).attr('data-time'));
                    } else {
                        $(this).css('display', 'none');
                    }
                });
                break;
            case 'night':
                console.log('it is night');
                $.each($('.slots li'), function() {
                    if ($(this).attr('data-time') >= 19.3 && $(this).attr('data-time') < 23.3) {
                        // console.log($(this).attr('data-time'));
                    } else {
                        $(this).css('display', 'none');
                    }
                });
                break;
            default:
                console.log("you're break up... hello");
        }
    });

    $("#generateotp").on("click", function(e) {
        ispaid = false;
    });
    $("#paidsession").on("click", function(e) {
        ispaid = true;
    });

    // Auto click the first date
    $('.pickdate .calendar .dateitem:first-child').click();

    // Passed slot not clickable
    $(".passedslot").prop( "disabled", true );
});