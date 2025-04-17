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
  let queriesValuesAggregated: number[] = [];
  for (let series of data.series) {
    let value = getQueryValueAggregation(series, fieldConfig);
    if (value !== undefined) {
      queriesValuesAggregated.push(value);
    }
  }

  /* Calculate Card size */

  const cardWidth = data.series.length < 12 ? width / data.series.length - 5 * 2 : width / 12 - 5 * 2;
  const cardHeight = height;

  // If query(ies) return no data, display "no data"
  if (queriesValuesAggregated.length === 0) {
    return <div>no data</div>;
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
              queriesValuesAggregated={queriesValuesAggregated}
              cardWidth={width - 5 * 2}
              cardHeight={cardHeight}
              flipped={flipped}
            />
          </div>
        ) : (
          <>
            {data.series.map((series, index) => (
              <>
                <div className={Style.col} key={index}>
                  <CardWrapper
                    series={series}
                    data={data}
                    options={options}
                    fieldsConfig={fieldConfig}
                    queryValue={queriesValuesAggregated[index]}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    flipped={flipped}
                    index={index}
                  />
                </div>
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
