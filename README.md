# Status Panel

![Grafana Version](https://img.shields.io/badge/%3E%3D10.4.0-version?logo=grafana&logoColor=F47A20&label=Grafana&color=F47A20)

A simple plugin to display the state of your resource.

## Overview

Status Panel is a Grafana plugin designed to visualize the status of resources in a straightforward and customizable
color card format. The status is based on the resource's metrics or health checks queries, with **severity thresholds**
that can be defined by the user.

## Features

- **Customizable Status Cards**: Display resource status using color-coded cards that reflect severity levels based on
  user-defined thresholds.
- **Titles and Subtitles**: Add titles and subtitles to each status card to clarify resource information.
- **Clickable Cards with URLs**: Configure a URL to open when clicking on a status card, enabling quick navigation to
  additional details or resources.
- **Metric Display and Units**: Optionally display metrics on the cards and define units for enhanced readability.
- **Multiple Cards per Panel**: Add queries to display multiple cards in a single panel.
- **Individual Card Customization**: Use override fields for advanced customization of each card independently.

## Compatibility

Work for with all datasources as long as it returns a `number` field, like Prometheus, Loki, InfluxDB ...

## Screenshots

This plugin supports autoscaling for best-fit sizing and font size of each cards to the panel size.

### Multi cards in one panel

![](https://raw.githubusercontent.com/BenjaminFourmaux/Grafana_Status_panel/refs/heads/master/src/img/screenshots/multi-card.png)

## Documentation
