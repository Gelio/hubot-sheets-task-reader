import { Robot, Response, TextMessage } from 'hubot';

import { formatTask } from './tasks/format-task';
import { getTasksFromWorksheet } from './tasks/get-tasks-from-worksheet';
import { ScriptConfiguration, getConfiguration } from './get-configuration';
import { handleScriptError } from './script-error';

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
      ].join('\n'),
    );
  });

  // TODO: add showing task assignments for all possible worksheets from the spreadsheet

  robot.respond(/who is responsible for ([^?]*)\??/i, async (res) => {
    const worksheetSearchPhrase: string | undefined = res.match[1];

    if (!worksheetSearchPhrase) {
      res.reply(
        'Errr... Did you forget to fill in the name of the worksheet? Try "who is responsible for ABC?"',
      );
      return;
    }

    const responsePromise = getTasksFromWorksheet(
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

    postIntermediateResponseWhenInProgressForSomeTime(
      res,
      responsePromise,
      2000,
    );
  });
};

/**
 * If the response from spreadsheet has not been sent within some time, send an intermediate
 * response.
 * Otherwise, do not send anything to avoid sending too many messages.
 */
function postIntermediateResponseWhenInProgressForSomeTime(
  response: Response<any, TextMessage>,
  promise: Promise<any>,
  intermediateResponseDelay: number,
) {
  const intermediateResponseTimeoutId = setTimeout(() => {
    response.reply("Hold on, I'm checking...");
  }, intermediateResponseDelay);

  promise.then(() => {
    clearTimeout(intermediateResponseTimeoutId);
  });
}
