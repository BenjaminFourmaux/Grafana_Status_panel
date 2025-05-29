# Changelog

## v1.1.1

### Changed

- Fix no values of formattedVariables `metric_name` and `label` on Prometheus
  Datasource. [#18](https://github.com/BenjaminFourmaux/Grafana_Status_panel/issues/18)

## v1.1.0

### Added

- Support for multi number type fields in query result (table)
  - When a query return a table, each number field are considered as a card (multi cards).
  - For each number field, Thresholds are computed.
  - If "Aggregate Queries in single card" is enabled, all number fields from all queries, computer their own Threshold
    and the higher Threshold (by his value) is used for display title, metrics, severity ...
- New formatted string `{{column_name}}` to show the column name when query return a table (prop `name` of field).
- New component `FlipCardNoData` to show "no data" like a `FlipCard` but without threshold background color and severity

### Changed

- Move getting values from query on-top level `StatusPanel` component instead in `FlipCard`. Making `FlipCard` agnostic
  and just accept aggregate query value in props.
- Move formatted string compilation logic from `FlipCard` to `CardWrapper` (above) to make `FlipCard` string agnostic
  and just pass compiled string to props.
- Change "Use 'Disable' color if no data" (option `isGrayOnNoData`) toggle switch to "Display nothing when 'no data'" (
  option `isNothingOnNoData`)
  for display or not "no data" text instead of a card (or show nothing)
- Change how formatted string "labels" variables are getting. Now get labels from prop `labels` of the returned field.
- [_Performance improvement_] Change how `FlipButton` is displaying by using CSS property instead of `useHover` hook.
  This change, reduce the number
  of times the `StatusPanel` component update and performance is improved.
- Change plugin fqdn in demo dashboard after first release on store.

### Removed

- [_Legacy_] remove `useEventListener` hooks. Not used
- [_Legacy_] remove `useHover` hook. No longer used now

## v1.0.1

### Changed

- Update LICENSE and NOTICE files to change code owner and mention the original code owner (Grafana Labs)
- Upgrade `package.json` dependencies to use Grafana `10.4.0`
- Fix tests e2e according to the package upgrade

## v1.0.0

**Breaking Changes**

Make this plugin **more simple and easy to use**.
The plugin now only supports the `number` type of data. The plugin will not work with other types of data.

### Added

- Customizable thresholds (Severity color, Severity text, Value threshold). like the threshold editor of Grafana default
  option
- Select metric unit to be displayed (like the unit selector of Grafana default option)
- Panel subtitle (to display a metric category or whatever you want)
- Panel title and subtitle can be formatted with formatted variables (like Query name `{{query_name}}`, Query value
  aggregate `{{query_value}}` ...).
- Tests End-to-End
- CI/CD pipelines

### Changed

- Fix the bug of non save panel flip state, by adding an option to save the flip state
- Multi panes in one panel
  - Each pane corresponds to a Query
  - Each pane share the same thresholds, unit, and title and subtitle
  - Panes are in grid layout (flexbox).
  - Panes size (height and width, and font size) are responsive according to the panel size

### Removed

- Defined weird thresholds
- Alert system
- Auto scroll feature
- Annotation display mode
- Things that make this plugin not simple to use.

## Fork from [Grafana_Status_panel v2.0.0](https://github.com/grafana/Grafana_Status_panel)
