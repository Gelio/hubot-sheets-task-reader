import { Robot } from 'hubot';

import { formatTask } from './tasks/format-task';
import { getTasksFromWorksheet } from './tasks/get-tasks-from-worksheet';
import { ScriptConfiguration, getConfiguration } from './get-configuration';
import { ScriptError } from './script-error';

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
      ].join('\n'),
    );
  });

  robot.respond(/who is responsible for (.*)\?/i, async (res) => {
    const worksheetName: string | undefined = res.match[1];

    if (!worksheetName) {
      res.reply(
        'Errr... Did you forget to fill in the name of the worksheet? Try "who is responsible for ABC?"',
      );
      return;
    }

    res.reply("Wait a second, I'll check...");

    getTasksFromWorksheet(
      scriptConfiguration.spreadsheetKey,
      scriptConfiguration.googleSheetsCredentials,
      worksheetName,
    ).then(
      (tasks) => {
        res.reply(
          [`Got it! For ${worksheetName}:`, ...tasks.map(formatTask)].join(
            '\n',
          ),
        );
      },
      (scriptError: ScriptError) => {
        console.log(scriptError.error);

        if (scriptError.consoleLogOnly) {
          res.reply(
            [
              'Unfortunately, I encountered an internal error :/',
              'See the logs in the Hubot console for more information',
            ].join('\n'),
          );
        } else {
          res.reply(
            [
              'Unfortunately, I encountered an error :/',
              scriptError.error.message,
            ].join('\n'),
          );
        }
      },
    );
  });
};