# Status Panel

![Grafana Version](https://img.shields.io/badge/%3E%3D10.4.0-version?logo=grafana&logoColor=F47A20&label=Grafana&color=F47A20)
[![Pipeline-Test-e2e](https://github.com/BenjaminFourmaux/Grafana_Status_panel/actions/workflows/test-e2e.yml/badge.svg)](https://github.com/BenjaminFourmaux/Grafana_Status_panel/actions/workflows/test-e2e.yml)
[![Grafana-Plugin-Validator](https://github.com/BenjaminFourmaux/Grafana_Status_panel/actions/workflows/validator.yml/badge.svg)](https://github.com/BenjaminFourmaux/Grafana_Status_panel/actions/workflows/validator.yml)

A simple plugin to display the state of your resource.

## Overview

Status Panel is a Grafana plugin designed to visualize the status of resources in a straightforward and customizable
color card format.
\
The status is based on the resource's metrics or health checks queries, with **severity thresholds**
that can be defined by the user.

## Features

- **Customizable Status Cards**: Display resource status using color-coded cards that reflect severity levels based on
  user-defined thresholds.
- **Titles and Subtitles**: Add titles and subtitles to each status card to clarify resource information.
- **Clickable Cards with URLs**: Configure a URL to open when clicking on a status card, enabling quick navigation to
  additional details or resources.
- **Metric Display and Units**: Optionally display metrics on the cards and define units for enhanced readability.
- **Multiple Cards per Panel**: Add queries to display multiple cards in a single panel.
- **Support for Table**: If query return a table (array of number field), each column is considered as a card 
- **Individual Card Customization**: Use override fields for advanced customization of each card independently.

## Compatibility

Work for with all datasources as long as it returns a `number` field, like Prometheus, Loki, InfluxDB ...

## Screenshots

This plugin supports autoscaling for best-fit sizing and font size of each cards to the panel size.

### Card variant options

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/main/src/img/screenshots/card-variants.png)

### Multi cards in one panel

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/main/src/img/screenshots/multi-card.png)

## Documentation

This panel provides some customization options and are searchable from the menu.

### Options

You can customize the panel with the following options:

- **Title**: display the title of the card
- **Subtitle**: display the subtitle of the card
- **URL**: URL to open when clicking on the card
  - (if URL) **Open URL in new tab**: choose if the URL should be open in a new tab
- **Aggregate queries in a single card**: Aggregate all queries in one card
- **Corner Radius**: set the corner radius of the card (with css attribute)
- **Flip Card**: set if card do a flip animation
  - (if not Flip Card) **Stay on**: select the side of the card to display
  - (if Flip Card) **Flip interval**: set the time in seconds to flip the card
- **Display nothing when 'no data'**: if no data is returned by the query, choose if you want a card empty card marked "no data" (disable) or show nothing (enable)

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/main/src/img/doc-options.png)

#### String variables

For text fields (Title, Subtitle, URL), you can use string formatted variables, to make the text more dynamic.

- `{{query_name}}`: will be replaced by the query name (A, B, C, ... by default)
- `{{query_value}}`: will be replaced by the value of the query (calculate with the selected aggregation)
- `{{query_index}}`: will be replaced by the index of the query (0, 1, 2, ... by default)
- `{{column_name}}`: will be replaced by the column name if query return a table
- `{{$__interval}}`: will be replaced by the interval of the query
- `{{time}}`: will be replaced by the sending query time. You can specify the format with `{{time format}}` (see
  [EMACS - Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format))
  - `{{time DD-MM-YYYY HH:mm:ss}}`: format the query time to `DD-MM-YYYY HH:mm:ss` like `01-01-2022 00:00:00`
  - `{{time HH:mm:ss}}`: format the query time to `HH:mm:ss` like `12:14:36`
- `{{metric_name}}`: (for Prometheus) will be replaced by the metric name
- `{{label:<label_name>}}`: (for Prometheus) get the value of the label by his name. Must be present in the query
  expression

You can add multiple variables in the same field, like `{{query_name}} - {{query_value}}`

### Display options

You can customize the apparence of the text with the following options:

- **Aggregation**: Calculate method of the query value, used for threshold calculation
  - **Last**: (default) get the last value of the time range, returned by the query
  - **First**: get the first value of the time range, returned by the query
  - **Max**: get the maximum value of the time range, returned by the query
  - **Min**: get the minimum value of the time range, returned by the query
  - **Sum**: get the sum of the values of the time range, returned by the query
  - **Avg**: get the average of the values of the time range, returned by the query
  - **Count**: get the number of values of the time range, returned by the query
  - **Delta**: get the difference between the first and the last value of the time range, returned by the query
- **Display value metric**: show the value of the query on the card
  - **Metric font format**: set the style of the metric text (bold, italic, underline, ...)
  - **Metric Unit**: set the unit of the metric value (like `ms`, `B`, `Gbits/s`, ...)

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/main/src/img/doc-display_options.png)

### Thresholds

You can define thresholds to change the color and the severity depending on the query value by selected aggregation.

Thresholds are calculated if the query value is greater or equal to the threshold value.

example:

```python
query_value = 10

threshold_1 = 1
threshold_2 = 5
threshold_3 = 15
threshold_4 = 20

# Oredered thresholds descending from the highest to the lowest
if query_value >= threshold_4:
    select_threshold = threshold_4
elif query_value >= threhold_3:
    select_threshold = threshold_3
elif query_value >= threshold_2:
    select_threshold = threshold_2 # <= in this example, this is the selected threshold
elif query_value >= threshold_1:
    select_threshold = threshold_1
else:
    select_threshold = default

# Explication
threshold_3 > query_value >= threshold_2
```

Thresholds are defined by the following options:

- **color**: set the color of the card, with the color picker
- **severity**: text to display on the card, when the threshold is reached
- **value**: value of the threshold (only number)

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/main/src/img/doc-thresholds.png)

### Overridden fields

If you want to customize the card individually, you can use the overridden fields.

- **Title**
- **Subtitle**
- **URL**
- **Open URL in new tab**
- **Aggregation**
- **Metric Unit**
- **Thresholds**

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/main/src/img/doc-overridden_fields.png)
