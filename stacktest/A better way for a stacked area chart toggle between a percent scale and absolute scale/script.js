var margin = {
    top: 20,
    bottom: 20,
    right: 20,
    left: 40
};
var width = 500 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var stackType = true;

data = [{
    "type": "Group1",
        "values": [{
        "x": 0,
        "y": 2.5
    }, {
        "x": 1,
        "y": 2.4
    }, {
        "x": 2,
        "y": 0.3
    }]
}, {
    "type": "Group2",
        "values": [{
        "x": 0,
        "y": 1.5
    }, {
        "x": 1,
        "y": 0.7
    }, {
        "x": 2,
        "y": 1.1
    }]
}];

var colors = d3.scale.category20();
var colors2 = d3.scale.category10();

var stackZero = d3.layout.stack()
    .values(function (d) {return d.values;}) 
    .offset("zero");

stackZero(data);
console.log(data);

var xScale = d3.scale.linear()
    .domain([0, 2])
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function (d) {
    return d3.max(d.values, function (d) {
        return d.y0 + d.y;
    });
})]);

var area = d3.svg.area()
    .x(function (d) {
    return xScale(d.x);
})
    .y0(function (d) {
    return yScale(d.y0);
})
    .y1(function (d) {
    return yScale(d.y0 + d.y);
});

var svg = d3.selectAll("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll(".layers")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "layer")
    .attr("d", function (d) {
    return area(d.values);
})
    .style("fill", function (d, i) {
    return colors(i)
});

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");


    if (stackType) { //enter true, or expanded data

        var stackExpand = d3.layout.stack()
            .values(function (d) {
            return d.values;
        })
            .offset("expand");

        stackExpand(data);

        console.log(data);

        var yScale = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(data, function (d) {
            return d3.max(d.values, function (d) {
                return d.y0 + d.y;
            });
        })]);

        var area = d3.svg.area()
            .x(function (d) {
            return xScale(d.x);
        })
            .y0(function (d) {
            return yScale(d.y0);
        })
            .y1(function (d) {
            return yScale(d.y0 + d.y);
        });

        svg.selectAll(".layers")
        //.data(stackZero(data))
        .data(stackExpand(data))
            .enter()
            .append("path")
            .attr("class", "layer")
            .attr("d", function (d) {
            return area(d.values);
        })
            .style("fill", function (d, i) {
            return colors(i)
        });

        formatter = d3.format(".0%");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickFormat(formatter);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);


        stackType = false;
        console.log("exiting variable is " + stackType);

    } else { //enter false, or zero data

        data = [{
            "type": "Group1",
                "values": [{
                "x": 0,
                "y": 2.5
            }, {
                "x": 1,
                "y": 2.4
            }, {
                "x": 2,
                "y": 0.3
            }]
        }, {
            "type": "Group2",
                "values": [{
                "x": 0,
                "y": 1.5
            }, {
                "x": 1,
                "y": 0.7
            }, {
                "x": 2,
                "y": 1.1
            }]
        }];

        var stackZero = d3.layout.stack()
            .values(function (d) {
            return d.values;
        })
            .offset("zero");

        stackZero(data);

        console.log(data);

        var yScale = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(data, function (d) {
            return d3.max(d.values, function (d) {
                return d.y0 + d.y;
            });
        })]);

        var area = d3.svg.area()
            .x(function (d) {
            return xScale(d.x);
        })
            .y0(function (d) {
            return yScale(d.y0);
        })
            .y1(function (d) {
            return yScale(d.y0 + d.y);
        });

        svg.selectAll(".layers")
            .data(stackZero(data))
        //.data(stackExpand(data))
        .enter()
            .append("path")
            .attr("class", "layer")
            .attr("d", function (d) {
            return area(d.values);
        })
            .style("fill", function (d, i) {
            return colors(i)
        });

        stackType = true;
        console.log("exiting variable is" + stackType);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

    };
