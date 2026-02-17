# World Happiness Visualised (2005–2022)

An interactive web visualisation of [World Happiness Report](https://worldhappiness.report/) data. Explore happiness and related metrics across countries and years via a choropleth map, time-series line chart, and interactive legend.

## Features

- **Choropleth world map** — Countries coloured by the selected metric and year. Pan and zoom (scroll/drag); double-click does not zoom.
- **Year slider** — Step through years from 2005 to 2022.
- **Metric dropdown** — Choose which happiness-related metric to show on the map and in the line chart.
- **Line chart** — Time series of the selected metric for chosen countries (2005–2022).
- **Interactive legend** — Scrollable list of all countries with checkboxes. Checked countries are shown on the map (highlighted) and in the line chart; unchecked countries are listed below a divider. Legend order can follow the selected metric (high→low) or region.
- **Country selection** — Click a country on the map to add/remove it from the “selected” set (and thus the line chart). Hover on map or legend to highlight that country across map, chart, and legend.
- **Tooltips** — Hover over a country on the map to see its name, region, and current metric value.
- **Metric descriptions** — Short explanations of each metric appear below the controls.

### Metrics

- Life Ladder  
- Log GDP Per Capita  
- Social Support  
- Healthy Life Expectancy At Birth  
- Freedom To Make Life Choices  
- Generosity  
- Perceptions Of Corruption  
- Positive Affect / Negative Affect  
- Confidence In National Government  

## Tech stack

- **D3.js** (v7) — Maps, scales, axes, and DOM updates  
- **TopoJSON** — Geographic data (world map)  
- **Vanilla JS (ES modules)** — No build step; run with a local server that supports modules  

## Project structure

```
world_happiness_visualiser/
├── index.html          # Entry page, loads D3/TopoJSON and app
├── styles.css          # Layout and styling for map, chart, legend, tooltip
├── js/
│   ├── index.js        # Data loading, state, and wiring of all components
│   ├── config.js       # Metrics, scale domains, descriptions, defaults
│   ├── components/
│   │   ├── choroplethMap.js    # World choropleth (projection, paths, zoom, tooltips)
│   │   ├── choroplethKey.js    # Colour scale key for the map
│   │   ├── lineChart.js        # Time-series line chart for selected countries
│   │   ├── interactiveLegend.js # Scrollable country list with checkboxes and hover
│   │   ├── dropdownMenu.js     # Metric selector dropdown
│   │   ├── slider.js           # Year range slider
│   │   └── variableText.js    # Metric description text under controls
│   └── utils/
│       ├── getCSSRuleValue.js  # Read SVG dimensions from CSS
│       └── range.js            # Integer range helper for line chart years
├── data/
│   ├── countries-110m.json   # TopoJSON world geometry
│   └── World Happiness Report.csv  # Happiness metrics by country/year
└── notes/              # Project notes (vision, report, etc.)
```

## How to run

The app uses ES modules and loads `data/` files, so it must be served over HTTP (not opened as `file://`).

1. From the project root, start a local server, for example:
   - **Python 3:** `python3 -m http.server 8000`
   - **Node (npx):** `npx serve .`
2. Open `http://localhost:8000` (or the port your server uses) in a browser.

## Data

- **World Happiness Report** — `data/World Happiness Report.csv`: country, region, year, and the metrics listed above. Sourced from [worldhappiness.report](https://worldhappiness.report/).
- **World map** — `data/countries-110m.json`: TopoJSON for country boundaries (Natural Earth 1:110m).

## Credits

Data from the [World Happiness Report](https://worldhappiness.report/).

## TODO

- **Responsiveness** — Make the layout adapt gracefully to smaller screens and mobile devices.
- **Current-year marker on line chart** — Add a visual marker for the selected year on each series.
- **Animated transitions** — Smoothly animate map, chart, and legend updates when year or metric changes.
