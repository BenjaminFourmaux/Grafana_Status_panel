import React from 'react';
import { Button, IconButton, Modal } from '@grafana/ui';
import { Style } from '../interfaces/styleCSS';

export const FormattedStringHelpEditor: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

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
              <code>{'{{metric_name}}'}</code> - (in prometheus) The metric name of the query expression
            </li>
            <li>
              <code>{'{{label:<label_name>}}'}</code> - (in prometheus) Get the value of the label by his name. Must be
              present in the query expression
            </li>
          </ul>
          <br />
          You can add multiple variables in the same text field.
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
