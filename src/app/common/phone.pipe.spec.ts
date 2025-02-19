import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {
  const pipe = new PhonePipe();

  it('format "010203" to "01 02 03"', () => {
    expect(pipe.transform('010203')).toBe('01 02 03');
  });

  it('format "0102030405" to "01 02 03 04 05"', () => {
    expect(pipe.transform('0102030405')).toBe('01 02 03 04 05');
  });

  it('should handle empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should format a valid phone number', () => {
    expect(pipe.transform('0123456789')).toBe('01 23 45 67 89');
    expect(pipe.transform('1234567890')).toBe('12 34 56 78 90');
  });

  it('should handle invalid inputs', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
    expect(pipe.transform('123')).toBe('123');  // Trop court
    expect(pipe.transform('12345678901')).toBe('12345678901');  // Trop long
  });

  it('should clean non-numeric characters', () => {
    expect(pipe.transform('01-23-45-67-89')).toBe('01 23 45 67 89');
    expect(pipe.transform('(01) 23 45 67 89')).toBe('01 23 45 67 89');
    expect(pipe.transform('01.23.45.67.89')).toBe('01 23 45 67 89');
  });
});
