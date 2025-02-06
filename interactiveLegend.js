export const interactiveLegend = (parent, props) => {
  const {
    names,
    visibleNames = [],
    hiddenNames = [],
    width,
    height,
    margin,
    onCheckboxClick,
    onMouseOver,
    onMouseOut,
    hoveredBox,
    nullColour
  } = props;

  const totalItems = visibleNames.length + hiddenNames.length;
  const itemHeight = 15; // height of each legend item, adjust if necessary
  const totalHeight = totalItems * itemHeight;

  // create the SVG for the legend with the calculated height
  parent.selectAll("svg").remove();
  const svg = parent
    .append("svg")
    .attr("width", width)
    .attr("height", totalHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


  const dividerLine = svg.append("line");

  // set up the colour scale for the legend
  const colourScale = d3.scaleOrdinal()
    .domain(visibleNames)
    .range(d3.schemeCategory10);

  // loop through all countries and add legend items
  function checkBox(countryName, i) {
    const legendX = margin.left;
    const legendY = 10 + i * 15;
    const isChecked = visibleNames.includes(countryName);

    // group element for the custom checkbox
    const checkboxGroup = svg.append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`)
      .attr("class", "checkbox")
      .datum(countryName);

    // add background square for the checkbox
    checkboxGroup
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", isChecked ? colourScale(countryName) : nullColour)
      .style('stroke-width', d => hoveredBox === d
                              ? '2px'
                              : '0.1px'
            );

    // add checkmark for the custom checkbox
    const checkmark = checkboxGroup
      .append("polyline")
      .attr("points", "1,5 4,8 9,1")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .style("display", isChecked ? "" : "none");

    // handle checkbox mouse events
    checkboxGroup
      .on("click", onCheckboxClick)
      .on("pointerover", (event, d) => {
        if (hoveredBox !== d) {
          onMouseOver(event, d);
        }
      })
      .on("pointerleave", (event, d) => {
        if (hoveredBox === d) {
          onMouseOut(event, d);
        }
      });

    // add country names as labels for each legend item
    svg.append("text")
      .attr("x", legendX + 15)
      .attr("y", legendY + 9)
      .attr("font-size", "10px")
      .attr("font-weight", hoveredBox === countryName ? "600" : "100")
      .text(`${(names.indexOf(countryName)+1)}. ${countryName}`);
  };

  dividerLine
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", 7 + (visibleNames.length + 0.5) * itemHeight)
  .attr("y2", 7 + (visibleNames.length + 0.5) * itemHeight)
  .attr("stroke", nullColour)
  .attr("stroke-width", 1);

  visibleNames.forEach((c, i) => checkBox(c, i));
  hiddenNames.forEach((c, i) => checkBox(c,i+1+visibleNames.length));
};
