import { GoogleSpreadsheet } from 'google-spreadsheet';

import { ScriptError } from '../script-error';

export type ScriptExecutor = (
  spreadsheet: GoogleSpreadsheet,
) => Promise<string>;

export type ScriptErrorHandler = (scriptError: ScriptError) => string;
