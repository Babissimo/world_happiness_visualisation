import { range } from './range.js';

export const lineChart = (parent, props) => {
  const {
    width,
    height,
    margin,
    leftRange,
    leftLabel,
    bottomRange,
    bottomLabel,
    lineNames,
    hoveredLine,
    yValueFunction,
  } = props;


  // set up the margins, width, and height for the line chart 
  const lwidth = width - margin.left - margin.right;
  const lheight = height - margin.top - margin.bottom;

  // create the SVG for the line chart
  parent.selectAll('g').remove();
  const svg = parent.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // set up the scales for the x and y axes
  const xScale = d3.scaleLinear()
    .domain(bottomRange)
    .range([0, lwidth]);

  const yScale = d3.scaleLinear()
    .domain(leftRange)
    .range([lheight, 0]);

  // create and append the x and y axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale);

  // create and append axis labels
  svg.append('g')
    .attr('transform', `translate(0,${lheight})`)
    .call(xAxis)
    .append('text')
      .attr('x', lwidth / 2)
      .attr('y', margin.bottom - 10)
      .attr('fill', '#333333')
      .attr("font-weight", "600")
      .text(bottomLabel);

  svg.append('g')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -lheight / 2)
      .attr('y', -margin.left + 12)
      .attr('fill', '#333333')
      .attr("font-weight", "600")
      .text(leftLabel);

  // line generator for the data points
  const line = d3.line()
    .defined((d) => !isNaN(d.value))
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  // loop through selected countries and add lines to the chart
  const allLines = [...lineNames];
  if (hoveredLine && !allLines.includes(hoveredLine)) {
    allLines.push(hoveredLine);
  }

  allLines.forEach((countryName, i) => {
    const lineData = range(bottomRange[0],bottomRange[1])
      .map(year => ({
        year: +year,
        value: yValueFunction(countryName, '' + year),
      }))
      .filter(point => point.value !== null);

    const colorScale = d3.scaleOrdinal()
    .domain(allLines)
    .range(d3.schemeCategory10);

    svg.append('path')
      .datum(lineData.filter(line.defined()))
      .attr('fill', 'none')
      .attr('stroke', colorScale(countryName))
      .attr('stroke-width', countryName === hoveredLine ? 3 : 1.5)
      .attr('d', line)
      .style('opacity', lineNames.includes(countryName) ? 1 : 0.5);
  });
};