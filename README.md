# Hubot Google Sheets task reader

[A Hubot script](https://hubot.github.com/docs/scripting/) that responds with the list of people
assigned to a given task.

The list of tasks and assignments is read from Google Sheets.

This works well for notification abou tasks that should be performed periodically in a round-robin
manner. Moving the _marker_ to the next person should be done manually. This bot only notifies.

## Task sheet structure

The sheet with tasks should contain the following columns:

1. Name
2. Chat username

Keep in mind that the names of those columns should be exactly as written above.

Then, each task should have a separate column. The task name is the header of the column.

The bot assumes that assignment is done by having any marker in a cell. There may be multiple
markers in a column if a task should be performed by more than 1 person.

## Example sheet structure

| Name           | Chat username   | Host | Minutes owner |
| -------------- | --------------- | ---- | ------------- |
| John Wick      | johnny          |      |               |
| Joe Goldberg   | will.bettleheim | x    |               |
| Love Quinn     | love            |      |               |
| Forty Quinn    | forty.quinn     | x    |               |
| Candace        | candace         |      | x             |
| Luke Skywalker | luke            |      |               |

### Bot response

Assuming the spreadsheet name is _Hollywood meeting_:

> The list of tasks for Hollywood meeting:
> Host - @will.bettleheim (Joe Goldberg), @forty.quinn (Forty Quinn)
> Minutes owner - @candace (Candace)

## Usage

The bot can be invoked with the following command:

> @botname who is responsible for (event name)?

for example:

> @botname who is responsible for Hollywood meeting?
