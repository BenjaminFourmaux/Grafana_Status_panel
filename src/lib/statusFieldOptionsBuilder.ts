import { Field, FieldConfigEditorBuilder, FieldOverrideContext } from '@grafana/data';
import { StatusFieldOptions } from '../interfaces/statusFieldOptions';
import { DISPLAY_OPTIONS_CATEGORY, OPTIONS_CATEGORY, THRESHOLDS_CATEGORY } from './constant';
import { ThresholdOptionsEditor } from '../components/ThresholdOptionsEditor';

/**
 * FieldConfigs are field configuration options that allow for the customization of individual data fields within the panel.
 * They are used for settings specific to data fields and can be overridden by the user.
 * @param builder
 */
export const statusFieldOptionsBuilder = (builder: FieldConfigEditorBuilder<StatusFieldOptions>) =>
  builder
    .addSelect({
      path: 'aggregation',
      name: 'Aggregation',
      description: 'What to do if the query returns multiple data points. Used for threshold calculation',
      defaultValue: 'last',
      settings: {
        options: [
          { label: 'Last', value: 'last' },
          { label: 'First', value: 'first' },
          { label: 'Max', value: 'max' },
          { label: 'Min', value: 'min' },
          { label: 'Sum', value: 'sum' },
          { label: 'Avg', value: 'mean' },
          { label: 'Count', value: 'count' },
          { label: 'Delta', value: 'delta' },
        ],
      },
      category: [DISPLAY_OPTIONS_CATEGORY],
    })
    .addBooleanSwitch({
      path: 'displayValueMetric',
      name: 'Display value metric',
      description: '',
      defaultValue: true,
      hideFromOverrides: true,
      category: [DISPLAY_OPTIONS_CATEGORY],
    })
    .addSelect({
      path: 'fontFormat',
      name: 'Metric font format',
      description: 'The metric text font format',
      hideFromOverrides: true,
      defaultValue: 'Regular',
      settings: {
        options: [
          { label: 'Regular', value: 'Regular' },
          { label: 'Bold', value: 'Bold' },
          { label: 'Italic', value: 'Italic' },
        ],
      },
      category: [DISPLAY_OPTIONS_CATEGORY],
      showIf: ({ displayValueMetric }) => displayValueMetric,
    })
    .addUnitPicker({
      path: 'metricUnit',
      name: 'Metric Unit',
      defaultValue: '',
      settings: undefined,
      category: [DISPLAY_OPTIONS_CATEGORY],
      showIf: ({ displayValueMetric }) => displayValueMetric,
    })
    /* ---- Text options ---- */
    .addTextInput({
      path: 'title',
      name: 'Title',
      description: '',
      defaultValue: '',
      hideFromDefaults: true,
      category: [OPTIONS_CATEGORY],
      settings: { expandTemplateVars: true },
    })
    .addTextInput({
      path: 'subtitle',
      name: 'Subtitle',
      description: '',
      defaultValue: '',
      hideFromDefaults: true,
      category: [OPTIONS_CATEGORY],
      settings: { expandTemplateVars: true },
    })
    .addTextInput({
      path: 'url',
      name: 'URL',
      description: '',
      defaultValue: '',
      hideFromDefaults: true,
      category: [OPTIONS_CATEGORY],
      settings: { expandTemplateVars: true, placeholder: 'https://' },
    })
    .addBooleanSwitch({
      path: 'urlTargetBlank',
      name: 'Open URL in new tab',
      defaultValue: false,
      hideFromDefaults: true,
      category: [OPTIONS_CATEGORY],
    })
    /* ---- Thresholds options ---- */
    .addCustomEditor({
      id: 'thresholds',
      name: 'Thresholds',
      description: 'Add thresholds to display different status on the panel depending on the query result',
      path: 'thresholds',
      category: [THRESHOLDS_CATEGORY],
      override: ThresholdOptionsEditor,
      process(value: any, context: FieldOverrideContext, settings: any): any {},
      shouldApply(field: Field): boolean {
        return true;
      },
      editor: ThresholdOptionsEditor,
      settings: { expandTemplateVars: true },
      defaultValue: [
        {
          id: 1,
          color: '#73bf69',
          value: undefined,
          severity: 'Base',
        },
      ],
    });
