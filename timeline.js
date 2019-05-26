
var events = [];


var targets = ["成员一","成员二", "成员三", "成员四","成员五"];


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
var format = "%Y-%m-%d %H:%M";
var timeFormat = d3.time.format(format);
var timeDomainString = "1day";

var timeline = d3.timeline().targets(targets).eventTypes(eventTypes);

var margin = {
     top : 20,
     right : 40,
     bottom : 20,
     left : 100
};
timeline.margin(margin);

timeline.timeDomainMode("fit");
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


function changeTimeDomain() {
    sort(events);
    var startDate = getStartDate();
    var endDate = getEndDate();
    timeline.timeDomain([ startDate, endDate]);
    timeline.tickFormat(format);
    timeline.redraw(events);
}

function getStartDate() {
    var startDate = Date.now();
    if (events.length > 0) {
        startDate = events[0].startDate;
    }
    return startDate;
}

function getEndDate() {
    var endDate = d3.time.day.offset(new Date(), +1);
    if (events.length > 0) {
        endDate = d3.time.hour.offset(events[events.length - 1].startDate, 2);

    }
    return endDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var eventTypeKeys = Object.keys(eventTypes);
    var eventType = eventTypeKeys[Math.floor(Math.random() * eventTypeKeys.length)];
    var target = targets[Math.floor(Math.random() * targets.length)];
    var startDate = lastEndDate;
    console.log("add startDate : " + timeFormat(lastEndDate));
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

