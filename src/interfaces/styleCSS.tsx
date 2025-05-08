import { css } from '@emotion/css';

/**
 * CSS class style
 * for better code readability
 */
export const Style = {
  wrapperContainer: css({ boxSizing: 'border-box', zIndex: 10 }),
  row: css({
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'auto',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  col: css({ flexBasis: 'auto', flexGrow: '0', maxWidth: '100%', padding: '5px' }),
  size100: css({ width: '100%', height: '100%' }),
  flipButton: css({
    position: 'absolute',
    bottom: '1.2rem',
    right: '1.2rem',
    display: 'none',
    '.status-panel-container:hover &': { display: 'block' },
  }),
  /* Flip Card */
  flipCardContainer: css({
    height: '100%',
    minHeight: '142px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    containerType: 'inline-size',
    overflow: 'hidden',
    textAlign: 'center',
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
  urlNotchContainer: css({
    position: 'absolute',
    top: '0',
    left: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  urlIcon: css({
    color: 'white',
    fontSize: '1.5rem',
    position: 'absolute',
    top: '2px',
    left: '2px',
    zIndex: 1,
  }),
  urlNotchTriangle: css({
    width: '0',
    height: '0',
    opacity: 0.5,
    borderTop: '35px solid black',
    borderRight: '35px solid transparent',
    position: 'relative',
    zIndex: 0,
  }),
  /* help modal */
  helpUl: css({ marginLeft: '1rem', listStylePosition: 'inside' }),
  variableContent: css({ marginTop: '1rem' }),
};
