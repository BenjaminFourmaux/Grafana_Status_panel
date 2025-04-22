import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { css } from '@emotion/css';
import { Style } from '../interfaces/styleCSS';
import { OpenLinkAnchor } from './OpenLinkAnchor';
import { Icon } from '@grafana/ui';

interface FlipCardProps {
  width: number;
  height: number;
  title: string;
  subtitle: string;
  url: string;
  urlTargetBlank: boolean;
  showMetric: boolean;
  fontStyle: string;
  cornerRadius: string;
  isFlipped: boolean;
}

export const FlipCardNoData: React.FC<FlipCardProps> = ({
  isFlipped,
  title,
  subtitle,
  url,
  urlTargetBlank,
  showMetric,
  fontStyle,
  cornerRadius,
  width,
  height,
}) => {
  // Retrieve colors
  const textColoration = css({ color: 'white' });

  return (
    <div
      className={
        css({ width, height: '100%', minWidth: '142px', borderRadius: cornerRadius, position: 'relative' }) +
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
                    <span id={'card-metric'}>no data</span>
                  </div>
                )}
              </OpenLinkAnchor>
            </div>

            {/* Back (severity) */}
            <div className={Style.flipCardContainer}>
              <span id={'card-severity'} className={Style.flipCardSeverity}>
                no data
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
