# Changelog

## v0.1.0 (2020-03-21)

- Use `google-spreadsheet` v3 - stops using deprecated Google Spreadsheets v3 API
- Added partial and case-insensitive matching for worksheet titles
- Improve error messages when cannot find matching worksheet
- Delay the intermediate response ("Hold on, I'm checking...") for 2 seconds to avoid spamming the chat

## v0.0.1 (2020-02-02)

- Add fetching tasks from Google Spreadsheets
- Add "help" command
- Add CI
