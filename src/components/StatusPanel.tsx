import { PanelProps } from '@grafana/data';
import { IconButton } from '@grafana/ui';
import { css } from '@emotion/css';
import React, { useEffect } from 'react';
import { useHover, useInterval } from 'hooks/index';
import { StatusPanelOptions } from 'interfaces/statusPanelOptions';
import { getQueriesValuesAggregation } from '../lib/thresholdCalulationFunc';
import { FlipCard } from './FlipCard';

type Props = PanelProps<StatusPanelOptions>;

export const StatusPanel: React.FC<Props> = ({ data, options, fieldConfig, width, height, replaceVariables }) => {
  console.log(data);
  const queriesValues: number[] = getQueriesValuesAggregation(data, fieldConfig.defaults.custom.aggregation);

  // setup flipper
  // True for the metrics page, False for the severity page
  const [flipped, setFlipped] = React.useState(options.flipState);
  const wrapper = React.useRef<HTMLDivElement>(null);
  const isHover = useHover(wrapper);
  useInterval(() => options.flipCard && !isHover && setFlipped(!flipped), 1000 * options.flipTime);
  useEffect(() => {
    setFlipped(options.flipState);
  }, [options.flipState]);

  return (
    <div
      ref={wrapper}
      className={css({
        boxSizing: 'border-box',
        zIndex: 10,
      })}
    >
      <div className={css({ display: 'flex', flexWrap: 'wrap' })}>
        {/* browse queries */}
        {queriesValues.map((queryValue, index) => (
          <div
            className={css(
              { flexBasis: 'O', flexGrow: '1', maxWidth: '100%' },
              {
                padding: '5px',
              }
            )}
            key={index}
          >
            <FlipCard
              width={width / queriesValues.length - 5 * 2}
              height={height}
              showMetric={fieldConfig.defaults.custom.displayValueMetric}
              metricUnit={fieldConfig.defaults.custom.metricUnit}
              fontStyle={fieldConfig.defaults.custom.fontFormat}
              options={options}
              value={queryValue}
              isFlipped={flipped}
            />
          </div>
        ))}
      </div>

      {isHover && (
        <IconButton
          name={'exchange-alt'}
          size={'xl'}
          onClick={() => setFlipped(!flipped)}
          className={css(
            {
              position: 'absolute',
              bottom: '1.2rem',
              right: '1.2rem',
            },
            { color: 'white' }
          )}
          aria-label="Flip Card"
          tooltip={'Flip Card'}
        />
      )}
    </div>
  );
};
