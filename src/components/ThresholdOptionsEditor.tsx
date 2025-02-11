import React, { useEffect, useState } from 'react';
import { Button, Stack, useTheme2 } from '@grafana/ui';
import { ThresholdConf, ThresholdSet } from './ThresholdSetComponent';
import { StatusFieldOptions } from '../interfaces/statusFieldOptions';
import { StandardEditorProps } from '@grafana/data';

/**
 * Custom editor for set the thresholds
 * @param value Thresholds list from StatusPanelOptions
 * @param onChange Update the thresholds list
 */
export const ThresholdOptionsEditor: React.FC<StandardEditorProps<StatusFieldOptions['thresholds'], any>> = ({
  value,
  onChange,
}) => {
  const theme = useTheme2();

  const [thresholdsList, setThresholdsList] = useState<ThresholdConf[]>(value || []);

  let thresholdId = thresholdsList.length;

  useEffect(() => {
    setThresholdsList(value || []);
  }, [value]);

  // Handlers
  const handleAddThreshold = () => {
    thresholdId = thresholdId + 1;
    const newThreshold: ThresholdConf = {
      id: thresholdId,
      color: theme.visualization.getColorByName('green'),
      value: undefined,
      severity: undefined,
    };
    const newThresholdsList = [...thresholdsList, newThreshold];
    setThresholdsList(newThresholdsList);
    onChange(newThresholdsList);
  };

  const handleRemoveThreshold = (index: number) => () => {
    const newThresholdsList = thresholdsList.filter((obj) => obj.id !== index);
    setThresholdsList(newThresholdsList);
    onChange(newThresholdsList);
  };

  const handleChangeThresholdColor = (index: number) => (color: string) => {
    const newThresholdsList = thresholdsList.map((threshold) => {
      if (threshold.id === index) {
        threshold.color = color;
      }
      return threshold;
    });
    setThresholdsList(newThresholdsList);
    onChange(newThresholdsList);
  };

  return (
    <>
      <Stack direction={'column'}>
        <Button
          variant={'secondary'}
          style={{ width: '100%' }}
          size={'sm'}
          icon={'plus'}
          onClick={handleAddThreshold}
          fullWidth
        >
          Add threshold
        </Button>
        {thresholdsList
          .slice()
          .reverse()
          .map((threshold, index) => (
            <ThresholdSet
              threshold={threshold}
              handleDeleteThreshold={handleRemoveThreshold(threshold.id)}
              handleChangeColor={handleChangeThresholdColor(threshold.id)}
              key={threshold.id}
            />
          ))}
      </Stack>
    </>
  );
};
