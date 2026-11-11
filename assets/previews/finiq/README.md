# FinIQ — Zebrafish Research Studio

FinIQ is a lightweight, browser-based dashboard for exploring zebrafish embryonic development measurements. Import a study CSV to inspect observations, compare experimental groups across developmental stages, and export a descriptive research summary.

> **Data note:** The built-in dataset is simulated for demonstration. It is not experimental data and should not be used to draw scientific conclusions.

## Features

- View study-level summaries and measurement trends across developmental stages.
- Search and filter observations by sample, group, and stage.
- Compare group means and sample standard deviations for body length, heart rate, and eye diameter.
- Import study data with a CSV column-mapping wizard.
- Download a CSV template, export the current dataset, or download a Markdown research report.
- Keep imported data and report provenance in the current browser.

## Run locally

FinIQ is a static web app and has no build step or package installation.

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.

To serve it locally instead, run this command from the project folder if Python is installed:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Importing data

Use **Import CSV** in the app. The first row should contain column headers. FinIQ will try to match common header names and lets you adjust the column mapping before importing.

The expected fields are:

| Field | Required | Example |
|---|---|---|
| `sample_id` | No | `ZF-001` |
| `group` | Yes | `Control` |
| `stage` | Yes | `24 hpf` |
| `body_length_mm` | Yes | `1.25` |
| `heart_rate_bpm` | No | `115` |
| `eye_diameter_mm` | No | `0.180` |

Download the CSV template from the **Dataset** view for a ready-to-fill example. Optional measurements may be left blank.

## Data and analysis notes

- Imported observations and the study source entered in the report view are stored in browser local storage; they are not uploaded to a server.
- Data is stored only in the browser profile used for the app. Clearing browser storage removes the saved import and source.
- Group summaries use means and sample standard deviations. Missing measurements are excluded from the corresponding summaries.
- FinIQ provides descriptive statistics only; it does not perform significance testing or establish causality. Check study methods, units, and biological replicates before interpreting results.

## Built with

HTML, CSS, and vanilla JavaScript. No external libraries or backend are required.
