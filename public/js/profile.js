$(document).ready(function() {
    // Show Profile
    $('.viewprofile').on('click', function() {
        $('.contentblocks').siblings().hide();
        $('.editprofile').show();
    });

    // Show Trials
    $('.viewtrials').on('click', function() {
        $('.contentblocks').siblings().hide();
        $('.trials').show();
    });

    // Show Reviews
    $('.viewreviews').on('click', function() {
        $('.contentblocks').siblings().hide();
        $('.reviews').show();
    });

    // Show Memberships
    $('.viewmemberships').on('click', function() {
        $('.contentblocks').siblings().hide();
        $('.memberships').show();
    });

    // Get Information for the user
    var tok = localStorage.getItem('fitaccesstoken');
     var recentSearches = JSON.parse(fitternity.fitLocalStorage.getlocal('recentsearch'));
     if (recentSearches !== null && recentSearches !== undefined && recentSearches.length > 0) {
        $.each(recentSearches, function(k, r) {
            temp = '<li><a href="' + r.slug + '"><span>' + r.category + ' in ' + r.location + '</span></a></li>';
            //
            $('#recentsearchlinks').append(temp);
        });
    } else {
        $("#recentlysearched").hide();
    }

     var recentViewed = JSON.parse(fitternity.fitLocalStorage.getlocal('recentviewed'));
    if (recentViewed !== null && recentViewed !== undefined && recentViewed.length > 0) {
        $.each(recentViewed, function(k, r) {
            temp = '<li><a href="/' + r.slug + '"><span class ="title">' + r.title +'</span><span class="location">'+r.location+'</span></a></li>';
            //
            $('#recentviewedprofilelinks').append(temp);
        });
    } else {
        $("#recentlyviewprofile").hide();
    }

    var getallinfo = function() {
        // Get all reviews
        $.ajax({
            type: 'GET',
            url: 'https://a1.fitternity.com/customer/getallreviews/0/10',
            headers: {
                'Authorization': tok
            }
        }).done(function(resp) {
            if (resp.reviews.length > 0) {
                $.each(resp.reviews, function(index, review) {
                    // Injecting html into page
                    // console.log(review);
                    var htmlblock = "<div class='mui-panel mui--z2'><div class='mui-row'><div class='mui-col-md-8'><h5 class='capitalize'>" + review.finder.title + "</h5><small>on " + review.created_at + "</small></div><div class='mui-col-md-4 mui--text-right'><span class='fa fa-star'></span><span class='fa fa-star'></span><span class='fa fa-star'></span><span class='fa fa-star'></span><span class='fa fa-star'></span></div></div><div class='mui-row'><div class='mui-col-md-12'><p>" + review.description + "</p></div></div></div>";
                    $('#myreviews').append(htmlblock);
                });
            } else {
                var htmlblock = "<div class='mui-row'><div class='mui-col-xs-12 text-center'><br><br><img src='/img/profile/noreviews.png' width='200px'><br><br><div class='mui--text-subhead'>SORRY NO REVIEWS FOUND</div></div></div>";
                $('#myreviews').append(htmlblock);
            }
        }).fail(function(err) {
            console.log(err);
        });

        // Get all bookmarks
        $.ajax({
            type: 'GET',
            url: 'https://a1.fitternity.com/customer/getallbookmarks',
            headers: {
                'Authorization': tok
            }
        }).done(function(resp) {
            // $.each(resp.bookmarksfinders,function(index,vendor){
            //  console.log(vendor);
            // });
        }).fail(function(err) {
            console.log(err);
        });

        // Get all trials
        var getTrials = function(){
            $.ajax({
                type: 'GET',
                url: 'https://a1.fitternity.com/customer/getalltrials',
                headers: {
                    'Authorization': tok
                }
            }).done(function(resp) {
                // *** Edited by Utkarsh on 28th April remove headers if no trial list ***
                if(resp.upcomingtrials.length === 0){
                    $('.upcomingheading').hide();
                }else{
                    $('.upcomingheading').show();
                }
                if(resp.passedtrials.length === 0){
                    $('.pastheading').hide();
                }else{
                    $('.pastheading').show();
                }
                var htmlblock = "";
                $.each(resp.upcomingtrials, function(index, trial) {
                    // Injecting html into page
                    console.log("trial",trial);
                    if(trial.going_status == 2){
                        htmlblock = "<div class='mui-panel mui--z1'><div class='mui-row'><div class='mui-col-md-6'><h5 class='capitalize'>" + trial.service_name + "</h5><small>" + trial.finder_name + "</small></div><div class='mui-col-md-6 mui--text-right'><span class='timing'>" + trial.schedule_slot_start_time + " - " + trial.schedule_slot_end_time + "</span><span class='date'>" + trial.schedule_date.substring(0, 10) + "</span></div></div><div class='mui-row'></div><br><div class='mui-row'><div class='mui-col-md-12 mui--text-right' style='color:red'> Cancelled </div></div></div>";
                    }else{
                        htmlblock = "<div class='mui-panel mui--z1'><div class='mui-row'><div class='mui-col-md-6'><h5 class='capitalize'>" + trial.service_name + "</h5><small>" + trial.finder_name + "</small></div><div class='mui-col-md-6 mui--text-right'><span class='timing'>" + trial.schedule_slot_start_time + " - " + trial.schedule_slot_end_time + "</span><span class='date'>" + trial.schedule_date.substring(0, 10) + "</span></div></div><div class='mui-row'><div class='mui-col-md-6'><h6>What to Carry ?</h6>" + trial.what_i_should_carry + "</div><div class='mui-col-md-6'><h6>What to Expect ?</h6>" + trial.what_i_should_expect + "</div></div><br><div class='mui-row'><div class='mui-col-md-12 mui--text-right'><a href=\"https://maps.google.com/maps?q="+trial.finder.lat+","+trial.finder.lon+"&ll="+trial.finder.lat+","+trial.finder.lon+"&z=17\", target=\"_blank\"> <button class='mui-btn mui-btn--dark mui-btn--small'>View Map</button></a> <a href=\"/booktrial/"+trial.finder_slug+"\"><button class='mui-btn mui-btn--primary mui-btn--small'>Reschedule</button></a> <button class='mui-btn mui-btn--danger mui-btn--small cancelTrial' data-trialid='" + trial._id + "'><span class='prog'></span>  Cancel This Session</button></div></div></div>";
                    }
                    // var htmlblock = "<div class='mui-panel mui--z1'><div class='mui-row'><div class='mui-col-md-6'><h5 class='capitalize'>" + trial.service_name + "</h5><small>" + trial.finder_name + "</small></div><div class='mui-col-md-6 mui--text-right'><span class='timing'>" + trial.schedule_slot_start_time + " - " + trial.schedule_slot_end_time + "</span><span class='date'>" + trial.schedule_date.substring(0, 10) + "</span></div></div><br><div class='mui-row'><div class='mui-col-md-12 mui--text-right'><a href=\"https://maps.google.com/maps?q="+trial.finder_lat+","+trial.finder_lon+"&ll="+trial.finder_lat+","+trial.finder_lon+"&z=17\", target=\"_blank\"> <button class='mui-btn mui-btn--dark mui-btn--small'>View Map</button></a><button class='mui-btn mui-btn--primary mui-btn--small'>Reschedule</button><button class='mui-btn mui-btn--danger mui-btn--small cancelTrial' data-trialid='" + trial._id + "'><span class='prog'></span>  Cancel This Session</button></div></div></div>";
                    $('#upcomingtrials').append(htmlblock);
                });
                $.each(resp.passedtrials, function(index, trial) {
                    // Injecting html into page
                    htmlblock = "<div class='mui-panel mui--z1'><div class='mui-row'><div class='mui-col-md-6'><h5 class='capitalize'>" + trial.service_name + "</h5><small>" + trial.finder_name + "</small></div><div class='mui-col-md-6 mui--text-right'><span class='timing'>" + trial.schedule_slot_start_time + " - " + trial.schedule_slot_end_time + "</span><span class='date'>" + trial.schedule_date.substring(0, 10) + "</span></div></div></div>";
                    $('#pasttrials').append(htmlblock);
                });
                if (resp.upcomingtrials.length === 0 && resp.passedtrials.length === 0) {
                    htmlblock = "<div class='mui-row'><div class='mui-col-xs-12 text-center'><br><br><img src='/img/profile/notrials.png' width='200px'><br><br><div class='mui--text-subhead'>SORRY NO TRIALS BOOKED SO FAR</div></div></div>";
                    $('#alltrials').append(htmlblock);
                } else {
                    // Cancel a trial
                    $('.cancelTrial').on('click', function(event) {
                        event.preventDefault();
                        $(this).find('.prog').addClass('fa fa-cog fa-spin');
                        console.log($(this).attr('data-trialid'));
                        $.ajax({
                            type: 'GET',
                            url: 'https://a1.fitternity.com//booktrials/cancel/' + $(this).attr('data-trialid'),
                            headers: {
                                'Authorization': tok
                            }
                        }).done(function(resp) {
                            console.log(resp);
                            $('#upcomingtrials').empty();
                            $('#pasttrials').empty();
                            Msgs('success','Successfully cancelled the Trial',true);
                            getTrials();
                        }).fail(function(err) {
                            console.log(err.responseText);
                        });
                    });
                }
            }).fail(function(err) {
                console.log(err);
            });
        };

        getTrials();

        // Get all orders
        $.ajax({
            type: 'GET',
            url: 'https://a1.fitternity.com/customer/getallorders/0/20',
            headers: {
                'Authorization': tok
            }
        }).done(function(resp) {
            if (resp.orders.length > 0) {
                $.each(resp.orders, function(index, order) {
                    // Injecting html into page
                    console.log(order);
                    var htmlblock = "<div class='mui-panel mui--z1'><div class='mui-row'><div class='mui-col-md-8'><h5 class='capitalize'>" + order.finder_name + "</h5><p>" + order.service_name + "</p><p><strong>Payment Method:</strong><span class='method'>" + ((order.payment_mode === "paymentgateway") ? " ONLINE" : "CASH ON DELIVERY") + " </span></p></div><div class='mui-col-md-4 mui--text-right'><span class='transid'><span>Transaction ID</span><span class='id'>#" + order._id + "</span></span><span class='price'><span class='fa fa-rupee'></span><span class='amount'> " + order.amount + "</span></span></div></div></div>";
                    $('#mymemberships').append(htmlblock);
                });
            } else {
                var htmlblock = "<div class='mui-row'><div class='mui-col-xs-12 text-center'><br><br><img src='/img/profile/noorders.png' width='200px'><br><br><div class='mui--text-subhead'>SORRY NO PREVIOUS ORDERS FOUND</div></div></div>";
                $('#mymemberships').append(htmlblock);
            }
        }).fail(function(err) {
            console.log(err);
            var htmlblock = "<div class='mui-row'><div class='mui-col-xs-12 text-center'><br><br><img src='/img/profile/noorders.png' width='200px'><br><br><div class='mui--text-subhead'>SORRY NO PREVIOUS ORDERS FOUND</div></div></div>";
            $('#mymemberships').append(htmlblock);
        });
    };

    // Timing out
    setTimeout(function() {
        console.log(window.user);
        if (window.user !== null) {
            getallinfo();
            // Full the form with existing data
            $('#myprofile input#fullname').val(window.user.name);
            $('#myprofile input#email').val(window.user.email);
            $('#myprofile input#mobile').val(window.user.contact_no);
            $('#myprofile input#location').val(window.user.location);
            $('#myprofile input#addline1').val(window.user.address.line1);
            $('#myprofile input#addline2').val(window.user.address.line2);
            $('#myprofile input#addline3').val(window.user.address.line3);
            // $('#myprofile input#addpincode').val(window.user.address.pincode);
        }
    }, 1000);

    // Update a user
    $('#myprofile').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            console.log('right data');
            var fullname = $('#myprofile input#fullname').val();
            var mobile = $('#myprofile input#mobile').val();
            var location = $('#myprofile location').val();
            var address = {
                line1: $('#myprofile input#addline1').val(),
                line2: $('#myprofile input#addline2').val(),
                line3: $('#myprofile input#addline3').val(),
                // pincode: $('#myprofile input#pincode').val(),
            };
            var data = {
                name: fullname,
                extra: {
                    mob: mobile,
                    location: location
                },
                address: {
                    line1: address.line1,
                    line2: address.line2,
                    line3: address.line3,
                    // pincode: address.pincode,
                }
            };
            $.ajax({
                type: 'POST',
                url: 'https://a1.fitternity.com/customer/update',
                data: JSON.stringify(data),
                dataType: "json",
                headers: {
                    'Authorization': tok
                }
            }).done(function(resp) {
                console.log(resp);
                if (resp.status !== 400) {
                    localStorage.setItem('fitaccesstoken', resp.token.token);
                    window.user = resp.customer;
                    Msgs('success', 'successfully updated user Information', true);
                } else {
                    Msgs('error', resp.message, true);
                }
            }).fail(function(err) {
                console.log(err.responseText);
            });
        },
        onError: function() {
            console.log('wrong form');
        }
    });

    // Update a picture
});
