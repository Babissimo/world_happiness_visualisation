export const slider = (parent, props) => {
  const {
    valueRange,
    selectedValue,
    onValueSelected,
    id
  } = props;

  // Make or reuse group element for slider and its associated text
  const sliderGroup = parent.selectAll('g#' + id)
    .data([null])
    .join('g')
      .attr('id', id)
      .attr('class', 'slider');

  // update selected value text
  const sliderText = sliderGroup.selectAll('text.sliderText')
    .data([null])
    .join('text')
      .attr('class', 'sliderText')
      .text(`${id}: ${selectedValue} `);

  // update slider
  const slider = sliderGroup.selectAll('input.slider')
    .data([null])
    .join('input')
      .attr('type', 'range')
      .attr('min', valueRange[0])
      .attr('max', valueRange[valueRange.length - 1])
      .attr('step', 1)
      .attr('class', 'slider')
      .attr('aria-label', `${id} slider`)
      .property('value', selectedValue)
      .on('input', (event) => {
        sliderText.text(`${id}: ${event.target.value} `);
        onValueSelected(event);
      });

  return slider;
};
