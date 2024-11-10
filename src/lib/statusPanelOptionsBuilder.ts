import { PanelOptionsEditorBuilder } from '@grafana/data';
import { StatusPanelOptions } from '../interfaces/statusPanelOptions';
import { FormattedStringHelpEditor } from '../components/FormattedStringHelpEditor';
import { OPTIONS_CATEGORY } from './constant';

/**
 * PanelOptions are specific options for the panel that you can configure to customize the panel's behavior and appearance.
 * They are generally used for global panel settings
 * @param builder
 */
export const statusPanelOptionsBuilder = (builder: PanelOptionsEditorBuilder<StatusPanelOptions>) =>
  builder
    .addTextInput({
      path: 'title',
      name: 'Title',
      description: '',
      defaultValue: '',
      category: [OPTIONS_CATEGORY],
      settings: { expandTemplateVars: true },
    })
    .addTextInput({
      path: 'subtitle',
      name: 'Subtitle',
      description: '',
      defaultValue: '',
      category: [OPTIONS_CATEGORY],
      settings: { expandTemplateVars: true },
    })
    .addTextInput({
      path: 'url',
      name: 'URL',
      description: '',
      defaultValue: '',
      category: [OPTIONS_CATEGORY],
      settings: { expandTemplateVars: true, placeholder: 'https://' },
    })
    .addBooleanSwitch({
      path: 'urlTargetBlank',
      name: 'Open URL in new tab',
      defaultValue: false,
      category: [OPTIONS_CATEGORY],
      showIf: ({ url }) => !!url,
    })
    .addCustomEditor({
      id: 'formatted string help',
      name: '',
      description: 'In above text fields, you can use formatted string to include variables. Useful for multi panes',
      path: 'string_help',
      category: [OPTIONS_CATEGORY],
      editor: FormattedStringHelpEditor,
    })
    .addBooleanSwitch({
      path: 'aggregateQueries',
      name: 'Aggregate queries in a single panel',
      defaultValue: false,
      category: [OPTIONS_CATEGORY],
    })
    // .addTextInput({
    //   path: 'namePrefix',
    //   name: 'Remove Prefix',
    //   defaultValue: '',
    //   description: 'A prefix to remove from the name (helpful when repeating panel over a template)',
    //   category: OPTIONS_CATEGORY],
    // })
    .addTextInput({
      path: 'cornerRadius',
      name: 'Corner Radius',
      defaultValue: '0rem',
      description: 'The corner radius to apply the panel. Values are used for the border-radius CSS attribute.',
      category: [OPTIONS_CATEGORY],
    })
    .addBooleanSwitch({
      path: 'flipCard',
      name: 'Flip Panel',
      defaultValue: false,
      category: [OPTIONS_CATEGORY],
    })
    .addNumberInput({
      path: 'flipTime',
      name: 'Flip interval',
      defaultValue: 5,
      category: [OPTIONS_CATEGORY],
      showIf: ({ flipCard }) => flipCard,
    })
    .addRadio({
      path: 'flipState',
      name: 'Stay on',
      defaultValue: false,
      settings: {
        options: [
          {
            label: 'Front',
            value: false,
          },
          {
            label: 'Back',
            value: true,
          },
        ],
      },
      category: [OPTIONS_CATEGORY],
      showIf: ({ flipCard }) => !flipCard,
    })
    .addBooleanSwitch({
      path: 'isGrayOnNoData',
      name: "Use 'Disable' color if no data",
      defaultValue: false,
      category: [OPTIONS_CATEGORY],
    });
