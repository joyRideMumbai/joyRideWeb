var exports = module.exports = {};
exports.getutmsubdocument = function(referer, page) {
	if ((page.indexOf('facebook') > -1) && (page.indexOf('utm') > -1)) {
		var utmlist = page.split('?');
		var utmparamlist = utmlist[1].split('&');
		var utmsession = {};
		utmparamlist.forEach(function(x) {
			y = x.split('=');
			switch (y[0]) {
				case 'utm_source':
					utmsession.source = y[1];
					break;
				case 'utm_medium':
					utmsession.medium = y[1];
					break;
				case 'utm_term':
					utmsession.term = y[1];
					break;
				case 'utm_content':
					utmsession.content = y[1];
					break;
				case 'utm_campaign':
					utmsession.campaign = y[1];
					break;
			}
		});
		return utmsession;
	} else if ((page.indexOf('google') > -1) && (page.indexOf('utm') > -1)) {
		var utmlist = page.split('?');
		var utmparamlist = utmlist[1].split('&');
		var utmsession = {};
		utmparamlist.forEach(function(x) {
			y = x.split('=');
			switch (y[0]) {
				case 'utm_source':
					utmsession.source = y[1];
					break;
				case 'utm_medium':
					utmsession.medium = y[1];
					break;
				case 'utm_term':
					utmsession.term = y[1];
					break;
				case 'utm_content':
					utmsession.content = y[1];
					break;
				case 'utm_campaign':
					utmsession.campaign = y[1];
					break;
				case 'gclid':
					utmsession.gclid = y[1];
					break;
			}
		});
		return utmsession;
	}
};