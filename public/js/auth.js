var Msgs = function(type, msg, showclose) {
    // Types are error-info-success
    Messenger().post({
        message: msg,
        type: type,
        showCloseButton: showclose,
        hideAfter: 3,
        hideOnNavigate: true
    });
};
var checktoken = function(token) {
    var data = {
        token: token
    };


    $.ajax({
        type: 'POST',
        url: '/user/verify',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        if (resp.customer === null) {
            window.user = null;
            $('#triglogin').show();
            $('#triglogin1').show();
            console.log("window.user",window.user);
        } else {
            window.user = resp.customer;
            kyu1.pushevent('logintoken', {
                email: window.user.email
            });
            $('#profilelink').css('display', 'inline-block');
            $('#profilelink a').attr("href", "/profile/" + window.user.email);
            $('#profilelink1').css('display', 'block');
            $('#profilelink1 a').attr("href", "/profile/" + window.user.email);
            $('.profileimg').css('background-image', "url('" + window.user.picture + "')");
        }
    }).fail(function(err) {
        console.log(err);
    });
};

var startrun = function() {
    var localtoken = localStorage.getItem('fitaccesstoken');
    if (localtoken !== undefined) {
        checktoken(localtoken);
    } else {
        window.user = null;
    }

    // getCurrentCity();
    // if (localStorage.getItem('currentcity') !== undefined) {
    //  currentslug = localStorage.getItem('currentcity').toLowerCase();
    // }

    // baseuri.url = "https://a1.fitternity.com";
    window.searchtag = {
        vendor: 'FITNESS OPTION',
        categorylocation: 'FITNESS TYPE + LOCATION',
        location: 'LOCATION',
        categorylocationoffering: 'OFFERING',
        categorycity: 'FITNESS TYPE + CITY',
        categoryoffering: 'OFFERING'
    };
};

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    var data = {
        id: id_token,
        email: profile.getEmail(),
        first_name: profile.getGivenName(),
        last_name: profile.getFamilyName()
    };
    kyu1.pushevent('gplogin', {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name
    });
    gplogin(data);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}

