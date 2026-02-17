import { range } from '../utils/range.js';

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
    colourScale,
  } = props;

  const lwidth = width - margin.left - margin.right;
  const lheight = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain(bottomRange)
    .range([0, lwidth]);

  const yScale = d3.scaleLinear()
    .domain(leftRange)
    .range([lheight, 0]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale);

  const line = d3.line()
    .defined((d) => !isNaN(d.value))
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  // Stable chart container (one g) so we can join series data to paths
  const chartRoot = parent.selectAll('g.chart-root').data([null]).join(
    enter => {
      const g = enter.append('g')
        .attr('class', 'chart-root')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      g.append('g').attr('class', 'axis-x');
      g.append('g').attr('class', 'axis-y');
      g.append('g').attr('class', 'series');
      return g;
    },
    update => update,
    exit => exit.remove()
  );

  // Update axes (call replaces tick content each time)
  chartRoot.select('g.axis-x')
    .attr('transform', `translate(0,${lheight})`)
    .call(xAxis);

  chartRoot.select('g.axis-y').call(yAxis);

  // Axis labels (join so we don't duplicate)
  chartRoot.select('g.axis-x').selectAll('text.axis-label').data([null]).join('text')
    .attr('class', 'axis-label')
    .attr('x', lwidth / 2)
    .attr('y', margin.bottom - 10)
    .attr('fill', '#333333')
    .attr('font-weight', '600')
    .text(bottomLabel);

  chartRoot.select('g.axis-y').selectAll('text.axis-label').data([null]).join('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -lheight / 2)
    .attr('y', -margin.left + 12)
    .attr('fill', '#333333')
    .attr('font-weight', '600')
    .text(leftLabel);

  // Series data for join: one item per country line
  const allLines = [...lineNames];
  if (hoveredLine && !allLines.includes(hoveredLine)) {
    allLines.push(hoveredLine);
  }

  const seriesData = allLines.map(countryName => {
    const lineData = range(bottomRange[0], bottomRange[1])
      .map(year => ({
        year: +year,
        value: yValueFunction(countryName, '' + year),
      }))
      .filter(point => point.value !== null);
    return {
      name: countryName,
      lineData: lineData.filter(d => !isNaN(d.value)),
      isSelected: lineNames.includes(countryName),
      isHovered: countryName === hoveredLine,
    };
  });

  const seriesGroup = chartRoot.select('g.series');

  const paths = seriesGroup.selectAll('path.series')
    .data(seriesData, d => d.name)
    .join(
      enter => enter.append('path')
        .attr('class', 'series')
        .attr('fill', 'none')
        .attr('stroke', d => colourScale(d.name))
        .attr('stroke-width', d => d.isHovered ? 3 : 1.5)
        .attr('d', d => line(d.lineData))
        .style('opacity', d => d.isSelected ? 1 : 0.5),
      update => update
        .attr('stroke', d => colourScale(d.name))
        .attr('stroke-width', d => d.isHovered ? 3 : 1.5)
        .attr('d', d => line(d.lineData))
        .style('opacity', d => d.isSelected ? 1 : 0.5),
      exit => exit.remove()
    );

};
