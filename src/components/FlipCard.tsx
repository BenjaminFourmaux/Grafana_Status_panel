import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { css } from '@emotion/css';
import { MaybeAnchor } from './MaybeAnchor';
import { getActualThreshold } from '../lib/thresholdCalulationFunc';
import { StatusMetric } from './buildStatusMetric';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { formattedString } from '../lib/formattedString';

interface FlipCardProps {
  width: number;
  height: number;
  showMetric: boolean;
  metricUnit: string | undefined;
  value: number;
  fontStyle: string;
  options: any;
  formattedVariables: FormattedStringVariables;
  isFlipped: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  isFlipped,
  showMetric,
  metricUnit,
  value,
  fontStyle,
  options,
  formattedVariables,
  width,
  height,
}) => {
  const actualThreshold = getActualThreshold(options.thresholds, value);

  // Retrieve colors
  const textColoration = css({ color: 'white' });
  const noBackgroundColor = options.isGrayOnNoData && value === undefined;

  return (
    <div
      className={css(
        {
          width,
          borderRadius: options.cornerRadius,
        },
        !noBackgroundColor && { backgroundColor: actualThreshold.color }
      )}
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection={'horizontal'}>
        {/* Front (severity) */}
        <div
          className={css(
            {
              height,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2rem',
              textAlign: 'center',
            },
            textColoration
          )}
        >
          <MaybeAnchor href={options.url} target={options.urlTargetBlank ? '_blank' : '_self'}>
            <span>{actualThreshold.severity}</span>
          </MaybeAnchor>
        </div>

        {/* Back (metric) */}
        <div className={css({ height, display: 'flex', flexDirection: 'column' })}>
          <div
            className={css(
              {
                flex: '1 0 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
              textColoration
            )}
          >
            <MaybeAnchor
              href={options.url}
              target={options.urlTargetBlank ? '_blank' : '_self'}
              className={textColoration}
            >
              {/* Pane title */}
              {options.title !== '' && (
                <div
                  className={css({
                    minHeight: '1px',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '2rem',
                  })}
                >
                  <span>{formattedString(options.title, formattedVariables)}</span>
                </div>
              )}
              {/* Pane subtitle */}
              {options.subtitle !== '' && (
                <div
                  className={css({
                    minHeight: '1px',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  })}
                >
                  <span>{options.subtitle}</span>
                </div>
              )}
              {/* Pane metric */}
              {showMetric && (
                <div
                  className={css({
                    minHeight: '1px',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '2.1rem',
                    marginTop: '1rem',
                  })}
                >
                  <StatusMetric fontStyle={fontStyle}>
                    {value}
                    {metricUnit}
                  </StatusMetric>
                </div>
              )}
            </MaybeAnchor>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
};
