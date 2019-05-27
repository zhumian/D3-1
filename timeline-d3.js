/**
 * @author liaozj
 * @version 2.1
 */

d3.timeline = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
        top : 20,
        right : 40,
        bottom : 20,
        left : 60
    };
    var selector;
    var timeDomainStart = Date.now();
    var timeDomainEnd = d3.time.day.offset(new Date(), +1);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var targets = [];
    var eventTypes = {
        "action": "action",
        "appear": "appear",
        "bomb": "bomb",
        "car": "car",
        "do": "do",
        "find": "find",
        "pack": "pack"
    };
    var height;
    var width;
    var tickSize = 10;
    var tickFormat = "%Y-%m-%d %H:%M";
    var timeFormat = d3.time.format("%m-%d %H:%M");
    var global_width;
    var global_scale = 1;
    var zoom;
    var x;
    var y;
    var xAxis;
    var yAxis;
    var svg;



    var keyFunction = function(d) {
        if(d != null){
            return d.startDate + d.target;
        }
        return ""

    };

    var rectTransform = function(d) {
        //console.log(d.target + " : " + x(d.startDate));
        return "translate(" + x(d.startDate) + "," + y(d.target) + ")";
    };

    var loadWidth = function (d) {
        if (d == null){
            return;
        }
        return global_width;
    };

    var loadDisplay = function (d) {
        var x_d = x(d.startDate);
        //console.log("x_d : " + x_d);

        return null;
    };

    var loadIcon = function (d) {
        var x_d = x(d.startDate);
        //console.log("x_d : " + x_d);
        var eventType = d.eventType;
        return "url(#" + eventType + ")";
    };

    var initTimeDomain = function(events) {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (events === undefined || events.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            events.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainEnd = d3.time.hour.offset(events[events.length - 1].startDate, +3);

            events.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = d3.time.hour.offset(events[events.length - 1].startDate, -6);
            console.log("change timedomain")
            //console.log("startDate : " + timeFormat(timeDomainStart) + "; endDate : " + timeFormat(timeDomainEnd));
        }
    };



    var initAxis = function() {
        console.log("initAxis")
        /*x = d3.time.scale().domain([timeDomainStart, timeDomainEnd ])
            .range([ -width, width ]).clamp(true);*/
        var startDate = d3.time.day.offset(new Date(),-3);
        var endDate =  d3.time.day.offset(new Date(),+3);
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE){
            startDate = timeDomainStart;
            endDate = timeDomainEnd;
        }
        console.log("domain : " + startDate + "  " + endDate);
        x = d3.time.scale()
            .domain([startDate, endDate])
            .range([0, width ]);
        y = d3.scale.ordinal().domain(targets).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(10).tickPadding(10);
       /* xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat));*/
        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0).tickPadding(10);
    };

    function zoomed() {
        var domain = x.domain();
        console.log("zoomed : " + zoom.scale());
        global_scale = zoom.scale()
        console.log("zoomed : " + domain[0] + "  " + domain[1])
        if(svg != null){
            svg.select(".x").transition().call(xAxis);
            svg.selectAll('.event-g')
                .attr("x", function (d) {
                    return x(d.startDate);
                })
                .attr("transform", rectTransform);
        }

    }


    function timeline(events) {
        console.log("timeline function")
        initTimeDomain(events);
        initAxis();


        var eventTypesKeys = Object.keys(eventTypes);
        var defs = svg.append("defs");
        for(var i = 0; i < eventTypesKeys.length; i++){
            defs .append("pattern")
                //userSpaceOnUse
                .attr('patternUnits', 'objectBoundingBox')//objectBoundingBox
                .attr("id", eventTypesKeys[i])
                .attr('width', 1)
                .attr("height", 1)
                //.attr('width', global_width)
                //.attr("height", function(d) { return y.rangeBand(); })
                .append("image")
               /* .attr('width', 1)
                .attr("height", 1)*/
                //.attr("width", global_width)
                .attr("width", function(d) { return y.rangeBand()*2; })
                .attr("height", function(d) { return y.rangeBand(); })
                .attr("xlink:href", function (d) {
                    var key = eventTypesKeys[i];
                    return "icon/" + key + ".png";
                });
        }



        var chart = svg.append("svg")
            .attr("class", "timeline-chart")
            .attr("x", margin.left)
            .attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left    + ", " + margin.top + ")");
        zoom = d3.behavior.zoom()
            .x(x)
            //.y(y)
            .scale(global_scale)
            .scaleExtent([0.5,10])
            .on("zoom", zoomed);
        svg.call(zoom);





        svg.selectAll(".target-line")
            .data(targets)
            .enter()
            .append("line")
            .attr("class", "target-line")
            .attr("x1", margin.left)
            .attr("x2", margin.left + width)
            .attr("y1", function (d, i) {
                var count = targets.length;
                var perHeight = (height - margin.top - margin.bottom)/count;
                return perHeight * i;
            })
            .attr("y2", function (d, i) {
                var count = targets.length;
                var perHeight = (height - margin.top - margin.bottom)/count;
                return perHeight * i;
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+ margin.left + ", " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        svg.append("g").attr("class", "y axis").transition()
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")").call(yAxis);

        return timeline;

    }

    timeline.redraw = function(events) {
        console.log("redraw function");
        initTimeDomain(events);
        initAxis();
        zoom = d3.behavior.zoom()
           .x(x)
           //.y(y)
           .scale(global_scale)
           .scaleExtent([0.5,10])
           .on("zoom", zoomed);
       svg.call(zoom);
        if(svg == null){
            svg = d3.select(selector).append("svg")
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
        }
        var chart = svg.select(".timeline-chart");
        var event_gs = chart.selectAll(".event-g").data(events, keyFunction);

        var event_g = event_gs.enter()
            .insert("g", ":first-child")
            .attr("class", "event-g");

        event_g.attr("rx", 5)
            .attr("ry", 5)
           /* .attr("x", function (d) {
                return x(d.startDate);
            })*/
            .transition()
            /*.attr("y", 0)*/
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth);

        event_g.append("rect")
            .attr("x",0)
            .attr("y", 0)
            .attr("class", "event-rect")
            .attr("width",loadWidth)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("fill", loadIcon);

        event_g.insert("text")
            .text(function (d, i) {
                return d.desc
            })
            .attr("class", "event-desc")
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth)
            .attr("x",function () {
                return y.rangeBand()*2/3;
            })
            .attr("y",function (d) {
                var y_d = y.rangeBand()/9;
                return  y_d*4;
            });
        event_g.insert("text")
            .text(function (d, i) {
                var time = d.startDate;
                return d3.time.format("%m-%d %H:%M")(time);
            })
            .attr("class", "event-time")
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth)
            .attr("x",function () {
                return y.rangeBand()*2/3;
            })
            .attr("y",function (d) {
                var y_d = y.rangeBand()/9;
                return  y_d*6;
            });

        event_gs.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth);
        svg.selectAll("rect").transition()
            //.attr("transform", rectTransform)
            //.attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth);
        svg.selectAll("text").transition()
            //.attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth)
            .attr("display", loadDisplay);

        event_gs.exit().remove();
        zoomed();

        return timeline;
    };

    timeline.init = function (selector_value, margin_value, targets_value, events) {
        console.log("timeline.init");
        selector = selector_value;
        margin = margin_value;
        height = selector.offsetHeight;
        width = selector.offsetWidth - margin.right - margin.left;

        x = d3.time.scale().domain([ d3.time.day.offset(timeDomainStart,-3), d3.time.day.offset(timeDomainStart,+3) ]).range([ -width, width ]).clamp(true);


        y = d3.scale.ordinal().domain(targets).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(10).tickPadding(10);
        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
        global_width = width/tickSize*2;

        svg = d3.select(selector).append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        targets = targets_value;
        timeline.redraw(events);
        timeline(events);
        return timeline;
    };

    timeline.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return timeline;
    };

    timeline.timeDomain = function(value) {
        if (!arguments.length)
            return [ timeDomainStart, timeDomainEnd ];
        timeDomainStart = value[0], timeDomainEnd = value[1];
        return timeline;
    };

    timeline.timeDomainMode = function(value) {
        if (!arguments.length)
            return timeDomainMode;
        timeDomainMode = value;
        return timeline;

    };

    timeline.targets = function(value) {
        if (!arguments.length)
            return targets;
        targets = value;
        return timeline;
    };

    timeline.selector = function(value) {
        if (!arguments.length)
            return selector;
        selector = value;
        return timeline;
    };

    timeline.reset = function (events) {
        if (events.length > 0) {
            events.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeline.timeDomain(events[0].startDate, endDate = d3.time.hour.offset(events[events.length - 1].startDate, 2));
        }else{
            var now = Date.now();
            timeline.timeDomain(now, d3.time.day.offset(now, +1));
        }
        initTimeDomain(events);
        initAxis();
        zoom = d3.behavior.zoom()
            .x(x)
            //.y(y)
            .scale(global_scale)
            .scaleExtent([0.5,10])
            .on("zoom", zoomed);
        svg.call(zoom);
        zoomed()
    };

    return timeline;
};
