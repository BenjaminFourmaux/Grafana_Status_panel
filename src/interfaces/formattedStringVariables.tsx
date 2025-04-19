/**
 * Interface for formatted string variables
 */
export interface FormattedStringVariables {
  queryIndex: number;
  queryName: string;
  queryValue: string;
  columnName: string;
  interval: string;
  time: number;
  metricName: string;
  labels: {
    [labelName: string]: string;
  };
}
