declare module 'google-spreadsheet' {
  export interface GoogleServiceAccountCredentials {
    client_email: string;
    private_key: string;
  }

  export class GoogleSpreadsheet {
    constructor(spreadsheetId: string);

    useServiceAccountAuth(
      credentials: GoogleServiceAccountCredentials,
    ): Promise<void>;

    loadInfo(): Promise<void>;

    sheetCount: number;
    sheetsByIndex: SpreadsheetWorksheet[];
    sheetsById: Record<string, SpreadsheetWorksheet>;
  }

  export interface SpreadsheetWorksheet {
    sheetId: string;
    title: string;
    index: number;

    rowCount: number;
    columnCount: number;

    headerValues: string[];
    loadHeaderRow(): Promise<void>;

    getRows(options?: {
      offset: number;
      limit: number;
    }): Promise<SpreadsheetRow[]>;

    loadCells(filter?: any): Promise<void>;

    /**
     * Loads a cell from the local cache. Call `loadCells` first before calling this method
     */
    getCell(rowIndex: number, columnIndex: number): SpreadsheetCell;
  }

  export interface SpreadsheetRow {
    [columnName: string]: string;
  }

  export interface SpreadsheetCell {
    value: string;

    /**
     * Starts at 0
     */
    rowIndex: number;

    /**
     * Starts at 0
     */
    columnIndex: number;
  }
}
