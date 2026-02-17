export const variableText = (parent, props) => {
  const {
    selectedOption,
    optionTextMap
  } = props;

  // Update text description relevant to the selected option.
  // Use an HTML element so we can render rich text (e.g. <b> tags) inside the #descriptions div.
  const message = parent.selectAll('div.description')
    .data([null])
    .join('div')
      .attr('class', 'description');

  message.html(optionTextMap[selectedOption]);

};
