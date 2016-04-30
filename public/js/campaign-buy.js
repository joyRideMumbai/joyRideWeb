$(function() {
	var preferred_starting_date;
	$('#payform').validetta({
		showErrorMessages: true,
		display: 'inline',
		realTime: true,
		errorTemplateClass: 'error-inline',
		errorClass: 'invalid-data',
		validClass: 'valid-data',
		onValid: function(event) {
			event.preventDefault();
			// Gotta send these details fullname,email,phone,preferred_time,vendor,finder_id,city_id
			var fullname = $('#payform input#fullname').val();
			var email = $('#payform input#email').val();
			var mobile = $('#payform input#mobile').val();
			var customer_address = {
				line1: $('#payform input#flat').val(),
				line2: $('#payform input#street').val(),
				line3: $('#payform input#city').val(),
				pincode: $('#payform input#pincode').val()
			};
			var address = customer_address.line1+", "+customer_address.line2+", "+customer_address.line3+", "+customer_address.pincode;
			var finder_name = $("#vendor-title").text();
			var city_id = $("#city-id").text();
			var finder_id = $("#vendor-id").text();
			var finder_address = $("#vendor-address").text();
			var service_id = $("#service-id").text();
			var service_name = $("#service-name").text();
			var service_duration = $("#serviceduration").text();
			var amount = $("#serviceamount").text();

			membership = {
				customer_name: fullname,
				customer_email: email,
				customer_phone: mobile,
				customer_identity: "email",
				address: address,
				customer_address: customer_address,
				customer_source: 'website',
				customer_location: '-',
				finder_name: finder_name,
				finder_id: finder_id,
				city_id: city_id,
				finder_address: finder_address,
				service_id: service_id,
				service_name: service_name,
				amount: amount,
				type: "crossfit-week",
				service_duration: service_duration

			};
			kyu1.pushevent('membershipbuy', {
				type: 'payform',
				data: membership
			});
			console.log('right data', membership);
			mui.tabs.activate('pane-default-2');
		},
		onError: function() {
			console.log('wrong form');
		}
	});
		$('#prefdate').validetta({
		showErrorMessages: true,
		display: 'inline',
		realTime: true,
		errorTemplateClass: 'error-inline',
		errorClass: 'invalid-data',
		validClass: 'valid-data',
		onValid: function(event) {
			event.preventDefault();
			// Gotta send these details fullname,email,phone,preferred_time,vendor,finder_id,city_id
			
			membership.preferred_starting_date = preferred_starting_date;
			var batch = $("input[type='radio'][name='batch']:checked");
			console.log(batch);
			membership.batches = batch.val();
			buymembershipOnline(membership);
		},
		onError: function() {
			console.log('wrong form');
			event.preventDefault();
			var errorDiv = $('.error-inline:visible').first();
			var scrollPos = errorDiv === undefined ? 0 : errorDiv.offset().top;
			$(window).scrollTop(scrollPos);
		}
	});
	$(".calander").on("click", function(e) {
		$("#datepicker").click();
	});
	var batchweekdays = [];
	var picker = new Pikaday({
		field: document.getElementById('datepicker'),
		minDate: new Date("2016-05-01"),
		maxDate: new Date("2016-05-10"),
		format: 'D MMM YYYY',
		onSelect: function() {
			var todayTime = this.getDate();
			var month = todayTime .getMonth() + 1;
		    var day = todayTime .getDate();
		    var year = todayTime .getFullYear();
		    preferred_starting_date = day + "-" + month + "-" + year;
            console.log(preferred_starting_date);
        },
        	disableDayFn: function(date) {
				if(batchweekdays.indexOf(date.getDay()) == -1){
					return true;
				}
			}
	});
	picker.setMinDate(new Date());

$("input[type='radio'][name='batch']").change(function() {
		// append goes here
		var weekdays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
		var batch = JSON.parse($(this).val());
		batchweekdays = [];
		_.each(batch, function(data, i) {
			batchweekdays = batchweekdays.concat(weekdays.indexOf(data.weekday));
		});
		console.log(batch,batchweekdays);
	});
function buymembershipOnline(data) {
		$.ajax({
			type: 'POST',
			url: baseuri.url + '/generatetmporder',
			data: JSON.stringify(data),
			dataType: "json"
		}).done(function(resp) {
			console.log(resp);
			kyu1.pushevent('membershipbuy', {type : 'membershiponline', data : data});
			$("#buyform input#firstname").val(membership.customer_name);
			$("#buyform input#email").val(membership.customer_email);
			$("#buyform input#phone").val(membership.customer_phone);
			$("#buyform input#orderid").val(resp.order._id);
			$("#buyform input#transactionid").val("FIT" + resp.order._id);
			$("#buyform input#product").val(membership.finder_name + " : " + membership.service_name + " - " + membership.service_duration);
			$("#buyform input#amount").val(membership.amount);
			$("#buyform input.confirmpage").val("https://" + window.location.host + "/paymentsuccess");
			$("#buyform input#servicename").val(membership.service_name);
			$("#buyform input#prefdate").val(membership.preferred_starting_date);
			$("#buyform input#vendorid").val(membership.finder_id);

			$("#buyform").submit();
		}).fail(function(err) {
			console.log(err.responseText);
		});
	}
	
});