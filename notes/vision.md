# doing 

# todo

pt 0 general/context stuff
[ ] colour blind mode
[ ] local visual updates rather than whole program (ie when country is clicked not the whole program needs to change so dont need to call updateVis)
[ ] css sliders
[ ] css dropdowns
[ ] css scroll
[ ] section titles

pt 1 choropleth graph with red unhappy to yellow happy

pt 2
[ ] tooltips

pt 3 sophisticated country/region selection menu
[ ] preset comparisons maybe with descriptions
[ ] deselect all button
[ ] null rank value (ie NaN or alphabetical order)

# ext
## pt 0
[ ] hint icon
## pt 1
[ ] put units on the scale if possible
[ ] fix zoomed translation
[ ] smiley symbols on countries
## pt 2
[ ] rescale chart better
[ ] animate lines as metric changes
[ ] keep colour the same
## pt 3
[ ] up or down button

# done
## pt 0
[x] text description of current attribute at bottom with units and scale
  [x] updates on attribute selection
  [x] text from kaggle/WHR
[x] link to WHR at bottom of page
[x] clear if statements to replace w d3
[x] css style the thing
[x] softcode/css everything
[x] group things for softcoded positioning
[x] handle html inside javascript and defer to css
[x] linked highlighting
  [x] hover on map draw line on chart
  [x] hover on map highlight legend
  [x] hover on legend highlight chart
  [x] hover on legend highlight map
[x] modularise functions
## pt 1
[x] set colour dependent on some happiness indicator
  [x] parse happiness data
  [x] choose some measure from happiness file and choose appropriate domain
  [x] filter to specific arbitrary year
  [x] grey for no value
  [x] map happiness to red yellow colour range
  [x] store happydata by year for cheapness
  [x] tidy colouring stuff in choropleth
  [x] put choropleth into an update pattern
  [x] generalise metric thing from log gdp
[x] dropdown with different happiness measures
  [x] html options
  [x] make options dropdown with css/js
  [x] fill dropdown
  [x] connect dropdown menu options to metric
  [x] specify domains and ranges
  [x] update map as dropdown changes
[x] colour key
  [x] choroplethKey separate module
  [x] coloured rectangle
  [x] numbered extremes of rectangle
  [x] dropdown updates numbers
[x] country interaction
  [x] click country adds to list and emboldens border
  [x] click again toggles this
[x] hover on countries brings up tooltip
  [x] tooltip has useful data
  [x] big grey border too?
## pt 2
[x] basic live linechart
  [x] updates when country is selected or unselected
  [x] update when metric is updated
  [x] rescale axes better
  [x] stop map appearing behind
[x] clearer axis labels
## pt 3
[x] scrollable checkbox list of countries
  [x] sync with world map and graph in what is selected
[x] list all countries
[x] make country list scrollable
[x] grey square default, coloured ticked if selected and to the top
[x] sortable
  [x] make countries sort auto
  [x] generic comparator function for sorting
  [x] sort by any properties
  [x] dropdown menu for sorts
[x] css checkbox hover
