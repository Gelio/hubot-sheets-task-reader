declare module 'google-spreadsheet' {
  type ResultCallback<T, E = unknown> =
    | ((error: E, value: never) => void)
    | ((error: undefined, value: T) => void);

  export default class GoogleSpreadsheet {
    constructor(spreadsheetKey: string);

    useServiceAccountAuth(
      credentials: object,
      callback: ResultCallback<never>,
    ): void;

    getInfo(callback: ResultCallback<SpreadsheetInfo>): void;
  }

  export interface SpreadsheetInfo {
    worksheets: SpreadsheetWorksheet[];
  }

  export interface SpreadsheetWorksheet {
    title: string;
    rowCount: number;
    colCount: number;

    getCells(
      options: GetCellsOptions,
      callback: ResultCallback<SpreadsheetCell[]>,
    ): void;
  }

  export interface GetCellsOptions {
    'min-row'?: number;
    'max-row'?: number;
    'min-col'?: number;
    'max-col'?: number;
  }

  export interface SpreadsheetCell {
    value: string;

    /**
     * Starts at 1
     */
    row: number;

    /**
     * Starts at 1
     */
    col: number;
  }
}
