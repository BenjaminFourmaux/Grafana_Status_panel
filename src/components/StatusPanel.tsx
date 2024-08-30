import { PanelProps } from '@grafana/data';
import { IconButton } from '@grafana/ui';
import { css } from '@emotion/css';
import React, { useEffect } from 'react';
import { useHover, useInterval } from 'hooks/index';
import { StatusPanelOptions } from 'interfaces/statusPanelOptions';
import { getQueriesValuesAggregation } from '../lib/thresholdCalulationFunc';
import { FlipCard } from './FlipCard';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { provideFormattedStringVariables } from '../lib/formattedString';
import { Style } from '../interfaces/styleCSS';

type Props = PanelProps<StatusPanelOptions>;

export const StatusPanel: React.FC<Props> = ({ data, options, fieldConfig, width, height }) => {
  console.log(data);
  const queriesValues: number[] = getQueriesValuesAggregation(data, fieldConfig.defaults.custom.aggregation);
  const stringFormattedVariables: FormattedStringVariables[] = provideFormattedStringVariables(data, queriesValues);

  // setup flipper
  // True for the metrics page, False for the severity page
  const [flipped, setFlipped] = React.useState(options.flipState);
  const wrapper = React.useRef<HTMLDivElement>(null);
  const isHover = useHover(wrapper);
  useInterval(() => options.flipCard && !isHover && setFlipped(!flipped), 1000 * options.flipTime);
  useEffect(() => {
    setFlipped(options.flipState);
  }, [options.flipState]);

  // Calculate Card size
  const cardWidth = width / queriesValues.length - 5 * 2;
  const cardHeight = height / Math.ceil(queriesValues.length / 12) - 5 * 2;

  return (
    <div ref={wrapper} className={Style.wrapperContainer}>
      <div className={Style.row}>
        {/* browse queries */}
        {queriesValues.map((queryValue, index) => (
          <>
            <div className={Style.col} key={index}>
              <FlipCard
                width={cardWidth}
                height={cardHeight}
                showMetric={fieldConfig.defaults.custom.displayValueMetric}
                metricUnit={fieldConfig.defaults.custom.metricUnit}
                fontStyle={fieldConfig.defaults.custom.fontFormat}
                options={options}
                formattedVariables={stringFormattedVariables[index]}
                value={queryValue}
                isFlipped={flipped}
              />
            </div>
            {/* Return to the line every 12 cards */}
            {(index + 1) % 12 === 0 && <div className={css({ width: '100%' })} />}
          </>
        ))}
      </div>

      {isHover && (
        <IconButton
          name={'exchange-alt'}
          size={'xl'}
          onClick={() => setFlipped(!flipped)}
          className={Style.flipButton + ' ' + css({ color: 'white' })}
          aria-label="Flip Card"
          tooltip={'Flip Card'}
        />
      )}
    </div>
  );
};
