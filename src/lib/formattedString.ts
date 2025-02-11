import { FormattedStringVariables } from '../interfaces/formattedStringVariables';

/**
 * Render a formatted string with template
 * @param formatString A string {{formatted_value}} to render
 * @param variables some data to render
 */
export const formattedString = (formatString: string, variables: FormattedStringVariables): string => {
  if (!formatString) {
    return '';
  }
  return formatString.replace(/{{(.*?)}}/g, (match, token) => {
    let value;

    let token_variable = token.trim();

    switch (token_variable) {
      case 'query_name':
        value = variables.queryName;
        break;
      case 'query_value':
        value = variables.queryValue;
        break;
      case 'query_index':
        value = variables.queryIndex.toString();
        break;
      case '$__interval':
        value = variables.interval;
        break;
      case token_variable.match(/time?.+/)?.input:
        let format = token_variable.match(/time\s(.*)/);
        if (format) {
          format = format[1];
          value = parseDateToString(new Date(variables.time), format);

          if (value === '') {
            value = 'Invalid datetime format';
          }
        } else {
          value = variables.time.toString();
        }
        break;
      case 'metric_name':
        value = variables.metricName;
        break;
      default:
        value = '';

        const regexLabel = /label:/;
        if (regexLabel.test(token_variable)) {
          const labelName: string = token.replace(/^label:/, '');
          const labelValue = variables.labels[labelName];
          value = labelValue ? labelValue.toString() : '';
        }

        break;
    }
    return value;
  });
};

export const provideFormattedStringVariables = (
  queryIndex: number,
  series: any,
  dataQueries: any,
  queryValue: number,
  metricUnit: string
): FormattedStringVariables => {
  let requestInfo = extractRequestInfo(dataQueries.request.targets[queryIndex]);
  return {
    queryIndex: queryIndex,
    queryName: series.refId,
    queryValue: queryValue !== undefined ? queryValue.toString() : '',
    interval: dataQueries.request.interval,
    time: dataQueries.request.startTime,
    metricName: metricUnit,
    labels: requestInfo.labels,
  };
};

function extractRequestInfo(request: any): any {
  let object = {
    metricName: '',
    labels: {},
  };

  if (request && request.expr) {
    let match = request.expr.match(/^(?<metric_name>\w+)\{(?<labels>.*)\}$/);
    if (match) {
      const { metric_name, labels } = match.groups;

      // Extract labels name and value
      const labelRegex = /([^ =,]+)="([^"]+)"/g;
      let labelMatch;
      const labelsObject: { [key: string]: string } = {};
      while ((labelMatch = labelRegex.exec(labels)) !== null) {
        labelsObject[labelMatch[1]] = labelMatch[2];
      }

      object = {
        metricName: metric_name,
        labels: labelsObject,
      };
    }
  }

  return object;
}

function parseDateToString(date: Date, format: string): string {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds();

  let formatted_datetime = format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('ss', seconds.toString().padStart(2, '0'))
    .replace('SSS', milliseconds.toString().padStart(3, '0'));

  if (formatted_datetime !== format) {
    return formatted_datetime;
  } else {
    return '';
  }
}
