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
var selector = document.getElementById("timeline");
var format = "%Y-%m-%d %H:%M";
var timeFormat = d3.time.format(format);
var timeline;

var margin = {
     top : 20,
     right : 40,
     bottom : 20,
     left : 60
};

init();
function init() {
    timeline = d3.timeline().init(selector, margin, targets, events);
    timeline.margin(margin);
}

function sort(events) {
    if(events.size > 0){
        events.sort(function(a, b) {
            return a.startDate - b.startDate;
        });
    }
}

function redraw() {
    var startDate = getStartDate();
    var endDate = getEndDate();
    timeline.timeDomain([ startDate, endDate]);
    timeline.redraw(events);
}

function getStartDate() {
    sort(events);
    var startDate = Date.now();
    if (events.length > 0) {
        startDate = events[0].startDate;
    }
    return startDate;
}

function getEndDate() {
    sort(events);
    var endDate = d3.time.day.offset(new Date(), +1);
    if (events.length > 0) {
        endDate = d3.time.hour.offset(events[events.length - 1].startDate, 2);

    }
    return endDate;
}

function addEvent() {
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
    redraw();
};

function removeEvent() {
    events.pop();
    redraw();
}

function reset() {
    timeline.reset(events);
}

