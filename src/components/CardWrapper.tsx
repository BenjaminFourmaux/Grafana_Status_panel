import React from 'react';
import { DataFrame, FieldConfigSource, PanelData } from '@grafana/data';
import { StatusPanelOptions } from '../interfaces/statusPanelOptions';
import {
  getActualThreshold,
  getMetricUnit,
  getQueryValueAggregation,
  getSubtitle,
  getThresholdsConf,
  getTitle,
  getUrl,
  getUrlTargetBlank,
} from '../lib/thresholdCalulationFunc';
import { FlipCard } from './FlipCard';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { provideFormattedStringVariables } from '../lib/formattedString';
import { mappingMetricUnitName } from '../lib/metricUnitMapping';

interface CardWrapperProps {
  index: number;
  data: PanelData;
  series: DataFrame;
  fieldsConfig: FieldConfigSource<any>;
  options: StatusPanelOptions;
  cardWidth: number;
  cardHeight: number;
  flipped: boolean;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  data,
  series,
  options,
  fieldsConfig,
  cardWidth,
  cardHeight,
  flipped,
  index,
}) => {
  const cardTitle = getTitle(options, fieldsConfig, series);
  const cardSubtitle = getSubtitle(options, fieldsConfig, series);
  const cardUrl = getUrl(options, fieldsConfig, series);
  const cardUrlTargetBlank = getUrlTargetBlank(options, fieldsConfig, series);
  // Calculate values depending on fieldsConfig and override fields
  const metricUnit = getMetricUnit(
    fieldsConfig.defaults.custom.displayValueMetric,
    fieldsConfig.defaults.custom.metricUnit,
    series,
    fieldsConfig.overrides
  );
  const queryValueComputed: number = getQueryValueAggregation(series, fieldsConfig);
  const stringFormattedVariables: FormattedStringVariables = provideFormattedStringVariables(
    index,
    series,
    data,
    queryValueComputed,
    metricUnit || ''
  );
  const thresholdsConf = getThresholdsConf(fieldsConfig, series);

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
      options={options}
      thresholds={thresholdsConf}
      formattedVariables={stringFormattedVariables}
      value={queryValueComputed}
      isFlipped={flipped}
    />
  );
};

interface CardWrapperPropsAggregateQuery {
  data: PanelData;
  fieldsConfig: FieldConfigSource<any>;
  options: StatusPanelOptions;
  cardWidth: number;
  cardHeight: number;
  flipped: boolean;
}

export const CardWrapperAggregateQuery: React.FC<CardWrapperPropsAggregateQuery> = ({
  data,
  fieldsConfig,
  options,
  cardWidth,
  cardHeight,
  flipped,
}) => {
  // Browse all series and get query value by aggregation
  let aggregateQueriesValues = [];
  for (let series of data.series) {
    aggregateQueriesValues.push(getQueryValueAggregation(series, fieldsConfig));
  }
  // Get threshold configuration
  const thresholdsConf = fieldsConfig.defaults.custom.thresholds;
  // For all aggregateQueriesValues, get actual threshold
  let actualThresholds = [];
  for (let queryValue of aggregateQueriesValues) {
    actualThresholds.push(getActualThreshold(thresholdsConf, queryValue));
  }
  // Get index of the worst threshold
  const actualThreshold = actualThresholds.reduce((prev, current) =>
    (prev.value || 0) > (current.value || 0) ? prev : current
  );
  const thresholdIndex = actualThresholds.indexOf(actualThreshold);

  const queryValue = aggregateQueriesValues[thresholdIndex];
  const metricUnit = mappingMetricUnitName(fieldsConfig.defaults.custom.metricUnit);
  const cardTitle = getTitle(options, fieldsConfig, data.series[thresholdIndex]);
  const cardSubtitle = getSubtitle(options, fieldsConfig, data.series[thresholdIndex]);
  const cardUrl = getUrl(options, fieldsConfig, data.series[thresholdIndex]);
  const cardUrlTargetBlank = getUrlTargetBlank(options, fieldsConfig, data.series[thresholdIndex]);
  const stringFormattedVariables: FormattedStringVariables = provideFormattedStringVariables(
    thresholdIndex,
    data.series[thresholdIndex],
    data,
    queryValue,
    metricUnit
  );

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
      isGrayOnNoData={options.isGrayOnNoData}
      thresholds={fieldsConfig.defaults.custom.thresholds}
      formattedVariables={stringFormattedVariables}
      value={queryValue}
      isFlipped={flipped}
    />
  );
};
