import { choroplethKey } from './choroplethKey.js';
import { dropdownMenu } from './dropdownMenu.js';
import { slider } from './slider.js';
import { choroplethMap } from './choroplethMap.js';
import { variableText } from './variableText.js';
import { lineChart } from './lineChart.js';
import { interactiveLegend } from './interactiveLegend.js';
import { getCSSRuleValue } from './getCSSRuleValue.js';

// load shapes of world countries (TopoJSON) & World Happiness Report
Promise.all([
  d3.json('data/countries-110m.json'),
  d3.csv('data/World Happiness Report.csv')
]).then(([topoData, happinessData]) => {

  // html svg data
  const mapSvg = d3.select('#map');
  const lineSvg = d3.select('#line');
  const legendSvg = d3.select('#legend');
  const mapWidth  = parseFloat(getCSSRuleValue('svg#map', 'width'));
  const mapHeight = parseFloat(getCSSRuleValue('svg#map', 'height'));
  const lineWidth = parseFloat(getCSSRuleValue('svg#line', 'width'));
  const lineHeight = parseFloat(getCSSRuleValue('svg#line', 'height'));
  const legendWidth = parseFloat(getCSSRuleValue('svg#legend', 'width'));
  const legendHeight = parseFloat(getCSSRuleValue('svg#legend', 'height'));

  const colourPalette = ['red', 'yellow'];

  // years we have data for
  const years = [...Array(18).keys()].map(n => '' + (n + 2005));
  let selectedYear = '2017'

  // metrics we have data for
  const metrics = ['Life Ladder', 'Log GDP Per Capita', 'Social Support', 'Healthy Life Expectancy At Birth', 'Freedom To Make Life Choices', 'Generosity', 'Perceptions Of Corruption', 'Positive Affect', 'Negative Affect', 'Confidence In National Government'];
  let selectedMetric = metrics[0];  // state (consistent with first item shown)
  const metricDescriptionsMap = {
    'Life Ladder': '<b>Life ladder (0-10)</b> is the national average response to the question “Please imagine a ladder, with steps numbered from 0 at the bottom to 10 at the top. The top of the ladder represents the best possible life for you and the bottom of the ladder represents the worst possible life for you. On which step of the ladder would you say you personally feel you stand at this time?” This measure is also known as the Cantril life ladder.',
    'Log GDP Per Capita': '<b>Log GDP per capita</b> is in terms of Purchasing Power Parity (PPP) adjusted to a constant 2017 international dollars. GDP data for 2022 is forecast. The equation uses the natural log of GDP per capita, as this form fits the data significantly better than GDP per capita.',
    'Social Support': '<b>Social support (0-1)</b> is the national average of the binary responses (0=no, 1=yes) to the question “If you were in trouble, do you have relatives or friends you can count on to help you whenever you need them, or not?”',
    'Healthy Life Expectancy At Birth': '<b>Healthy life expectancy at birth</b> is constructed based on data from the World Health Organization (WHO) Global Health Observatory data repository, with data available for 2005, 2010, 2015, 2016, and 2019. To match this report’s sample period (2005-2022), interpolation and extrapolation are used.',
    'Freedom To Make Life Choices': '<b>Freedom to make life choices (0-1)</b> is the national average of binary responses to the question “Are you satisfied or dissatisfied with your freedom to choose what you do with your life?”',
    'Generosity': '<b>Generosity</b> is the residual of regressing the national average of responses to the donation question “Have you donated money to a charity in the past month?” on log GDP per capita.',
    'Perceptions Of Corruption': '<b>Perceptions of corruption (0-1)</b> is the average of binary answers to the questions: “Is corruption widespread throughout the government or not?” and “Is corruption widespread within businesses or not?”',
    'Positive Affect': '<b>Positive affect (0-1)</b> is the average of previous-day effects measures for laughter, enjoyment, and interest. The general form for the affect questions is: Did you experience the following feelings during a lot of the day yesterday?',
    'Negative Affect': '<b>Negative affect (0-1)</b> is  the average of previous-day effects measures for worry, sadness, and anger. The general form for the affect questions is: Did you experience the following feelings during a lot of the day yesterday?',
    'Confidence In National Government': '<b>Confidence in national government (0-1)</b> is the national average of  binary responses (0=no, 1=yes) to the question "Do you have confidence in your national government?"'
  };
  const metricScaleMap = {
    'Life Ladder': [0, 10],
    'Log GDP Per Capita': [5.5, 11.7],
    'Social Support': [0, 1],
    'Healthy Life Expectancy At Birth': [40, 75],
    'Freedom To Make Life Choices': [0, 1],
    'Generosity': [-0.34, 0.71],
    'Perceptions Of Corruption': [0, 1],
    'Positive Affect': [0, 1],
    'Negative Affect': [0, 1],
    'Confidence In National Government': [0, 1]
  };

  // geographic projection and path generator
  const projection = d3.geoNaturalEarth1();
  const pathGenerator = d3.geoPath().projection(projection);

  // groups for map elements, to facilitate zoom
  const choroplethGroup = mapSvg.append('g');
  const choroplethMapGroup = choroplethGroup.append('g');
  const choroplethKeyGroup = choroplethGroup.append('g');


    // convert TopoJSON to GeoJSON
    const countries = topojson.feature(topoData, topoData.objects.countries);

    // tracking countries
    const countryNames = new Set(happinessData.map(d => d.CountryName));
    const selectedCountries = new Set();
    selectedCountries.add('United Kingdom');
    selectedCountries.add('Australia');
    selectedCountries.add('Italy');
    const unselectedCountries = new Set([...countryNames].filter(d => !selectedCountries.has(d)));
    let hoveredCountry = null;

    // map from year, metric and country to value
    const metricByCountry = new Map(years.map(y => [y, new Map(metrics.map(o => [o, new Map(happinessData.filter(f => f.Year === y).map(d => ([d.CountryName, +d[o]] || null)))]))]));
    
    // country to region
    const regionByCountry = new Map(happinessData.map(d => [d.CountryName, d.Region]));


    // for ordering legend items
    function dynamicSort(property) {
      var sortOrder = 1;
      // if(property[0] === "-") {
      //     sortOrder = -1;
      //     property = property.substr(1);
      // }
      if(property === "Alphabetical"){
        return function(a,b) {
          var result =
            (a < b)
              ? -1
              : (a > b)
              ? 1
              : 0;
          return result * sortOrder
        }
      } if (property === "Region"){
        return function(a,b) {
          var result =
            (regionByCountry.get(a) < regionByCountry.get(b))
              ? -1
              : (regionByCountry.get(a) > regionByCountry.get(b))
              ? 1
              : dynamicSort("Alphabetical")(a,b);
          return result * sortOrder
        }
      } if (['Perceptions Of Corruption', 'Negative Affect'].includes(property)) {
        return function (a,b) {
          const aValue = metricByCountry.get(selectedYear).get(property).get(a) || Infinity;
          const bValue = metricByCountry.get(selectedYear).get(property).get(b) || Infinity;
          if (aValue === bValue) {
            dynamicSort("Alphabetical")(a,b);
          }
          return (aValue - bValue) * sortOrder;
        }
      }
      return function (a,b) {
        const aValue = metricByCountry.get(selectedYear).get(property).get(a) || -Infinity;
        const bValue = metricByCountry.get(selectedYear).get(property).get(b) || -Infinity;
        if (aValue === bValue) {
          dynamicSort("Alphabetical")(a,b);
        }
        return (bValue - aValue) * sortOrder;
      }
    }


    // colour scale for choropleth
    const colourScale = d3.scaleLinear()
      .domain(metricScaleMap[selectedMetric])
      .range(colourPalette);
    const nullColour = '#333333';

    const updateVis = () => {

      // update colour scale for current metric
      colourScale
        .domain(metricScaleMap[selectedMetric])
        .range((["Negative Affect", "Perceptions Of Corruption"].includes(selectedMetric)) ? [colourPalette[1], colourPalette[0]] : colourPalette);

      // update dropdown menu for choroplethMap
      dropdownMenu(d3.select('#menus'), {
        options: metrics,
        onOptionSelected: (event) => {
          selectedMetric = event.target.value;
          updateVis();
        },
        id: 'Metric'
      });

      // update the time scale slider
      slider(d3.select('#menus'), {
        valueRange: years,
        selectedValue: selectedYear,
        onValueSelected: (event) => {
          selectedYear = event.target.value;
          updateVis();
        },
        id: 'Year'
      });

      // update the values of the choropleth world map's key
      choroplethKey(choroplethKeyGroup, {
        keyExtent: ["Negative Affect", "Perceptions Of Corruption"].includes(selectedMetric) ? 
          [metricScaleMap[selectedMetric][1], metricScaleMap[selectedMetric][0]] : 
          metricScaleMap[selectedMetric],
        keyColours: colourPalette,
        xVal: 28,
        yVal: 474
      });

      // update the choropleth world map
      choroplethMap(choroplethMapGroup, {
        nullColour,
        colourScale,
        countryValueMap: (d) => (metricByCountry.get(selectedYear).get(selectedMetric).get(d.properties.name) || null),     // country to value given the selectedYear and selectedMetric
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
        },
        onMouseOver: (event, d) => {
          hoveredCountry = d.properties.name;
          updateVis();
        },
        onMouseOut: (event, d) => {
          hoveredCountry = null;
          updateVis();
        },
        hoveredCountry
      });

      // update the description of the metrics shown by the map
      variableText(d3.select('#descriptions'), {
        selectedOption: selectedMetric,
        optionTextMap: metricDescriptionsMap
      });

      // update the line chart
      lineChart(lineSvg, {
        width: lineWidth,
        height: lineHeight,
        margin: { top: 20, right: 20, bottom: 40, left: 40 },
        leftRange: metricScaleMap[selectedMetric],
        leftLabel: selectedMetric,
        bottomRange: [+years[0], +years[years.length-1]],
        bottomLabel: "Year",
        lineNames: Array.from(selectedCountries).sort(dynamicSort(selectedMetric)),
        hoveredLine: hoveredCountry,
        yValueFunction: (countryName,year) => (metricByCountry.get(year).get(selectedMetric).get(countryName) || null) // country name and year to value given selectedMetric
      });

      interactiveLegend(legendSvg, {
        names: Array.from(countryNames).sort(dynamicSort(selectedMetric)),
        visibleNames: Array.from(selectedCountries).sort(dynamicSort(selectedMetric)), 
        hiddenNames: Array.from(unselectedCountries).sort(dynamicSort(selectedMetric)),
        width: legendWidth,
        height: legendHeight,
        margin: { top: 0, right: 0, bottom: 50, left: 0 },
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
          hoveredCountry = d;
          updateVis();
        },
        onMouseOut: (event, d) => {
          hoveredCountry = null;
          updateVis();
        },
        hoveredBox: hoveredCountry,
        nullColour
      });

    };
    
    // Initialise visualisation
    updateVis();
    });