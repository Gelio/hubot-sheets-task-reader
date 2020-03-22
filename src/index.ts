import { Robot } from 'hubot';

import { formatTask } from './tasks/format-task';
import { getTasksFromWorksheet } from './tasks/get-tasks-from-worksheet';
import { ScriptConfiguration, getConfiguration } from './get-configuration';
import { handleScriptError } from './script-error';
import { getAllWorksheetsWithTaskAssignments } from './tasks/get-tasks-from-all-worksheets';
import { ScriptExecutor } from './script-execution/types';
import { postIntermediateResponseWhenExecutionInProgressForSomeTime } from './script-execution/post-intermediate-response';
import { runScriptExecutorWithIntermediateResponse } from './script-execution/run-script-executor-with-intermediate-response';

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

    runScriptExecutorWithIntermediateResponse(
      scriptConfiguration,
      res,
      showAllTaskAssignmentsExecutor,
      handleScriptError,
    );
  });
};
