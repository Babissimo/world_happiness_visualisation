# sum

## visualisation catalogues
- http://massvis.mit.edu/
- https://www.data-to-viz.com/
- https://datavizproject.com/
- https://datavizcatalogue.com/


## coding stuff
refer to lecture 2 and d3 tutorials

## analysis framework
domain: who are the target users?
abstraction: what is shown? - data abstraction
abstraction: why is the user looking? - task abstraction
idiom: how is it shown? - visual encoding & interaction
algorithm: efficient computation

# what

## data terms
- item: independent variable
- attribute: dependent variable
- links: relationship between 2 items
- position: spatial data
- grids: sampling strategy for continuous data

## dataset types
- flat table
  - item per row
  - column is attribute
  - cells hold value for item-attribute pair 
  - unique key (could be implicit)
- multidimensional table
  - index based on multiple keys
- network/graph
  - nodes (items) connected by links (relationships)
  - tree: acyclic and potentially a root
- spatial fields (continuous)
  - attribute values associated with cells
  - think map or force map
- geometry (discrete)
  - shape of item
  - also map

## attribute types
- categorical
- ordinal (ordered)
- quantitative (ordered)

## ordering direction
- sequential
- diverging
- cyclic

## dataset availability
- static
- dynamic

## dataset abstraction
- identify dataset types, attribute types
- identify cardinality
- consider whether to transform data

# why

## domain to abstraction

### domain characterisation
- user groups, target domain and their questions and data vary wildly by domain and must be specific to get traction
- domain questions/problems break down to simpler abstract tasks
### abstraction:
- map what and why into generalised terms
  - identify tasks user wants to do
  - find data types to support the tasks (maybe derive)

## design process

characterise domain situation

map domain-language data to data abstraction
map domain-language task to abstract task

identify/create suitable idiom/technique

identify/create suitable algorithm

## task abstraction

explored plenty in lecture 3

action, target pairs

### actions:
- analyse: high-level choices
  - consume
    - discover: find/test hypotheses (idk what they want)
    - present: known info and message to communicate
    - enjoy: like discover without goals
  - produce
    - annotate: add to visualisation (maybe text)
    - record: persist visualisations for historical record
    - derive: create new data, derive attributes
- search: find known/unknown item
  - lookup: known target, known location (word in dictionary)
  - locate: known target, unknown location (node in network)
  - browse: unknown target, known location (book in bookstore)
  - explore: unknown target, unknown location (find cool spot in city)
- query: find out about item's characteristics
  - identify (1 item)
  - compare (a couple)
  - summarise (overview)

### targets
- all data
  - trends
  - outliers
  - features
- attributes
  - one
    - distribution
    - extremes
  - many
    - dependency
    - correlation
    - similarity
- network data
  - topolgy (eg paths)
- spatial data
  - shape

# 5. marks and channels

visual data encoding
- marks: basic graphical elements (points, lines, areas, volumes)
- channels: ways to control mark appearance based on attributes (position, colour, shape, tilt, size)


## channels

different channels convey different amounts of information to humans
using multiple channels can strengthen message or just confuse the viewer and use up channels 

expressiveness principle: encode the whole dataset and no more (ie only include order if an order exists)
effectiveness principle: the most important attribute should be most salient

### magnitude channel rankings (for ordered attributes)
- position on common scale
- position on unaligned scale
- length
- tilt
- area
- depth
- luminance
- saturation
- curvature
- volume

### identity channel rankings (for categorical attributes)
- spatial region
- hue
- motion
- shape

marks for links: containment or connection
grouping channels: proximity, similarity

### channel effectiveness

- accuracy: how precisely may we distinguish encoded items?
- discriminability: how many unique steps may we percieve?
- seperability: ability to channel affected by another channel?
- popout: can things jump out using this channel?

# 6/7. tables

key   value   value   value
1     2       3       4

2 keys - matrix

## scatterplot idiom

quantitative attributes
no keys
2 quantitative attributes

marks: points
channels: horizontal + vertical position
tasks: find trends, outliers, distribution, correlation, clusters
scalability: 100s of items

could encode more channels with colour, size or shape

## bar chart idiom

1 key, 1 value
1 categorical, 1 quantitative attribute

marks: lines
channels: length, spatial regions (separated, aligned, ordered)
tasks: compare, lookup tables
scalability: 100s of levels, 100s of values

## stacked bar chart idiom

2 keys, 1 value
2 categorical, 1 quantitatve attributes

marks: stack of line marks (glyph: composite object)
channels: length, hue, spatial region (glyph aligned, bar components unaligned)
tasks: part-to-whole relationship
scalability: asymmetric (10ish levels for segments, for main attribute, 100s of levels (bars))

## more
- streamgraph
- dot/line chart
- gantt charts
- slope graphs MAYBE
- heatmap MAYBE
- cluster heatmap MAYBE
- radial bar chart
- radar plot BAD
- pie chart
- matrix of smaller views

# 8. networks

## more
- force-directed placement MAYBE
- circular layouts MAYBE
- adjacencey matrix view MAYBE
- radial node-link tree
- tree map
- implicit tree layouts
- grouse flocks MAYBE (interesting)
- hierarchical edge bundling

# 9. spatial data
- choropleth map MAYBE
- symbol maps MAYBE
- contiguous cartogram
- grid cartogram MAYBE
- dot density maps
- topographic map
- isosurfaces, direct volume rendering

# 10/11. colour

ordered
- luminance - brightness
- saturation - colourfulness
categorical
- hue - what colour

minimise number of different bins and dont use rainbows (look at lectures)

univariate colour palettes:
- diverging A...0....B
- sequential 0.......A
- cyclic 0...A...0

bivariate colour palettes:
combine univariates carefully

think of colour blindness https://www.color-blindness.com/coblis-color-blindness-simulator/

colour spaces n that.
CONTRAST

D3-color: conversion to from different colour spaces, low-level
D3-scale: make your own colour scale d3.scaleSequential(), d3.scaleOrdinal()
D3-scale-chromatic: implementation of colour map, many colour schemes/scales, high-level, ready-to-use

# 12/13. interactive views

so far we've just found new data to show in a view - ie network from table
we have other options

manipulate
- change
  - over time
  - over parameters
  - order
  - alignment
  - animate transitions?
- select - highlight
- navigate
  - item reduction
    - zoom (geometric or semantic)
    - pan/translate
    - constrained
    - scrollytelling
  - attribute reduction
    - slice (filter?)
    - cut 
    - project
facet
- juxtapose
  - linked highlighting
  - share data (all/subset/none)
  - share navigation
  - idiom overview-detail navigation MAYBE
  - idiom tooltips MAYBE
  - idiom (interactive) small multiples MAYBE
  - idiom reorderable lists MAYBE
- partition idk mate
- superimpose

## view coordination
          data
encoding    all         subset                      none
same        /           overview/detail             small multiples
different   multiform   multiform, overview/detail  /

# 14. reduce: filter, aggregate, embed

idiom finder MAYBE
cross filtering IDTS
idimom box plot
idiom continuous scatterplot
spatial aggregation
idiom dimensionality reduction
embed is a thing to but idk

# 15. rules of thumb
- avoid 3d unless essential
  - avoid occlusion
  - avoid perspective
  - avoid tilting text
- eyes beat memory
  - want someone to compare? put it side by side
  - overview 1st, zoom & filter, details on demand
- responsiveness required, limits:
  - 0.1s mouse-over highlighting
  - 1s mouse-click
  - 10s brief tasks (show hour glass)
- function then form