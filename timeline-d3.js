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
    /*var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat));*/

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function(targets) {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (targets === undefined || targets.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            targets.sort(function(a, b) {
                return a.endDate - b.endDate;
            });
            timeDomainEnd = targets[targets.length - 1].endDate;
            targets.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = targets[0].startDate;
        }
    };

    var initAxis = function() {
        x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
        y = d3.scale.ordinal().domain(targets).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(12).tickPadding(12);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function timeline(targets) {
        console.log("timeline function")
        initTimeDomain(targets);
        initAxis();

        var svg = d3.select(selector)
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "timeline-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var g = svg.selectAll(".event-g")
            .data(targets, keyFunction).enter()
            .append("g")
            .attr("class", "event-g");
        g.append("svg:image")
            .attr('xlink:href', 'qq.jpg')
            .attr("class", "timeline-event")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });
        g.append("text")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            })
            .attr("transform", rectTransform)
            .text(function (d, i) {
                return d.desc
            });


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        svg.append("g").attr("class", "y axis").transition().call(yAxis);

        return timeline;

    }

    timeline.redraw = function(targets) {
        console.log("redraw function")
        initTimeDomain(targets);
        initAxis();

        var svg = d3.select(".chart");
        var chart = d3.select(".timeline-chart");
        var g_0 = chart.selectAll(".event-g").data(targets, keyFunction);
        var g = g_0.enter()
            .insert("g", ":first-child")
            .attr("class", "event-g");
        //var g = ganttChartGroup.selectAll("g").data(targets, keyFunction);

        g.attr("rx", 5)
            .attr("ry", 5)
            .transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });

        g.insert("svg:image")
            .attr('xlink:href', 'qq.jpg')
            .attr("class", "timeline-event")
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });

        g.insert("text")
            .text(function (d, i) {
                return d.desc
            })
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });



        g_0.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                console.log(d.target + " width : " + Math.max(1,(x(d.endDate) - x(d.startDate)))  + d.startDate + " " + d.endDate);
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });
        svg.selectAll("img").transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                debugger
                console.log(d.target + " width : " + Math.max(1,(x(d.endDate) - x(d.startDate)))  + d.startDate + " " + d.endDate);
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });
        svg.selectAll("text").transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                console.log(d.target + " width : " + Math.max(1,(x(d.endDate) - x(d.startDate)))  + d.startDate + " " + d.endDate);
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });
        /*if(g_0[0] != null){
            for(var i = 0; i < g_0[0].length -1; i++){
                debugger
                var item = g_0[0][i];
            }
        }*/

        /*g_0.selectAllChildren().transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                console.log(d.target + " width : " + Math.max(1,(x(d.endDate) - x(d.startDate)))  + d.startDate + " " + d.endDate);
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });*/
        g_0.exit().remove();

        /*g.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });*/


        /*g.enter()
            .insert("rect",":first-child")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d){
                return d.eventType;
            })
            .transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });

        g.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return Math.max(1,(x(d.endDate) - x(d.startDate)));
            });*/

        //g.exit().remove();
        svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);

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
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
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

    return timeline;
};
