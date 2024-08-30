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
      <div style={{ width: '100%', height: '100%' }}>
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection={'horizontal'}
          containerStyle={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Front (severity) */}
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h4>Issou</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
            <h4>King</h4>
          </div>

          {/* Back (metric) */}
          <div>
            <h3>Bite</h3>
          </div>
        </ReactCardFlip>
      </div>
    </div>
  );
};
