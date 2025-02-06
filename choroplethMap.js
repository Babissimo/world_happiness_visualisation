export const choroplethMap = (parent, props) => {
  const {
    nullColour,
    colourScale,
    countryValueMap,
    width,
    height,
    countries,
    selectedCountries,
    regionByCountry,
    pathGenerator,
    onCountryClick,
    onMouseOver,
    onMouseOut,
    hoveredCountry
  } = props;

  // Earth's sphere border
  const earthBorder = parent.selectAll('path.sphere').data([null]);
  const earthBorderEnter = earthBorder.enter().append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}))
    .merge(earthBorder);

  // d3-zoom 
  parent.call(d3.zoom()
  .scaleExtent([1, 8])
  .translateExtent([[0, 0], [width, height]])
  .on('zoom', event => {
    // only apply zoom if it's not a double-click event
    if (!event.sourceEvent || event.sourceEvent.type !== 'dblclick') {
      parent.attr('transform', event.transform);
    }
  }));

  // inset shadow
  let filter = parent.select('defs.filter');
  if (filter.empty()) {
    const filter = parent.append('defs')
      .append('filter')
      .attr('id', 'shadow')
      .attr('width', '150%')
      .attr('height', '150%');
  
    filter.append('feOffset')
      .attr('result', 'offOut')
      .attr('in', 'SourceAlpha')
      .attr('dx', '0')
      .attr('dy', '0');
  
    filter.append('feGaussianBlur')
      .attr('result', 'blurOut')
      .attr('in', 'offOut')
      .attr('stdDeviation', '5');
  
    filter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blurOut')
      .attr('operator', 'out')
      .attr('result', 'inverse');
  
    filter.append('feFlood')
      .attr('color', '#000000')
      .attr('result', 'color');
  
    filter.append('feComposite')
      .attr('in', 'color')
      .attr('in2', 'inverse')
      .attr('operator', 'in')
      .attr('result', 'shadow');
  
    filter.append('feComposite')
      .attr('in', 'shadow')
      .attr('in2', 'SourceGraphic')
      .attr('operator', 'over')
      .attr('result', 'output');
  }

  // render map with the path generator
  const countryPaths = parent.selectAll('path.country')
  .data(countries.features)
  .join(
    enter => enter.append('path')
      .attr('class', 'country')
      .attr('fill', d => (colourScale(countryValueMap(d)) == null) ? nullColour : colourScale(countryValueMap(d)))
      .attr('d', pathGenerator)
      .on('click', onCountryClick)
      .on('pointerover', onMouseOver)
      .on('pointerleave', onMouseOut),
    update => update
      .attr('class', d => `country${
            selectedCountries.has(d.properties.name)
            ? ' selected'
            : hoveredCountry == d.properties.name
            ? ' hovered'
            :'' 
          }`)
      .attr('fill', d => (colourScale(countryValueMap(d)) == null) ? nullColour : colourScale(countryValueMap(d)))
      .style('filter', d => selectedCountries.has(d.properties.name) ? 'url(#shadow)' : ''),
    exit => exit.remove()
  )
  .style('stroke-width', d => selectedCountries.has(d.properties.name)
      ? '2px'
      : hoveredCountry === d.properties.name
      ? '1px'
      : '0.1px'
  );

  // tooltip
  const tooltipPadding = 5;
  countryPaths
    .on('pointerover', (event, d) => {
      d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (event.pageX + tooltipPadding) + 'px')   
        .style('top', (event.pageY + tooltipPadding) + 'px')
        .style('border-bottom-color', (colourScale(countryValueMap(d)) == null) ? nullColour : colourScale(countryValueMap(d)))
        .html(`
          <div class="tooltip-title">${d.properties.name}${(countryValueMap(d) == null) ? '' : ': ' + countryValueMap(d).toPrecision(3)}</div>
          <div><i>${regionByCountry.get(d.properties.name)}</i></div>
        `);
      onMouseOver(event,d);
    })
    .on('pointermove', (event, d) => {
      d3.select('#tooltip')
      .style('left', (event.pageX + tooltipPadding) + 'px')   
      .style('top', (event.pageY + tooltipPadding) + 'px');
    })
    .on('pointerleave', (event,d) => {
      d3.select('#tooltip').style('display', 'none');
      onMouseOut(event,d);
    });
    
  };