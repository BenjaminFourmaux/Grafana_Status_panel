import React from 'react';
import { DataFrame, FieldConfigSource, PanelData } from '@grafana/data';
import { StatusPanelOptions } from '../interfaces/statusPanelOptions';
import { getMetricUnit } from '../lib/thresholdCalulationFunc';
import { FlipCard } from './FlipCard';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { provideFormattedStringVariables } from '../lib/formattedString';

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
  // Calculate velues depending on fieldsConfig and override fields
  const metricUnit = getMetricUnit(
    fieldsConfig.defaults.custom.displayValueMetric,
    fieldsConfig.defaults.custom.metricUnit,
    series,
    fieldsConfig.overrides
  );
  const stringFormattedVariables: FormattedStringVariables[] = provideFormattedStringVariables(data, [12]);
  //const queriesValues: number[] = getQueriesValuesAggregation(data, fieldConfig.defaults.custom.aggregation);
  const queryValueComputed = 12;

  return (
    <FlipCard
      width={cardWidth}
      height={cardHeight}
      showMetric={fieldsConfig.defaults.custom.displayValueMetric}
      metricUnit={metricUnit}
      fontStyle={fieldsConfig.defaults.custom.fontFormat}
      options={options}
      formattedVariables={stringFormattedVariables[index]}
      value={queryValueComputed}
      isFlipped={flipped}
    />
  );
};
