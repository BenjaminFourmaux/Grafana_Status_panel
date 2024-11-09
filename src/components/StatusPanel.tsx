import { PanelProps } from '@grafana/data';
import React, { useEffect } from 'react';
import { useHover, useInterval } from 'hooks/index';
import { StatusPanelOptions } from 'interfaces/statusPanelOptions';
import { CardWrapper } from './CardWrapper';
import { Style } from '../interfaces/styleCSS';
import { css } from '@emotion/css';

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
                key={index}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
