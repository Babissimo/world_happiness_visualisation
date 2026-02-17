export const slider = (parent, props) => {
  const {
    valueRange,
    selectedValue,
    onValueSelected,
    id
  } = props;

  // make group element for slider and its associated text
  const sliderGroup = parent.selectAll('g#' + id).data([null]).enter().append('g')
    .attr('id', id)
    .attr('class', 'slider');

  // update selected value text
  const sliderText = sliderGroup.selectAll('text.sliderText').data([null]);
  const sliderTextEnter = sliderText.enter().append('text')
    .attr('class', 'sliderText')
    .merge(sliderText)
      .text(`${id}: ${selectedValue} `);

  // update slider
  const slider = sliderGroup.selectAll('input.slider').data([null]);
  const sliderEnter = slider.enter().append('input')
    .attr('type', 'range')
    .attr('min', valueRange[0])
    .attr('max', valueRange[valueRange.length - 1])
    .attr('step', 1)
    .attr('class', 'slider')
    .merge(slider)
      .attr('value', selectedValue)
      .on('input', (event) => {
        sliderTextEnter.text(`${id}: ${event.target.value} `);
        onValueSelected(event);
      });

  return sliderEnter;
};
