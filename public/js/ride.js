
/*Creating Global NameSpace*/

var ride = ride || {};

ride = {
	
	initialize:function(){
		this.initPlugins();
		this.pageManipulations();
		this.rideBookingCards();
	},

	pageManipulations:function(){
		var device = this.detectdevice();
		if(device == "laptop"){
			$(window).scroll(function(){
				var currentPos = $(this).scrollTop();
				if(currentPos > 10){
					$('header').addClass('navbar-fixed sticky');
					$('header nav').addClass('white').removeClass('transparent').css('top','0');
				}
				else{
					$('header').removeClass('navbar-fixed sticky');
					$('header nav').removeClass('white').addClass('transparent').css('top','auto');
				}
			});	
		}		

		$(document).on("scroll",this.onScroll);

		if(!$('.rideWrapper').hasClass('ride')){
			$('header nav ul.right li').not('.book').find('a').click(function(e) {
				e.preventDefault();
		    	
		        $(this).parent('li').siblings().removeClass('active');
		        $(this).parent('li').addClass('active');

				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
					var target = $(this.hash);
					var link  = $(this);
					target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
					if (target.length) {
						$('html,body').animate({
							scrollTop: target.offset().top - 10
						},500);
						return false;
					}
				}
			});

			if($(document).find(".LoginWrapper").length){
				this.login.initialize();
			}	
		}
		else{
			$('body').addClass('ride');
		}
				
	},

	onScroll:function(event){
	    var scrollPos = $(document).scrollTop();

	    if(!$('.rideWrapper').hasClass('ride')){
	    	$('header nav ul.right li').not('.book').find('a').each(function () {
		        
		        var currLink   = $(this);
		        var refElement = $(currLink.attr("href"));

		        if(refElement !== undefined){
		        	if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
			            $('header nav ul li.riht').removeClass("active");
			            currLink.parent('li').addClass("active");
			        }
			        else{
			            currLink.parent('li').removeClass("active");
			        }	
		        }
		    });	
	    }	    
	},

	initPlugins:function(){
		//menu bar
		$(".button-collapse").sideNav();
		$('.scrollspy').scrollSpy();

		//slider
		$('.slider-wrapper').addClass('owl-carousel').owlCarousel({
			items:1,
			lazyLoad:true,
			loop:true,
			pagination:true,
			autoplay:false,
			autoplayTimeout:5000,
			autoplayHoverPause:true,
			responsiveClass:true,
			dots:true,
			dotsEach:true,
		    responsive:{
		        0:{
		            items:1,
		            nav:false
		        },
		        600:{
		            items:1,
		            nav:false
		        },
		        1000:{
		            items:1,
		            nav:false
		        }
		    }
		});

		new WOW().init();
	},

	rideBookingCards:function(){
		var $mainButton = $(".main-button"),
		  $closeButton = $(".close-button"),
		  $buttonWrapper = $(".button-wrapper"),
		  $layer = $(".layered-content");

		$mainButton.on("click", function(){
		  $buttonWrapper.addClass("clicked").delay(1500).queue(function(){
		      $layer.addClass("active");
		  });
		});

		$closeButton.on("click", function(){
		  $buttonWrapper.removeClass("clicked");
		  $layer.removeClass("active");
		});
	},

	detectdevice: function() {
        var device = '';
        if (window.navigator.userAgent.match(/Mobile/i) || window.navigator.userAgent.match(/iPhone/i) || window.navigator.userAgent.match(/iPod/i) || window.navigator.userAgent.match(/IEMobile/i) || window.navigator.userAgent.match(/Windows Phone/i) || window.navigator.userAgent.match(/Android/i) || window.navigator.userAgent.match(/BlackBerry/i) || window.navigator.userAgent.match(/webOS/i)) {
            device = 'mobile';
        } else if (window.navigator.userAgent.match(/Tablet/i) || window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/Nexus 7/i) || window.navigator.userAgent.match(/Nexus 10/i) || window.navigator.userAgent.match(/KFAPWI/i)) {
            device = 'tablet';
        } else {
            device = 'laptop';
        }
        return device;
    },

    login:{

		initialize:function(){
			$('body').addClass('login');
			this.initializeLoginEvents();
		},

		initializeLoginEvents:function(){
				
			var resetInputs = function(){
				$('input[type="text"], input[type="password"], input[type="email"]').val('').prop('autocomplete',false).prop('autocorrect',false).blur();
			};

			var showSignUp = function(elem){
				$("#form1,#form3").addClass('hide');
				$("#form2").removeClass('hide');
				$('.loginTxt').html('Sign In');
				$('.dontTxt').addClass('hide');
				$(elem).replaceWith("<span class='showLogin btn'>Back To Login</span>");
				bindLogin();
				resetInputs();
			};

			var showLogin = function(elem){
				$("#form2,#form3").addClass('hide');
				$("#form1").removeClass('hide');
				$('.loginTxt').html('Login');
				$('.dontTxt').removeClass('hide');
				$(elem).replaceWith("<span class='showSignup btn'>Sign In</span>");
				bindSignUp();
				resetInputs();
			};

			var showForgot = function(elem){
				$("#form2,#form1").addClass('hide');
				$("#form3").removeClass('hide');
				$('.loginTxt').html('Reset Password');
				$('.dontTxt').addClass('hide');
				$('.showSignup').replaceWith("<span class='showLogin btn'>Back To Login</span>");
				bindLogin();
				resetInputs();
			};

			var bindSignUp = function(){
				$(".showSignup").bind("click",function(){
					showSignUp($(this));
				});
			};			

			var bindLogin = function(){
				$('.showLogin').bind('click',function(){
					showLogin($(this));		
				});
			};		

			var bindForgot = function(){
				$('.showForgot').bind('click',function(){
					showForgot($(this));		
				});
			};

			bindSignUp();
			$('.showForgot').css('cursor','pointer').click(function(){
				showForgot();
			});			
		},	
	}
};

$(function(){
	ride.initialize();
});