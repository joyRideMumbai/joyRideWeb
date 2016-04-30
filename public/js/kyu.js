var kyu = function () {
    var read_cookie = document.cookie;
    var listcookie = read_cookie.split(';');
    var a, b, c, d, e, f = null;
    listcookie.forEach(function (x) {
        var y = x.split('=');
        switch (y[0].trim()) {
        case 'userid':
            c = y[1];
            break;
        case 'useremail':
            d = y[1];
            break;
        case 'sessioncookie':
            var z = decodeURIComponent(y[1]).substring(2);
            var w = JSON.parse(z);
            b = w.referer;
            a = w.visitsession;
            break;
        case 'store':
            f = JSON.parse(y[1]);
            var flag = true;
            if ((f !== null) || (f !== undefined)) {
                var i = 0;
                while (i < f.length) {
                    var req = new XMLHttpRequest();
                    req.open("POST", 'https://a1.fitternity.com/pushkyuevent', true);
                    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    var postdata = JSON.stringify(f[i]);
                    req.send(postdata);
                    req.onerror = function (e) {
                        flag = false;
                        return;
                    };
                    if (i === f.length - 1) {
                        if (flag) {
                            document.cookie = 'store=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        }
                    }
                    i++;
                }
            }
            break;
        }
    });
    if (navigator.userAgent.match(/Mobile/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/webOS/i)) {
        e = 'mobile';
    } else if (navigator.userAgent.match(/Tablet/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Nexus 7/i) || navigator.userAgent.match(/Nexus 10/i) || navigator.userAgent.match(/KFAPWI/i)) {
        e = 'tablet';
    } else {
        e = 'laptop';
    }
    this.visitsession = a;
    this.userid = c;
    this.referer = b;
    this.useremail = d;
    this.device = e;
    this.store = f;
    this.url = "https://a1.fitternity.com/pushkyuevent";
    this.request = new XMLHttpRequest();
    this.request.open("POST", this.url, true);
    this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
};
kyu.prototype.pushevent = function (eventname, eventdata) {
    try {
        eventdata.useridentifier = this.userid;
        eventdata.referer = this.referer;
        eventdata.sessionid = this.visitsession;
        eventdata.device = this.device;
        eventdata.useremail = this.useremail;
        eventdata.event_id = eventname;
        this.request.open("POST", this.url, true);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var postdata = JSON.stringify(eventdata);
        this.request.send(postdata);
        this.request.onerror = function (e) {
            if (this.store === undefined) {
                this.store = [];
                this.store.push(eventdata);
                var k = document.cookie + ';store=' + JSON.stringify(this.store);
                document.cookie = k + ';path=/';
            } else {
                this.store.push(eventdata);
                document.cookie = 'store=' + JSON.stringify(this.store) + ';path=/';
            }
        };
    } catch (error) {
        if (this.store === null) {
            this.store = [];
            this.store.push(eventdata);
            document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
        } else {
            this.store.push(eventdata);
            document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
        }
    }
};
kyu.prototype.pushprofile = function (eventdata) {
    try {
        eventdata.useridentifier = this.userid;
        eventdata.referer = this.referer;
        eventdata.sessionid = this.visitsession;
        eventdata.useremail = eventdata.email;
        eventdata.username = eventdata.name;
        eventdata.device = this.device;
        this.request.open("POST", this.url, true);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var postdata = JSON.stringify(eventdata);
        this.request.send(postdata);
        this.request.onerror = function (e) {
            if (this.store === null) {
                this.store = [];
                this.store.push(eventdata);
                document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
            } else {
                this.store.push(eventdata);
            }
        };
    } catch (error) {
        if (this.store === null) {
            this.store = [];
            this.store.push(eventdata);
            document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
        } else {
            this.store.push(eventdata);
            document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
        }
    }
};
kyu.prototype.charged = function (eventdata) {
    try {
        eventdata.useridentifier = this.userid;
        eventdata.referer = this.referer;
        eventdata.sessionid = this.visitsession;
        eventdata.useremail = this.useremail;
        eventdata.device = this.device;
        this.request.open("POST", this.url, true);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var postdata = JSON.stringify(eventdata);
        this.request.send(eventdata);
        this.request.onerror = function (e) {
            if (this.store === null) {
                this.store = [];
                this.store.push(eventdata);
                document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
            } else {
                this.store.push(eventdata);
            }
        };
    } catch (error) {
        if (this.store === null) {
            this.store = [];
            this.store.push(eventdata);
            document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
        } else {
            this.store.push(eventdata);
            document.cookie = document.cookie + ';store=' + JSON.stringify(this.store);
        }
    }
};
var kyu1 = new kyu();