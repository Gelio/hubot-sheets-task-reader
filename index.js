const GoogleSpreadsheet = require("google-spreadsheet");
const { promisify } = require("util");

const googleSheetsCredentialsPath =
  process.env.HUBOT_GOOGLE_SHEETS_CREDENTIALS_PATH;

if (!googleSheetsCredentialsPath) {
  console.error(
    "Google Sheets credentials path is not provided.",
    "\nDid you forget to pass the HUBOT_GOOGLE_SHEETS_CREDENTIALS_PATH variable?"
  );
  return;
}

const googleSheetsCredentials = require(googleSheetsCredentialsPath);
const spreadsheetKey = process.env.HUBOT_SPREADSHEET_KEY;

if (!spreadsheetKey) {
  console.error(
    "Spreadsheet key is not provided.",
    "\nDid you forget to pass the HUBOT_SPREADSHEET_KEY variable?"
  );
  return;
}

async function readAssignmentsForSheet(sheetName) {
  const doc = new GoogleSpreadsheet(spreadsheetKey);
  await promisify(doc.useServiceAccountAuth)(googleSheetsCredentials);

  const { worksheets } = await promisify(doc.getInfo)();

  const worksheet = worksheets.find(sheet => sheet.title === sheetName);
  if (!worksheet) {
    throw new Error("Cannot find worksheet with name", sheetName);
  }

  const cells = await promisify(worksheet.getCells)({
    "min-row": 1,
    "max-row": worksheet.rowCount,
    "min-col": 1,
    "max-col": worksheet.colCount
  });

  const matrix = transformCellArrayToMatrix(cells);

  if (matrix[0][0].value !== "Name" || matrix[0][1].value !== "Chat username") {
    throw new Error(
      "The worksheet does not follow proper format.",
      '\nThe first column should be named "Name"',
      '\nThe second column should be named "Chat username"'
    );
  }

  const valuesMatrix = matrix.slice(1);

  const users = valuesMatrix.map(row => {
    const name = row[0].value;
    const chatUsername = row[1].value;

    return { name, chatUsername };
  });

  const tasks = [];
  const tasksCount = matrix[0].length - 2;
  const taskStartIndexOffset = 2;

  for (let taskIndex = 0; taskIndex < tasksCount; taskIndex++) {
    const task = {
      name: matrix[0][taskIndex + taskStartIndexOffset].value,
      assigneeIndices: []
    };

    valuesMatrix.forEach((row, index) => {
      const taskCell = row[taskIndex + taskStartIndexOffset];
      if (!taskCell || taskCell.value.trim() === "") {
        return;
      }

      task.assigneeIndices.push(index);
    });

    tasks.push(task);
  }

  return prepareAssignments(users, tasks);
}

function transformCellArrayToMatrix(cells) {
  const matrix = [];

  cells.forEach(cell => {
    const row = cell.row - 1;
    const col = cell.col - 1;
    if (!matrix[row]) {
      matrix[row] = [];
    }

    matrix[row][col] = cell;
  });

  return matrix;
}

function prepareAssignments(users, tasks) {
  return tasks.map(task => {
    const assignees = task.assigneeIndices.map(
      assigneeIndex => users[assigneeIndex]
    );

    return { name: task.name, assignees };
  });
}

module.exports = robot => {
  robot.respond(/help/i, res => {
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetKey}`;
    res.reply(
      `If you want to check who is responsible for some event in ${spreadsheetUrl}, ask me:\nwho is responsible for (event name)?`
    );
  });

  robot.respond(/who is responsible for (.*)\?/i, async res => {
    const worksheetName = res.match[1];
    console.log({ worksheetName });

    if (!worksheetName) {
      res.reply(
        'Errr... Did you forget to fill in the name of the worksheet? Try "who is responsible for ABC?"'
      );
      return;
    }

    console.log("Checking");

    res.reply("Wait a second, I'll check...");

    readAssignmentsForSheet(worksheetName).then(
      tasks => {
        res.reply(
          `Got it! For ${worksheetName}:\n${tasks.map(formatTask).join("\n")}`
        );
      },
      error => {
        res.reply(`Unfortunately, I encountered an error :/\n${error}`);
      }
    );
  });
};

function formatUser(user) {
  return `@${user.chatUsername} (${user.name})`;
}

function formatTask(task) {
  return `${task.name}: ${task.assignees.map(formatUser).join(", ")}`;
}

// readAssignmentsForSheet("The final ");
