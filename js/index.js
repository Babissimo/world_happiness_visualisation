import {
  years,
  defaultYear,
  metrics,
  defaultSelectedCountries,
  colourPalette,
  nullColour,
  metricDescriptionsMap,
  metricScaleMap,
  invertedMetricScale
} from './config.js';
import { choroplethKey } from './components/choroplethKey.js';
import { dropdownMenu } from './components/dropdownMenu.js';
import { slider } from './components/slider.js';
import { choroplethMap } from './components/choroplethMap.js';
import { variableText } from './components/variableText.js';
import { lineChart } from './components/lineChart.js';
import { interactiveLegend } from './components/interactiveLegend.js';
import { getCSSRuleValue } from './utils/getCSSRuleValue.js';

Promise.all([
  d3.json('../data/countries-110m.json'),
  d3.csv('../data/World Happiness Report.csv')
]).then(([topoData, happinessData]) => {

  const mapSvg = d3.select('#map');
  const lineSvg = d3.select('#line');
  const legendSvg = d3.select('#legend');
  const mapWidth = parseFloat(getCSSRuleValue('svg#map', 'width'));
  const mapHeight = parseFloat(getCSSRuleValue('svg#map', 'height'));
  const lineWidth = parseFloat(getCSSRuleValue('svg#line', 'width'));
  const lineHeight = parseFloat(getCSSRuleValue('svg#line', 'height'));
  const legendWidth = parseFloat(getCSSRuleValue('svg#legend', 'width'));
  const legendHeight = parseFloat(getCSSRuleValue('svg#legend', 'height'));

  let selectedYear = defaultYear;
  let selectedMetric = metrics[0];

  const projection = d3.geoNaturalEarth1();
  const pathGenerator = d3.geoPath().projection(projection);

  const choroplethGroup = mapSvg.append('g');
  const choroplethMapGroup = choroplethGroup.append('g');
  const choroplethKeyGroup = choroplethGroup.append('g');

  const countries = topojson.feature(topoData, topoData.objects.countries);

  const countryNames = new Set(happinessData.map(d => d.CountryName));
  const selectedCountries = new Set(defaultSelectedCountries);
  const unselectedCountries = new Set([...countryNames].filter(d => !selectedCountries.has(d)));
  let hoveredCountry = null;
  let previousHoveredCountry = null;

  const palette = d3.schemeCategory10;
  const counts = Array(palette.length).fill(0);
  const countryToColour = new Map();

  function argminCount(counts) {
    let best = 0;
    for (let k = 1; k < counts.length; k++) {
      if (counts[k] < counts[best] || (counts[k] === counts[best] && k < best)) best = k;
    }
    return best;
  }

  const metricByCountry = new Map(years.map(y => [y, new Map(metrics.map(o => [o, new Map(happinessData.filter(f => f.Year === y).map(d => ([d.CountryName, +d[o]] || null)))]))]));
  const regionByCountry = new Map(happinessData.map(d => [d.CountryName, d.Region]));

  function dynamicSort(property) {
    const sortOrder = 1;
    if (property === "Alphabetical") {
      return function(a, b) {
        const result = (a < b) ? -1 : (a > b) ? 1 : 0;
        return result * sortOrder;
      };
    }
    if (property === "Region") {
      return function(a, b) {
        const result = (regionByCountry.get(a) < regionByCountry.get(b))
          ? -1
          : (regionByCountry.get(a) > regionByCountry.get(b))
          ? 1
          : dynamicSort("Alphabetical")(a, b);
        return result * sortOrder;
      };
    }
    if (invertedMetricScale.includes(property)) {
      return function(a, b) {
        const aValue = metricByCountry.get(selectedYear).get(property).get(a) || Infinity;
        const bValue = metricByCountry.get(selectedYear).get(property).get(b) || Infinity;
        if (aValue === bValue) dynamicSort("Alphabetical")(a, b);
        return (aValue - bValue) * sortOrder;
      };
    }
    return function(a, b) {
      const aValue = metricByCountry.get(selectedYear).get(property).get(a) || -Infinity;
      const bValue = metricByCountry.get(selectedYear).get(property).get(b) || -Infinity;
      if (aValue === bValue) dynamicSort("Alphabetical")(a, b);
      return (bValue - aValue) * sortOrder;
    };
  }

  const colourScale = d3.scaleLinear()
    .domain(metricScaleMap[selectedMetric])
    .range(colourPalette);

  function updateHoverOnly(previousHovered) {
    const ghostColour = palette[argminCount(counts)];
    const getColourForCountry = (country) => {
      if (countryToColour.has(country)) return palette[countryToColour.get(country)];
      if (country === hoveredCountry) return ghostColour;
      return null;
    };
    choroplethMapGroup.selectAll('path.country')
      .filter(d => d.properties.name === previousHovered || d.properties.name === hoveredCountry)
      .attr('class', d => `country${selectedCountries.has(d.properties.name) ? ' selected' : hoveredCountry === d.properties.name ? ' hovered' : ''}`)
      .style('stroke-width', d => selectedCountries.has(d.properties.name) ? '2px' : hoveredCountry === d.properties.name ? '1px' : '0.1px')
      .style('filter', d => selectedCountries.has(d.properties.name) ? 'url(#shadow)' : '');
    lineChart(lineSvg, {
      width: lineWidth,
      height: lineHeight,
      margin: { top: 20, right: 20, bottom: 40, left: 40 },
      leftRange: metricScaleMap[selectedMetric],
      leftLabel: selectedMetric,
      bottomRange: [+years[0], +years[years.length - 1]],
      bottomLabel: "Year",
      lineNames: Array.from(selectedCountries).sort(dynamicSort(selectedMetric)),
      hoveredLine: hoveredCountry,
      yValueFunction: (countryName, year) => (metricByCountry.get(year).get(selectedMetric).get(countryName) || null),
      colourScale: getColourForCountry
    });
    interactiveLegend(legendSvg, {
      names: Array.from(countryNames).sort(dynamicSort(selectedMetric)),
      visibleNames: Array.from(selectedCountries).sort(dynamicSort(selectedMetric)),
      hiddenNames: Array.from(unselectedCountries).sort(dynamicSort(selectedMetric)),
      width: legendWidth,
      height: legendHeight,
      margin: { top: 0, right: 0, bottom: 50, left: 0 },
      colourScale: getColourForCountry,
      onCheckboxClick: (event, d) => {
        if (selectedCountries.has(d)) {
          selectedCountries.delete(d);
          unselectedCountries.add(d);
          hoveredCountry = null;
        } else {
          selectedCountries.add(d);
          unselectedCountries.delete(d);
          hoveredCountry = null;
        }
        updateVis();
      },
      onMouseOver: (event, d) => {
        previousHoveredCountry = hoveredCountry;
        hoveredCountry = d;
        updateHoverOnly(previousHoveredCountry);
      },
      onMouseOut: (event, d) => {
        previousHoveredCountry = hoveredCountry;
        hoveredCountry = null;
        updateHoverOnly(previousHoveredCountry);
      },
      hoveredBox: hoveredCountry,
      nullColour
    });
  }

  const updateVis = () => {

    colourScale
      .domain(metricScaleMap[selectedMetric])
      .range(invertedMetricScale.includes(selectedMetric) ? [colourPalette[1], colourPalette[0]] : colourPalette);

    const toRemove = [...countryToColour.keys()].filter(c => !selectedCountries.has(c));
    toRemove.forEach(country => {
      const k = countryToColour.get(country);
      counts[k]--;
      countryToColour.delete(country);
    });
    for (const country of [...selectedCountries].sort()) {
      if (!countryToColour.has(country)) {
        const k = argminCount(counts);
        counts[k]++;
        countryToColour.set(country, k);
      }
    }

    dropdownMenu(d3.select('#menus'), {
      options: metrics,
      onOptionSelected: (event) => {
        selectedMetric = event.target.value;
        updateVis();
      },
      id: 'Metric'
    });

    slider(d3.select('#menus'), {
      valueRange: years,
      selectedValue: selectedYear,
      onValueSelected: (event) => {
        selectedYear = event.target.value;
        updateVis();
      },
      id: 'Year'
    });

    choroplethKey(choroplethKeyGroup, {
      keyExtent: invertedMetricScale.includes(selectedMetric)
        ? [metricScaleMap[selectedMetric][1], metricScaleMap[selectedMetric][0]]
        : metricScaleMap[selectedMetric],
      keyColours: colourPalette,
      xVal: 28,
      yVal: 474
    });

    choroplethMap(choroplethMapGroup, {
        nullColour,
        colourScale,
        countryValueMap: (d) => (metricByCountry.get(selectedYear).get(selectedMetric).get(d.properties.name) || null),
        width: mapWidth,
        height: mapHeight,
        countries,
        selectedCountries,
        regionByCountry,
        pathGenerator,
        onCountryClick: (event, d) => {
          if (selectedCountries.has(d.properties.name)) {
            selectedCountries.delete(d.properties.name);
            unselectedCountries.add(d.properties.name);
          } else {
            selectedCountries.add(d.properties.name);
            unselectedCountries.delete(d.properties.name);
          }
          updateVis();
          if (hoveredCountry) updateHoverOnly(hoveredCountry);
        },
        onMouseOver: (event, d) => {
          previousHoveredCountry = hoveredCountry;
          hoveredCountry = d.properties.name;
          updateHoverOnly(previousHoveredCountry);
        },
        onMouseOut: (event, d) => {
          previousHoveredCountry = hoveredCountry;
          hoveredCountry = null;
          updateHoverOnly(previousHoveredCountry);
        },
        hoveredCountry,
        previousHoveredCountry
      });

    variableText(d3.select('#descriptions'), {
      selectedOption: selectedMetric,
      optionTextMap: metricDescriptionsMap
    });

    const ghostColour = palette[argminCount(counts)];
    const getColourForCountry = (country) => {
      if (countryToColour.has(country)) return palette[countryToColour.get(country)];
      if (country === hoveredCountry) return ghostColour;
      return null;
    };

    lineChart(lineSvg, {
      width: lineWidth,
      height: lineHeight,
      margin: { top: 20, right: 20, bottom: 40, left: 40 },
      leftRange: metricScaleMap[selectedMetric],
      leftLabel: selectedMetric,
      bottomRange: [+years[0], +years[years.length - 1]],
      bottomLabel: "Year",
      lineNames: Array.from(selectedCountries).sort(dynamicSort(selectedMetric)),
      hoveredLine: hoveredCountry,
      yValueFunction: (countryName, year) => (metricByCountry.get(year).get(selectedMetric).get(countryName) || null),
      colourScale: getColourForCountry
    });

    interactiveLegend(legendSvg, {
      names: Array.from(countryNames).sort(dynamicSort(selectedMetric)),
      visibleNames: Array.from(selectedCountries).sort(dynamicSort(selectedMetric)),
      hiddenNames: Array.from(unselectedCountries).sort(dynamicSort(selectedMetric)),
      width: legendWidth,
      height: legendHeight,
      margin: { top: 0, right: 0, bottom: 50, left: 0 },
      colourScale: getColourForCountry,
      onCheckboxClick: (event, d) => {
        if (selectedCountries.has(d)) {
          selectedCountries.delete(d);
          unselectedCountries.add(d);
          hoveredCountry = null;
        } else {
          selectedCountries.add(d);
          unselectedCountries.delete(d);
          hoveredCountry = null;
        }
        updateVis();
      },
      onMouseOver: (event, d) => {
        previousHoveredCountry = hoveredCountry;
        hoveredCountry = d;
        updateHoverOnly(previousHoveredCountry);
      },
      onMouseOut: (event, d) => {
        previousHoveredCountry = hoveredCountry;
        hoveredCountry = null;
        updateHoverOnly(previousHoveredCountry);
      },
      hoveredBox: hoveredCountry,
      nullColour
    });
  };

  requestAnimationFrame(() => updateVis());
});
