import { SpreadsheetWorksheet } from 'google-spreadsheet';
import { findMatchingWorksheet } from './find-matching-worksheet';

describe('findMatchingWorksheet', () => {
  let worksheets: SpreadsheetWorksheet[];

  beforeEach(() => {
    worksheets = [
      {
        title: 'Event A',
      },
      {
        title: 'Event B',
      },
      {
        title: 'Hard task',
      },
      {
        title: 'Some other event',
      },
    ] as SpreadsheetWorksheet[];
  });

  it('should match a worksheet by an exact match', () => {
    const result = findMatchingWorksheet(worksheets, 'Event A');

    expect(result).toEqual(worksheets[0]);
  });

  it('should match a worksheet by a case-insensitive exact match', () => {
    const result = findMatchingWorksheet(worksheets, 'event a');

    expect(result).toEqual(worksheets[0]);
  });

  it('should match a worksheet by a partial match', () => {
    const result = findMatchingWorksheet(worksheets, 'task');

    expect(result).toEqual(worksheets[2]);
  });

  it('should match a worksheet by a case-insensitive partial match', () => {
    const result = findMatchingWorksheet(worksheets, 'hard t');

    expect(result).toEqual(worksheets[2]);
  });

  it('should return an error message when no spreadsheet is found', () => {
    const result = findMatchingWorksheet(worksheets, 'Event C');

    expect(result).toMatch('Cannot find worksheet that contains "Event C"');
  });

  it('should return an error message when more than 1 worksheet matches', () => {
    const result = findMatchingWorksheet(worksheets, 'event');

    expect(result).toMatch('Found more than 1 worksheet that contains "event"');
  });
});
