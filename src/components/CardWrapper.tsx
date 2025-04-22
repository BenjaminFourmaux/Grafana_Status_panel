import React from 'react';
import { DataFrame, FieldConfigSource, PanelData } from '@grafana/data';
import { StatusPanelOptions } from '../interfaces/statusPanelOptions';
import {
  getActualThreshold,
  getMetricUnit,
  getSubtitle,
  getThresholdsConf,
  getTitle,
  getUrl,
  getUrlTargetBlank,
} from '../lib/thresholdCalulationFunc';
import { FlipCard } from './FlipCard';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { compileFormattedString, provideFormattedStringVariables } from '../lib/formattedString';
import { mappingMetricUnitName } from '../lib/metricUnitMapping';
import { FlipCardNoData } from './FlipCardNoData';

interface CardWrapperProps {
  index: number;
  data: PanelData;
  series: DataFrame;
  fieldsConfig: FieldConfigSource<any>;
  options: StatusPanelOptions;
  queryValue: number;
  cardWidth: number;
  cardHeight: number;
  flipped: boolean;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  data,
  series,
  fieldsConfig,
  options,
  queryValue,
  cardWidth,
  cardHeight,
  flipped,
  index,
}) => {
  // Calculate values depending on fieldsConfig and override fields
  const metricUnit = getMetricUnit(
    fieldsConfig.defaults.custom.displayValueMetric,
    fieldsConfig.defaults.custom.metricUnit,
    series,
    fieldsConfig.overrides
  );
  // Get formatted string variables (like query name, query value, etc.)
  const stringFormattedVariables: FormattedStringVariables = provideFormattedStringVariables(
    index,
    series,
    data,
    queryValue,
    metricUnit || ''
  );

  // Debug, help people to show what their can do with the variables
  console.log('stringFormattedVariables', stringFormattedVariables);

  const cardTitle = compileFormattedString(getTitle(options, fieldsConfig, series), stringFormattedVariables);
  const cardSubtitle = compileFormattedString(getSubtitle(options, fieldsConfig, series), stringFormattedVariables);
  const cardUrl = compileFormattedString(getUrl(options, fieldsConfig, series), stringFormattedVariables);
  const cardUrlTargetBlank = getUrlTargetBlank(options, fieldsConfig, series);

  const thresholdsConf = getThresholdsConf(fieldsConfig, series);

  if (queryValue === undefined || queryValue === null) {
    return (
      <>
        {!options.isNothingOnNoData && (
          <FlipCardNoData
            width={cardWidth}
            height={cardHeight}
            title={cardTitle}
            subtitle={cardSubtitle}
            url={cardUrl}
            urlTargetBlank={cardUrlTargetBlank}
            showMetric={fieldsConfig.defaults.custom.displayValueMetric}
            fontStyle={fieldsConfig.defaults.custom.fontFormat}
            cornerRadius={options.cornerRadius}
            isFlipped={flipped}
          />
        )}
      </>
    );
  }

  return (
    <FlipCard
      width={cardWidth}
      height={cardHeight}
      title={cardTitle}
      subtitle={cardSubtitle}
      url={cardUrl}
      urlTargetBlank={cardUrlTargetBlank}
      showMetric={fieldsConfig.defaults.custom.displayValueMetric}
      metricUnit={metricUnit}
      fontStyle={fieldsConfig.defaults.custom.fontFormat}
      thresholds={thresholdsConf}
      value={queryValue}
      isFlipped={flipped}
      cornerRadius={options.cornerRadius}
    />
  );
};

interface CardWrapperPropsAggregateQuery {
  data: PanelData;
  fieldsConfig: FieldConfigSource<any>;
  options: StatusPanelOptions;
  queriesValuesAggregated: number[][];
  cardWidth: number;
  cardHeight: number;
  flipped: boolean;
}

export const CardWrapperAggregateQuery: React.FC<CardWrapperPropsAggregateQuery> = ({
  data,
  fieldsConfig,
  options,
  queriesValuesAggregated,
  cardWidth,
  cardHeight,
  flipped,
}) => {
  // Get threshold configuration
  const thresholdsConf = fieldsConfig.defaults.custom.thresholds;
  // For all aggregateQueriesValues, get actual threshold
  let actualThresholds = [];
  for (let queryValues of queriesValuesAggregated) {
    // note: queryValues is already the aggregated value for each dataframe of a query
    for (let queryValue of queryValues) {
      actualThresholds.push(getActualThreshold(thresholdsConf, queryValue));
    }
  }

  // Get index of the worst threshold
  const actualThreshold = actualThresholds.reduce((prev, current) =>
    (prev.value || 0) > (current.value || 0) ? prev : current
  );
  const thresholdIndex = actualThresholds.indexOf(actualThreshold);

  const queryValue = queriesValuesAggregated.flat()[thresholdIndex];
  const metricUnit = mappingMetricUnitName(fieldsConfig.defaults.custom.metricUnit);

  const stringFormattedVariables: FormattedStringVariables = provideFormattedStringVariables(
    thresholdIndex,
    data.series[thresholdIndex],
    data,
    queryValue,
    metricUnit,
    true
  );
  // Debug, help people to show what their can do with the variables
  console.log('stringFormattedVariables', stringFormattedVariables);

  // Formatted Texts
  const cardTitle = compileFormattedString(
    getTitle(options, fieldsConfig, data.series[thresholdIndex]),
    stringFormattedVariables
  );
  const cardSubtitle = compileFormattedString(
    getSubtitle(options, fieldsConfig, data.series[thresholdIndex]),
    stringFormattedVariables
  );
  const cardUrl = compileFormattedString(
    getUrl(options, fieldsConfig, data.series[thresholdIndex]),
    stringFormattedVariables
  );
  const cardUrlTargetBlank = getUrlTargetBlank(options, fieldsConfig, data.series[thresholdIndex]);

  return (
    <FlipCard
      width={cardWidth}
      height={cardHeight}
      title={cardTitle}
      subtitle={cardSubtitle}
      url={cardUrl}
      urlTargetBlank={cardUrlTargetBlank}
      showMetric={fieldsConfig.defaults.custom.displayValueMetric}
      metricUnit={metricUnit}
      fontStyle={fieldsConfig.defaults.custom.fontFormat}
      cornerRadius={options.cornerRadius}
      thresholds={fieldsConfig.defaults.custom.thresholds}
      value={queryValue}
      isFlipped={flipped}
    />
  );
};
