export const dropdownMenu = (parent, props) => {
  const {
    options,
    onOptionSelected,
    id
  } = props;

  // create group element for dropdown menu and its associated text
  const dropdownGroup = parent.selectAll('g#' + id).data([null]).enter().append('g')
    .attr('id', id)
    .attr('class', 'dropdown');

  // place text
  const idText = dropdownGroup.selectAll('text').data([null]);
  const idTextEnter = idText.enter().append('text')
    .attr('class', 'text')
    .merge(idText)
      .text(`${id}: `);

  // update dropdown menu
  const select = dropdownGroup.selectAll('select').data([null]);
  const selectEnter = select.enter().append('select')
    .merge(select)
      .on('change', onOptionSelected);

  // update options of menu
  const option = selectEnter.selectAll('option').data(options);
  option.enter().append('option')
    .merge(option)
      .attr('value', d => d)
      .text(d => d);
};
