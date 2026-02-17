export const choroplethKey = (parent, props) => {
  const {
    keyExtent,
    keyColours,
    xVal,
    yVal
  } = props;

  const keyGroup = parent.selectAll('g#key').data([null]).join('g')
    .attr('id', 'key');

  // Gradient defs and linearGradient: create once in enter
  keyGroup.selectAll('defs.gradient').data([null]).join(
    enter => {
      const defs = enter.append('defs').attr('class', 'gradient');
      defs.append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
      return defs;
    },
    update => update,
    exit => exit.remove()
  );

  // Stops: join so colours can update when keyColours change
  keyGroup.select('linearGradient').selectAll('stop')
    .data(keyColours)
    .join(
      enter => enter.append('stop')
        .attr('offset', (d, i) => (i === 0 ? '0%' : '100%'))
        .attr('stop-color', d => d),
      update => update
        .attr('offset', (d, i) => (i === 0 ? '0%' : '100%'))
        .attr('stop-color', d => d),
      exit => exit.remove()
    );

  // Coloured rectangle: join so we don't append a new rect every call
  keyGroup.selectAll('rect.key-block').data([null]).join('rect')
    .attr('class', 'key-block')
    .attr('x', xVal)
    .attr('y', yVal)
    .attr('width', 100)
    .attr('height', 10)
    .attr('fill', 'url(#gradient)');

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
