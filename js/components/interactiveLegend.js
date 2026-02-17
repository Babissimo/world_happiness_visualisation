export const interactiveLegend = (parent, props) => {
  const {
    names,
    visibleNames = [],
    hiddenNames = [],
    width,
    height,
    margin,
    colourScale,
    onCheckboxClick,
    onMouseOver,
    onMouseOut,
    hoveredBox,
    nullColour
  } = props;

  const itemHeight = 15;
  const totalItems = visibleNames.length + hiddenNames.length;
  const totalHeight = totalItems * itemHeight;
  const dividerY = 7 + (visibleNames.length + 0.5) * itemHeight;

  // Data: visible (highlighted) in rank order, divider, then hidden in rank order.
  // Hidden indices skip one slot so they sit below the divider.
  const dividerDatum = { key: '__divider__', y: dividerY };
  const itemsData = [
    ...visibleNames.map((name, i) => ({
      name,
      index: i,
      isVisible: true,
      isHovered: hoveredBox === name,
    })),
    dividerDatum,
    ...hiddenNames.map((name, i) => ({
      name,
      index: visibleNames.length + 1 + i, // +1 so first hidden is below divider
      isVisible: false,
      isHovered: hoveredBox === name,
    })),
  ];

  const keyFn = d => d.key || d.name;
  const ns = 'http://www.w3.org/2000/svg';

  // Stable SVG and inner group
  const svg = parent.selectAll('svg.legend-svg').data([null]).join('svg')
    .attr('class', 'legend-svg')
    .attr('width', width)
    .attr('height', totalHeight + margin.top + margin.bottom);

  const innerG = svg.selectAll('g.legend-inner').data([null]).join('g')
    .attr('class', 'legend-inner')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Use a single selector that matches both types so we can bind one array and append in data order
  innerG.selectAll('[data-legend-entry]')
    .data(itemsData, keyFn)
    .join(
      enter => {
        // Append in data order: line for divider, g for items
        const sel = enter.append(d => document.createElementNS(ns, d.key === '__divider__' ? 'line' : 'g'))
          .attr('data-legend-entry', d => d.key || d.name);
        const divider = sel.filter(d => d.key === '__divider__');
        divider
          .attr('class', 'legend-divider')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', d => d.y)
          .attr('y2', d => d.y)
          .attr('stroke', nullColour)
          .attr('stroke-width', 1);
        const items = sel.filter(d => d.key !== '__divider__');
        items
          .attr('class', 'legend-item checkbox')
          .attr('transform', d => `translate(${margin.left}, ${10 + d.index * itemHeight})`);
        items
          .append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', d => d.isVisible ? colourScale(d.name) : nullColour)
          .style('stroke-width', d => d.isHovered ? '2px' : '0.1px');
        items
          .append('polyline')
          .attr('points', '1,5 4,8 9,1')
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .style('display', d => d.isVisible ? '' : 'none');
        items
          .append('text')
          .attr('x', 15)
          .attr('y', 9)
          .attr('font-size', '10px')
          .attr('font-weight', d => d.isHovered ? '600' : '100')
          .text(d => `${names.indexOf(d.name) + 1}. ${d.name}`);
        items
          .on('click', (event, d) => onCheckboxClick(event, d.name))
          .on('pointerover', (event, d) => {
            if (hoveredBox !== d.name) onMouseOver(event, d.name);
          })
          .on('pointerleave', (event, d) => {
            if (hoveredBox === d.name) onMouseOut(event, d.name);
          });
        return sel;
      },
      update => {
        const divider = update.filter(d => d.key === '__divider__');
        divider
          .attr('y1', d => d.y)
          .attr('y2', d => d.y);
        const items = update.filter(d => d.key !== '__divider__');
        items
          .attr('transform', d => `translate(${margin.left}, ${10 + d.index * itemHeight})`);
        items.select('rect')
          .attr('fill', d => d.isVisible ? colourScale(d.name) : nullColour)
          .style('stroke-width', d => d.isHovered ? '2px' : '0.1px');
        items.select('polyline')
          .style('display', d => d.isVisible ? '' : 'none');
        items.select('text')
          .attr('font-weight', d => d.isHovered ? '600' : '100')
          .text(d => `${names.indexOf(d.name) + 1}. ${d.name}`);
        return update;
      },
      exit => exit.remove()
    );

  // When the pointer leaves the legend area entirely, clear hover so the ghost/outline don’t stick
  parent.on('pointerleave', (event) => {
    if (hoveredBox != null) onMouseOut(event, null);
  });
}
