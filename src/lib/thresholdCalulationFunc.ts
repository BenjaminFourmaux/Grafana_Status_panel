import { ThresholdConf } from '../components/ThresholdSetComponent';
import { DataFrame, FieldConfigSource, MatcherConfig } from '@grafana/data';
import { mappingMetricUnitName } from './metricUnitMapping';

/**
 * Get queries (if there are multiple queries) values with selected aggregation (last, min, max, etc.)
 * @param frame Data from the query
 * @param aggregation Type of chosen aggregation
 * @returns Values of the queries with selected aggregation
 */
export const getQueryValueAggregation = (frame: DataFrame, aggregation: string): number => {
  const rows = frame.fields.find((field: { type: string }) => field.type === 'number');
  return AggregationFunctions(rows, aggregation);
};

/**
 * Return the value of the query with selected aggregation
 * @param rows Data from series of a query
 * @param aggregation Aggregation type
 * @returns Value of the query with selected aggregation
 */
const AggregationFunctions = (rows: any, aggregation: string): number => {
  switch (aggregation) {
    case 'last':
      return rows.values[rows.values.length - 1];
    case 'first':
      return rows.values[0];
    case 'max':
      return rows.values.reduce((prev: number, curr: number) => {
        return prev > curr ? prev : curr;
      });
    case 'min':
      return rows.values.reduce((prev: number, curr: number) => {
        return prev > curr ? curr : prev;
      });
    case 'sum':
      return rows.values.reduce((prev: number, curr: number) => prev + curr, 0);
    case 'mean':
      const sum = rows.values.reduce((prev: number, curr: number) => prev + curr, 0);
      return sum / rows.values.length;
    case 'delta':
      const orderedValues = rows.values.sort((a: number, b: number) => a - b);
      return Math.abs(orderedValues[orderedValues.length - 1] - orderedValues[0]);
    default:
      return rows.values[rows.values.length - 1];
  }
};

/**
 * Get thresholds configuration for a query from fields configuration or override fields if they exist
 * @param fieldsConf Fields configuration
 * @param series Data from the query
 * @returns Thresholds configuration for the query
 */
export const getThresholdsConf = (fieldsConf: FieldConfigSource<any>, series: DataFrame): ThresholdConf[] => {
  for (let overrideField of fieldsConf.overrides) {
    let matcher = overrideField.matcher;

    for (let properties of overrideField.properties) {
      if (properties && properties.id === 'custom.thresholds') {
        // Concern this function
        if (overrideFieldForThisQuery(matcher, series)) {
          return properties.value;
        }
      }
    }
  }
  return fieldsConf.defaults.custom.thresholds;
};

/**
 * Get actual threshold depending on the query data (where the magic happens)
 * @param thresholds List of thresholds
 * @param value query value
 */
export const getActualThreshold = (thresholds: ThresholdConf[], value: number | undefined): ThresholdConf => {
  const baseThreshold = thresholds[0];
  if (value === undefined || value === null) {
    return {
      ...baseThreshold,
      severity: undefined,
    };
  }

  // Remove base threshold from the list (no used in actual threshold computing)
  thresholds = thresholds.slice(1);

  // Order thresholds by value from lowest to highest (make sure to handle null and wrong value before)
  let sortedThresholds = thresholds.sort((a, b) => (a.value || 0) - (b.value || 0));

  // Compare thresholds with data and return threshold that data is on the slice
  const reverseSortedThresholds = sortedThresholds.slice().reverse();
  for (let i = 0; i < reverseSortedThresholds.length; i++) {
    if (value >= (reverseSortedThresholds[i].value || 0)) {
      return reverseSortedThresholds[i];
    }
  }
  return baseThreshold;
};

/**
 * True if the override field should be used for this query
 * @param matcher
 * @param series
 * @returns True if the override field should be used for this query
 */
function overrideFieldForThisQuery(matcher: MatcherConfig<any>, series: DataFrame): boolean {
  let regex = undefined;
  if (matcher.id === 'byRegexp') {
    let exp = matcher.options;
    exp = exp.slice(1, exp.length - 1);
    regex = new RegExp(exp);
  }
  return (
    (matcher.id === 'byName' && matcher.options === series.fields[1].name) || // Override Field with Name
    (matcher.id === 'byRegexp' && regex && regex.test(series.fields[1].name)) || // Override Field with Regexp
    (matcher.id === 'byType' && series.fields[1].type === matcher.options) || // Override Field by Type
    (matcher.id === 'byFrameRefID' && series.refId === matcher.options)
  ); // Override Field by Fields returned by query
}

/**
 * Get metric unit for display it, if it's define in options or override field
 * @param showMetric If metric should be show
 * @param metricUnit Metric unit from options
 * @param series Data from the query
 * @param overrideFields Override field from options
 */
export const getMetricUnit = (
  showMetric: boolean,
  metricUnit: string | undefined,
  series: DataFrame,
  overrideFields: any
): string | undefined => {
  let metricUnitName = '';

  if (showMetric) {
    for (let overrideField of overrideFields) {
      let matcher = overrideField.matcher;

      for (let properties of overrideField.properties) {
        if (properties.id === 'custom.metricUnit') {
          if (overrideFieldForThisQuery(matcher, series)) {
            metricUnitName = properties.value;
            break;
          }
        }
      }
    }
    let metricUnitFromName = mappingMetricUnitName(metricUnitName);
    return metricUnitFromName ? metricUnitFromName : metricUnit;
  } else {
    return undefined;
  }
};
