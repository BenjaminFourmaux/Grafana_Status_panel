import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { css } from '@emotion/css';
import { MaybeAnchor } from './MaybeAnchor';
import { getActualThreshold } from '../lib/thresholdCalulationFunc';
import { StatusMetric } from './buildStatusMetric';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { formattedString } from '../lib/formattedString';
import { Style } from '../interfaces/styleCSS';

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
      className={
        css({ width, height: '100%', minWidth: '142px', borderRadius: options.cornerRadius }) +
        ' ' +
        (!noBackgroundColor && css({ backgroundColor: actualThreshold.color }))
      }
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection={'horizontal'}>
        {/* Front (severity) */}
        <div className={Style.flipCardFrontContainer}>
          <MaybeAnchor href={options.url} target={options.urlTargetBlank ? '_blank' : '_self'}>
            <span className={Style.flipCardSeverity + ' ' + textColoration}>{actualThreshold.severity}</span>
          </MaybeAnchor>
        </div>

        {/* Back (metric) */}
        <div className={Style.flipCardBackContainer}>
          <div className={Style.flipCardBackFlexContainer + ' ' + textColoration}>
            <MaybeAnchor
              href={options.url}
              target={options.urlTargetBlank ? '_blank' : '_self'}
              className={textColoration}
            >
              {/* Pane title */}
              {options.title !== '' && (
                <div className={Style.flipCardBackTexts + ' ' + Style.flipCardTitle}>
                  <span>{formattedString(options.title, formattedVariables)}</span>
                </div>
              )}
              {/* Pane subtitle */}
              {options.subtitle !== '' && (
                <div className={Style.flipCardBackTexts + ' ' + Style.flipCardSubtitle}>
                  <span>{options.subtitle}</span>
                </div>
              )}
              {/* Pane metric */}
              {showMetric && (
                <div className={Style.flipCardBackTexts + ' ' + Style.flipCardMetric}>
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
