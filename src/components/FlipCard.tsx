import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { css } from '@emotion/css';
import { getActualThreshold } from '../lib/thresholdCalulationFunc';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { Style } from '../interfaces/styleCSS';
import { OpenLinkAnchor } from './OpenLinkAnchor';
import { formattedString } from '../lib/formattedString';
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
  isGrayOnNoData: boolean;
  thresholds: ThresholdConf[];
  formattedVariables: FormattedStringVariables;
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
  isGrayOnNoData,
  thresholds,
  formattedVariables,
  width,
  height,
}) => {
  const actualThreshold = getActualThreshold(thresholds, value);

  // Retrieve colors
  const textColoration = css({ color: 'white' });
  const noBackgroundColor = isGrayOnNoData && value === null;

  return (
    <div
      className={
        css({ width, height: '100%', minWidth: '142px', borderRadius: cornerRadius, position: 'relative' }) +
        ' ' +
        (!noBackgroundColor && css({ backgroundColor: actualThreshold.color })) +
        ' ' +
        textColoration
      }
    >
      <div className={Style.size100}>
        <OpenLinkAnchor
          href={formattedString(url, formattedVariables)}
          target={urlTargetBlank ? '_blank' : '_self'}
          className={textColoration}
        >
          <ReactCardFlip isFlipped={isFlipped} flipDirection={'horizontal'} containerClassName={Style.size100}>
            {/* Front (metric) */}
            <div className={Style.flipCardContainer}>
              <OpenLinkAnchor
                href={formattedString(url, formattedVariables)}
                target={urlTargetBlank ? '_blank' : '_self'}
                className={textColoration}
              >
                {/* Pane title */}
                {title !== '' && (
                  <div className={Style.flipCardBackTexts + ' ' + Style.flipCardTitle}>
                    <span>{formattedString(title, formattedVariables)}</span>
                  </div>
                )}
                {/* Pane subtitle */}
                {subtitle !== '' && (
                  <div className={Style.flipCardBackTexts + ' ' + Style.flipCardSubtitle}>
                    <span>{formattedString(subtitle, formattedVariables)}</span>
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
              <span className={Style.flipCardSeverity}>{actualThreshold.severity}</span>
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
