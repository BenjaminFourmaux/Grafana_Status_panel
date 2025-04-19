import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { css } from '@emotion/css';
import { getActualThreshold } from '../lib/thresholdCalulationFunc';
import { Style } from '../interfaces/styleCSS';
import { OpenLinkAnchor } from './OpenLinkAnchor';
import { StatusMetric } from './buildStatusMetric';
import { ThresholdConf } from './ThresholdSetComponent';
import { Icon } from '@grafana/ui';

interface FlipCardProps {
  width: number;
  height: number;
  title: string;
  subtitle: string;
  url: string;
  urlTargetBlank: boolean;
  showMetric: boolean;
  metricUnit: string | undefined;
  value: number;
  fontStyle: string;
  cornerRadius: string;
  thresholds: ThresholdConf[];
  isFlipped: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  isFlipped,
  title,
  subtitle,
  url,
  urlTargetBlank,
  showMetric,
  metricUnit,
  value,
  fontStyle,
  cornerRadius,
  thresholds,
  width,
  height,
}) => {
  const actualThreshold = getActualThreshold(thresholds, value);

  // Retrieve colors
  const textColoration = css({ color: 'white' });

  return (
    <div
      className={
        css({ width, height: '100%', minWidth: '142px', borderRadius: cornerRadius, position: 'relative' }) +
        ' ' +
        css({ backgroundColor: actualThreshold.color }) +
        ' ' +
        textColoration
      }
    >
      <div className={Style.size100}>
        <OpenLinkAnchor href={url} target={urlTargetBlank ? '_blank' : '_self'} className={textColoration}>
          <ReactCardFlip isFlipped={isFlipped} flipDirection={'horizontal'} containerClassName={Style.size100}>
            {/* Front (metric) */}
            <div className={Style.flipCardContainer}>
              <OpenLinkAnchor href={url} target={urlTargetBlank ? '_blank' : '_self'} className={textColoration}>
                {/* Pane title */}
                {title !== '' && (
                  <div className={Style.flipCardBackTexts + ' ' + Style.flipCardTitle}>
                    <span id={'card-title'}>{title}</span>
                  </div>
                )}
                {/* Pane subtitle */}
                {subtitle !== '' && (
                  <div className={Style.flipCardBackTexts + ' ' + Style.flipCardSubtitle}>
                    <span id={'card-subtitle'}>{subtitle}</span>
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
              </OpenLinkAnchor>
            </div>

            {/* Back (severity) */}
            <div className={Style.flipCardContainer}>
              <span id={'card-severity'} className={Style.flipCardSeverity}>
                {actualThreshold.severity}
              </span>
            </div>
          </ReactCardFlip>
        </OpenLinkAnchor>
        {url && (
          <div className={Style.urlNotchContainer}>
            <Icon name={'external-link-alt'} className={Style.urlIcon} />
            <div className={Style.urlNotchTriangle}></div>
          </div>
        )}
      </div>
    </div>
  );
};
