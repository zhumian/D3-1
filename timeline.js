var events = [
{"startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"target":"一支队","eventType":"action_start",
"desc": "aaa", url: "qq.jpg"},
{"startDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 04:36:45 EST 2012"),"target":"二支队","eventType":"action_start",
    "desc": "bbb", url: "qq.jpg"}];



var targets = ["一支队","二支队", "三支队", "四支队","五支队"];
var eventTypes = {
    "target_appear": "target_appear",
    "target_disappear": "target_disappear",
    "action_start": "action_start",
    "action_over": "action_over"
}

events.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = events[events.length - 1].endDate;
events.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = events[0].startDate;

var format = "%a %H:%M";
var timeDomainString = "1day";

var timeline = d3.timeline().targets(targets).eventTypes(eventTypes).tickFormat(format);

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


function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
    case "1hr":
	format = "%H:%M:%S";
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
	break;
    case "3hr":
	format = "%H:%M";
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
	break;

    case "6hr":
	format = "%H:%M";
	timeline.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
	break;

    case "1day":
	format = "%H:%M";
	timeline.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
	break;

    case "1week":
	format = "%a %H:%M";
	timeline.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
	break;
    default:
	format = "%H:%M"

    }
    timeline.tickFormat(format);
    timeline.redraw(events);
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (events.length > 0) {
	lastEndDate = events[events.length - 1].endDate;
    }

    return lastEndDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var eventTypeKeys = Object.keys(eventTypes)
    var eventType = eventTypeKeys[Math.floor(Math.random() * eventTypeKeys.length)];
    var target = targets[Math.floor(Math.random() * targets.length)];
    var event = {
        "startDate" : d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
        "endDate" : d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
        "eventType" : eventType,
        "target" : target,
        "desc": target + " " + eventType
    };
    events.push(event);

    changeTimeDomain(timeDomainString);
    timeline.redraw(events);
};

function removeTask() {
    events.pop();
    changeTimeDomain(timeDomainString);
    timeline.redraw(events);
};
