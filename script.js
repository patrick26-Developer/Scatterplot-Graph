const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 800;
const height = 500;
const padding = 60;

const svg = d3.select("#scatterplot")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json(url).then(data => {
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(0, 0, 0, 0, d.Seconds)))
        .range([padding, height - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(new Date(0, 0, 0, 0, d.Seconds)))
        .attr("r", 6)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(0, 0, 0, 0, d.Seconds))
        .style("fill", d => d.Doping ? "red" : "blue")
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .attr("data-year", d.Year)
                .html(`${d.Name} (${d.Nationality}) <br> Année: ${d.Year} <br> Temps: ${d.Time}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", () => tooltip.style("display", "none"));

    const legend = d3.select("#legend");
    legend.append("p").text("● Avec dopage").style("color", "red");
    legend.append("p").text("● Sans dopage").style("color", "blue");
});