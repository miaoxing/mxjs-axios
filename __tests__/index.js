import axios from '..';
import originalAxios from 'axios';

describe('test', () => {
  test('basic', () => {
    expect(axios).toBe(originalAxios);
  });
});

