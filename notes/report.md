# Project Title
Candidate Number: 570768
"I declare that, except where otherwise indicated, this mini-project is entirely my own work, and that it has not been previously submitted and/or assessed and is not due to be submitted on its entirety or inpart for any other course, module or assignment"

## Overview

## Data

World Happiness Report
https://www.kaggle.com/datasets/usamabuttar/world-happiness-report-2005-present

countries-110m
Tutorial 5 of the course

The file `countries-110m.json` is a TopoJSON from tutorial 5 of the course. It represents the names, locations and borders of the world's countries.

The file `World Happiness Report.csv` is from Kaggle and contains the data from the World Happiness Report. It has information on happiness by country by year as well as the corresponding metrics that they used to derive this value. The dataset is incomplete in that most countries do not have information for every year and not every field is filled. Here are its attributes:
- Country Name
- Regional Indicator
- Year
- Life Ladder
- Log GDP Per Capita
- Social Support
- Healthy Life Expectancy At Birth
- Freedom To Make Life Choices
- Generosity
- Perceptions of Corruption
- Positive Affect
- Negative Affect
- Confidence In National Government
These are all described in the project.

In both files I renamed countries so that the program would be able to use one name in both. In the CSV I filled in the Regional Indicators of some countries that had them missing. I removed the Haitian Healthy Life Expectancy as it seemed flawed.

The default for the scales was to use the extent over all years. This is useful for comparing different time periods and see how countries change with time due to the common scale. For some, it did not make sense for the reasons specified in brackets.
Perceptions of corruption (big is bad)
Negative affect (big is bad)
There was no data on the Confidence in National Government in 2022 so that was a notable edge case to visualise.

## Goals & Tasks

## Visualisation

## Usage Scenario

## Credits
### Inspiration

### Code Consulted

The basis of the choropleth map was the geographic map from the Data Visualisation tutorial 5. It is in its own file for code reuse. I altered it so that it is a choropleth map and it updates as different filters are used. I change the names of some of the countries.

The dropdown box used for the metrics was based on that from Data Visualisation tutorial 4.4. I changed its contents and the styling.

The map's tooltip is based on the tooltip code from Data Visualisation tutorial 4.5.

For the interactive legend I used a dynamic-sort from StackOverflow: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value

### Other
- favicon: https://www.favicon.cc/?action=icon&file_id=837