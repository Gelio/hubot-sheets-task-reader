# Changelog

## v1.0.0 (2020-03-22)

### Features

- Add "show all" command for showing task assignments from all worksheets
- Add "show (worksheet name)" shorthand command

  Alias for "who is responsible for (worksheet name)?"

- Improve bot output. Bot will respond differently when there is nobody assigned to a task
- Improve error reporting when an unknown error was encountered

### Engineering

- Use `ScriptExecutor`s for encapsulating high-level bot's logic
- Simplify functions related to data processing
- Make `tsconfig.json` stricter (does not allow unused variables and parameters)

## v0.1.0 (2020-03-21)

- Use `google-spreadsheet` v3 - stops using deprecated Google Spreadsheets v3 API
- Added partial and case-insensitive matching for worksheet titles
- Improve error messages when cannot find matching worksheet
- Delay the intermediate response ("Hold on, I'm checking...") for 2 seconds to avoid spamming the
  chat

## v0.0.1 (2020-02-02)

- Add fetching tasks from Google Spreadsheets
- Add "help" command
- Add CI
