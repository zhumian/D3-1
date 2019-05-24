/*var events = [
{"startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"target":"一支队","eventType":"action_start",
"desc": "aaa", url: "qq.jpg"},
{"startDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 04:36:45 EST 2012"),"target":"二支队","eventType":"action_start",
    "desc": "bbb", url: "qq.jpg"}];*/
var events = [];


var targets = ["一支队","二支队", "三支队", "四支队","五支队"];


var eventTypes = {
    "action": "action",
    "appear": "appear",
    "bomb": "bomb",
    "car": "car",
    "do": "do",
    "find": "find",
    "pack": "pack"
};

sort(events)

//var format = "%Y-%m-%d %H:%M";
var format = "%m-%d %H:%M";
var time_formatter = d3.time.format(format);
var timeDomainString = "1day";

var timeline = d3.timeline().targets(targets).eventTypes(eventTypes).tickFormat(format).init();

var margin = {
     top : 20,
     right : 40,
     bottom : 20,
     left : 80
};
timeline.margin(margin);

timeline.timeDomainMode("fixed");
changeTimeDomain(timeDomainString);
timeline(events);

function sort(events) {
    if(events.size > 0){
        events.sort(function(a, b) {
            return a.startDate - b.startDate;
        });
        var maxDate = events[events.length - 1].startDate;
        events.sort(function(a, b) {
            return a.startDate - b.startDate;
        });
        var minDate = events[0].startDate;
    }
}


function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
    case "1hr":
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
	break;
    case "3hr":
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
	break;

    case "6hr":
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
	break;

    case "1day":
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -12), d3.time.hour.offset(getEndDate(), +12)]);
	break;

    case "1week":
	timeline.timeDomain([ d3.time.day.offset(getEndDate(), -3), d3.time.day.offset(getEndDate(), +4) ]);
	break;
    default:

    }
    timeline.tickFormat(format);
    timeline.redraw(events);
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (events.length > 0) {
	lastEndDate = events[events.length - 1].startDate;
    }
    return lastEndDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var eventTypeKeys = Object.keys(eventTypes);
    var eventType = eventTypeKeys[Math.floor(Math.random() * eventTypeKeys.length)];
    var target = targets[Math.floor(Math.random() * targets.length)];
    var startDate = d3.time.hour.offset(lastEndDate,  + 1);
    var event = {
        "startDate" : startDate,
        "eventType" : eventType,
        "target" : target,
        "desc":  "动作描述"
    };
    events.push(event);

    changeTimeDomain(timeDomainString);
    //timeline.redraw(events);
};

function removeTask() {
    events.pop();
    changeTimeDomain(timeDomainString);
};
