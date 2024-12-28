import React from 'react';

interface StatusMetricProps {
  fontStyle: string;
  children: React.ReactNode;
}

/**
 * Apply font style on metric value and unit
 * @param fontStyle Bold, Italic, Underline
 * @param children Metric value and unit
 */
export const StatusMetric: React.FC<StatusMetricProps> = ({ fontStyle, children }) => {
  const childrenArray = React.Children.toArray(children);
  let style = {};

  switch (fontStyle) {
    case 'Bold':
      style = { fontWeight: 'bold' };
      break;
    case 'Italic':
      style = { fontStyle: 'italic' };
      break;
    case 'Underline':
      style = { textDecoration: 'underline' };
      break;
    default:
      break;
  }

  if (childrenArray[1] && childrenArray[1] !== 'none') {
    return (
      <span style={style}>
        <span id={'card-metric'}>{childrenArray[0]}</span> <span id={'card-unit'}>{childrenArray[1]}</span>
      </span>
    );
  } else {
    return (
      <span style={style}>
        <span id={'card-metric'}>{childrenArray[0]}</span>
      </span>
    );
  }
};
