import { verifyWorksheetHeaders } from './verify-worksheet-headers';

describe('verifyWorksheetHeaders', () => {
  it('should return an error when the "Name" column is not named as expected', () => {
    const headerValues = ['name and surname', 'chat username'];

    const verificationResult = verifyWorksheetHeaders(headerValues);

    expect(verificationResult).toBeTruthy();
    expect(verificationResult?.error).toBeTruthy();
    expect(verificationResult?.error.message).toMatch(
      /The first column should be named/,
    );
  });

  it('should return an error when the "Chat username" column is not named as expected', () => {
    const headerValues = ['name', 'chat nick'];

    const verificationResult = verifyWorksheetHeaders(headerValues);

    expect(verificationResult).toBeTruthy();
    expect(verificationResult?.error).toBeTruthy();
    expect(verificationResult?.error.message).toMatch(
      /The second column should be named/,
    );
  });

  it('should pass when the columns are valid but in different case', () => {
    const headerValues = ['name', 'chat UserName'];

    const verificationResult = verifyWorksheetHeaders(headerValues);

    expect(verificationResult).toBeNull();
  });
});
