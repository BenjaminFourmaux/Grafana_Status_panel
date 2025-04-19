import { PanelProps } from '@grafana/data';
import React, { useEffect } from 'react';
import { useInterval } from 'hooks/index';
import { StatusPanelOptions } from 'interfaces/statusPanelOptions';
import { CardWrapper, CardWrapperAggregateQuery } from './CardWrapper';
import { Style } from '../interfaces/styleCSS';
import { css } from '@emotion/css';
import { IconButton } from '@grafana/ui';
import { getQueryValueAggregation } from '../lib/thresholdCalulationFunc';

type Props = PanelProps<StatusPanelOptions>;

export const StatusPanel: React.FC<Props> = ({ data, options, fieldConfig, width, height }) => {
  // setup flipper
  // True for the metrics page, False for the severity page
  const [flipped, setFlipped] = React.useState(options.flipState);
  useInterval(() => options.flipCard && setFlipped(!flipped), 1000 * options.flipTime);
  useEffect(() => {
    setFlipped(options.flipState);
  }, [options.flipState]);

  /* Calculate the query values */
  // Contains all query aggregated values

  console.log('data', data);

  // A list for all panel (and all rows) aggregated values used to compute the threshold according to the selected aggregation and overrides fields config
  let queriesValuesAggregated: number[][] = [];
  for (let series of data.series) {
    // for each query
    let value = getQueryValueAggregation(series, fieldConfig);
    queriesValuesAggregated.push(value);
  }

  /* Calculate Card size */

  const cardWidth = data.series.length < 12 ? width / data.series.length - 5 * 2 : width / 12 - 5 * 2;
  const cardHeight = height;

  // If query(ies) return no data, display "no data"
  if (queriesValuesAggregated.length === 0) {
    return <>{!options.isNothingOnNoData && <div>no data</div>}</>;
  }

  return (
    <div className={Style.wrapperContainer + ' panel-container'}>
      <div className={Style.row + ' ' + css({ height })}>
        {/* If option AggregateQueries is enabled */}
        {options.aggregateQueries ? (
          <div className={Style.col}>
            <CardWrapperAggregateQuery
              data={data}
              options={options}
              fieldsConfig={fieldConfig}
              queriesValuesAggregated={queriesValuesAggregated[0]}
              cardWidth={width - 5 * 2}
              cardHeight={cardHeight}
              flipped={flipped}
            />
          </div>
        ) : (
          <>
            {/* For each query */}
            {data.series.map((series, index) => (
              <>
                {/* For each values in query (dataframe returned in the query (zabbix)  */}
                {queriesValuesAggregated[index].map((value, index) => (
                  <>
                    <div className={Style.col} key={index}>
                      <CardWrapper
                        series={series}
                        data={data}
                        options={options}
                        fieldsConfig={fieldConfig}
                        queryValue={value}
                        cardWidth={cardWidth}
                        cardHeight={cardHeight}
                        flipped={flipped}
                        index={index}
                      />
                    </div>
                  </>
                ))}
              </>
            ))}
          </>
        )}
      </div>
      <IconButton
        name={'exchange-alt'}
        size={'xl'}
        onClick={() => setFlipped(!flipped)}
        className={Style.flipButton + ' ' + css({ color: 'white' })}
        aria-label="Flip Card"
        tooltip={'Flip Card'}
      />
    </div>
  );
};
