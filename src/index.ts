import { Robot } from 'hubot';

import { ScriptConfiguration, getConfiguration } from './get-configuration';
import { handleScriptError } from './script-error';
import { runScriptExecutorWithIntermediateResponse } from './script-execution/run-script-executor-with-intermediate-response';
import {
  showAllTaskAssignmentsExecutor,
  showTaskAssignmentsInWorksheetExecutorFactory,
} from './script-execution/executors';

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
        "If you don't like typing, the shorter version is:",
        '> show (event name)',
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

    runScriptExecutorWithIntermediateResponse(
      scriptConfiguration,
      res,
      showTaskAssignmentsInWorksheetExecutorFactory(worksheetSearchPhrase),
      handleScriptError,
    );
  });

  robot.respond(/show (.*)/i, async (res) => {
    const rawSearchPhrase: string | undefined = res.match[1];

    const scriptExecutor = (function getScriptExecutor() {
      if (!rawSearchPhrase) {
        return;
      }

      const searchPhrase = rawSearchPhrase.trim().toLowerCase();

      if (searchPhrase === 'all') {
        return showAllTaskAssignmentsExecutor;
      }

      return showTaskAssignmentsInWorksheetExecutorFactory(rawSearchPhrase);
    })();

    if (!scriptExecutor) {
      res.reply(
        [
          "I don't know what you are looking for :/ Try:",
          '> show (event name)',
          'or',
          '> show all',
        ].join('\n'),
      );
      return;
    }

    runScriptExecutorWithIntermediateResponse(
      scriptConfiguration,
      res,
      scriptExecutor,
      handleScriptError,
    );
  });
};