var signin = function(username, password) {
    var data = {
        identity: 'email',
        email: username.toLowerCase(),
        password: password
    };
    $.ajax({
        type: 'POST',
        url: '/user/signin',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        if (resp.status !== 400) {
            localStorage.setItem('fitaccesstoken', resp.token);
            window.user = resp.customer;
            console.log(window.user);
            $('#triglogin').hide();
            $('#triglogin1').hide();
            $('#profilelink').css('display', 'inline-block');
            $('#profilelink a').attr("href", "/profile/" + window.user.email);
            $('#profilelink1').css('display', 'block');
            $('#profilelink1 a').attr("href", "/profile/" + window.user.email);
            console.log(kyu1, 'kyu1');
            kyu1.pushevent('signin', {
                email: window.user.email
            });
            $.magnificPopup.close();
            Msgs('success', 'successfully signed in', true);
        } else {
            Msgs('error', resp.message, true);
        }
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

// Login a FB User
var fblogin = function(userinfo) {
    console.log(userinfo);
    var data = {
        identity: 'facebook',
        id: userinfo.id,
        email: userinfo.email,
        first_name: userinfo.first_name,
        last_name: userinfo.last_name
    };
    $.ajax({
        type: 'POST',
        url: '/user/fbsignin',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        if (resp.status !== 400) {
            console.log(resp);
            localStorage.setItem('fitaccesstoken', resp.token);
            window.user = resp.customer;
            $('#triglogin').hide();
            $('#triglogin1').hide();
            $('#profilelink').css('display', 'inline-block');
            $('#profilelink a').attr("href", "/profile/" + window.user.email);
            $('#profilelink1').css('display', 'block');
            $('#profilelink1 a').attr("href", "/profile/" + window.user.email);
            kyu1.pushevent('fblogin', {
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name
            });
            $.magnificPopup.close();
            Msgs('success', 'successfully signed in', true);
        } else {
            Msgs('error', err.message, true);
        }
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

// Login a G+ User
var gplogin = function(userinfo) {
    var data = {
        identity: 'google',
        id: userinfo.id,
        email: userinfo.email,
        first_name: userinfo.first_name,
        last_name: userinfo.last_name
    };
    $.ajax({
        type: 'POST',
        url: '/user/gpsignin',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        if (resp.status !== 400) {
            window.user = resp.customer;
            $('#triglogin').hide();
            $('#triglogin1').hide();
            $('#profilelink').css('display', 'inline-block');
            $('#profilelink a').attr("href", "/profile/" + window.user.email);
            $('#profilelink1').css('display', 'block');
            $('#profilelink1 a').attr("href", "/profile/" + window.user.email);
            $.magnificPopup.close();
            kyu1.pushevent('gp+login', {
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name
            });
            Msgs('success', 'successfully signed in', true);
        } else {
            Msgs('error', err.message, true);
        }
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

var logout = function() {
    var localtoken = localStorage.getItem('fitaccesstoken');
    var data = {
        'token': localtoken
    };
    $.ajax({
        type: 'POST',
        url: '/user/logout',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        localStorage.removeItem('fitaccesstoken');
        if (window.user.indentity === "google") {
            console.log('is a google user');
            signOut();
        }
        window.location.href = '/';
    });
};

// Register a user
var register = function(fullname, email, pass) {
    console.log(fullname, email, pass);
    var data = {
        identity: 'email',
        fullname: fullname,
        email: email.toLowerCase(),
        password: pass
    };
    $.ajax({
        type: 'POST',
        url: '/user/register',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        if (resp.status !== 400) {
            console.log(resp);
            localStorage.setItem('fitaccesstoken', resp.token);
            window.user = resp.customer;
            $('#triglogin').hide();
            $('#triglogin1').hide();
            $('#profilelink').css('display', 'inline-block');
            $('#profilelink a').attr("href", "/profile/" + window.user.email);
            $('#profilelink1').css('display', 'block');
            $('#profilelink1 a').attr("href", "/profile/" + window.user.email);
            kyu1.pushevent('register', {
                email: data.email,
                fullname: data.fullname
            });
            $.magnificPopup.close();
            Msgs('success', 'successfully registered!', true);
        } else {
            console.log(resp);
            Msgs('error', resp.message, true);
        }
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

// Request a callback
var reqcallback = function(fullname, email, phone, preferred_time, city_id, vendor, finder_id) {
    var data = {
        name: fullname,
        email: email,
        phone: phone,
        preferred_time: preferred_time,
        vendor: vendor,
        finder_id: finder_id,
        city_id: city_id
    };
    console.log("data",data);
    $.ajax({
        type: 'POST',
        url: 'https://a1.fitternity.com/email/requestcallback',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        console.log(resp);
        kyu1.pushevent('callback', {
            email: data.email,
            name: data.fullname,
            phone: data.phone,
            preferred_time: data.preferred_time,
            vendor: data.vendor,
            finder_id: data.finder_id,
            city_id: data.city_id
        });
        $.magnificPopup.close();
        Msgs('success', "Thanks for requesting a callback. We'll get back to you soon.", true);
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

// Reset Password
var reset = function(email) {
    console.log(email);
    var data = {
        email: email.toLowerCase()
    };
    $.ajax({
        type: 'POST',
        url: '/user/reset',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        console.log(resp);
        $.magnificPopup.close();
        Msgs('success', "We've send a reset mail to your mail account.", true);
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

// Update Password

var updatepass = function() {
    console.log(pass, token);
    var data = {
        password: pass,
        token: token
    };
    $.ajax({
        type: 'POST',
        url: '/user/resetpass',
        data: data,
        dataType: "json"
    }).done(function(resp) {
        console.log(resp);
        localStorage.setItem('fitaccesstoken', resp.token);
        window.location.href = '/';
    }).fail(function(err) {
        console.log(err.responseText);
    });
};

// Auth Triggers
$(function() {
    // Check User
    startrun();

    // Login Validation & Submission
    $('#formsignin').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            console.log('right data');
            var email = $('.signin input#email').val();
            var pass = $('.signin input#pass').val();
            signin(email, pass);
        },
        onError: function() {
            console.log('wrong form');
        }
    });

    // Registration Validations & Submission
    $('#formsignup').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            console.log('yeah ok');
            var fullname = $('.signup input#fullname').val();
            var email = $('.signup input#email').val();
            var pass = $('.signup input#pass').val();
            register(fullname, email, pass);
        },
        onError: function() {
            console.log('wrong form');
        }
    });

    // Do FBLogin
    $('#doFblogin').on('click', function(event) {
        event.preventDefault();
        console.log('trying fb login');
        FB.login(function(response) {
            FB.api('/me', function(resp) {
                fblogin(resp);
            });
        }, {
            scope: 'public_profile,email'
        });
    });

    $('#forgot').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            var email = $('.forgot input#email').val();
            reset(email);
        },
        onError: function() {
            console.log('wrong form');
        }
    });

    // Toggle Login form
    $('#triglogin').magnificPopup({
        items: {
            src: '#login',
            type: 'inline'
        }
    });
    $('#triglogin1').magnificPopup({
        items: {
            src: '#login',
            type: 'inline'
        }
    });

    // Toggle Email Singup form
    $('#doEmailSignup').magnificPopup({
        items: {
            src: '#signup',
            type: 'inline'
        }
    });

    $('#iforgot').magnificPopup({
        items: {
            src: '#forgot',
            type: 'inline'
        }
    });

    // Show request to callback
    $('#trigcallback').hover(function() {
        $(this).removeClass('mui-btn--flat');
        $(this).addClass('mui-btn--danger');
    }, function() {
        $(this).removeClass('mui-btn--danger');
        $(this).addClass('mui-btn--flat');
    });
    $('#trigcallback').magnificPopup({
        items: {
            src: '#callback',
            type: 'inline'
        }
    });
    $('#trigcallback1').on("click", function(e) {
        $('#sidebar').slideReveal("hide");
    });
    $("#triglogin1").on("click", function(e) {
        $('#sidebar').slideReveal("hide");
    });
    $('#trigcallback1').magnificPopup({
        items: {
            src: '#callback',
            type: 'inline'
        }
    });
    // Trigger Logout
    $('#dologout').on('click', function(event) {
        logout();
    });

    // Update the new password
    $('#updatepass').on('click', function(event) {
        event.preventDefault();
        var pass = $('.reset input#password').val();
        var token = $(this).attr('data-key');
        updatepass(pass, token);
    });

    // Request a callback Validation & Submission
    $('#callbackform').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            // Gotta send these details fullname,email,phone,preferred_time,vendor,finder_id,city_id
            console.log('right data');
            var fullname = $('#callback input#fullname').val();
            var email = $('#callback input#email').val();
            var mobile = $('#callback input#mobile').val();
            var preferred_time = $('#callback select').val();
            var curcity = fitternity.fitCookie.getCookie('currentcity');
            var curcityurl = fitternity.fitCookie.getCookie('currentcity') !== undefined ? fitternity.fitCookie.getCookie('currentcity').substring(4) : '%7B%22name%22%3A%22Mumbai%22%2C%22id%22%3A1%2C%22slug%22%3A%22mumbai%22%7D';
            var curcityobj = JSON.parse(decodeURIComponent(curcityurl));
            console.log(curcityobj);
            console.log(fullname, email, mobile, preferred_time, curcityobj.id);
            reqcallback(fullname, email, mobile, preferred_time,curcityobj.id);
        },
        onError: function() {
            console.log('wrong form');
        }
    });

    $('#doGplogin').on('click', function() {
        console.log('login google');
        $('.g-signin2').click();
        // $('.abcRioButton').click();
    });

    // Enter Key Handlers

    // Newsletter Subscription
    // $('#newsletter').validetta({
    //     showErrorMessages: true,
    //     display: 'inline',
    //     realTime: true,
    //     errorTemplateClass: 'error-inline',
    //     errorClass: 'invalid-data',
    //     validClass: 'valid-data',
    //     onValid: function(event) {
    //         event.preventDefault();
    //         // Gotta send these details fullname,email,phone,preferred_time,vendor,finder_id,city_id
    //         console.log('right data');
    //         var email = $('#newsletter input#subemail').val();
    //         var data = {
    //          email: email,
    //          list: 'jQbOI4mm892JYXO4j892Ee47jg'
    //         }
    //         $.ajax({
    //             type: 'POST',
    //             url: 'http://newsbox.fitternity.com/subscribe',
    //             data: data,
    //             dataType: "json"
    //         }).done(function(resp) {
    //             console.log(resp);
    //         }).fail(function(err) {
    //             console.log(err.responseText);
    //         });
    //     },
    //     onError: function() {
    //         console.log('wrong form');
    //     }
    // });
    $('#reset').validetta({
        showErrorMessages: true,
        display: 'inline',
        realTime: true,
        errorTemplateClass: 'error-inline',
        errorClass: 'invalid-data',
        validClass: 'valid-data',
        onValid: function(event) {
            event.preventDefault();
            // Gotta send these details fullname,email,phone,preferred_time,vendor,finder_id,city_id
            console.log('right data');
            var password1 = $('#reset input#password1').val();
            var password2 = $('#reset input#password2').val();
            var token = $("#token").attr('data-key');
            var data = {
                password: password1,
                password_confirmation: password2,
                password_token: token
            };
            resetpassword(data);
        },
        onError: function() {
            console.log('wrong form');
        }
    });

    function resetpassword(data) {
        $.ajax({
            type: 'POST',
            url: 'https://a1.fitternity.com/customerforgotpassword',
            data: JSON.stringify(data),
            dataType: "json"
        }).done(function(resp) {
            console.log(resp);
            localStorage.setItem('fitaccesstoken', resp.token);
            checktoken(resp.token);
            Msgs('success', 'Password successfully reset', true);
            window.location.href = '/';
        }).fail(function(err) {
            console.log(err);
        });
    }
});