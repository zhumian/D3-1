/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.timeline = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
        top : 20,
        right : 40,
        bottom : 20,
        left : 150
    };
    var selector = 'body';
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var targets = [];
    var eventTypes = [];
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;

    var tickFormat = "%H:%M";
    var timeFormat = d3.time.format("%m-%d %H:%M");
    var global_width = 300;

    var keyFunction = function(d) {
        if(d != null){
            return d.startDate + d.target + d.endDate;
        }
        return ""

    };

    var rectTransform = function(d) {
        console.log(d.target + " : " + x(d.startDate));
        return "translate(" + x(d.startDate) + "," + y(d.target) + ")";
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(targets).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(10).tickPadding(10);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var loadWidth = function (d) {
        if (d == null){
            return;
        }
        var x_d = x(d.startDate);
        console.log("x_d : " + x_d);
        if(x_d == 0){
            return 0;
        }
        return global_width;
    };

    var loadDisplay = function (d) {
        var x_d = x(d.startDate);
        console.log("x_d : " + x_d);
        if(x_d == 0){
            return "none";
        }
        return null;
    };

    var loadIcon = function (d) {
        var x_d = x(d.startDate);
        console.log("x_d : " + x_d);
        if(x_d == 0){
            return "";
        }
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
            timeDomainEnd = d3.time.hour.offset(events[events.length - 1].startDate, +3);;

            events.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = events[0].startDate;
            debugger
            console.log("startDate : " + timeFormat(timeDomainStart) + "; endDate : " + timeFormat(timeDomainEnd));
        }
    };

    var initAxis = function() {
        debugger
        x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ])
            .range([ 0, width ]).clamp(true);
        y = d3.scale.ordinal().domain(targets).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(10).tickPadding(10);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function timeline(events) {
        console.log("timeline function")
        initTimeDomain(events);
        initAxis();

        var svg = d3.select(selector).append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "#022056");

        var eventTypesKeys = Object.keys(eventTypes);
        var defs = svg.append("defs");


        for(var i = 0; i < eventTypesKeys.length; i++){
            defs .append("pattern")
                .attr('patternUnits', 'userSpaceOnUse')
                .attr("id", eventTypesKeys[i])
                .attr('width', 300)
                .attr("height", function(d) { return y.rangeBand(); })
                .append("image")
                .attr("width", 300)
                .attr("height", function(d) { return y.rangeBand(); })
                .attr("xlink:href", function (d) {
                    var key = eventTypesKeys[i];
                    return "icon/" + key + ".png";
                });
        }
        var g = svg.append("g")
            .attr("class", "timeline-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        g.selectAll(".target-line")
            .data(targets)
            .enter()
            .append("line")
            .attr("class", "target-line")
            .attr("x1", 0)
            .attr("x2", width)
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

        //svg.attr("fill", "url(#bg");

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        g.append("g").attr("class", "y axis").transition().call(yAxis);

        return timeline;

    }

    timeline.redraw = function(events) {
        console.log("redraw function")
        initTimeDomain(events);
        initAxis();

        var svg = d3.select(".chart");
        var chart = d3.select(".timeline-chart");
        var g_0 = chart.selectAll(".event-g").data(events, keyFunction);

        var g = g_0.enter()
            .insert("g", ":first-child")
            .attr("class", "event-g")

        g.attr("rx", 5)
            .attr("ry", 5)
            //.transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth);

        g.append("rect")
            .attr("x",0)
            .attr("y", 0)
            .attr("class", "event-rect")
            .attr("width",loadWidth)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("fill", loadIcon);

        g.insert("text")
            .text(function (d, i) {
                return d.desc
            })
            .attr("class", "event-desc")
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth)
            .attr("x",function () {
                return global_width/3;
            })
            .attr("y",function (d) {
                var y_d = y.rangeBand()/9;
                return  y_d*4;
            });
        g.insert("text")
            .text(function (d, i) {
                var time = d.startDate;
                return d3.time.format("%m-%d %H:%M")(time);
            })
            .attr("class", "event-time")
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", loadWidth)
            .attr("x",function () {
                return global_width/3;
            })
            .attr("y",function (d) {
                var y_d = y.rangeBand()/9;
                return  y_d*6;
            });




        g_0.transition()
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



        g_0.exit().remove();


        svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);
        //svg.select(".tick major").select()transition().attr("fill","white");

        return timeline;
    };

    timeline.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return timeline;
    };

    timeline.timeDomain = function(value) {
        debugger
        if (!arguments.length)
            return [ timeDomainStart, timeDomainEnd ];
        timeDomainStart = value[0], timeDomainEnd = value[1];
        return timeline;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
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

    timeline.eventTypes = function(value) {
        if (!arguments.length)
            return eventTypes;
        eventTypes = value;
        return timeline;
    };

    timeline.width = function(value) {
        if (!arguments.length)
            return width;
        width = +value;
        return timeline;
    };

    timeline.height = function(value) {
        if (!arguments.length)
            return height;
        height = +value;
        return timeline;
    };

    timeline.tickFormat = function(value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return timeline;
    };

    timeline.selector = function(value) {
        if (!arguments.length)
            return selector;
        selector = value;
        return timeline;
    };

    timeline.init = function() {
        var svg = d3.select(".chart");
        svg.append("defs")
            .append("pattern")
            .attr('patternUnits', 'userSpaceOnUse')
            .attr("id", "action")
            .append("image")
            .attr("xlink:href", "icon/action.png");
        return timeline;
    };

    return timeline;
};
