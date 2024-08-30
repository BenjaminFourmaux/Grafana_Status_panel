import { FormattedStringVariables } from '../interfaces/formattedStringVariables';

/**
 * Render a formatted string with template
 * @param formatString A string {{formatted_value}} to render
 * @param variables some data to render
 */
export const formattedString = (formatString: string, variables: FormattedStringVariables): string => {
  return formatString.replace(/{{(.*?)}}/g, (match, token) => {
    let value;

    switch (token.trim()) {
      case 'query_name':
        value = variables.queryName;
        break;
      case 'query_value':
        value = variables.queryValue;
        break;
      case 'query_index':
        value = variables.queryIndex.toString();
        break;
      default:
        value = '';
        break;
    }
    return value;
  });
};

export const provideFormattedStringVariables = (
  dataQueries: any,
  queryValues: number[]
): FormattedStringVariables[] => {
  return dataQueries.series.map((serie: any, index: number) => {
    return {
      queryIndex: index,
      queryName: serie.refId,
      queryValue: queryValues[index],
    };
  });
};
