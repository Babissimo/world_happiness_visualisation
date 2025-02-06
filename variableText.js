export const variableText = (parent, props) => {
  const {
    selectedOption,
    optionTextMap
  } = props;

  // update text description to that relevant to the selected option
  const message = parent.selectAll('text.description').data([null]);
  const messageEnter = message.enter().append('text')
    .attr('class', 'description');
  messageEnter.merge(message)
    .html(optionTextMap[selectedOption]);

};