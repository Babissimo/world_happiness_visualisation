// Years we have data for (2005–2022)
export const years = [...Array(18).keys()].map(n => '' + (n + 2005));

// Default selected year
export const defaultYear = '2017';

// Metrics we have data for
export const metrics = [
  'Life Ladder',
  'Log GDP Per Capita',
  'Social Support',
  'Healthy Life Expectancy At Birth',
  'Freedom To Make Life Choices',
  'Generosity',
  'Perceptions Of Corruption',
  'Positive Affect',
  'Negative Affect',
  'Confidence In National Government'
];

// Default countries to show in the line chart and legend
export const defaultSelectedCountries = ['United Kingdom', 'Australia', 'Italy'];

// Choropleth colour palette [low, high]
export const colourPalette = ['red', 'yellow'];

// Null/missing data colour
export const nullColour = '#333333';

// Metric descriptions (shown below controls)
export const metricDescriptionsMap = {
  'Life Ladder': '<b>Life ladder (0-10)</b> is the national average response to the question "Please imagine a ladder, with steps numbered from 0 at the bottom to 10 at the top. The top of the ladder represents the best possible life for you and the bottom of the ladder represents the worst possible life for you. On which step of the ladder would you say you personally feel you stand at this time?" This measure is also known as the Cantril life ladder.',
  'Log GDP Per Capita': '<b>Log GDP per capita</b> is in terms of Purchasing Power Parity (PPP) adjusted to a constant 2017 international dollars. GDP data for 2022 is forecast. The equation uses the natural log of GDP per capita, as this form fits the data significantly better than GDP per capita.',
  'Social Support': '<b>Social support (0-1)</b> is the national average of the binary responses (0=no, 1=yes) to the question "If you were in trouble, do you have relatives or friends you can count on to help you whenever you need them, or not?"',
  'Healthy Life Expectancy At Birth': '<b>Healthy life expectancy at birth</b> is constructed based on data from the World Health Organization (WHO) Global Health Observatory data repository, with data available for 2005, 2010, 2015, 2016, and 2019. To match this report\'s sample period (2005-2022), interpolation and extrapolation are used.',
  'Freedom To Make Life Choices': '<b>Freedom to make life choices (0-1)</b> is the national average of binary responses to the question "Are you satisfied or dissatisfied with your freedom to choose what you do with your life?"',
  'Generosity': '<b>Generosity</b> is the residual of regressing the national average of responses to the donation question "Have you donated money to a charity in the past month?" on log GDP per capita.',
  'Perceptions Of Corruption': '<b>Perceptions of corruption (0-1)</b> is the average of binary answers to the questions: "Is corruption widespread throughout the government or not?" and "Is corruption widespread within businesses or not?"',
  'Positive Affect': '<b>Positive affect (0-1)</b> is the average of previous-day effects measures for laughter, enjoyment, and interest. The general form for the affect questions is: Did you experience the following feelings during a lot of the day yesterday?',
  'Negative Affect': '<b>Negative affect (0-1)</b> is  the average of previous-day effects measures for worry, sadness, and anger. The general form for the affect questions is: Did you experience the following feelings during a lot of the day yesterday?',
  'Confidence In National Government': '<b>Confidence in national government (0-1)</b> is the national average of  binary responses (0=no, 1=yes) to the question "Do you have confidence in your national government?"'
};

// Scale domain [min, max] per metric (for choropleth and line chart axes)
export const metricScaleMap = {
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

// Metrics where higher is worse (reverse colour scale)
export const invertedMetricScale = ['Negative Affect', 'Perceptions Of Corruption'];
