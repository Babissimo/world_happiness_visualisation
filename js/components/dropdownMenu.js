export const dropdownMenu = (parent, props) => {
  const {
    options,
    onOptionSelected,
    id
  } = props;

  // Create or reuse group element for dropdown menu and its associated text
  const dropdownGroup = parent.selectAll('g#' + id)
    .data([null])
    .join('g')
      .attr('id', id)
      .attr('class', 'dropdown');

  // place text
  const idText = dropdownGroup.selectAll('text')
    .data([null])
    .join('text')
      .attr('class', 'text')
      .text(`${id}: `);

  // update dropdown menu
  const select = dropdownGroup.selectAll('select')
    .data([null])
    .join('select')
      .on('change', onOptionSelected);

  // update options of menu
  const option = select.selectAll('option')
    .data(options, d => d);

  option.join(
    enter => enter.append('option')
      .attr('value', d => d)
      .text(d => d),
    update => update
      .attr('value', d => d)
      .text(d => d),
    exit => exit.remove()
  );
};
