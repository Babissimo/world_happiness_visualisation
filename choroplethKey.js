export const choroplethKey = (parent, props) => {
  const {
    keyExtent,
    keyColours,
    xVal,
    yVal
  } = props;

  // group element for key and its associated text
  const keyGroup = parent.selectAll('g#key').data([null]).join('g')
    .attr('id', 'key');

  const gradient = keyGroup.selectAll('defs.gradient').data([null]);
  const gradientEnter = gradient.enter().append('defs')
    .append('linearGradient')
    .attr('class', 'gradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');

  gradientEnter.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', keyColours[0]);

  gradientEnter.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', keyColours[1]);

  // colored rectangle key
  const block = keyGroup.append('rect')
    .attr('x', xVal)
    .attr('y', yVal)
    .attr('width', 100)
    .attr('height', 10)
    .attr('fill', `url(#gradient)`);

  // update text below key
  keyGroup.selectAll('text.range-left').data([null]).join('text')
    .attr('class', 'range range-left')
    .attr('x', xVal)
    .attr('y', yVal + 25)
    .text((keyExtent[0] === undefined) ? '-/-' : keyExtent[0].toPrecision(3));

  keyGroup.selectAll('text.range-right').data([null]).join('text')
    .attr('class', 'range range-right')
    .attr('x', xVal + 100)
    .attr('y', yVal + 25)
    .attr('text-anchor', 'end')
    .text((keyExtent[0] === undefined) ? '-/-' : keyExtent[1].toPrecision(3));
};
