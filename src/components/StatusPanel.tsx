import { PanelProps } from '@grafana/data';
import React, { useEffect } from 'react';
import { useHover, useInterval } from 'hooks/index';
import { StatusPanelOptions } from 'interfaces/statusPanelOptions';
import { CardWrapper, CardWrapperAggregateQuery } from './CardWrapper';
import { Style } from '../interfaces/styleCSS';
import { css } from '@emotion/css';
import { IconButton } from '@grafana/ui';

type Props = PanelProps<StatusPanelOptions>;

export const StatusPanel: React.FC<Props> = ({ data, options, fieldConfig, width, height }) => {
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
  const cardWidth = data.series.length < 12 ? width / data.series.length - 5 * 2 : width / 12 - 5 * 2;
  const cardHeight = height;

  return (
    <div ref={wrapper} className={Style.wrapperContainer}>
      <div className={Style.row + ' ' + css({ height })}>
        {/* If option AggregateQueries is enabled */}
        {options.aggregateQueries ? (
          <div className={Style.col}>
            <CardWrapperAggregateQuery
              data={data}
              options={options}
              fieldsConfig={fieldConfig}
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
