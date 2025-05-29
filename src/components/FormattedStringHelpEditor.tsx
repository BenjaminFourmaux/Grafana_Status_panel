import React, { useState } from 'react';
import { Button, Collapse, IconButton, Modal, Text } from '@grafana/ui';
import { Style } from '../interfaces/styleCSS';
import { FormattedStringVariables } from '../interfaces/formattedStringVariables';
import { STORAGE_FORMATTED_STRING_VARIABLES_LIST } from 'lib/constant';

export const FormattedStringHelpEditor: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const variablesContent: FormattedStringVariables[] = JSON.parse(
    localStorage.getItem(STORAGE_FORMATTED_STRING_VARIABLES_LIST) || '[{}]'
  );

  return (
    <>
      <IconButton name={'question-circle'} onClick={() => setModalOpen(true)} aria-label={'help'} />

      <Modal
        title={'Formatted string Help'}
        closeOnEscape={true}
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
      >
        <div>
          Formatted strings are used to include dynamics values into string (title, subtitle, url). Is pretty useful if
          you have multiple panes, like the server name, the metric name used.
          <br />
          Variables are included in the string by using double brackets <code>{'{{variable_name}}'}</code> syntax.
          <br />
          <br />
          List of available variables:
          <ul className={Style.helpUl}>
            <li>
              <code>{'{{query_name}}'}</code> - The name of the query (A, B, C ... by default)
            </li>
            <li>
              <code>{'{{query_value}}'}</code> - The returned value of the query (with selected aggregation)
            </li>
            <li>
              <code>{'{{query_index}}'}</code> - The positional index of the query (start 0)
            </li>
            <li>
              <code>{'{{column_name}}'}</code> - The name of the column if query returns a table. (like Zabbix)
            </li>
            <li>
              <code>{'{{$__interval}}'}</code> - The <i>$__interval</i> Grafana&apos;s global variable, represents the
              selected time interval for fetching data.
            </li>
            <li>
              <code>{'{{time}}'}</code> - The time of last sent query
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp; You can specify the date time format to display, by adding format string. For
              example:
              <ul>
                <div
                  dangerouslySetInnerHTML={{
                    __html: "<!-- <li><code{'{{time DD/MM/YYYY}}'}</code> to have 11/01/2003</li>",
                  }}
                />
                <li>
                  <code>{'{{time DD-MM-YYYY HH:mm:ss}}'}</code> to have 31-06-2024 12:14:36
                </li>
                <li>
                  <code>{'{{time HH:mm:ss}}'}</code> to have 12:14:36
                </li>
                <li>
                  <a href={'https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format'}>
                    <u>see more format</u>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <code>{'{{metric_name}}'}</code> - The metric name of the query expression
            </li>
            <li>
              <code>{'{{label:<label_name>}}'}</code> - Get the value of the label by its name. Must be present in the
              query expression
            </li>
          </ul>
          <br />
          You can add multiple variables in the same text field
          <Collapse
            label="Variable content"
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            className={Style.variableContent}
          >
            <p>A example of available values in formatted string</p>
            <Text color="primary" variant="body">
              query_name: <code>{variablesContent[0].queryName}</code>
              <br />
              query_value: <code>{variablesContent[0].queryValue}</code>
              <br />
              query_index: <code>{variablesContent[0].queryIndex}</code>
              <br />
              column_name: <code>{variablesContent[0].columnName}</code>
              <br />
              $__interval: <code>{variablesContent[0].interval}</code>
              <br />
              time: <code>{variablesContent[0].time}</code>
              <br />
              metric_name: <code>{variablesContent[0].metricName}</code>
              <br />
              labels:{' '}
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(variablesContent[0].labels, null, 4)}</pre>
              <br />
            </Text>
          </Collapse>
        </div>
        <Modal.ButtonRow>
          <Button variant={'secondary'} onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.ButtonRow>
      </Modal>
    </>
  );
};
