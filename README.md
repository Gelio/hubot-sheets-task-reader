# Hubot Google Sheets task reader

[A Hubot script](https://hubot.github.com/docs/scripting/) that responds with the list of people
assigned to a given task.

The list of tasks and assignments is read from Google Sheets.

This works well for notification abou tasks that should be performed periodically in a round-robin
manner. Moving the _marker_ to the next person should be done manually. This bot only reads out the
assignments.

## Task worksheet structure

The worksheet with tasks should contain the following columns:

1. Name
2. Chat username

Keep in mind that the names of those columns should be exactly as written above.

Then, each task should have a separate column. The task name is the header of the column.

The bot assumes that assignment is done by having any marker in a cell. There may be multiple
markers in a column if a task should be performed by more than 1 person.

The spreadsheet can contain multiple worksheets. Each can be referenced individually by name.

## Example worksheet structure

| Name           | Chat username   | Host | Minutes owner |
| -------------- | --------------- | ---- | ------------- |
| John Wick      | johnny          |      |               |
| Joe Goldberg   | will.bettleheim | x    |               |
| Love Quinn     | love            |      |               |
| Forty Quinn    | forty.quinn     | x    |               |
| Candace        | candace         |      | x             |
| Luke Skywalker | luke            |      |               |

### Bot's response

Assuming the worksheet name is _Hollywood meeting_:

> The list of tasks for Hollywood meeting:
> Host - @will.bettleheim (Joe Goldberg), @forty.quinn (Forty Quinn)
> Minutes owner - @candace (Candace)

## Usage

The bot can be invoked with the following command:

> @botname who is responsible for (worksheet name)?

for example:

> @botname who is responsible for Hollywood meeting?

And the bot will read out the assignments in the _Hollywood meeting_ worksheet.

## Installation

This sections lists the steps required to install the script.

### Prerequisites

1. Node 10.x+
2. npm v6+

### Building the script

To build the script, run the following commands:

```sh
npm install
npm run build
```

Then, the script should be available in `dist/index.js`.

### Copying the script to Hubot

Copy the `dist/index.js` script to `<your hubot instance>/scripts/sheets-reader.js`.

### Adding script's dependencies to Hubot

Add the following line to the `dependencies` object in your Hubot's `package.json`:

```json
  "google-spreadsheet": "^3.0.10"
```

### Configuring environment variables

The following environment variables should be set before Hubot is started:

1. `HUBOT_GOOGLE_SHEETS_CREDENTIALS_PATH`

   The path to the Google Sheets credentials file.

   To generate the credentials file, follow [the instructions in the `google-spreadsheet` package](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account).

   Don't forget to share the spreadsheet with the service account (by sharing it with the generated
   account's e-mail).

2. `HUBOT_SPREADSHEET_KEY`

   The ID of the spreadsheet that the bot should read.

   It can be extracted from the spreadsheet's URL:

   [https://docs.google.com/spreadsheets/d/here is the spreadsheet key/edit#gid=0]()

## Contributing

Feel free to contribute by raising a Pull Request or creating an issue for discussion.
