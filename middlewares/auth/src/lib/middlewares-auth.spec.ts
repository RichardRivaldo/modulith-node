import { middlewaresAuth } from './middlewares-auth';

describe('middlewaresAuth', () => {
  it('should work', () => {
    expect(middlewaresAuth()).toEqual('middlewares-auth');
  });
});
