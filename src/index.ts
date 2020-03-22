import { Robot, Response, TextMessage } from 'hubot';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import { formatTask } from './tasks/format-task';
import { getTasksFromWorksheet } from './tasks/get-tasks-from-worksheet';
import { ScriptConfiguration, getConfiguration } from './get-configuration';
import { handleScriptError, ScriptError } from './script-error';
import { getAllWorksheetsWithTaskAssignments } from './tasks/get-tasks-from-all-worksheets';
import { getSpreadsheet } from './spreadsheet/get-spreadsheet';

let scriptConfiguration: ScriptConfiguration;
try {
  scriptConfiguration = getConfiguration(process.env, require);
} catch (error) {
  console.log('Error while reading initial script configuration', error);
  process.exit(1);
}

module.exports = (robot: Robot<any>) => {
  robot.respond(/help/i, (res) => {
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${scriptConfiguration.spreadsheetKey}`;

    res.reply(
      [
        `If you want to check who is responsible for some event in ${spreadsheetUrl}, ask me:`,
        '> who is responsible for (event name)?',
        'For example: who is responsible for Sprint Planning?',
        'The event names are worksheet titles. Keep I mind that I will try to find the right worksheet even when you only specify a part of the name :)',
        '',
        'You can also ask me for task assignments for all events/worksheets:',
        '> show all',
      ].join('\n'),
    );
  });

  robot.respond(/who is responsible for ([^?]*)\??/i, async (res) => {
    const worksheetSearchPhrase: string | undefined = res.match[1];

    if (!worksheetSearchPhrase) {
      res.reply(
        'Errr... Did you forget to fill in the name of the worksheet? Try "who is responsible for ABC?"',
      );
      return;
    }

    const executionPromise = getTasksFromWorksheet(
      scriptConfiguration,
      worksheetSearchPhrase,
    )
      .then(
        ({ tasks, worksheetName }) =>
          [`Got it! For ${worksheetName}:`, ...tasks.map(formatTask)].join(
            '\n',
          ),
        handleScriptError,
      )
      .then((responseMessage) => res.reply(responseMessage));

    postIntermediateResponseWhenExecutionInProgressForSomeTime(
      res,
      executionPromise,
      2000,
    );
  });

  robot.respond(/show all/i, async (res) => {
    const showAllTaskAssignmentsExecutor: ScriptExecutor = (spreadsheet) =>
      getAllWorksheetsWithTaskAssignments(
        spreadsheet,
      ).then((worksheetsWithTasks) =>
        [
          "I've got assignments for all tasks :)",
          ...worksheetsWithTasks.map(({ tasks, worksheetName }) =>
            [`For ${worksheetName}:`, ...tasks.map(formatTask)].join('\n'),
          ),
        ].join('\n\n'),
      );

    const executionPromise = runScriptExecutorWithSpreadsheet(
      scriptConfiguration,
      res,
    )(showAllTaskAssignmentsExecutor, handleScriptError);

    postIntermediateResponseWhenExecutionInProgressForSomeTime(
      res,
      executionPromise,
      2000,
    );
  });
};

/**
 * If the response from spreadsheet has not been sent within some time, send an intermediate
 * response.
 * Otherwise, do not send anything to avoid sending too many messages.
 */
function postIntermediateResponseWhenExecutionInProgressForSomeTime(
  response: Response<any, TextMessage>,
  executionPromise: Promise<any>,
  intermediateResponseDelay: number,
) {
  const intermediateResponseTimeoutId = setTimeout(() => {
    response.reply("Hold on, I'm checking...");
  }, intermediateResponseDelay);

  executionPromise.then(() => {
    clearTimeout(intermediateResponseTimeoutId);
  });
}

type ScriptExecutor = (spreadsheet: GoogleSpreadsheet) => Promise<string>;
type ScriptErrorHandler = (scriptError: ScriptError) => string;

const runScriptExecutorWithSpreadsheet = (
  scriptConfiguration: ScriptConfiguration,
  response: Response<any, TextMessage>,
) => async (
  scriptExecutor: ScriptExecutor,
  scriptErrorHandler: ScriptErrorHandler,
) =>
  getSpreadsheet(scriptConfiguration)
    .then(scriptExecutor)
    .catch(scriptErrorHandler)
    .then((responseMessage) => response.reply(responseMessage));
