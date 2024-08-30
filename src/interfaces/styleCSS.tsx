import { css } from '@emotion/css';

/**
 * CSS class style
 * for better code readability
 */
export const Style = {
  wrapperContainer: css({ boxSizing: 'border-box', zIndex: 10 }),
  row: css({ display: 'flex', flexWrap: 'wrap' }),
  col: css({ flexBasis: 'auto', flexGrow: '0', maxWidth: '100%', padding: '5px' }),
  flipButton: css({ position: 'absolute', bottom: '1.2rem', right: '1.2rem' }),
  /* Flip Card */
  flipCardFrontContainer: css({
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    containerType: 'inline-size',
  }),
  flipCardBackContainer: css({ display: 'flex', flexDirection: 'column' }),
  flipCardBackFlexContainer: css({
    flex: '1 0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    containerType: 'inline-size',
  }),
  flipCardBackTexts: css({
    minHeight: '1px',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  }),
  flipCardTitle: css({ fontSize: '12cqw' }),
  flipCardSubtitle: css({ fontSize: '9.5cqw' }),
  flipCardMetric: css({ fontSize: '12.5cqw' }),
  flipCardSeverity: css({ fontSize: '14cqw' }),
};
